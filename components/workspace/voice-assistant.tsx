"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Keyboard, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { demoAnswer, type StudyFile } from "./demo-data";
import "./voice-inspiration.css";

type RecognitionResultEvent = {
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
    length: number;
  };
  resultIndex: number;
};
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};
type VoiceWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export default function VoiceAssistant({
  onClose,
  onPrompt,
  source,
  buildReply,
}: {
  onClose: () => void;
  onPrompt: (text: string) => void;
  source?: StudyFile;
  buildReply?: (text: string) => string;
}) {
  const [phase, setPhase] = useState<
    "idle" | "listening" | "preparing" | "speaking"
  >("idle");
  const [supported, setSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [muted, setMuted] = useState(false);
  const [draft, setDraft] = useState("");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<Recognition | null>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>();
  const replyTimer = useRef<ReturnType<typeof setTimeout>>();
  const speakingRef = useRef(false);
  const mountedRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const voiceWindow = window as VoiceWindow;
    setSupported(
      !!(voiceWindow.SpeechRecognition || voiceWindow.webkitSpeechRecognition),
    );
    setSpeechSupported("speechSynthesis" in window);
    return () => {
      mountedRef.current = false;
      recognitionRef.current?.abort();
      clearTimeout(replyTimer.current);
      if (speakingRef.current && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
      clearTimeout(pulseTimer.current);
    };
    // The panel owns one voice session; callbacks are read from the current turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    clearTimeout(pulseTimer.current);
    orbRef.current?.style.setProperty("--voice-pulse", "1");
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    clearTimeout(replyTimer.current);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speakingRef.current = false;
    setPhase("idle");
  }
  function respond(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setTranscript(cleaned);
    setDraft("");
    setError("");
    setResponse("");
    setPhase("preparing");
    onPrompt(cleaned);
    clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      if (!mountedRef.current) return;
      const answer = demoAnswer(cleaned, source);
      const text = buildReply
        ? buildReply(cleaned)
        : `${answer.title} ${answer.body}`;
      setResponse(text);
      if (!("speechSynthesis" in window) || mutedRef.current) {
        setPhase("idle");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.96;
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang.startsWith("en") && v.localService) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      utterance.onstart = () => {
        if (mountedRef.current) {
          speakingRef.current = true;
          setPhase("speaking");
        }
      };
      utterance.onboundary = (event) => {
        if (!mountedRef.current || event.name !== "word") return;
        orbRef.current?.style.setProperty("--voice-pulse", "1.035");
        clearTimeout(pulseTimer.current);
        pulseTimer.current = setTimeout(
          () => orbRef.current?.style.setProperty("--voice-pulse", "1"),
          170,
        );
      };
      utterance.onend = () => {
        orbRef.current?.style.setProperty("--voice-pulse", "1");
        speakingRef.current = false;
        if (mountedRef.current) setPhase("idle");
      };
      utterance.onerror = () => {
        speakingRef.current = false;
        if (mountedRef.current) {
          setPhase("idle");
          setError(
            "Spoken playback is unavailable. You can read the response below.",
          );
        }
      };
      speakingRef.current = true;
      window.speechSynthesis.speak(utterance);
      setPhase("speaking");
    }, 850);
  }
  function listen() {
    if (phase !== "idle") {
      stop();
      return;
    }
    const Constructor =
      (window as VoiceWindow).SpeechRecognition ||
      (window as VoiceWindow).webkitSpeechRecognition;
    if (!Constructor) {
      inputRef.current?.focus();
      return;
    }
    setError("");
    setTranscript("");
    const recognition = new Constructor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    let submitted = false;
    recognition.onresult = (event) => {
      if (!mountedRef.current) return;
      let text = "";
      for (let index = 0; index < event.results.length; index++)
        text += event.results[index][0].transcript;
      setTranscript(text);
      const last = event.results[event.results.length - 1];
      if (last.isFinal && !submitted) {
        submitted = true;
        respond(text);
      }
    };
    recognition.onerror = (event) => {
      if (!mountedRef.current) return;
      setPhase("idle");
      if (event.error === "aborted") return;
      setError(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone permission was not granted. You can type a question instead."
          : event.error === "no-speech"
            ? "No speech detected. Try again when you are ready."
            : "Voice input is unavailable in this browser. Try typing below.",
      );
    };
    recognition.onend = () => {
      if (mountedRef.current && !submitted) setPhase("idle");
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setPhase("listening");
    } catch {
      setPhase("idle");
      setError("Could not start the microphone. Type below or try again.");
    }
  }
  const status =
    phase === "listening"
      ? "I’m listening."
      : phase === "speaking"
        ? "Alexis is speaking"
        : phase === "preparing"
          ? "Thinking…"
          : response
            ? "Anything else?"
            : "What’s on your mind?";
  return (
    <section
      className={`inline-voice reference-voice voice-${phase}`}
      aria-label="Voice conversation"
    >
      <div className="inline-voice-center">
        <div
          className="voice-halo-orb voice-inspiration"
          ref={orbRef}
          aria-hidden="true"
        >
          <span className="voice-gradient-field" />
          <Image
            className="voice-bot-logo"
            src="/brand/logo%20bot.svg"
            alt=""
            width={142}
            height={142}
            draggable={false}
          />
        </div>
        <p className="voice-phase-label" role="status">
          {phase === "speaking"
            ? "Alexis is speaking"
            : phase === "listening"
              ? "Your microphone is on"
              : phase === "preparing"
                ? "Thinking it through"
                : "Alexis is here"}
        </p>
        <h2>{status}</h2>

        {transcript && <p className="inline-user-transcript">“{transcript}”</p>}
        {response && (
          <details className="inline-voice-transcript">
            <summary>Read Alexis’s response</summary>
            <p>{response}</p>
          </details>
        )}
        {error && (
          <p className="inline-voice-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <footer className="inline-voice-footer">
        {source && <p className="voice-source">Using {source.title}</p>}
        <div className="inline-voice-controls">
          <button
            className="voice-secondary-control"
            disabled={!speechSupported}
            aria-label={
              muted ? "Enable spoken responses" : "Mute spoken responses"
            }
            aria-pressed={muted}
            onClick={() => {
              const next = !muted;
              setMuted(next);
              mutedRef.current = next;
              if (next && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                speakingRef.current = false;
                if (phase === "speaking") setPhase("idle");
              }
            }}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            className="inline-voice-mic"
            aria-label={
              phase === "idle" ? "Start voice input" : "Stop voice interaction"
            }
            aria-pressed={phase === "listening"}
            onClick={listen}
          >
            {phase === "idle" ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button
            className="voice-secondary-control"
            aria-label="Switch to text chat"
            onClick={onClose}
          >
            <Keyboard size={20} />
          </button>
        </div>
        <div
          className={`user-voice-activity mt-3 ${phase === "listening" ? "is-listening" : ""}`}
          role="status"
        >
          <Mic size={14} />
          <span>
            {phase === "listening"
              ? transcript
                ? "You’re speaking"
                : "Listening for your voice"
              : "Tap to talk. Take your time."}
          </span>
          {phase === "listening" && (
            <span
              className={`user-speech-bars ${transcript ? "has-speech" : ""}`}
              aria-hidden="true"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} />
              ))}
            </span>
          )}
        </div>
      </footer>
    </section>
  );
}
