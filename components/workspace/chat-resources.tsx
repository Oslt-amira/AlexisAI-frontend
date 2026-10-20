"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  Layers3,
  ListChecks,
  PencilLine,
  X,
} from "lucide-react";
import { flashcards, quizQuestions, type StudyFile } from "./demo-data";
import { referenceFor, type SourceReference } from "./learning-answer";
import type { PracticeQuestion, StudyCard } from "./practice-data";
import { FlashcardResource, QuizResource } from "./study-practice";

export type ChatMode = "Ask" | "Summary" | "Flashcards" | "Quiz" | "Writing";
export type ChatResource = {
  id: string;
  kind: "document" | "summary" | "flashcards" | "quiz" | "writing";
  title: string;
  fileId?: string;
  body?: string;
  reference?: SourceReference;
  questions?: PracticeQuestion[];
  cards?: StudyCard[];
};
export const resourceIcons = {
  document: FileText,
  summary: FileText,
  flashcards: Layers3,
  quiz: ListChecks,
  writing: PencilLine,
};

function resourceSummary(resource: ChatResource, document?: StudyFile) {
  switch (resource.kind) {
    case "document":
      return document
        ? [document.kind, document.subject].filter(Boolean).join(" · ")
        : "Reference";
    case "quiz":
      return `${resource.questions?.length ?? quizQuestions.length} questions · Practice`;
    case "flashcards":
      return `${resource.cards?.length ?? flashcards.length} cards · Review`;
    case "writing":
      return "Editable draft · Autosaves";
    default:
      return "Document summary";
  }
}

export default function ChatResources({
  resources,
  files,
  expandedId,
  onToggle,
  onClose,
  onUpdate,
  onOpenDocument,
}: {
  resources: ChatResource[];
  files: StudyFile[];
  expandedId: string | null;
  onToggle: (id: string | null) => void;
  onClose: () => void;
  onUpdate: (id: string, body: string) => void;
  onOpenDocument: (id: string) => void;
}) {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (!expandedId || !panel.current) return;
    const row = Array.from(
      panel.current.querySelectorAll<HTMLElement>("[data-resource-id]"),
    ).find((element) => element.dataset.resourceId === expandedId);
    row?.scrollIntoView({ block: "nearest" });
  }, [expandedId]);
  return (
    <div
      className="resource-sheet-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="resource-sheet"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-resources-title"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
          if (e.key === "Tab") {
            const items = Array.from(
              e.currentTarget.querySelectorAll<HTMLElement>(
                "button:not(:disabled),textarea,a,input",
              ),
            );
            const first = items[0],
              last = items[items.length - 1];
            if (
              e.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === panel.current)
            ) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <header className="resource-sheet-header">
          <div className="resource-sheet-heading">
            <span className="resource-sheet-kicker">This conversation</span>
            <h2 id="chat-resources-title">Chat resources</h2>
            <p>
              {resources.length} {resources.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Close chat resources"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <div className="resource-sheet-body">
          {["References", "Generated"].map((group) => {
            const items = resources.filter((r) =>
              group === "References"
                ? r.kind === "document"
                : r.kind !== "document",
            );
            if (!items.length) return null;
            return (
              <section className="resource-group" key={group}>
                <h3>
                  <span>{group}</span>
                  <span className="resource-group-count">{items.length}</span>
                </h3>
                {items.map((r) => {
                  const Icon = resourceIcons[r.kind];
                  const document = files.find((file) => file.id === r.fileId);
                  const reference =
                    r.reference ||
                    (document ? referenceFor(document) : undefined);
                  const expanded = expandedId === r.id;
                  const wordCount = (r.body || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length;
                  return (
                    <div
                      className={`resource-row ${expanded ? "is-open" : ""}`}
                      data-resource-id={r.id}
                      key={r.id}
                    >
                      <div className="resource-row-head">
                        <button
                          className="resource-row-main"
                          aria-expanded={expanded}
                          onClick={() => onToggle(expanded ? null : r.id)}
                        >
                          <span
                            className={`resource-list-icon resource-icon-${r.kind}`}
                          >
                            <Icon size={18} />
                          </span>
                          <span className="resource-row-text">
                            <b>{r.title}</b>
                            <small>{resourceSummary(r, document)}</small>
                          </span>
                        </button>
                        {r.kind === "document" && reference && (
                          <button
                            className="resource-row-open"
                            aria-label={`Open ${r.title}`}
                            title="Open document"
                            onClick={() => onOpenDocument(reference.fileId)}
                          >
                            <ArrowUpRight size={15} />
                          </button>
                        )}
                        <button
                          className="resource-row-expand"
                          aria-expanded={expanded}
                          aria-label={
                            expanded
                              ? `Collapse ${r.title}`
                              : `Expand ${r.title}`
                          }
                          onClick={() => onToggle(expanded ? null : r.id)}
                        >
                          <ChevronDown
                            className="resource-row-chevron"
                            size={16}
                          />
                        </button>
                      </div>
                      {expanded && (
                        <div className="resource-row-body">
                          {r.kind === "document" ? (
                            <div className="resource-reference">
                              <span className="resource-reference-label">
                                Text used by Alexis
                                {reference?.page ? ` · ${reference.page}` : ""}
                              </span>
                              <p className="resource-reference-text">
                                {reference?.documentText ||
                                  reference?.excerpt ||
                                  r.body ||
                                  "This reference is no longer in your library."}
                              </p>
                            </div>
                          ) : r.kind === "quiz" ? (
                            <QuizResource key={r.id} questions={r.questions} />
                          ) : r.kind === "flashcards" ? (
                            <FlashcardResource key={r.id} cards={r.cards} />
                          ) : r.kind === "writing" ? (
                            <>
                              <textarea
                                className="resource-writing-draft"
                                aria-label={`Edit ${r.title}`}
                                value={r.body || ""}
                                onChange={(e) =>
                                  onUpdate(r.id, e.target.value)
                                }
                              />
                              <div className="resource-writing-meta">
                                <span>
                                  {wordCount}{" "}
                                  {wordCount === 1 ? "word" : "words"}
                                </span>
                                <span>
                                  <Check size={12} />
                                  Saved automatically
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="resource-reference">
                              <p className="resource-reference-text">
                                {r.body ||
                                  "This summary is no longer in your library."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
          {!resources.length && (
            <div className="resource-empty">
              <span className="resource-empty-icon">
                <FileText size={22} />
              </span>
              <h3>Your resources will appear here</h3>
              <p>
                Attach a document or create a quiz, flashcards, summary, or
                writing draft in this chat.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
