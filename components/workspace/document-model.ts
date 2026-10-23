import type { StudyFile } from "./demo-data";
import { referenceFor } from "./learning-answer";
import { openReadingSections } from "./open-reading";

export type TextSegment = { paragraphId: string; start: number; end: number };
export type DocumentAnnotation = {
  id: string;
  quote: string;
  segments: TextSegment[];
  color: "amber" | "rose" | "sage" | "sand";
  style: "overlay" | "underline" | "soft";
  note: string;
  createdAt: string;
};
export type ReaderSection = { id: string; title: string; text: string };
export function documentSections(file: StudyFile): ReaderSection[] {
  if (file.id === "nasa-sun")
    return openReadingSections.map((section, index) => ({
      id: `paragraph-${index}`,
      title: section.title,
      text: section.text,
    }));
  const blocks = referenceFor(file).documentText.split("\n\n").slice(1);
  return blocks
    .filter((block) => block.includes("\n"))
    .map((block, index) => ({
      id: `paragraph-${index}`,
      title: block.split("\n")[0].replace(/^\d+ · /, ""),
      text: block.split("\n").slice(1).join(" "),
    }));
}
export function annotationRuns(
  text: string,
  paragraphId: string,
  annotations: DocumentAnnotation[],
) {
  const segments = annotations.flatMap((annotation) =>
    annotation.segments
      .filter((segment) => segment.paragraphId === paragraphId)
      .map((segment) => ({ ...segment, annotation })),
  );
  const boundaries = Array.from(
    new Set([
      0,
      text.length,
      ...segments.flatMap((segment) => [
        Math.max(0, Math.min(text.length, segment.start)),
        Math.max(0, Math.min(text.length, segment.end)),
      ]),
    ]),
  ).sort((a, b) => a - b);
  return boundaries
    .slice(0, -1)
    .map((start, index) => ({
      text: text.slice(start, boundaries[index + 1]),
      start,
      annotation: segments
        .filter((segment) => segment.start <= start && segment.end > start)
        .at(-1)?.annotation,
    }));
}
export function selectionSegments(
  range: Range,
  paragraphs: HTMLElement[],
): TextSegment[] {
  return paragraphs.flatMap((paragraph) => {
    if (!range.intersectsNode(paragraph)) return [];
    const local = range.cloneRange();
    if (!paragraph.contains(range.startContainer)) local.setStart(paragraph, 0);
    if (!paragraph.contains(range.endContainer))
      local.setEnd(paragraph, paragraph.childNodes.length);
    const prefix = local.cloneRange();
    prefix.selectNodeContents(paragraph);
    prefix.setEnd(local.startContainer, local.startOffset);
    const start = prefix.toString().length,
      end = start + local.toString().length;
    return end > start
      ? [{ paragraphId: paragraph.dataset.paragraphId!, start, end }]
      : [];
  });
}
export function explainPassage(
  file: StudyFile,
  question: string,
  quote: string,
) {
  const sections = documentSections(file);
  const words = (quote || question).toLowerCase().match(/[a-z]{4,}/g) || [];
  const ranked = sections
    .map((section, index) => ({
      section,
      index,
      score: words.filter((word) => section.text.toLowerCase().includes(word))
        .length,
    }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best)
    return {
      title: "The original text is needed",
      text: "This uploaded entry only contains a summary. Try the included NASA reading or one of the sample course chapters.",
      source: "Document summary",
    };
  if (file.id === "nasa-sun")
    return {
      title: best.section.title,
      text: openReadingSections[best.index].explanation,
      source: `Section ${best.index + 1} · ${best.section.title}`,
    };
  const text = best.section.text;
  const focus = quote
    ? `This passage is about ${best.section.title.toLowerCase()}. `
    : "";
  return {
    title: best.section.title,
    text: focus + text,
    source: best.section.title,
  };
}
