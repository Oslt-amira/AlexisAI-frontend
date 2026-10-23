"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  GraduationCap,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { StudyFile } from "./demo-data";
import type { LibraryCollection } from "./library-organization";
import PlatformSelect from "./platform-select";

export default function LibraryBrowser({
  files,
  collections,
  onFilesChange,
  onCollectionsChange,
  onOpen,
  onUpload,
  onSync,
}: {
  files: StudyFile[];
  collections: LibraryCollection[];
  onFilesChange: (files: StudyFile[]) => void;
  onCollectionsChange: (collections: LibraryCollection[]) => void;
  onOpen: (file: StudyFile) => void;
  onUpload: (subject: string, folderId?: string) => void;
  onSync: () => void;
}) {
  const [subject, setSubject] = useState("All");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [form, setForm] = useState<"folder" | "rename" | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [newMenu, setNewMenu] = useState<"menu" | "subject" | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [moving, setMoving] = useState<StudyFile | null>(null);
  const [moveSubject, setMoveSubject] = useState("");
  const [moveFolder, setMoveFolder] = useState("");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const formRef = useRef<HTMLInputElement>(null);
  const movingRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!moving) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    movingRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [moving]);
  const subjects = Array.from(
    new Set([
      ...files.map((f) => f.subject),
      ...collections.filter((c) => c.kind === "subject").map((c) => c.name),
    ]),
  );
  const targetSubject = subject === "All" ? subjects[0] || "Biology" : subject;
  const folders = useMemo(() => {
    const result = collections
      .filter((c) => c.kind === "folder")
      .map((c) => ({
        ...c,
        subject:
          c.subject ||
          files.find((f) => c.files.includes(f.id))?.subject ||
          "Biology",
        files: c.files.filter((id) => files.some((f) => f.id === id)),
      }));
    const assigned = new Set(result.flatMap((c) => c.files));
    for (const s of subjects) {
      for (const classroom of [true, false]) {
        const ids = files
          .filter(
            (f) =>
              f.subject === s &&
              !assigned.has(f.id) &&
              (classroom
                ? f.id.startsWith("classroom-")
                : [
                    "nasa-sun",
                    "bio-1",
                    "bio-2",
                    "psych-1",
                    "chem-1",
                    "math-1",
                  ].includes(f.id)),
          )
          .map((f) => f.id);
        if (ids.length) {
          const id = `${classroom ? "classroom" : "course"}-${s.toLowerCase().replace(/\s/g, "-")}`;
          result.push({
            id,
            name: classroom ? "Classroom materials" : "Course notes",
            kind: "folder",
            subject: s,
            origin: classroom ? "classroom" : "manual",
            files: ids,
          });
          ids.forEach((id) => assigned.add(id));
        }
      }
    }
    return result;
    // Subjects are derived from the same two collections.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, collections]);
  const current = folders.find((f) => f.id === folderId);
  const activeFolders = folders.filter(
    (f) => !f.root && (subject === "All" || f.subject === subject),
  );
  const classroomSubject = (s: string) =>
    files.some((f) => f.subject === s && f.id.startsWith("classroom-"));
  const visible = files.filter((f) => {
    if (subject !== "All" && f.subject !== subject) return false;
    if (
      !(f.title + " " + f.subject).toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (subject === "All" || search) return true;
    if (current) return current.files.includes(f.id);
    return !folders.some(
      (folder) => !folder.root && folder.files.includes(f.id),
    );
  });
  if (sort === "title") visible.sort((a, b) => a.title.localeCompare(b.title));
  useEffect(() => {
    const dismiss = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      if (
        !e.target.closest(
          ".library-entry-menu,.library-entry-options,.library-move-form",
        )
      )
        setMenu(null);
      if (!e.target.closest(".library-new-menu")) {
        setNewMenu(null);
        setSubjectError("");
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  function selectSubject(s: string) {
    setSubject(s);
    setFolderId(null);
    setSearch("");
    setMenu(null);
    setForm(null);
    setNewMenu(null);
  }
  function begin(kind: "folder" | "rename", value = "") {
    setForm(kind);
    setName(value);
    setError("");
    setMenu(null);
    setNewMenu(null);
  }
  function commit(updated: LibraryCollection[]) {
    onCollectionsChange([
      ...collections.filter((c) => c.kind === "subject"),
      ...updated,
    ]);
  }
  function upload(subject: string, folderId?: string) {
    commit(folders);
    onUpload(subject, folderId);
  }
  function create() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (form === "folder") {
      if (subject === "All") {
        setError("Choose a subject for this folder.");
        return;
      }
      if (
        activeFolders.some(
          (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        setError("This subject already has a folder with that name.");
        return;
      }
      commit([
        ...folders,
        {
          id: crypto.randomUUID(),
          name: trimmed,
          kind: "folder",
          files: [],
          subject,
          origin: "manual",
        },
      ]);
    } else if (form === "rename" && current)
      commit(
        folders.map((f) => (f.id === current.id ? { ...f, name: trimmed } : f)),
      );
    setForm(null);
    setName("");
  }
  function createSubject() {
    const trimmed = subjectName.trim();
    if (!trimmed) return;
    if (subjects.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSubjectError("This subject already exists.");
      return;
    }
    onCollectionsChange([
      ...collections,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        kind: "subject",
        files: [],
        origin: "manual",
      },
    ]);
    setSubjectName("");
    setSubjectError("");
    setNewMenu(null);
    selectSubject(trimmed);
  }
  return (
    <div className="library-browser">
      <header className="screen-heading library-page-heading">
        <div>
          <h1>Library</h1>
          <p>Your subjects, course materials, and references.</p>
        </div>
        <div className="screen-heading-actions">
          <button className="secondary-button" onClick={onSync}>
            <GraduationCap size={16} />
            <span>Sync Google Classroom</span>
          </button>
          <button
            className="primary-button"
            onClick={() => upload(targetSubject, current?.id)}
          >
            <Plus size={16} />
            Add documents
          </button>
        </div>
      </header>
      <div className="library-subject-navigation">
        <div className="filter-tabs" aria-label="Library subjects">
          <button
            className={subject === "All" ? "active" : ""}
            aria-pressed={subject === "All"}
            onClick={() => selectSubject("All")}
          >
            All
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              className={subject === s ? "active" : ""}
              aria-pressed={subject === s}
              onClick={() => selectSubject(s)}
            >
              {s}
              {classroomSubject(s) && (
                <GraduationCap size={13} aria-label="From Google Classroom" />
              )}
            </button>
          ))}
          <div className="library-new-menu">
            <button
              className="secondary-button library-new-button"
              aria-label="Create new"
              aria-expanded={newMenu !== null}
              aria-haspopup="menu"
              onClick={() => {
                setNewMenu((open) => (open ? null : "menu"));
                setSubjectError("");
                setForm(null);
              }}
            >
              <Plus size={14} />
            </button>
            {newMenu && (
              <div className="library-new-popover">
                {newMenu === "menu" ? (
                  <div className="library-new-options" role="menu">
                    <button
                      role="menuitem"
                      disabled={subject === "All"}
                      title={
                        subject === "All" ? "Select a subject first" : undefined
                      }
                      onClick={() => begin("folder")}
                    >
                      <FolderPlus size={15} />
                      <span>New folder</span>
                      <small>
                        {subject === "All" ? "Pick a subject" : subject}
                      </small>
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setNewMenu("subject");
                        setSubjectError("");
                      }}
                    >
                      <Plus size={15} />
                      <span>New subject</span>
                    </button>
                  </div>
                ) : (
                  <form
                    className="library-new-form"
                    aria-label="Add subject"
                    onSubmit={(e) => {
                      e.preventDefault();
                      createSubject();
                    }}
                  >
                    <label htmlFor="new-subject-name">New subject</label>
                    <div>
                      <input
                        id="new-subject-name"
                        value={subjectName}
                        onChange={(e) => {
                          setSubjectName(e.target.value);
                          setSubjectError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setNewMenu(null);
                            setSubjectError("");
                          }
                        }}
                        autoFocus
                        maxLength={60}
                        placeholder="e.g. Economics"
                      />
                      <button
                        className="primary-button"
                        disabled={!subjectName.trim()}
                      >
                        <Check size={14} />
                        Create
                      </button>
                    </div>
                    {subjectError && <p role="alert">{subjectError}</p>}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {form && (
        <form
          className="library-inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <label htmlFor="library-name">
            {form === "rename" ? "Rename folder" : "New folder"}
          </label>
          <input
            id="library-name"
            ref={formRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={60}
            placeholder="e.g. Exam prep"
          />
          <button className="primary-button" disabled={!name.trim()}>
            <Check size={14} />
            {form === "rename" ? "Save" : "Create"}
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Cancel library form"
            onClick={() => setForm(null)}
          >
            <X size={17} />
          </button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      <>
        {!current &&
          subject !== "All" &&
          !search &&
          activeFolders.length > 0 && (
            <div className="library-folder-grid">
              {activeFolders.map((folder) => (
                <button
                  className="library-folder-card"
                  key={folder.id}
                  onClick={() => {
                    setFolderId(folder.id);
                    setSearch("");
                  }}
                >
                  <Folder size={20} />
                  <span>
                    <b>{folder.name}</b>
                    <small>
                      {folder.files.length}{" "}
                      {folder.files.length === 1 ? "document" : "documents"}
                    </small>
                  </span>
                  {folder.origin === "classroom" && (
                    <GraduationCap
                      size={14}
                      aria-label="Google Classroom folder"
                    />
                  )}
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          )}
        <div className="library-documents-toolbar">
          <span>
            {current ? (
              <>
                <button
                  className="library-back-button"
                  onClick={() => setFolderId(null)}
                  aria-label={`Back to ${subject === "All" ? "all documents" : subject}`}
                  title="Back"
                >
                  <ArrowLeft size={14} />
                </button>
                {current.name}
              </>
            ) : subject === "All" ? (
              "All documents"
            ) : activeFolders.length ? (
              "Documents outside folders"
            ) : (
              "Documents"
            )}
            <small>{visible.length}</small>
          </span>
          <div>
            {current && (
              <div className="library-current-folder-options flex flex-row items-center gap-2">
                <button
                  className="icon-button library-entry-options"
                  aria-label="Folder actions"
                  aria-expanded={menu === "folder"}
                  onClick={() => setMenu(menu === "folder" ? null : "folder")}
                >
                  <MoreVertical size={18} />
                </button>
                {menu === "folder" && (
                  <div className="library-entry-menu" role="menu">
                    <button
                      role="menuitem"
                      onClick={() => begin("rename", current.name)}
                    >
                      <Pencil size={14} />
                      Rename folder
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        const ids = current.files;
                        const remaining = folders.filter(
                          (f) => f.id !== current.id,
                        );
                        commit([
                          ...remaining,
                          {
                            id: current.id,
                            name: "Subject root",
                            subject: current.subject,
                            kind: "folder",
                            files: ids,
                            origin: "manual",
                            root: true,
                          },
                        ]);
                        setFolderId(null);
                        setMenu(null);
                      }}
                    >
                      <Trash2 size={14} />
                      Remove folder
                    </button>
                    <small>Documents stay in this subject.</small>
                  </div>
                )}
              </div>
            )}
            <label className="library-document-search">
              <Search size={14} />
              <input
                aria-label="Search documents"
                placeholder="Search documents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <PlatformSelect
              aria-label="Sort documents"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Recently added</option>
              <option value="title">Title A–Z</option>
            </PlatformSelect>
          </div>
        </div>
        <div className="library-files">
          {visible.map((file) => (
            <div className="library-document-row" key={file.id}>
              <button
                className="document-row document-open"
                onClick={() => onOpen(file)}
              >
                <span className="document-file-icon">
                  <FileText size={19} />
                </span>
                <div className="file-details">
                  <h3>{file.title}</h3>
                  <p>
                    {file.kind}
                    <span>·</span>
                    {file.pages} pages
                    {file.id.startsWith("classroom-") && (
                      <>
                        <span>·</span>Google Classroom
                      </>
                    )}
                  </p>
                </div>
                <span className="document-date flex items-end">
                  {file.date}
                </span>
              </button>
              <button
                className="icon-button library-entry-options"
                aria-label={`Organize ${file.title}`}
                onClick={() => {
                  setMoving(file);
                  setMoveSubject(file.subject);
                  setMoveFolder(
                    folders.find((f) => !f.root && f.files.includes(file.id))
                      ?.id || "",
                  );
                }}
              >
                <MoreVertical size={17} />
              </button>
            </div>
          ))}
        </div>
        {!visible.length &&
          (current ||
            subject === "All" ||
            !!search ||
            !activeFolders.some((folder) => folder.files.length)) && (
            <div className="empty-state my-12">
              <FileText size={27} />
              <h3>
                {search ? "No matching documents" : "No documents here yet"}
              </h3>
              <p>
                {search
                  ? "Try a different title."
                  : "Add documents or move them here from this subject."}
              </p>
              <button
                className="secondary-button"
                onClick={() => upload(targetSubject, current?.id)}
              >
                <Plus size={15} />
                Add documents
              </button>
            </div>
          )}
      </>
      {moving && (
        <div
          className="library-move-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setMoving(null);
          }}
        >
          <form
            ref={movingRef}
            className="library-move-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-document-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") setMoving(null);
              if (e.key === "Tab") {
                const nodes = Array.from(
                  movingRef.current?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]),input, [tabindex="0"]',
                  ) || [],
                );
                const first = nodes[0],
                  last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
            onSubmit={(e) => {
              e.preventDefault();
              onFilesChange(
                files.map((f) =>
                  f.id === moving.id ? { ...f, subject: moveSubject } : f,
                ),
              );
              const rootId = "subject-root-" + moveSubject;
              const destination = moveFolder || rootId;
              let updated = folders.map((folder) => ({
                ...folder,
                files: [
                  ...folder.files.filter((id) => id !== moving.id),
                  ...(folder.id === destination ? [moving.id] : []),
                ],
              }));
              if (
                !moveFolder &&
                !updated.some((folder) => folder.id === rootId)
              )
                updated.push({
                  id: rootId,
                  name: "Subject root",
                  kind: "folder",
                  subject: moveSubject,
                  files: [moving.id],
                  origin: "manual",
                  root: true,
                });
              commit(updated);
              setMoving(null);
            }}
          >
            <button
              type="button"
              className="icon-button library-move-close"
              aria-label="Close move document"
              onClick={() => setMoving(null)}
            >
              <X size={18} />
            </button>
            <h2 id="move-document-title">Move document</h2>
            <p>{moving.title}</p>
            <label>
              Subject
              <PlatformSelect
                aria-label="Destination subject"
                value={moveSubject}
                onChange={(e) => {
                  setMoveSubject(e.target.value);
                  setMoveFolder("");
                }}
              >
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </PlatformSelect>
            </label>
            <label>
              Folder
              <PlatformSelect
                aria-label="Destination folder"
                value={moveFolder}
                onChange={(e) => setMoveFolder(e.target.value)}
              >
                <option value="">Subject root</option>
                {folders
                  .filter((f) => !f.root && f.subject === moveSubject)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </PlatformSelect>
            </label>
            <button className="primary-button full-width">
              Move document
              <ChevronRight size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
