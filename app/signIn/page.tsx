"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Focus,
  Leaf,
  Loader2,
  Mail,
  MessageCircle,
  PenLine,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/api";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import FamiliarArt from "@/components/workspace/familiar-art";
import "@/components/workspace/design-system.css";
import "./sign-in.css";
const palettes = [
  { id: "green", name: "Sage" },
  { id: "purple", name: "Iris" },
  { id: "chrome", name: "Chrome" },
  { id: "amber", name: "Amber" },
] as const;
type Accent = (typeof palettes)[number]["id"];
const prompts = [
  {
    question: "Why do leaves change color in autumn?",
    answer:
      "Chlorophyll fades as the days shorten, revealing carotenoids underneath.",
    source: "Biology notes · p. 4",
  },
  {
    question: "Explain photosynthesis in one sentence.",
    answer:
      "Plants turn light, water, and carbon dioxide into sugar and oxygen.",
    source: "Biology notes · p. 12",
  },
  {
    question: "What should I review before Friday?",
    answer:
      "Cell respiration first, then a five-question check on the Calvin cycle.",
    source: "Study plan · Week 6",
  },
];
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [accent, setAccent] = useState<Accent | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const visualRef = useRef<HTMLElement>(null);
  const activeAccent = accent ?? "green";
  const prompt = prompts[promptIndex];
  useEffect(() => {
    try {
      const stored = localStorage.getItem("alexis-accent");
      if (palettes.some((item) => item.id === stored)) {
        setAccent(stored as Accent);
      } else {
        setAccent("green");
      }
    } catch {
      setAccent("green");
    }
  }, []);
  useEffect(() => {
    if (!accent) return;
    document.documentElement.dataset.accent = accent;
    try {
      localStorage.setItem("alexis-accent", accent);
    } catch {}
  }, [accent]);
  function handleVisualMove(event: React.MouseEvent<HTMLElement>) {
    const element = visualRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty(
      "--mx",
      ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3),
    );
    element.style.setProperty(
      "--my",
      ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3),
    );
  }
  function resetVisual() {
    visualRef.current?.style.setProperty("--mx", "0");
    visualRef.current?.style.setProperty("--my", "0");
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await auth(email);
      if (!result?.response.ok) {
        setError("We couldn’t send your link. Please try again in a moment.");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="alexis-app auth-page">
      <header className="auth-header">
        <Link href="/" className="brand">
          <span className="emblem">
            <AlexisLogo color="#F6F4EC" width={27} height={27} />
          </span>
          <span>Alexis</span>
        </Link>
        <div className="auth-header-actions">
          <div
            className="auth-palette"
            role="group"
            aria-label="Preview a palette"
          >
            <span>Palette</span>
            {palettes.map((palette) => (
              <button
                key={palette.id}
                data-palette={palette.id}
                className={activeAccent === palette.id ? "active" : ""}
                aria-pressed={activeAccent === palette.id}
                aria-label={`${palette.name} palette`}
                title={palette.name}
                onClick={() => setAccent(palette.id)}
              />
            ))}
          </div>
        </div>
      </header>
      <main className="auth-shell">
        <section className="auth-form-panel flex flex-col justify-center">
          {/* <span className="eyebrow">
            {sent ? "ONE SMALL STEP AWAY" : "YOUR SPACE TO THINK"}
          </span> */}

          <h1>{sent ? "Check your inbox" : "Welcome to Alexis"}</h1>

          <p className="pb-2">
            {sent
              ? `Your sign-in link is on its way to ${email}. Check your inbox to get back to your workspace.`
              : "A space for your notes, conversations, and everything you're learning along the way."}
          </p>
          {sent ? (
            <div className="auth-sent" role="status">
              <span>
                <Check size={25} />
              </span>
              <h2>Check your email</h2>
              <p>Your personal sign-in link is on its way.</p>
              <button
                className="secondary-button"
                onClick={() => setSent(false)}
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="auth-email">Your email address</label>
              <div className="auth-input">
                <Mail size={17} />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary-button full-width" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={17} className="spin" />
                    Sending sign-in link…
                  </>
                ) : (
                  <>
                    Continue with email
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
              <p className="auth-magic pb-2">
                We’ll email you a secure sign-in link. No password needed.
              </p>
            </form>
          )}
          <div className="auth-divider">
            <span />
            OR
            <span />
          </div>
          <Link className="secondary-button full-width" href="/api/auth/google">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>
            Connect with Google
          </Link>
        </section>
        <aside
          className="auth-brand-panel"
          ref={visualRef}
          onMouseMove={handleVisualMove}
          onMouseLeave={resetVisual}
        >
          <div className="auth-visual-head">
            <div className="auth-editorial-icons" aria-hidden="true">
              <span><BookOpen size={20} /></span>
              <span><PenLine size={20} /></span>
              <span><MessageCircle size={20} /></span>
            </div>
           
          </div>
          <div className="auth-float-field">
            <article className="auth-float-card auth-float-chat">
              <header>
                <span className="auth-mini-emblem">
                  <AlexisLogo width={22} height={22} />
                </span>
                <b>Alexis</b>
                <span className="auth-live-dot" aria-hidden="true" />
              </header>
              <div className="auth-chat-thread" key={promptIndex}>
                <p className="auth-bubble auth-bubble-user">
                  {prompt.question}
                </p>
                <p className="auth-bubble auth-bubble-ai">
                  {prompt.answer}
                  <span className="auth-cite">{prompt.source}</span>
                </p>
              </div>
              <button
                className="auth-card-action"
                onClick={() =>
                  setPromptIndex((index) => (index + 1) % prompts.length)
                }
              >
                <RefreshCw size={11} />
                Ask another
              </button>
            </article>
            <button
              className={`auth-float-card auth-flashcard ${flipped ? "is-flipped" : ""}`}
              onClick={() => setFlipped((value) => !value)}
              aria-pressed={flipped}
            >
              <span className="auth-flashcard-inner">
                <span className="auth-flashcard-face">
                  <small>FLASHCARD 3 / 8</small>
                  <b>What powers the Sun’s heat and light?</b>
                  <em>Tap to flip</em>
                </span>
                <span className="auth-flashcard-face auth-flashcard-back">
                  <small>ANSWER</small>
                  <b>Nuclear fusion in the core turns hydrogen into helium.</b>
                  <em>Nicely done</em>
                </span>
              </span>
            </button>
            <article className={`auth-float-card auth-float-focus ${focusRunning ? "is-focusing" : ""}`}>
              <button
                className="auth-focus-preview-toggle"
                onClick={() => setFocusRunning((running) => !running)}
                aria-label="Preview focus mode"
                aria-pressed={focusRunning}
              >
                <Focus size={12} />{focusRunning ? "Focus on" : "Focus off"}<i />
              </button>
              <span className="auth-focus-companion"><FamiliarArt kind="cat" /></span>
              <p>{focusRunning ? "One thought at a time." : "A little room to focus."}</p>
            </article>
            <article className="auth-float-card auth-float-plan">
              <header>
                <Sparkles size={13} />
                <b>Today’s plan</b>
                <span>2 / 3</span>
              </header>
              <ul>
                <li className="is-done">
                  <span>
                    <Check size={10} />
                  </span>
                  Review cell respiration
                </li>
                <li className="is-done">
                  <span>
                    <Check size={10} />
                  </span>
                  Flip 8 flashcards
                </li>
                <li>
                  <span className="auth-plan-radio" />
                  5-question quiz
                </li>
              </ul>
              <span className="auth-plan-track">
                <span />
              </span>
            </article>
          </div>
          <p className="auth-visual-foot">
            © 2024. All rights reserved. <Leaf size={13} />
          </p>
        </aside>
      </main>
    </div>
  );
}
