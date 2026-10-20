"use client";
import { useState } from "react";
import {
  Check,
  Folder,
  FolderPlus,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
export type LibraryCollection = {
  id: string;
  name: string;
  kind: "folder" | "subject";
  files: string[];
  subject?: string;
  origin?: "manual" | "classroom";
  root?: boolean;
};
export default function LibraryOrganization({
  collections,
  selected,
  onSelect,
  onCreate,
  onRename,
  onRemove,
}: {
  collections: LibraryCollection[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (name: string, kind: "folder" | "subject") => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  const [form, setForm] = useState<"folder" | "subject" | "rename" | null>(
    null,
  );
  const [name, setName] = useState("");
  const [options, setOptions] = useState(false);
  const current = collections.find((c) => c.id === selected);
  return (
    <div className="library-organization">
      <div className="library-organization-bar">
        <div className="library-folder-tabs">
          <button
            className={!selected ? "selected" : ""}
            onClick={() => onSelect(null)}
          >
            All documents
          </button>
          {collections
            .filter((c) => c.kind === "folder")
            .map((c) => (
              <button
                className={selected === c.id ? "selected" : ""}
                key={c.id}
                onClick={() => onSelect(c.id)}
              >
                <Folder size={15} />
                {c.name}
                <small>{c.files.length}</small>
              </button>
            ))}
        </div>
        <div className="library-organize-actions">
          <button
            className="text-button"
            onClick={() => {
              setForm("folder");
              setName("");
            }}
          >
            <FolderPlus size={15} />
            New folder
          </button>
          <button
            className="text-button"
            onClick={() => {
              setForm("subject");
              setName("");
            }}
          >
            <Plus size={15} />
            New subject
          </button>
          {current && (
            <div className="library-folder-options">
              <button
                className="icon-button"
                aria-label="Library folder options"
                aria-expanded={options}
                onClick={() => setOptions((v) => !v)}
              >
                <MoreVertical size={17} />
              </button>
              {options && (
                <div className="chat-popover" role="menu">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setName(current.name);
                      setForm("rename");
                      setOptions(false);
                    }}
                  >
                    <Pencil size={14} />
                    Rename folder
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      onRemove(current.id);
                      onSelect(null);
                      setOptions(false);
                    }}
                  >
                    <Trash2 size={14} />
                    Remove folder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {form && (
        <form
          className="library-create-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            if (form === "rename" && current) onRename(current.id, name.trim());
            else if (form !== "rename") onCreate(name.trim(), form);
            setForm(null);
            setName("");
          }}
        >
          <label htmlFor="library-collection-name">
            {form === "rename" ? "Rename folder" : `New ${form}`}
          </label>
          <input
            id="library-collection-name"
            placeholder={
              form === "subject" ? "e.g. Economics" : "e.g. Semester 1"
            }
            autoFocus
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="primary-button" disabled={!name.trim()}>
            <Check size={14} />
            {form === "rename" ? "Save" : "Create"}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Cancel library organization"
            onClick={() => setForm(null)}
          >
            <X size={17} />
          </button>
        </form>
      )}
    </div>
  );
}
