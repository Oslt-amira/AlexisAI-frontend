"use client";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Droplets,
  Heart,
  Minus,
  Moon,
  Palette,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Target,
  X,
} from "lucide-react";
import FamiliarArt from "./familiar-art";

const companions = [
  {
    id: "potted",
    label: "Plant",
    src: "/brand/companions/potted-plant.svg",
  },
  { id: "cat", label: "White cat", src: "" },
  { id: "alien", label: "Alien", src: "" },
] as const;

type CompanionId = (typeof companions)[number]["id"];

export default function FocusSession({
  seconds,
  duration,
  running,
  onDuration,
  onToggle,
  onReset,
  onExit,
}: {
  seconds: number;
  duration: number;
  running: boolean;
  onDuration: (minutes: number) => void;
  onToggle: () => void;
  onReset: () => void;
  onExit: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState(String(duration));
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setEditing(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  function choose(minutes: number) {
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) return;
    onDuration(minutes);
    setEditing(false);
    clock.current?.focus();
  }
  function bump(amount: number) {
    const current = Number(custom);
    const base = Number.isFinite(current) ? Math.round(current) : duration;
    setCustom(String(Math.min(180, Math.max(1, base + amount))));
  }
  function openTimerSettings() {
    setCustom(String(duration));
    setEditing(true);
  }
  const total = duration * 60;
  const progress = total ? Math.min(1, Math.max(0, 1 - seconds / total)) : 0;
  const complete = seconds === 0;
  const stateLabel = complete
    ? "Complete"
    : running
      ? "Focusing"
      : seconds < total
        ? "Paused"
        : "Ready";
  const customValue = Number(custom);
  const customValid =
    Number.isInteger(customValue) && customValue >= 1 && customValue <= 180;
  const customInvalid = custom.trim() !== "" && !customValid;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;
  return (
    <div
      className={`focus-toolbar refined-focus-toolbar ${running ? "is-running" : ""} ${complete ? "is-complete" : ""}`}
      style={
        { "--focus-progress": `${progress * 100}%` } as React.CSSProperties
      }
    >
      <span className="focus-dock-progress-track" aria-hidden="true">
        <span className="focus-dock-progress" />
      </span>
      <div
        className="focus-timer-control"
        ref={root}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setEditing(false);
            clock.current?.focus();
          }
        }}
      >
        <button
          ref={clock}
          className="focus-clock-button"
          aria-label={`Timer settings. ${duration} minute timer, ${stateLabel.toLowerCase()}.`}
          aria-expanded={editing}
          aria-haspopup="dialog"
          aria-controls="focus-timer-popover"
          title="Click to set your timer"
          onClick={() => {
            if (editing) {
              setEditing(false);
            } else {
              openTimerSettings();
            }
          }}
        >
          <span className="focus-clock-ring" aria-hidden="true">
            <span
              className={`focus-timer-dot ${running ? "is-running" : ""}`}
            />
          </span>
          <span className="focus-timer-copy">
            <span
              className="focus-clock"
              role="timer"
              aria-label="Time remaining"
            >
              {time}
            </span>
          </span>
          <ChevronDown size={13} className="focus-clock-caret" />
        </button>
        {editing && (
          <div
            className="focus-timer-popover"
            id="focus-timer-popover"
            role="dialog"
            aria-label="Set focus timer"
          >
            <header className="focus-popover-header">
              <div className="pb-3">
                <b className="leading-none">Focus timer</b>
                <small className="">Pick a length or set your own</small>
              </div>
              <button
                className="icon-button"
                aria-label="Close timer settings"
                onClick={() => {
                  setEditing(false);
                  clock.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            </header>
            {[
              {
                label: "Focus",
                items: [
                  { minutes: 25, label: "Classic", icon: Target },
                  { minutes: 50, label: "Deep work", icon: Brain },
                ],
              },
              {
                label: "Break",
                items: [
                  { minutes: 5, label: "Quick reset", icon: Coffee },
                  { minutes: 15, label: "Long break", icon: Moon },
                ],
              },
            ].map((group) => (
              <div className="focus-preset-group" key={group.label}>
                <span className="focus-preset-label">{group.label}</span>
                <div className="focus-duration-presets">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = duration === item.minutes;
                    return (
                      <button
                        key={item.minutes}
                        className="focus-preset"
                        aria-pressed={active}
                        onClick={() => choose(item.minutes)}
                      >
                        <span className="focus-preset-icon">
                          <Icon size={14} />
                        </span>
                        <span className="focus-preset-copy">
                          <b>
                            {item.minutes}
                            <small>min</small>
                          </b>
                          <span>{item.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <form
              className="focus-custom-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (customValid) choose(customValue);
              }}
            >
              <label htmlFor="custom-focus-minutes ">Custom</label>
              <div className="flex flex-row gap-2 items-center">
                <div className="focus-stepper">
                  <button
                    type="button"
                    aria-label="Decrease by 5 minutes"
                    onClick={() => bump(-5)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="focus-stepper-value">
                    <input
                      autoFocus
                      id="custom-focus-minutes"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={180}
                      step={1}
                      value={custom}
                      onChange={(event) => setCustom(event.target.value)}
                      aria-describedby="focus-custom-hint"
                      aria-invalid={customInvalid}
                      required
                    />
                    <span aria-hidden="true">min</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Increase by 5 minutes"
                    onClick={() => bump(5)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="primary-button focus-custom-submit "
                  disabled={!customValid}
                >
                  Set
                </button>
              </div>
              <p
                className={`pt-3 px-1.5 opacity-75 focus-custom-hint ${customInvalid ? "is-error" : ""}`}
                id="focus-custom-hint"
              >
                {customInvalid
                  ? "Enter a whole number from 1 to 180 minutes."
                  : "1-180 minutes. Changing the timer resets the session."}
              </p>
            </form>
          </div>
        )}
      </div>
      <button
        className="timer-play icon-button"
        onClick={onToggle}
        aria-label={
          complete ? "Start again" : running ? "Pause timer" : "Start timer"
        }
        title={complete ? "Start again" : running ? "Pause" : "Start"}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        className="icon-button focus-reset"
        aria-label="Reset timer"
        title="Reset timer"
        onClick={onReset}
      >
        <RotateCcw size={14} />
      </button>
      <button className="exit-focus" onClick={onExit}>
        Exit focus
        <X size={13} />
      </button>
    </div>
  );
}

export function FocusPlant({
  running,
  progress,
  complete,
}: {
  running: boolean;
  progress: number;
  complete: boolean;
}) {
  const [watered, setWatered] = useState(false);
  const [status, setStatus] = useState("");
  const [companion, setCompanion] = useState<CompanionId>("potted");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reminding, setReminding] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const reminder = useRef<ReturnType<typeof setTimeout>>();
  const root = useRef<HTMLDivElement>(null);
  const pickerTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let composer: Element | null = null;
    const measure = () => {
      const height = composer?.getBoundingClientRect().height ?? 0;
      root.current?.style.setProperty("--composer-clearance", `${height + 28}px`);
    };
    const resize = new ResizeObserver(measure);
    const connect = () => {
      const next = document.querySelector(".composer");
      if (next === composer) return;
      resize.disconnect();
      composer = next;
      if (composer) resize.observe(composer);
      measure();
    };
    const changes = new MutationObserver(connect);
    changes.observe(document.querySelector(".workspace-main") ?? document.body, {childList: true, subtree: true});
    connect();
    return () => { resize.disconnect(); changes.disconnect(); };
  }, []);
  const active =
    companions.find((item) => item.id === companion) ?? companions[0];
  const interaction = companion === "cat" ? "Pet" : companion === "alien" ? "Greet" : "Water";
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("alexis-focus-companion");
      if (companions.some((item) => item.id === saved))
        setCompanion(saved as CompanionId);
    } catch {}
  }, []);
  useEffect(() => {
    setReminding(true);
    clearTimeout(reminder.current);
    reminder.current = setTimeout(() => setReminding(false), 4600);
  }, [running, complete]);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(reminder.current);
    },
    [],
  );
  useEffect(() => {
    if (!pickerOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setPickerOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPickerOpen(false);
        pickerTrigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [pickerOpen]);
  function water() {
    clearTimeout(timer.current);
    setWatered(true);
    setStatus(companion === "cat" ? "Your cat is purring." : companion === "alien" ? "Your visitor waves back." : "Your plant is watered.");
    timer.current = setTimeout(() => setWatered(false), 2600);
  }
  function chooseCompanion(id: CompanionId, label: string) {
    setCompanion(id);
    setWatered(false);
    clearTimeout(timer.current);
    setPickerOpen(false);
    pickerTrigger.current?.focus();
    setStatus(`${label} is now your focus companion.`);
    setReminding(true);
    clearTimeout(reminder.current);
    reminder.current = setTimeout(() => setReminding(false), 3200);
    try {
      window.localStorage.setItem("alexis-focus-companion", id);
    } catch {}
  }
  const message = watered
    ? companion === "cat" ? "purr" : companion === "alien" ? "A little hello, from far away." : "A little water. A little growth."
    : complete
      ? `${active.label} made it through with you.`
      : running
        ? companion === "cat" ? "Settling in beside you." : companion === "alien" ? "In your orbit." : "Growing, one moment at a time."
        : `${active.label} is here when you are ready.`;
  return (
    <div
      ref={root}
      className={`focus-plant companion-${companion} ${running ? "is-growing" : ""} ${watered ? "is-watered" : ""} ${complete ? "is-complete" : ""} ${reminding ? "is-reminding" : ""} ${pickerOpen ? "is-picking" : ""}`}
      style={
        {
          "--plant-growth": String(
            0.82 + Math.max(0, Math.min(1, progress)) * 0.18,
          ),
        } as React.CSSProperties
      }
    >
      <div className="focus-plant-bubble" role="status">
        {message}
      </div>
      {pickerOpen && (
        <div
          className="plant-companion-menu"
          id="focus-companion-picker"
          role="dialog"
          aria-label="Choose a focus companion"
        >
          <span className="plant-companion-title">Companion</span>
          <div className="plant-companion-options">
            {companions.map((item) => (
              <button
                key={item.id}
                aria-pressed={companion === item.id}
                onClick={() => chooseCompanion(item.id, item.label)}
              >
                {item.id === "potted" ? <img src={item.src} alt="" draggable={false} /> : <FamiliarArt kind={item.id} />}
                <span>{item.label}</span>
                <small>{item.id === "potted" ? "Water & grow" : item.id === "cat" ? "Pet & purr" : "Greet & orbit"}</small>
              </button>
            ))}
          </div>
          <p>A quiet presence for your focus time.</p>
        </div>
      )}
      <button
        className="focus-plant-button"
        aria-label={`${interaction} ${active.label.toLowerCase()}`}
        title={`${interaction} your ${active.label.toLowerCase()}`}
        onClick={water}
      >
        <span className="plant-shadow" />
        <span className="plant-art">
          {companion === "potted" ? (
            <>
              <img
                className="plant-leaves"
                src="/brand/focus-plant-leaves.svg"
                alt=""
                draggable={false}
              />
              <img
                className="plant-pot"
                src="/brand/focus-plant-pot.svg"
                alt=""
                draggable={false}
              />
              <svg
                className="plant-face"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <g className="plant-eyes">
                  <ellipse cx="15" cy="30" rx=".65" ry=".9" />
                  <ellipse cx="21" cy="30" rx=".65" ry=".9" />
                </g>
                <path
                  d="M16.5 32 Q18 33.3 19.5 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".6"
                  strokeLinecap="round"
                />
              </svg>
            </>
          ) : (
            <FamiliarArt kind={companion} />
          )}
        </span>
        {watered && companion === "potted" && (
          <span className="plant-water" aria-hidden="true">
            <Droplets size={25} />
            <Heart size={13} />
          </span>
        )}
      </button>
      <button
        ref={pickerTrigger}
        className="plant-companion-trigger"
        aria-label="Choose focus companion"
        aria-expanded={pickerOpen}
        aria-haspopup="dialog"
        aria-controls="focus-companion-picker"
        title="Choose companion"
        onClick={() => setPickerOpen(!pickerOpen)}
      >
        <Palette size={12} />
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
      <a
        className="plant-credit"
        href={companion === "potted" ? "https://github.com/jdecked/twemoji" : "/brand/companions/LICENSE.txt"}
        target="_blank"
        rel="noreferrer"
        aria-label={companion === "potted" ? "Plant artwork: Twemoji, CC BY 4.0" : "Original familiar artwork, CC0"}
      >
        {companion === "potted" ? "Twemoji · CC BY 4.0" : "Original art · CC0"}
      </a>
    </div>
  );
}
