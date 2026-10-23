"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Highlighter,
  Layers3,
  ListChecks,
  Loader2,
  MessageCircle,
  PanelRightClose,
  PanelRightOpen,
  PencilLine,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { StudyFile } from "./demo-data";
import { referenceFor } from "./learning-answer";
import { createPracticeSet } from "./practice-data";
import { type ChatMode } from "./chat-resources";
import { FlashcardResource, QuizResource } from "./study-practice";
import {
  annotationRuns,
  documentSections,
  explainPassage,
  selectionSegments,
  type DocumentAnnotation,
  type TextSegment,
} from "./document-model";
import { openReadingSource } from "./open-reading";
import PlatformSelect from "./platform-select";
import "./document-reader.css";

type Selection = {
  quote: string;
  segments: TextSegment[];
  x: number;
  y: number;
};
type Reply = {
  question: string;
  quote: string;
  title: string;
  text: string;
  source: string;
};
type Panel = "Summary" | "Ask" | "Practice" | "Notes";
type AnnotationEditor = {
  id: string | null;
  quote: string;
  segments: TextSegment[];
  color: DocumentAnnotation["color"];
  style: DocumentAnnotation["style"];
  note: string;
  x: number;
  y: number;
};

const COLORS: DocumentAnnotation["color"][] = ["amber", "rose", "sage", "sand"];
const STYLES: DocumentAnnotation["style"][] = ["overlay", "underline", "soft"];

const COLOR_BG: Record<DocumentAnnotation["color"], string> = {
  amber: "#fef3c7",
  rose: "#fce7f3",
  sage: "#dcfce7",
  sand: "#f5f5f4",
};
const COLOR_BORDER: Record<DocumentAnnotation["color"], string> = {
  amber: "#d97706",
  rose: "#be185d",
  sage: "#15803d",
  sand: "#78716c",
};
const COLOR_LABEL: Record<DocumentAnnotation["color"], string> = {
  amber: "Amber",
  rose: "Rose",
  sage: "Sage",
  sand: "Sand",
};
const STYLE_LABEL: Record<DocumentAnnotation["style"], string> = {
  overlay: "Overlay",
  underline: "Underline",
  soft: "Soft",
};
export default function DocumentReader({
  file,
  folderName,
  backLabel,
  onClose,
  onChat,
}: {
  file: StudyFile;
  folderName: string;
  backLabel: string;
  onClose: () => void;
  onChat: (question: string, mode: ChatMode) => void;
}) {
  const sections = useMemo(() => documentSections(file), [file]);
  const reference = referenceFor(file);
  const [panel, setPanel] = useState<Panel>("Summary");
  const [panelOpen, setPanelOpen] = useState(true);
  const panelTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 899px)").matches) setPanelOpen(false);
  }, []);
  const [size, setSize] = useState("Comfortable");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>([]);
  const [editor, setEditor] = useState<AnnotationEditor | null>(null);
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [working, setWorking] = useState<"answer" | "quiz" | "cards" | null>(
    null,
  );
  const [practiceMode, setPracticeMode] = useState<"quiz" | "cards">("cards");
  const [generated, setGenerated] = useState({ quiz: false, cards: false });
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [status, setStatus] = useState("");
  const article = useRef<HTMLElement>(null);
  const side = useRef<HTMLElement>(null);
  const panelContent = useRef<HTMLDivElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLFormElement>(null);
  const askInput = useRef<HTMLInputElement>(null);
  const selectionToolbar = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const practice = useMemo(() => createPracticeSet([file]), [file]);
  useEffect(() => {
    if (panel !== "Ask") panelContent.current?.scrollTo({ top: 0 });
  }, [panel, practiceMode]);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("alexis-document-v1:" + file.id) || "null",
      );
      if (saved) {
        if (Array.isArray(saved.annotations))
          setAnnotations(
            saved.annotations
              .filter(
                (item: DocumentAnnotation) =>
                  item &&
                  typeof item.quote === "string" &&
                  Array.isArray(item.segments),
              )
              .map((item: DocumentAnnotation) => ({
                ...item,
                color:
                  (item.color as string) === "yellow"
                    ? "amber"
                    : (item.color as DocumentAnnotation["color"]),
                style: (item.style as DocumentAnnotation["style"]) || "overlay",
              })),
          );
        if (Array.isArray(saved.replies)) setReplies(saved.replies);
        if (saved.generated)
          setGenerated({
            quiz: !!saved.generated.quiz,
            cards: !!saved.generated.cards,
          });
      }
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
    return () => clearTimeout(timer.current);
  }, [file.id]);
  useEffect(() => {
    if (!loaded || storageError) return;
    try {
      localStorage.setItem(
        "alexis-document-v1:" + file.id,
        JSON.stringify({ annotations, replies, generated }),
      );
    } catch {
      setStorageError(true);
    }
  }, [annotations, replies, generated, loaded, storageError, file.id]);
  useEffect(() => {
    const capture = () => {
      const current = window.getSelection();
      if (!current || current.isCollapsed || !current.rangeCount) {
        setSelection(null);
        return;
      }
      const range = current.getRangeAt(0);
      if (!article.current?.contains(range.commonAncestorContainer)) return;
      const paragraphs = Array.from(
        article.current.querySelectorAll<HTMLElement>("[data-paragraph-id]"),
      );
      const segments = selectionSegments(range, paragraphs);
      if (!segments.length) return;
      const quote = current.toString().trim();
      if (!quote) return;
      const rect = range.getBoundingClientRect();
      setSelection({
        quote,
        segments,
        x: Math.max(12, Math.min(window.innerWidth - 328, rect.left)),
        y: Math.max(76, Math.min(window.innerHeight - 72, rect.bottom + 9)),
      });
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelection(null);
        setEditor(null);
        window.getSelection()?.removeAllRanges();
      }
    };
    document.addEventListener("selectionchange", capture);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("selectionchange", capture);
      document.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (!editor) return;
    const onDown = (event: PointerEvent) => {
      if (editorRef.current?.contains(event.target as Node)) return;
      if (selectionToolbar.current?.contains(event.target as Node)) return;
      setEditor(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [editor]);
  useEffect(() => {
    if (panel !== "Ask") return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    if (window.innerWidth < 900) {
      const replies =
        panelContent.current?.querySelectorAll<HTMLElement>(".reader-reply");
      const latest =
        working === "answer"
          ? panelContent.current?.querySelector<HTMLElement>(".reader-working")
          : replies?.[replies.length - 1];
      latest?.scrollIntoView({ behavior, block: "start" });
    } else {
      panelContent.current?.scrollTo({
        top: panelContent.current.scrollHeight,
        behavior,
      });
    }
  }, [replies, working, panel]);
  function openPanel(next: Panel) {
    setPanel(next);
    setPanelOpen(true);
  }
  function closePanel() {
    setPanelOpen(false);
    panelTrigger.current?.focus();
  }
  useEffect(() => {
    if (!panelOpen || !window.matchMedia("(max-width: 899px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
      if (event.key === "Tab" && side.current) {
        const controls = Array.from(side.current.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea, a[href], [tabindex="0"]'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    side.current?.querySelector<HTMLButtonElement>("button")?.focus();
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [panelOpen]);
  function clearSelection() {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }
  function selectParagraph(
    id: string,
    text: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const rect =
      article.current
        ?.querySelector<HTMLElement>(`[data-paragraph-id="${id}"]`)
        ?.getBoundingClientRect() ||
      event.currentTarget.getBoundingClientRect();
    setSelection({
      quote: text,
      segments: [{ paragraphId: id, start: 0, end: text.length }],
      x: Math.max(12, Math.min(window.innerWidth - 328, rect.left)),
      y: Math.max(76, Math.min(window.innerHeight - 72, rect.bottom + 8)),
    });
    requestAnimationFrame(() =>
      selectionToolbar.current
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus(),
    );
  }
  function beginAnnotation(focusNote: boolean) {
    if (!selection) return;
    const approxHeight = 360;
    const y =
      selection.y + approxHeight > window.innerHeight - 12
        ? Math.max(12, window.innerHeight - approxHeight - 12)
        : selection.y;
    setEditor({
      id: null,
      quote: selection.quote,
      segments: selection.segments,
      color: "amber",
      style: "overlay",
      note: "",
      x: Math.max(12, Math.min(window.innerWidth - 352, selection.x)),
      y,
    });
    clearSelection();
    if (focusNote) requestAnimationFrame(() => noteInput.current?.focus());
  }
  function askSelection() {
    if (!selection) return;
    const quote = selection.quote;
    setContext(quote);
    openPanel("Ask");
    clearSelection();
    ask("Explain this passage in simpler terms.", quote);
  }
  function ask(text: string, quote = context) {
    if (!text.trim() || working) return;
    openPanel("Ask");
    setQuestion("");
    setWorking("answer");
    timer.current = setTimeout(() => {
      const result = explainPassage(file, text, quote);
      setReplies((previous) => [
        ...previous,
        { question: text, quote, ...result },
      ]);
      setWorking(null);
    }, 700);
  }
  function generate(mode: "quiz" | "cards") {
    if (working) return;
    openPanel("Practice");
    setPracticeMode(mode);
    if (generated[mode]) return;
    setWorking(mode);
    timer.current = setTimeout(() => {
      setGenerated((previous) => ({ ...previous, [mode]: true }));
      setWorking(null);
    }, 850);
  }
  function saveEditor() {
    if (!editor) return;
    const note = editor.note.trim();
    if (editor.id) {
      setAnnotations((previous) =>
        previous.map((item) =>
          item.id === editor.id
            ? { ...item, note, color: editor.color, style: editor.style }
            : item,
        ),
      );
    } else {
      setAnnotations((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          quote: editor.quote,
          segments: editor.segments,
          color: editor.color,
          style: editor.style,
          note,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setEditor(null);
    setStatus(note ? "Note saved" : "Highlight saved");
  }
  function editAnnotation(item: DocumentAnnotation) {
    const paragraph = item.segments[0]
      ? article.current?.querySelector<HTMLElement>(
          `[data-paragraph-id="${item.segments[0].paragraphId}"]`,
        )
      : null;
    let x = 12;
    let y = 96;
    if (paragraph) {
      paragraph.scrollIntoView({ behavior: "smooth", block: "center" });
      const rect = paragraph.getBoundingClientRect();
      x = Math.max(12, Math.min(window.innerWidth - 352, rect.left));
      y = Math.max(72, Math.min(window.innerHeight - 380, rect.bottom + 10));
    }
    setEditor({
      id: item.id,
      quote: item.quote,
      segments: item.segments,
      color: item.color,
      style: item.style,
      note: item.note,
      x,
      y,
    });
    requestAnimationFrame(() => noteInput.current?.focus());
  }
  function jumpTo(item: DocumentAnnotation) {
    if (!item.segments[0]) return;
    article.current
      ?.querySelector<HTMLElement>(
        `[data-paragraph-id="${item.segments[0].paragraphId}"]`,
      )
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return (
    <div
      className={`alexis-app document-reader ${panelOpen ? "reader-panel-open" : ""}`}
    >
      <main className="reader-layout">
        <div className="reader-canvas">
          <div className="reader-location">
            <button
              className="reader-back icon-button"
              aria-label={backLabel}
              title={backLabel}
              onClick={onClose}
            >
              <ArrowLeft size={17} />
            </button>
            <nav
              className="reader-breadcrumbs"
              aria-label="Document breadcrumb"
            >
              <span>{file.subject}</span>
              <ChevronRight size={12} />
              <span>{folderName}</span>
              <ChevronRight size={12} />
              <span aria-current="page">{file.title}</span>
            </nav>
            <div className="reader-location-actions">
              <button
                className="icon-button"
                aria-label="Document notes"
                title="Notes"
                aria-pressed={panelOpen && panel === "Notes"}
                aria-controls="document-study-panel"
                onClick={(event) => {
                  panelTrigger.current = event.currentTarget;
                  if (panel === "Notes" && panelOpen) closePanel();
                  else openPanel("Notes");
                }}
              >
                <PencilLine size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="Document summary"
                title="Document summary"
                aria-expanded={panelOpen && panel === "Summary"}
                aria-controls="document-study-panel"
                onClick={(event) => {
                  panelTrigger.current = event.currentTarget;
                  if (panelOpen && panel === "Summary") closePanel();
                  else openPanel("Summary");
                }}
              >
                {panelOpen ? (
                  <PanelRightClose size={18} />
                ) : (
                  <PanelRightOpen size={18} />
                )}
              </button>
            </div>
          </div>
          <article
            className={`reader-paper ${size === "Large text" ? "reader-large-text" : ""}`}
            ref={article}
            aria-label="Document text"
          >
            <div className="reader-document-kicker">
              {file.id === "nasa-sun"
                ? "NASA Science · Selected excerpts"
                : `${file.kind} · Included course material`}
            </div>
            <h1>{file.id === "nasa-sun" ? "Our Sun: Facts" : file.title}</h1>
            <p className="reader-instruction">
              Select a passage to ask Alexis, highlight, or add a note.
            </p>
            <div className="reader-document-rule" />
            {!sections.length ? (
              <div className="reader-unavailable">
                <FileFallback summary={file.summary} />
              </div>
            ) : (
              sections.map((section, index) => (
                <section className="reader-section" key={section.id}>
                  <div className="reader-section-heading">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h2>{section.title}</h2>
                    <button
                      className="reader-select-passage icon-button"
                      aria-label={`Select passage ${index + 1}`}
                      title="Select this passage"
                      onClick={(event) =>
                        selectParagraph(section.id, section.text, event)
                      }
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <p data-paragraph-id={section.id}>
                    {annotationRuns(section.text, section.id, annotations).map(
                      (run) =>
                        run.annotation ? (
                          <mark
                            key={run.start}
                            className={`reader-highlight reader-highlight--${run.annotation.color} reader-highlight--${run.annotation.style}`}
                            role="button"
                            tabIndex={0}
                            aria-label={
                              run.annotation.note
                                ? `Read note: ${run.annotation.note}`
                                : "Highlighted passage"
                            }
                            onClick={() => {
                              if (window.getSelection()?.isCollapsed !== false)
                                editAnnotation(run.annotation!);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                editAnnotation(run.annotation!);
                              }
                            }}
                          >
                            {run.text}
                          </mark>
                        ) : (
                          <span key={run.start}>{run.text}</span>
                        ),
                    )}
                  </p>
                </section>
              ))
            )}
            {reference.figure && (
              <figure className="reader-figure">
                <img
                  src={reference.figure.src}
                  alt={reference.figure.caption}
                />
                <figcaption>{reference.figure.caption}</figcaption>
              </figure>
            )}
            {file.id === "nasa-sun" ? (
              <footer className="reader-attribution">
                <b>Source & reuse</b>
                <p>{openReadingSource.rights}</p>
                <a
                  href={openReadingSource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the complete NASA article <ExternalLink size={12} />
                </a>
                <a
                  href={openReadingSource.rightsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  NASA content usage guidelines <ExternalLink size={12} />
                </a>
              </footer>
            ) : (
              <footer className="reader-attribution">
                Included sample course text. Original uploads need document
                processing.
              </footer>
            )}
          </article>
        </div>
        {panelOpen && <button className="reader-panel-scrim" aria-label="Close study panel" tabIndex={-1} onClick={closePanel} />}
        <aside
          id="document-study-panel"
          ref={side}
          className={`reader-study-panel ${!panelOpen ? "is-hidden" : ""}`}
          aria-label="Document study panel"
        >
          <div className="reader-panel-navigation">
            {panel !== "Summary" && <button className="reader-overview-button" onClick={() => setPanel("Summary")}><ArrowLeft size={14} /> Overview</button>}
            <button className="icon-button reader-panel-close" aria-label="Close study panel" onClick={closePanel}><X size={17} /></button>
          </div>
          <div className="reader-panel-content" ref={panelContent}>
            {panel === "Summary" && (
              <>
                <span className="reader-panel-eyebrow">At a glance</span>
                <h2>Document summary</h2>
                <p className="reader-summary">{file.summary}</p>
                <div className="reader-outline">
                  <span>In this reading</span>
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() =>
                        article.current
                          ?.querySelector<HTMLElement>(
                            `[data-paragraph-id="${section.id}"]`,
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          })
                      }
                    >
                      <span>{index + 1}</span>
                      {section.title}
                      <ArrowRight size={13} />
                    </button>
                  ))}
                </div>
                <div className="reader-study-actions">
                  <button
                    onClick={() => {
                      openPanel("Ask");
                      requestAnimationFrame(() => askInput.current?.focus());
                    }}
                  >
                    <MessageCircle size={17} />
                    <span>
                      <b>Ask about this document</b>
                      <small>Work through an idea together</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    disabled={!practice.cards.length || !!working}
                    onClick={() => generate("cards")}
                  >
                    <Layers3 size={17} />
                    <span>
                      <b>Flashcards</b>
                      <small>Recall the key concepts</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    disabled={!practice.questions.length || !!working}
                    onClick={() => generate("quiz")}
                  >
                    <ListChecks size={17} />
                    <span>
                      <b>Practice quiz</b>
                      <small>Test your understanding</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </>
            )}
            {panel === "Ask" && (
              <>
                <span className="reader-panel-eyebrow">
                  Document conversation
                </span>
                <h2>Ask about this document</h2>

                {replies.map((reply, index) => (
                  <div className="reader-reply" key={index}>
                    <div className="reader-question">{reply.question}</div>
                    {reply.quote && <blockquote>{reply.quote}</blockquote>}
                    <span className="reader-answer-label">
                      <Sparkles size={13} />
                      Alexis
                    </span>
                    <h3>{reply.title}</h3>
                    <p>{reply.text}</p>
                    <small>
                      <BookOpen size={12} />
                      {reply.source}
                    </small>
                    <button
                      className="reader-open-chat"
                      onClick={() =>
                        onChat(
                          reply.question +
                            (reply.quote
                              ? `\n\nSelected passage:\n“${reply.quote}”`
                              : ""),
                          "Ask",
                        )
                      }
                    >
                      Continue in chat
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
                {working === "answer" && (
                  <div className="reader-working" role="status">
                    <Loader2 size={17} className="spin" />
                    Reading this passage…
                  </div>
                )}
              </>
            )}
            {panel === "Practice" && (
              <>
                <span className="reader-panel-eyebrow">Active recall</span>
                <h2>
                  {practiceMode === "cards"
                    ? "Document flashcards"
                    : "Document quiz"}
                </h2>
                {working === "cards" || working === "quiz" ? (
                  <div className="reader-working" role="status">
                    <Loader2 size={19} className="spin" />
                    Preparing {working === "cards" ? "flashcards" : "your quiz"}
                    …
                  </div>
                ) : generated[practiceMode] && practice.cards.length ? (
                  <div className="reader-inline-practice">
                    {practiceMode === "cards" ? (
                      <FlashcardResource cards={practice.cards} />
                    ) : (
                      <QuizResource questions={practice.questions} />
                    )}
                    <button
                      className="reader-open-chat"
                      onClick={() =>
                        onChat(
                          practiceMode === "cards"
                            ? "Create flashcards from this document"
                            : "Quiz me on this document",
                          practiceMode === "cards" ? "Flashcards" : "Quiz",
                        )
                      }
                    >
                      Open in chat
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="reader-ask-empty">
                    <p>
                      {practice.cards.length
                        ? "Choose flashcards or a quiz to practice this document."
                        : "The original document text is needed to prepare practice."}
                    </p>
                    {!!practice.cards.length && (
                      <button
                        className="primary-button"
                        onClick={() => generate(practiceMode)}
                      >
                        Create{" "}
                        {practiceMode === "cards" ? "flashcards" : "quiz"}
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            {panel === "Notes" && (
              <>
                <div className="reader-notes-header">
                  <div>
                    <span className="reader-panel-eyebrow">
                      Your annotations
                    </span>
                    <h2>Your notebook</h2>
                  </div>
                  {!!annotations.length && (
                    <span className="reader-notebook-count">
                      {annotations.length}
                    </span>
                  )}
                </div>
                {!annotations.length && (
                  <div className="reader-notes-empty">
                    <span className="reader-empty-icon">
                      <PencilLine size={22} />
                    </span>
                    <h3>No annotations yet</h3>
                    <p>
                      Select a passage in the document to highlight it or add a
                      note.
                    </p>
                  </div>
                )}
                <div className="reader-annotations">
                  {annotations.map((item) => (
                    <article
                      key={item.id}
                      className={`reader-annotation-item ${
                        editor?.id === item.id ? "is-editing" : ""
                      }`}
                    >
                      <header className="reader-item-header">
                        <div className="reader-item-meta">
                          <span
                            className="reader-type-dot"
                            style={{
                              background: COLOR_BG[item.color],
                              borderColor: COLOR_BORDER[item.color],
                            }}
                          />
                          <span className="reader-item-type">
                            {item.note ? "Note" : "Highlight"}
                          </span>
                          <time className="reader-item-date">
                            {formatAnnotationDate(item.createdAt)}
                          </time>
                        </div>
                        <div className="reader-item-actions">
                          <button
                            className="reader-item-edit"
                            aria-label={item.note ? "Edit note" : "Add note"}
                            title={item.note ? "Edit note" : "Add note"}
                            onClick={() => editAnnotation(item)}
                          >
                            <PencilLine size={13} />
                          </button>
                          <button
                            className="reader-item-delete"
                            aria-label={`Remove ${
                              item.note ? "note" : "highlight"
                            }`}
                            title={`Remove ${item.note ? "note" : "highlight"}`}
                            onClick={() => {
                              setAnnotations((previous) =>
                                previous.filter(
                                  (entry) => entry.id !== item.id,
                                ),
                              );
                              if (editor?.id === item.id) setEditor(null);
                              setStatus("Annotation removed");
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </header>
                      {item.quote && (
                        <div
                          className="reader-item-quote"
                          onClick={() => jumpTo(item)}
                          title="Find passage in document"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              jumpTo(item);
                            }
                          }}
                        >
                          “{item.quote}”
                        </div>
                      )}
                      {item.note && (
                        <p className="reader-item-note">{item.note}</p>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
          {panel === "Ask" && (
            <form
              className="reader-ask-form"
              onSubmit={(event) => {
                event.preventDefault();
                ask(question);
              }}
            >
              {context && (
                <div className="reader-context">
                  <BookOpen size={13} />
                  <span>{context}</span>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Clear selected passage"
                    onClick={() => setContext("")}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
              <label htmlFor="reader-question" className="sr-only">
                Ask about this document
              </label>
              <div>
                <input
                  ref={askInput}
                  id="reader-question"
                  placeholder={
                    context
                      ? "Ask about this passage…"
                      : "Ask about this document…"
                  }
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
                <button
                  className="reader-send"
                  aria-label="Send document question"
                  disabled={!question.trim() || !!working}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          )}
        </aside>
      </main>
      {selection && (
        <div
          className="reader-selection-toolbar"
          ref={selectionToolbar}
          role="toolbar"
          aria-label="Selected passage actions"
          style={{ left: selection.x, top: selection.y }}
          onPointerDown={(event) => event.preventDefault()}
        >
          <button disabled={!!working} onClick={askSelection}>
            <Sparkles size={14} />
            <span>Ask Alexis</span>
          </button>
          <span />
          <button
            aria-label="Highlight selection"
            title="Highlight"
            onClick={() => beginAnnotation(false)}
          >
            <Highlighter size={15} />
            <span>Highlight</span>
          </button>
          <button
            aria-label="Annotate selection"
            title="Add note"
            onClick={() => beginAnnotation(true)}
          >
            <PencilLine size={15} />
            <span>Note</span>
          </button>
          <button aria-label="Dismiss selection" onClick={clearSelection}>
            <X size={14} />
          </button>
        </div>
      )}
      {editor && (
        <form
          ref={editorRef}
          className="reader-annotation-editor"
          style={{ left: editor.x, top: editor.y }}
          onSubmit={(event) => {
            event.preventDefault();
            saveEditor();
          }}
        >
          {editor.quote && (
            <div className="reader-editor-quote py-1.5 mt-2 mb-3">
              “{editor.quote}”
            </div>
          )}
          <textarea
            ref={noteInput}
            className="reader-editor-note"
            value={editor.note}
            onChange={(event) =>
              setEditor((previous) =>
                previous ? { ...previous, note: event.target.value } : previous,
              )
            }
            placeholder="Add a note (optional)…"
            maxLength={4000}
            rows={3}
          />
          <div className="reader-editor-row my-1 mx-1">
            <span className="reader-editor-label">Color</span>
            <div className="reader-swatches">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`reader-swatch ${
                    editor.color === color ? "is-active" : ""
                  }`}
                  style={
                    {
                      "--swatch": COLOR_BG[color],
                      "--swatch-border": COLOR_BORDER[color],
                    } as React.CSSProperties
                  }
                  aria-label={COLOR_LABEL[color]}
                  aria-pressed={editor.color === color}
                  title={COLOR_LABEL[color]}
                  onClick={() =>
                    setEditor((previous) =>
                      previous ? { ...previous, color } : previous,
                    )
                  }
                />
              ))}
            </div>
          </div>
          <div className="reader-editor-row my-1 mx-1">
            <span className="reader-editor-label">Style</span>
            <div className="reader-segmented">
              {STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={editor.style === style ? "is-active" : ""}
                  aria-pressed={editor.style === style}
                  onClick={() =>
                    setEditor((previous) =>
                      previous ? { ...previous, style } : previous,
                    )
                  }
                >
                  {STYLE_LABEL[style]}
                </button>
              ))}
            </div>
          </div>
          <div className="reader-editor-footer mt-3">
            <button
              type="button"
              className="reader-editor-cancel"
              onClick={() => setEditor(null)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button reader-editor-save">
              {editor.note.trim() ? "Save note" : "Save highlight"}
            </button>
          </div>
        </form>
      )}
      <div className="reader-status sr-only" role="status">
        {status}
      </div>
    </div>
  );
}
function formatAnnotationDate(iso: string) {
  const date = new Date(iso);
  date.setFullYear(2024);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function FileFallback({ summary }: { summary: string }) {
  return (
    <>
      <BookOpen size={25} />
      <h2>The source document isn’t available yet.</h2>
      <p>{summary}</p>
      <small>
        This upload currently has a library placeholder. Try the NASA reading to
        use text selection, highlights, and notes.
      </small>
    </>
  );
}
