"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Layers3,
  ListChecks,
  PencilLine,
  Sparkles,
} from "lucide-react";
import { type ChatMode, type ChatResource } from "./chat-resources";
import { FlashcardResource, QuizResource } from "./study-practice";
import type { DetailedAnswer, SourceReference } from "./learning-answer";
import FurtherReading from "./further-reading";

export function AnswerProgress({
  mode,
  count,
}: {
  mode: ChatMode;
  count: number;
}) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const one = setTimeout(() => setStage(1), 420);
    const two = setTimeout(() => setStage(2), 950);
    return () => {
      clearTimeout(one);
      clearTimeout(two);
    };
  }, []);
  const labels =
    mode === "Quiz"
      ? [
          "Reviewing course material",
          "Preparing practice questions",
          "Checking explanations",
        ]
      : mode === "Flashcards"
        ? [
            "Reviewing course material",
            "Finding key concepts",
            "Preparing your flashcards",
          ]
        : [
            `Searching ${count} ${count === 1 ? "document" : "documents"}`,
            "Reading the relevant passages",
            "Building your explanation",
          ];
  return (
    <div className="answer-progress" aria-live="polite">
      <div>
        <b>{labels[stage]}</b>
        <span className="answer-progress-dots">
          <i />
          <i />
          <i />
        </span>
      </div>
      <p>
        {stage === 2
          ? "Almost ready"
          : "Alexis is working through your material"}
      </p>
      <div className="answer-progress-track">
        {labels.map((label, i) => (
          <span key={label} className={stage >= i ? "active" : ""} />
        ))}
      </div>
    </div>
  );
}
export function RichAnswer({
  answer,
  onReference,
  onOpenDocument,
}: {
  answer: DetailedAnswer;
  onReference: (reference: SourceReference) => void;
  onOpenDocument: (id: string) => void;
}) {
  return (
    <div className="rich-learning-answer">
      <div className="answer-scope">
        <BookOpen size={13} />
        {answer.scopeLabel}
        <span>·</span>
        {answer.references.length}{" "}
        {answer.references.length === 1 ? "reference" : "references"}
      </div>
      <h2>{answer.title}</h2>
      <p>{answer.introduction}</p>
      <aside className="answer-key-idea">
        <span>
          <Sparkles size={15} />
          {answer.takeaway.label}
        </span>
        <p>{answer.takeaway.text}</p>
      </aside>
      {answer.diagram && (
        <div className="answer-process">
          <h3>{answer.diagram.title}</h3>
          <div>
            {answer.diagram.steps.map((step, i) => (
              <div className="answer-process-step" key={step.title}>
                <span>{i + 1}</span>
                <b>{step.title}</b>
                <small>{step.detail}</small>
                {i < answer.diagram!.steps.length - 1 && (
                  <ArrowRight className="process-connector" size={16} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {answer.sections.map((section, i) => (
        <section className="answer-explanation-section" key={section.title + i}>
          <h3>{section.title}</h3>
          <p>
            {section.body}
            {answer.references[section.citation] && (
              <button
                className="answer-citation"
                aria-label={`Reference ${section.citation + 1}: ${answer.references[section.citation].title}`}
                onClick={() => onReference(answer.references[section.citation])}
              >
                {section.citation + 1}
              </button>
            )}
          </p>
          {section.bullets && (
            <ul>
              {section.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {answer.figure && (
        <figure className="answer-course-figure">
          <img
            src={answer.figure.src}
            alt="Diagram showing the mitochondrial inner membrane, proton gradient, and ATP synthase."
          />
          <figcaption>
            {answer.figure.caption}
            <button
              onClick={() =>
                onOpenDocument(
                  answer.references[answer.figure!.citation].fileId,
                )
              }
            >
              Check document
              <ArrowRight size={12} />
            </button>
          </figcaption>
        </figure>
      )}
      {!!answer.references.length && (
        <div className="answer-reference-list">
          <h3>
            References <span>{answer.references.length}</span>
          </h3>
          {answer.references.map((reference, i) => (
            <button
              key={reference.fileId}
              onClick={() => onReference(reference)}
            >
              <span>{i + 1}</span>
              <FileText size={14} />
              <b>{reference.title}</b>
              <small>{reference.page}</small>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      )}
      <FurtherReading topic={answer.title + " " + answer.introduction} />
    </div>
  );
}
export function InlineStudyResource({
  resource,
  onOpen,
}: {
  resource: ChatResource;
  onOpen: () => void;
}) {
  const Icon =
    resource.kind === "quiz"
      ? ListChecks
      : resource.kind === "flashcards"
        ? Layers3
        : resource.kind === "writing"
          ? PencilLine
          : FileText;
  if (resource.kind !== "quiz" && resource.kind !== "flashcards")
    return (
      <button className="chat-resource-preview" onClick={onOpen}>
        <span className="resource-list-icon">
          <Icon size={19} />
        </span>
        <span>
          <b>{resource.title}</b>
          <small>
            {resource.kind === "writing"
              ? "Open editable draft"
              : "Read summary"}
          </small>
        </span>
        <ArrowRight size={16} />
      </button>
    );
  return (
    <details className="inline-study-resource">
      <summary>
        <span className="resource-list-icon">
          <Icon size={20} />
        </span>
        <span>
          <b>{resource.title}</b>
          <small>
            {resource.kind === "quiz"
              ? (resource.questions?.length || 5) +
                " questions · Immediate explanations"
              : (resource.cards?.length || 5) + " cards · Flip to review"}
          </small>
        </span>
        <span className="inline-study-start">
          {resource.kind === "quiz" ? "Start quiz" : "Review"}
          <ChevronDown size={14} />
        </span>
      </summary>
      <div className="inline-study-body">
        {resource.kind === "quiz" ? (
          <QuizResource questions={resource.questions} />
        ) : (
          <FlashcardResource cards={resource.cards} />
        )}
        <button className="inline-resource-sheet-link" onClick={onOpen}>
          Open in resources
          <ArrowRight size={13} />
        </button>
      </div>
    </details>
  );
}
