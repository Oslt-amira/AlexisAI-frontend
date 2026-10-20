"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronRight,
  Folder,
  FolderPlus,
  MessagesSquare,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type Chat = { id: string; title: string };
type Group = { id: string; name: string; chats: string[] };
const initial: Group[] = [
  { id: "biology", name: "Biology", chats: ["c1"] },
  { id: "semester", name: "First semester revision", chats: ["c2"] },
];

export default function ConversationOrganizer({
  conversations,
  activeId,
  onOpen,
}: {
  conversations: Chat[];
  activeId: string | null;
  onOpen: (id: string) => void;
}) {
  const [groups, setGroups] = useState<Group[]>(initial);
  const [sort, setSort] = useState("recent");
  const [order, setOrder] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>(["biology"]);
  const [menu, setMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ left: 12, top: 100 });
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("alexis-conversation-groups-v1") || "null",
      );
      if (saved && Array.isArray(saved.groups)) {
        const seen = new Set<string>();
        setGroups(
          saved.groups
            .filter(
              (g: Group) =>
                g &&
                typeof g.id === "string" &&
                typeof g.name === "string" &&
                Array.isArray(g.chats),
            )
            .map((g: Group) => ({
              ...g,
              chats: g.chats.filter((id) => {
                if (typeof id !== "string" || seen.has(id)) return false;
                seen.add(id);
                return true;
              }),
            })),
        );
        if (["recent", "az", "manual"].includes(saved.sort))
          setSort(saved.sort);
        if (Array.isArray(saved.ungroupedOrder))
          setOrder(
            saved.ungroupedOrder.filter(
              (id: unknown) => typeof id === "string",
            ),
          );
      }
    } catch {
      setSaveError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        "alexis-conversation-groups-v1",
        JSON.stringify({ groups, sort, ungroupedOrder: order }),
      );
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [groups, sort, order, ready]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(".tree-popover, .tree-menu-trigger")
      )
        setMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(null);
        setEditing(null);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    const group = groups.find((g) => g.chats.includes(activeId || ""));
    if (group)
      setExpanded((p) => (p.includes(group.id) ? p : [...p, group.id]));
  }, [activeId, groups]);
  function ordered(ids?: string[]) {
    const items = conversations.filter((c) => !ids || ids.includes(c.id));
    if (sort === "az") items.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "manual") {
      const list = ids || order;
      items.sort(
        (a, b) =>
          (list.indexOf(a.id) < 0 ? 999999 : list.indexOf(a.id)) -
          (list.indexOf(b.id) < 0 ? 999999 : list.indexOf(b.id)),
      );
    }
    return items;
  }
  function move(id: string, target: string) {
    setGroups((p) =>
      p.map((g) => ({
        ...g,
        chats: [
          ...g.chats.filter((c) => c !== id),
          ...(g.id === target ? [id] : []),
        ],
      })),
    );
    if (target !== "none")
      setExpanded((p) => (p.includes(target) ? p : [...p, target]));
    setMenu(null);
    setDropTarget(null);
  }
  function reorder(id: string, delta: number, groupId: string, items: Chat[]) {
    const ids = items.map((c) => c.id),
      index = ids.indexOf(id),
      next = index + delta;
    if (next < 0 || next >= ids.length) return;
    [ids[index], ids[next]] = [ids[next], ids[index]];
    setSort("manual");
    if (groupId === "none") setOrder(ids);
    else
      setGroups((p) =>
        p.map((g) => (g.id === groupId ? { ...g, chats: ids } : g)),
      );
    setMenu(null);
  }
  function editFolder(id: string, value: string) {
    setEditing(id);
    setName(value);
    setMenu(null);
  }
  function openMenu(id: string, event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      left: Math.max(8, Math.min(rect.right - 204, window.innerWidth - 212)),
      top: Math.max(12, Math.min(rect.bottom + 4, window.innerHeight - 330)),
    });
    setMenu(menu === id ? null : id);
  }
  function row(chat: Chat, index: number, items: Chat[], groupId: string) {
    return (
      <div
        className={"tree-chat " + (activeId === chat.id ? "selected" : "")}
        key={chat.id}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/x-alexis-chat", chat.id);
          e.dataTransfer.effectAllowed = "move";
        }}
      >
        <button
          className="tree-chat-open"
          title={chat.title}
          onClick={() => {
            setMenu(null);
            onOpen(chat.id);
          }}
        >
          {chat.title}
        </button>
        <button
          className="tree-menu-trigger"
          aria-label={"Organize " + chat.title}
          aria-expanded={menu === chat.id}
          aria-haspopup="menu"
          onClick={(event) => openMenu(chat.id, event)}
        >
          <MoreVertical size={15} />
        </button>
        {menu === chat.id && (
          <div
            className="tree-popover"
            style={menuPosition}
            role="menu"
            aria-label={"Move " + chat.title}
          >
            <p>Move to</p>
            <button
              autoFocus
              role="menuitem"
              onClick={() => move(chat.id, "none")}
            >
              <MessagesSquare size={14} />
              Unfiled chats{groupId === "none" && <Check size={13} />}
            </button>
            {groups.map((g) => (
              <button
                role="menuitem"
                key={g.id}
                onClick={() => move(chat.id, g.id)}
              >
                <Folder size={14} />
                <span>{g.name}</span>
                {g.id === groupId && <Check size={13} />}
              </button>
            ))}
            <hr />
            <button
              role="menuitem "
              className="text-red-500"
              onClick={() => reorder(chat.id, -1, groupId, items)}
            >
              <Trash2 size={14} />
              Delete Chat
            </button>
          </div>
        )}
      </div>
    );
  }
  const assigned = new Set(groups.flatMap((g) => g.chats));
  const unfiled = ordered().filter((c) => !assigned.has(c.id));
  return (
    <section
      className="conversation-organizer chat-tree"
      aria-label="Chat folders"
      onKeyDown={(e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const target = e.target as HTMLElement;
        const popover = target.closest(".tree-popover");
        if (!popover) return;
        e.preventDefault();
        const items = Array.from(
          popover.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
        );
        const index = items.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        items[
          (index + (e.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length
        ]?.focus();
      }}
    >
      <div className="chat-tree-toolbar">
        <h2>Chats</h2>
        <button
          className="tree-menu-trigger"
          aria-label="New chat folder"
          title="New folder"
          onClick={() => editFolder("new", "")}
        >
          <FolderPlus size={16} />
        </button>
        <div className="tree-sort">
          <button
            className="tree-menu-trigger"
            aria-label="Sort chats"
            aria-expanded={menu === "sort"}
            onClick={(event) => openMenu("sort", event)}
          >
            <ArrowUpDown size={15} />
          </button>
          {menu === "sort" && (
            <div className="tree-popover" role="menu" style={menuPosition}>
              {[
                ["recent", "Newest first"],
                ["az", "Alphabetical"],
                ["manual", "Custom order"],
              ].map(([value, label], i) => (
                <button
                  key={value}
                  role="menuitemradio"
                  autoFocus={i === 0}
                  aria-checked={sort === value}
                  onClick={() => {
                    setSort(value);
                    setMenu(null);
                  }}
                >
                  {label}
                  {sort === value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {editing && (
        <form
          className="tree-folder-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            if (editing === "new") {
              const id = crypto.randomUUID();
              setGroups((p) => [...p, { id, name: name.trim(), chats: [] }]);
              setExpanded((p) => [...p, id]);
            } else
              setGroups((p) =>
                p.map((g) =>
                  g.id === editing ? { ...g, name: name.trim() } : g,
                ),
              );
            setEditing(null);
          }}
        >
          <input
            aria-label="Chat folder name"
            placeholder="Folder name"
            autoFocus
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button aria-label="Save chat folder" disabled={!name.trim()}>
            <Check size={15} />
          </button>
          <button
            type="button"
            aria-label="Cancel chat folder"
            onClick={() => setEditing(null)}
          >
            <X size={15} />
          </button>
        </form>
      )}
      {groups.map((group) => {
        const items = ordered(group.chats),
          open = expanded.includes(group.id);
        return (
          <div
            className={
              "tree-folder " + (dropTarget === group.id ? "drop-target" : "")
            }
            key={group.id}
            onDragOver={(e) => {
              e.preventDefault();
              setDropTarget(group.id);
            }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("application/x-alexis-chat");
              if (conversations.some((c) => c.id === id)) move(id, group.id);
            }}
          >
            <div className="tree-folder-row">
              <button
                className="tree-folder-toggle"
                aria-expanded={open}
                aria-controls={"folder-" + group.id}
                onClick={() =>
                  setExpanded((p) =>
                    open ? p.filter((id) => id !== group.id) : [...p, group.id],
                  )
                }
              >
                <ChevronRight size={12} className={open ? "expanded" : ""} />
                <Folder size={15} />
                <span>{group.name}</span>
                <small>{items.length}</small>
              </button>
              <button
                className="tree-menu-trigger"
                aria-label={"Folder options for " + group.name}
                aria-expanded={menu === "folder:" + group.id}
                onClick={(event) => openMenu("folder:" + group.id, event)}
              >
                <MoreVertical size={15} />
              </button>
              {menu === "folder:" + group.id && (
                <div className="tree-popover" role="menu" style={menuPosition}>
                  <button
                    role="menuitem"
                    autoFocus
                    onClick={() => editFolder(group.id, group.name)}
                  >
                    <Pencil size={14} />
                    Rename folder
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setGroups((p) => p.filter((g) => g.id !== group.id));
                      setMenu(null);
                    }}
                  >
                    <Trash2 size={14} />
                    Remove folder
                  </button>
                  <p>Conversations are kept.</p>
                </div>
              )}
            </div>
            {open && (
              <div className="tree-folder-children" id={"folder-" + group.id}>
                {items.map((chat, i) => row(chat, i, items, group.id))}
                {!items.length && (
                  <p className="tree-folder-empty">
                    Move a chat here using its ••• menu.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
      {!!unfiled.length && (
        <div
          className="tree-unfiled"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("application/x-alexis-chat");
            if (conversations.some((c) => c.id === id)) move(id, "none");
          }}
        >
          {groups.length > 0 && <span>Unfiled</span>}
          {unfiled.map((chat, i) => row(chat, i, unfiled, "none"))}
        </div>
      )}
      {!conversations.length && (
        <p className="tree-folder-empty">
          Your conversations will appear here.
        </p>
      )}
      {saveError && (
        <p className="organizer-save-note">
          Folders could not be saved to this browser.
        </p>
      )}
    </section>
  );
}
