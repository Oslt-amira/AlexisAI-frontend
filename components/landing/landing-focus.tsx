"use client";

import { useEffect, useRef, useState } from "react";
import { BellOff, Check, Focus, MessageCircle } from "lucide-react";
import FamiliarArt, {
  type FamiliarKind,
} from "@/components/workspace/familiar-art";

const companions = [
  {
    kind: "mushroom",
    label: "Mushroom",
    saved: "potted",
    response: "A little room to grow.",
  },
  {
    kind: "cat",
    label: "Cat",
    saved: "cat",
    response: "Settling in beside you.",
  },
  {
    kind: "alien",
    label: "Spirit",
    saved: "alien",
    response: "In your orbit.",
  },
] as const;

export default function LandingFocus() {
  const [kind, setKind] = useState<FamiliarKind>("cat");
  const [engaged, setEngaged] = useState(false);
  const [reacting, setReacting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const active = companions.find((item) => item.kind === kind)!;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alexis-focus-companion");
      const match = companions.find((item) => item.saved === saved);
      if (match) setKind(match.kind);
    } catch {}
    const sync = (event: Event) => {
      const next = (event as CustomEvent<FamiliarKind>).detail;
      if (companions.some((item) => item.kind === next)) setKind(next);
    };
    window.addEventListener("alexis-companion-change", sync);
    return () => {
      window.removeEventListener("alexis-companion-change", sync);
      clearTimeout(timer.current);
    };
  }, []);

  function choose(next: FamiliarKind) {
    setKind(next);
    setReacting(false);
    clearTimeout(timer.current);
    try {
      localStorage.setItem(
        "alexis-focus-companion",
        companions.find((item) => item.kind === next)!.saved,
      );
    } catch {}
    window.dispatchEvent(
      new CustomEvent("alexis-companion-change", { detail: next }),
    );
  }

  return (
    <div
      className={`lp-focus-showcase lp-focus-demo ${engaged ? "is-engaged" : ""} ${reacting ? "is-reacting" : ""}`}
      role="group"
      aria-label="Feature focus preview"
    >
      <div className="lp-focus-scene">
        <div className="lp-focus-scene-bar">
          <span>
            <Focus size={13} />
            Your quiet space
          </span>
          <button
            className="lp-focus-switch"
            aria-label="Focus preview"
            aria-pressed={engaged}
            onClick={() => {
              const next = !engaged;
              setEngaged(next);
            }}
          >
            <i />
            <span>{!engaged ? "Focus on" : "Focus off"}</span>
          </button>
        </div>
        <div className="lp-focus-room ">
          <div className="lp-focus-reading" aria-hidden="true">
            <span>BIOLOGY · CHAPTER 04</span>
            <h4>One thing at a time.</h4>
            <i />
            <i />
            <mark>A little room to understand.</mark>
            <i />
            <i />
          </div>
          <div className="lp-focus-noise" aria-hidden="true">
            <span>
              <BellOff size={12} />
              Notifications
            </span>
            <span>
              <MessageCircle size={12} />
              Other conversations
            </span>
          </div>
          <div className="lp-focus-presence">
            <button
              className="lp-companion-art"
              aria-label={`Interact with ${active.label.toLowerCase()} companion`}
              onClick={() => {
                setReacting(true);
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setReacting(false), 2400);
              }}
            >
              <FamiliarArt kind={kind} />
            </button>
            <div className="lp-focus-companion-picker">
              <div role="group" aria-label="Feature focus companion">
                {companions.map((item) => (
                  <button
                    key={item.kind}
                    aria-label={`${item.label} companion`}
                    aria-pressed={item.kind === kind}
                    onClick={() => choose(item.kind)}
                  >
                    <FamiliarArt kind={item.kind} />
                    <span>{item.label}</span>
                    {item.kind === kind && <Check size={10} />}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="lp-companion-bubble"
              role="status"
              key={engaged ? "focused" : reacting ? "reacting" : "quiet"}
            >
              <p>
                {engaged
                  ? "I’ll keep your place."
                  : reacting
                    ? active.response
                    : "Screen blocked. Stay focused."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
