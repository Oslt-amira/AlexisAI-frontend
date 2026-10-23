"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, FileText, Library, Search } from "lucide-react";
import type { StudyFile } from "./demo-data";
export default function ContextPicker({
  files,
  selected,
  onChange,
}: {
  files: StudyFile[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState({ left: 0, width: 360 });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dismiss = (e: PointerEvent) => {
      if (e.target instanceof Node && !root.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  const visible = files.filter((f) =>
    (f.title + " " + f.subject).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div
      className="context-picker"
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        type="button"
        className="composer-context-trigger"
        ref={trigger}
        aria-label="Choose document contexts"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          const rect = trigger.current!.getBoundingClientRect();
          const width = Math.min(360, window.innerWidth - 32);
          setPosition({
            width,
            left: Math.min(0, window.innerWidth - 16 - rect.left - width),
          });
          setOpen((v) => !v);
        }}
      >
        <BookOpen size={16} />
        <span>
          {selected.length
            ? `${selected.length} ${selected.length === 1 ? "document" : "documents"}`
            : "All library"}
        </span>
      </button>
      {open && (
        <section
          style={position}
          className="context-picker-panel"
          role="dialog"
          aria-label="Document contexts"
        >
          <header>
            <b>Choose your context</b>
            <span>
              {selected.length
                ? `${selected.length} selected`
                : `${files.length} library documents`}
            </span>
          </header>
          <button
            type="button"
            className="context-library-option"
            aria-pressed={!selected.length}
            onClick={() => onChange([])}
          >
            <Library size={17} />
            <span>
              <b>Entire library</b>
              <small>Find relevant information across all documents</small>
            </span>
            {!selected.length && <Check size={15} />}
          </button>
          <label className="context-search">
            <Search size={15} />
            <input
              aria-label="Search context documents"
              placeholder="Find a document…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </label>
          <div className="context-document-list">
            {visible.map((f) => (
              <button
                type="button"
                key={f.id}
                aria-pressed={selected.includes(f.id)}
                onClick={() =>
                  onChange(
                    selected.includes(f.id)
                      ? selected.filter((id) => id !== f.id)
                      : [...selected, f.id],
                  )
                }
              >
                <FileText size={16} />
                <span>
                  <b>{f.title}</b>
                  <small>
                    {f.subject} · {f.kind}
                  </small>
                </span>
                <i>{selected.includes(f.id) && <Check size={12} />}</i>
              </button>
            ))}
            {!visible.length && <p>No documents found.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
