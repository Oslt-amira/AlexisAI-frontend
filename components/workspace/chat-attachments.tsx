"use client";
import { FileText, Image as ImageIcon, Music2, X } from "lucide-react";
export type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  text?: string;
};
export function attachmentSize(size: number) {
  return size < 1024
    ? `${size} B`
    : size < 1024 * 1024
      ? `${Math.ceil(size / 1024)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
export async function prepareAttachments(
  list: FileList | File[],
  existing: ChatAttachment[] = [],
) {
  const incoming = Array.from(list);
  const valid = incoming
    .filter(
      (file) =>
        file.size <= 20 * 1024 * 1024 &&
        !/\.(exe|dll|bat|cmd|msi|ps1)$/i.test(file.name) &&
        !existing.some(
          (item) => item.name === file.name && item.size === file.size,
        ),
    )
    .slice(0, Math.max(0, 10 - existing.length));
  const attachments = await Promise.all(
    valid.map(async (file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      text:
        /\.(txt|md|csv)$/i.test(file.name) && file.size <= 100000
          ? (await file.text()).slice(0, 16000)
          : undefined,
    })),
  );
  return { attachments, rejected: incoming.length - valid.length };
}
export default function AttachmentList({
  items,
  onRemove,
}: {
  items: ChatAttachment[];
  onRemove?: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div
      className={`chat-attachment-list ${onRemove ? "is-pending" : ""}`}
      aria-label={onRemove ? "Files to attach" : "Attached files"}
    >
      {items.map((item) => {
        const Icon = item.type.startsWith("image/")
          ? ImageIcon
          : item.type.startsWith("audio/")
            ? Music2
            : FileText;
        return (
          <div className="chat-attachment-chip" key={item.id}>
            <span className="chat-attachment-icon">
              <Icon size={17} />
            </span>
            <span>
              <b title={item.name}>{item.name}</b>
              <small>
                {attachmentSize(item.size)}
                {onRemove ? " · This chat only" : ""}
              </small>
            </span>
            {onRemove && (
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove attachment ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                <X size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function attachmentAnswer(items: ChatAttachment[]) {
  const readable = items.filter((item) => item.text?.trim());
  return {
    title: readable.length
      ? "A closer look at your attached text"
      : "Your files are attached to this chat",
    body: readable.length
      ? readable
          .map(
            (item) =>
              `${item.name}: ${item
                .text!.trim()
                .split(/(?<=[.!?])\s/)
                .slice(0, 3)
                .join(" ")
                .slice(0, 1000)}`,
          )
          .join("\n\n")
      : "These attachments stay in this conversation. This demo can preview plain-text files; understanding images, audio, PDFs, and other binary files needs the AI connection.",
    points: readable.length
      ? [
          "Preview based on the attached text. Full analysis and practice generation need the AI connection.",
        ]
      : [],
  };
}
