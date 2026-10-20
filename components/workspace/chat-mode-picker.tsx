"use client";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  Layers3,
  ListChecks,
  MessageCircle,
  PencilLine,
} from "lucide-react";
import type { ChatMode } from "./chat-resources";
const modes = [
  {
    name: "Ask",
    description: "Questions and explanations",
    icon: MessageCircle,
  },
  {
    name: "Summary",
    description: "Key points from your document",
    icon: FileText,
  },
  { name: "Flashcards", description: "Practice active recall", icon: Layers3 },
  { name: "Quiz", description: "Test your understanding", icon: ListChecks },
  {
    name: "Writing",
    description: "Improve a draft or build an outline",
    icon: PencilLine,
  },
] as const;
export default function ChatModePicker({
  value,
  onChange,
  writingAction,
  onWritingActionChange,
}: {
  value: ChatMode;
  onChange: (mode: ChatMode) => void;
  writingAction?: string;
  onWritingActionChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = modes.find((m) => m.name === value)!;
  const Icon = selected.icon;
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (e.target instanceof Node && !root.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <div
      className="chat-mode-picker"
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
        if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          const items = Array.from(
            root.current!.querySelectorAll<HTMLButtonElement>(
              '[role="menuitemradio"]',
            ),
          );
          const i = items.indexOf(document.activeElement as HTMLButtonElement);
          items[
            (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
          ]?.focus();
        }
      }}
    >
      <button
        type="button"
        ref={trigger}
        className="chat-mode-trigger"
        aria-label={`Chat mode: ${value === "Writing" ? "Writing assistant" : value}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon size={15} />
        <span>{value === "Writing" ? "Writing" : value}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="chat-mode-menu" role="menu" aria-label="Chat modes">
          {modes.map((mode, i) => {
            const ModeIcon = mode.icon;
            return (
              <button
                type="button"
                key={mode.name}
                role="menuitemradio"
                autoFocus={i === 0}
                aria-checked={value === mode.name}
                onClick={() => {
                  onChange(mode.name);
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                <ModeIcon size={17} />
                <span>
                  <b>
                    {mode.name === "Writing" ? "Writing assistant" : mode.name}
                  </b>
                  <small>{mode.description}</small>
                </span>
                {value === mode.name && <Check size={15} />}
              </button>
            );
          })}
          {value === "Writing" && onWritingActionChange && (
            <div className="chat-writing-tasks">
              <span>Writing task</span>
              {["Improve clarity", "Proofread", "Build an outline"].map(
                (task) => (
                  <button
                    type="button"
                    role="menuitemradio"
                    key={task}
                    aria-checked={task === writingAction}
                    onClick={() => {
                      onWritingActionChange(task);
                      setOpen(false);
                      trigger.current?.focus();
                    }}
                  >
                    <span>{task}</span>
                    {task === writingAction && <Check size={14} />}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
