"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  FileText,
  GraduationCap,
  MessageCircle,
  PenLine,
  Play,
  RefreshCw,
  Sigma,
} from "lucide-react";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import LandingFocus from "./landing-focus";

const modes = [
  {
    name: "Ask",
    icon: MessageCircle,
    question: "Why do cells need ATP?",
    answer: "Think of ATP as energy cells can put to work.",
  },
  {
    name: "Solve",
    icon: Sigma,
    question: "Help me work through this equation.",
    answer: "Start with what you know. Then take it step by step.",
  },
  {
    name: "Write",
    icon: PenLine,
    question: "Give these notes a clearer structure.",
    answer: "One central idea. A clear argument. Your own voice.",
  },
  {
    name: "MCQ",
    icon: Check,
    question: "Put my understanding to the test.",
    answer: "A quick question. A chance to see what sticks.",
  },
];

export default function BentoGrid() {
  const [mode, setMode] = useState(0);
  const [day, setDay] = useState(2);
  const [summary, setSummary] = useState(false);
  const ModeIcon = modes[mode].icon;

  return (
    <section id="Features" className="lp-container lp-section lp-tools-section">
      <div className="lp-section-heading">
        <div>
          <span className="eyebrow lp-eyebrow">THE WORKSPACE</span>
          <h2>
            Less switching.
            <br />
            <span>More understanding.</span>
          </h2>
        </div>
      </div>
      <div className="lp-tools-grid">
        <article className="lp-tool-card">
          <h3>Your library, annotated.</h3>
          <p>Read your documents with notes and summaries alongside.</p>
          <div className="lp-tool-scene lp-library-art">
            <div className="lp-paper-preview">
              <span>
                <FileText size={14} /> Cellular respiration
              </span>
              <h4>Energy, one step at a time.</h4>
              <i />
              <i />
              <mark>Three stages. One continuous process.</mark>
              <i />
              <i />
            </div>
            <div className="lp-note-preview">
              <div role="group" aria-label="Preview library panels">
                <button
                  aria-pressed={!summary}
                  onClick={() => setSummary(false)}
                >
                  Notes
                </button>
                <button aria-pressed={summary} onClick={() => setSummary(true)}>
                  Summary
                </button>
              </div>
              <p>
                {summary
                  ? "Glucose becomes energy the cell can use."
                  : "Connect this to the previous lecture."}
              </p>
              <i />
              <i />
            </div>
            <span className="lp-floating-icon">
              <BookOpen size={22} />
            </span>
          </div>
        </article>
        <article className="lp-tool-card">
          <h3>A plan with room to breathe.</h3>
          <p>Organise your week. Make space for one focused session.</p>
          <div className="lp-tool-scene lp-planner-art">
            <div className="lp-week-preview">
              <span>
                This week <CalendarDays size={13} />
              </span>
              <div role="group" aria-label="Preview planner days">
                {["M", "T", "W", "T", "F"].map((label, index) => (
                  <button
                    key={index}
                    aria-label={`Preview ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index]}`}
                    aria-pressed={day === index}
                    onClick={() => setDay(index)}
                  >
                    <small>{label}</small>
                    <b>{12 + index}</b>
                  </button>
                ))}
              </div>
              <p>
                <span />
                {day % 2 === 0 ? "Biology revision" : "Review lecture notes"}
                <small>{day % 2 === 0 ? "09:00" : "14:00"}</small>
              </p>
            </div>
            <div className="lp-focus-preview">
              <span />
              <b>25:00</b>
              <small>Time to focus</small>
              <Play size={13} />
            </div>
          </div>
        </article>
        <article className="lp-tool-card">
          <h3>A mode for every thought.</h3>
          <p>Ask a question. Solve a problem. Write, or test what you know.</p>
          <div className="lp-tool-scene lp-modes-art">
            <div
              className="lp-mode-options"
              role="group"
              aria-label="Preview study modes"
            >
              {modes.map((item, index) => (
                <button
                  key={item.name}
                  aria-pressed={mode === index}
                  onClick={() => setMode(index)}
                >
                  <item.icon size={13} />
                  {item.name}
                </button>
              ))}
            </div>
            <div className="lp-mode-preview" key={mode}>
              <span>
                <ModeIcon size={14} />
                {modes[mode].question}
              </span>
              <div>
                <AlexisLogo width={24} height={24} />
                <p>{modes[mode].answer}</p>
              </div>
              <small>
                Keep the thought going <ArrowRight size={12} />
              </small>
            </div>
          </div>
        </article>
        <article className="lp-tool-card">
          <h3>Keep your week in sync.</h3>
          <p>Bring Google Calendar and Classroom into your study flow.</p>
          <div className="lp-tool-scene lp-sync-art">
            <div className="lp-sync-service">
              <CalendarDays size={19} />
              <span>
                Google Calendar<small>Your schedule</small>
              </span>
              <Check size={13} />
            </div>
            <div className="lp-sync-bridge">
              <i />
              <span>
                <RefreshCw size={19} />
              </span>
              <i />
            </div>
            <div className="lp-sync-service">
              <GraduationCap size={20} />
              <span>
                Google Classroom<small>Your course materials</small>
              </span>
              <Check size={13} />
            </div>
          </div>
        </article>
        <article className="lp-tool-card lp-focus-feature">
          <div>
            <span className="eyebrow lp-eyebrow">FOCUS MODE</span>
            <h3>
              Less noise.
              <br />
              More focus.
            </h3>
            <p>
              If you drift away, your companion gently
              brings you back.
            </p>
          </div>
          <LandingFocus />
        </article>
      </div>
    </section>
  );
}
