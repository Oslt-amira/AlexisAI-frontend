"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Mic,
  Pause,
  Play,
  PanelRightClose,
  PanelRightOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Focus,
  RefreshCw,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  FileText,
  Flame,
  FolderOpen,
  GraduationCap,
  Home,
  Layers3,
  Leaf,
  ListChecks,
  Loader2,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Moon,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Target,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Upload,
  X,
} from "lucide-react";
import {
  demoAnswer,
  flashcards,
  initialFiles,
  initialTasks,
  quizQuestions,
  subjects as defaultSubjects,
  type StudyFile,
  type StudyTask,
} from "./demo-data";
import "./design-system.css";
import "./inline-chat.css";
import ConversationOrganizer from "./conversation-organizer";
import VoiceAssistant from "./voice-assistant";
import SidebarProfile from "./sidebar-profile";
import ChatModePicker from "./chat-mode-picker";
import ChatResources, {
  type ChatMode,
  type ChatResource,
} from "./chat-resources";
import type { LibraryCollection } from "./library-organization";
import "./product-flow.css";
import "./learning-flow.css";
import PlatformSelect from "./platform-select";
import ContextPicker from "./context-picker";
import LibraryBrowser from "./library-browser";
import StudyPlanner from "./study-planner";
import {
  DEMO_TODAY,
  taskDate,
  weekDay,
  sessionConflict,
} from "./planner-dates";
import {
  createLearningAnswer,
  referenceFor,
  type DetailedAnswer,
  type SourceReference,
} from "./learning-answer";
import { createPracticeSet } from "./practice-data";
import { AnswerProgress, InlineStudyResource, RichAnswer } from "./rich-answer";
import DocumentReader from "./document-reader";
import { explainPassage } from "./document-model";
import { openReadingFile } from "./open-reading";
import ChatScrollArea from "./chat-scroll-area";
import FurtherReading from "./further-reading";
import "./workspace-polish.css";
import FocusSession, { FocusPlant } from "./focus-session";
import AttachmentList, {
  prepareAttachments,
  attachmentAnswer,
  type ChatAttachment,
} from "./chat-attachments";
import "./focus-attachments.css";
type View =
  | "Home"
  | "My library"
  | "Study room"
  | "Study planner"
  | "Explore"
  | "Ask Alexis"
  | "Settings";
type Modal =
  | "upload"
  | "flashcards"
  | "quiz"
  | "plan"
  | "welcome"
  | "sync"
  | "account"
  | "upgrade"
  | null;
const palettes = [
  { id: "green", name: "Sage", hint: "Calm and grounded" },
  { id: "purple", name: "Iris", hint: "Focused and creative" },
  { id: "chrome", name: "Chrome", hint: "Clean and quiet" },
  { id: "amber", name: "Amber", hint: "Warm and papery" },
] as const;
type Accent = (typeof palettes)[number]["id"];
type Message = {
  attachments?: ChatAttachment[];
  mode?: ChatMode;
  rating?: "helpful" | "unhelpful";
  role: "user" | "assistant";
  text: string;
  answer?: ReturnType<typeof demoAnswer>;
  source?: string;
  resource?: ChatResource;
  detailed?: DetailedAnswer;
};
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  resources?: ChatResource[];
  contextIds?: string[];
};
const navItems = [
  { name: "My library" as View, icon: FolderOpen },
  { name: "Study planner" as View, icon: CalendarDays },
];
const viewKeys: Record<string, View> = {
  home: "Home",
  library: "My library",
  study: "Home",
  planner: "Study planner",
  explore: "Explore",
  chat: "Ask Alexis",
  settings: "Settings",
};
const seedConversations: Conversation[] = [
  {
    id: "c1",
    title: "Understanding cellular respiration",
    messages: [
      { role: "user", text: "Explain cellular respiration in simple terms" },
      {
        role: "assistant",
        text: "",
        answer: demoAnswer("cellular respiration"),
        source: initialFiles[0].title,
      },
    ],
  },
  {
    id: "c2",
    title: "Memory & learning strategies",
    messages: [
      { role: "user", text: "How does memory work?" },
      {
        role: "assistant",
        text: "",
        answer: demoAnswer("memory"),
        source: initialFiles[1].title,
      },
    ],
  },
];
function Emblem({ className = "" }: { className?: string }) {
  return (
    <span className={`emblem ${className}`}>
      <img className="alexis-logo" src="/brand/logo.svg" alt="Alexis" />
    </span>
  );
}
function SectionTitle({
  title,
  action,
  onClick,
}: {
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}
export default function AlexisWorkspace() {
  const router = useRouter();
  const [view, setView] = useState<View>("Home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const themeInitialized = useRef(false);
  const [accent, setAccent] = useState<Accent | null>(null);
  const accentInitialized = useRef(false);
  const [materialsCollapsed, setMaterialsCollapsed] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerDeadline = useRef<number | null>(null);
  const [syncTab, setSyncTab] = useState<"calendar" | "classroom">("calendar");
  const [importedClassroom, setImportedClassroom] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("alexis-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(
        stored === "dark" || stored === "light"
          ? stored
          : prefersDark
            ? "dark"
            : "light",
      );
    } catch {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (themeInitialized.current) {
      try {
        localStorage.setItem("alexis-theme", theme);
      } catch {}
    }
    themeInitialized.current = true;
  }, [theme]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("alexis-accent");
      if (palettes.some((p) => p.id === stored)) {
        setAccent(stored as Accent);
      } else {
        setAccent("green");
      }
    } catch {
      setAccent("green");
    }
  }, []);
  useEffect(() => {
    if (!accent) return;
    document.documentElement.dataset.accent = accent;
    if (accentInitialized.current) {
      try {
        localStorage.setItem("alexis-accent", accent);
      } catch {}
    }
    accentInitialized.current = true;
  }, [accent]);
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil(((timerDeadline.current || Date.now()) - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setTimerRunning(false);
        timerDeadline.current = null;
      }
    }, 250);
    return () => clearInterval(interval);
  }, [timerRunning]);
  function toggleTimer() {
    if (timerRunning) {
      setSecondsLeft(
        Math.max(
          0,
          Math.ceil(
            ((timerDeadline.current || Date.now()) - Date.now()) / 1000,
          ),
        ),
      );
      setTimerRunning(false);
      timerDeadline.current = null;
    } else {
      const next = secondsLeft || timerDuration * 60;
      setSecondsLeft(next);
      timerDeadline.current = Date.now() + next * 1000;
      setTimerRunning(true);
    }
  }
  function resetTimer(minutes = timerDuration) {
    setTimerDuration(minutes);
    setTimerRunning(false);
    timerDeadline.current = null;
    setSecondsLeft(minutes * 60);
  }
  function enterFocus() {
    if (view !== "Home" && view !== "Ask Alexis") navigate("Home");
    setFocusMode(true);
    setMobileMenu(false);
  }
  function exitFocus() {
    setFocusMode(false);
    if (timerRunning) toggleTimer();
  }
  function exportCalendar() {
    const escape = (v: string) =>
      v
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
    const stamp = (date: Date) =>
      date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const events = tasks.map((t) => {
      const date = new Date(taskDate(t) + "T" + t.time + ":00+01:00");
      const end = new Date(
        date.getTime() + (parseInt(t.duration) || 25) * 60000,
      );
      return [
        "BEGIN:VEVENT",
        `UID:${t.id}@alexis.demo`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(date)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${escape(t.title)}`,
        `DESCRIPTION:${escape(t.subject + " · Alexis demo study session")}`,
        "END:VEVENT",
      ].join("\r\n");
    });
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Alexis//Study Planner//EN",
      "CALSCALE:GREGORIAN",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "alexis-study-plan.ics";
    a.click();
    URL.revokeObjectURL(url);
    notify(
      "Calendar exported. Import the .ics file into Google Calendar, Apple Calendar, or Outlook.",
    );
  }
  function importClassroom() {
    const samples: StudyFile[] = [
      {
        id: "classroom-bio",
        source: "classroom",
        title: "Biology 201 — Cellular Systems",
        subject: "Biology",
        kind: "PDF",
        pages: 28,
        date: "Just now",
        color: "sage",
        summary:
          "Demo Google Classroom course material covering cell structures, energy transfer, and cellular respiration.",
      },
      {
        id: "classroom-psych",
        source: "classroom",
        title: "Psychology — Memory & Cognition",
        subject: "Psychology",
        kind: "PDF",
        pages: 16,
        date: "Just now",
        color: "sand",
        summary:
          "Demo Google Classroom reference covering working memory, encoding, retrieval, and effective study techniques.",
      },
    ];
    setFiles((prev) => [
      ...samples.filter((f) => !prev.some((existing) => existing.id === f.id)),
      ...prev,
    ]);
    setImportedClassroom(true);
    notify("Two demo course materials added to your library.");
  }

  const [modal, setModal] = useState<Modal>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    try {
      setSidebarCollapsed(
        localStorage.getItem("alexis-sidebar-collapsed") === "true",
      );
    } catch {}
  }, []);
  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setMobileMenu(false);
      return;
    }
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem("alexis-sidebar-collapsed", String(next));
    } catch {}
  }
  const [files, setFiles] = useState<StudyFile[]>(initialFiles);
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [conversations, setConversations] =
    useState<Conversation[]>(seedConversations);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [attaching, setAttaching] = useState(false);
  const attachmentInput = useRef<HTMLInputElement>(null);
  const [thinking, setThinking] = useState(false);
  const [readerFile, setReaderFile] = useState<StudyFile | null>(null);
  const [contextFileIds, setContextFileIds] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [chatMode, setChatMode] = useState<ChatMode>("Ask");
  const [writingAction, setWritingAction] = useState("Improve clarity");
  const [chatResources, setChatResources] = useState<ChatResource[]>([]);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(
    null,
  );
  const [libraryCollections, setLibraryCollections] = useState<
    LibraryCollection[]
  >([]);
  const [libraryFolder, setLibraryFolder] = useState<string | null>(null);
  const subjects = Array.from(
    new Set([
      ...defaultSubjects,
      ...libraryCollections
        .filter((c) => c.kind === "subject")
        .map((c) => c.name),
      ...files.map((f) => f.subject),
    ]),
  );
  useEffect(() => {
    if (!searchOpen) return;
    const previous = document.activeElement as HTMLElement;
    searchRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [searchOpen]);
  const [notice, setNotice] = useState("");
  const [day, setDay] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [cardsDone, setCardsDone] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizReview, setQuizReview] = useState(false);
  const [name, setName] = useState("Sara");
  const [email, setEmail] = useState("sara@example.com");
  const [reminders, setReminders] = useState(true);
  const [goal, setGoal] = useState(5);
  const [ready, setReady] = useState(false);
  const [uploadSubject, setUploadSubject] = useState("Biology");
  const [uploadNames, setUploadNames] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planDay, setPlanDay] = useState(0);
  const [planTime, setPlanTime] = useState("14:00");
  const [planDuration, setPlanDuration] = useState("30 min");
  const [plannerDate, setPlannerDate] = useState(DEMO_TODAY);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [planError, setPlanError] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [writing, setWriting] = useState(false);
  const [writingText, setWritingText] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout>>();
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();
  const [storageAvailable, setStorageAvailable] = useState(true);
  const searchAllowed = useRef(false);
  searchAllowed.current =
    (view === "Home" || view === "Ask Alexis") && !readerFile && !focusMode;
  useEffect(() => {
    if (window.innerWidth <= 980) setMaterialsCollapsed(true);
    const readView = () => {
      const params = new URLSearchParams(window.location.search);
      const next = viewKeys[params.get("view") || "home"] || "Home";
      setView(next);
      const documentId = params.get("document");
      try {
        const savedFiles =
          JSON.parse(localStorage.getItem("alexis-demo-v1") || "null")?.files ||
          initialFiles;
        setReaderFile(
          documentId
            ? [...savedFiles, openReadingFile].find(
                (file: StudyFile) => file.id === documentId,
              ) || null
            : null,
        );
      } catch {
        setReaderFile(null);
      }
      setResourcesOpen(false);
      setVoiceOpen(false);
      if (next === "Ask Alexis") {
        try {
          const saved = JSON.parse(
            localStorage.getItem("alexis-demo-v1") || "null",
          );
          const chat = (saved?.conversations || seedConversations).find(
            (chat: Conversation) => chat.id === params.get("chat"),
          );
          if (chat) {
            setActiveChat(chat.id);
            setMessages(chat.messages);
            setContextFileIds(chat.contextIds || []);
            setChatResources(
              chat.resources ||
                (saved?.files || initialFiles)
                  .filter((file: StudyFile) =>
                    chat.messages.some(
                      (message: Message) => message.source === file.title,
                    ),
                  )
                  .map((file: StudyFile) => ({
                    id: "document-" + file.id,
                    kind: "document",
                    title: file.title,
                    fileId: file.id,
                    reference: referenceFor(file),
                  })),
            );
          }
        } catch {
          /* The ordinary loader below reports unavailable storage. */
        }
      }
    };
    readView();
    window.addEventListener("popstate", readView);
    try {
      const saved = localStorage.getItem("alexis-demo-v1");
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.files)) {
          const savedFiles = data.files.map((file: StudyFile) => {
            const sample = initialFiles.find((item) => item.id === file.id);
            return sample &&
              sample.date.includes("2024") &&
              file.source !== "upload"
              ? { ...file, date: sample.date }
              : file;
          });
          setFiles(
            savedFiles.some((file: StudyFile) => file.id === openReadingFile.id)
              ? savedFiles
              : [openReadingFile, ...savedFiles],
          );
        }
        if (Array.isArray(data.tasks)) {
          setTasks(
            data.tasks.map((task: StudyTask) => ({
              ...task,
              date: taskDate(task),
              day: weekDay(taskDate(task)),
            })),
          );
        }
        if (Array.isArray(data.libraryCollections))
          setLibraryCollections(
            data.libraryCollections.filter(
              (c: LibraryCollection) =>
                c &&
                typeof c.id === "string" &&
                typeof c.name === "string" &&
                ["folder", "subject"].includes(c.kind) &&
                Array.isArray(c.files),
            ),
          );
        if (Array.isArray(data.conversations))
          setConversations(data.conversations);
        if (typeof data.name === "string") setName(data.name);
        if (typeof data.email === "string") setEmail(data.email);
        if (typeof data.goal === "number") setGoal(data.goal);
        if (typeof data.reminders === "boolean") setReminders(data.reminders);
      }
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
    const keys = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k" &&
        searchAllowed.current
      ) {
        e.preventDefault();
        setModal(null);
        setVoiceOpen(false);
        setSearchText("");
        setSearchIndex(0);
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setModal(null);
        setSearchOpen(false);
        setMobileMenu(false);
        setNotificationOpen(false);
      }
    };
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("popstate", readView);
      window.removeEventListener("keydown", keys);
      clearTimeout(replyTimer.current);
      clearTimeout(noticeTimer.current);
    };
  }, []);
  useEffect(() => {
    if (ready && storageAvailable) {
      try {
        localStorage.setItem(
          "alexis-demo-v1",
          JSON.stringify({
            files,
            tasks,
            conversations,
            libraryCollections,
            name,
            email,
            goal,
            reminders,
          }),
        );
      } catch {
        setStorageAvailable(false);
      }
    }
  }, [
    files,
    tasks,
    conversations,
    libraryCollections,
    name,
    email,
    goal,
    reminders,
    ready,
    storageAvailable,
  ]);
  useEffect(() => {
    const viewport = chatEnd.current?.closest(".chat-messages");
    if (!viewport) return;
    if (messages.at(-1)?.role === "assistant" && !thinking) {
      const replies =
        chatEnd.current?.parentElement?.querySelectorAll<HTMLElement>(
          ".chat-message.assistant",
        );
      const reply = replies?.[replies.length - 1];
      if (reply)
        viewport.scrollTo({
          top:
            reply.getBoundingClientRect().top -
            viewport.getBoundingClientRect().top +
            viewport.scrollTop -
            16,
          behavior: "smooth",
        });
    } else {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }
  }, [messages, thinking, view, voiceOpen]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = document.querySelector<HTMLElement>(".modal");
    panel?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input, select, textarea, a[href]",
      );
      const first = items[0],
        last = items[items.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modal]);
  function navigate(next: View, chatId?: string) {
    if (next !== "Home" && next !== "Ask Alexis") setVoiceOpen(false);
    setReaderFile(null);
    setResourcesOpen(false);
    setView(next);
    setMobileMenu(false);
    setSearchOpen(false);
    document.querySelector(".page-content")?.scrollTo({ top: 0 });
    const key =
      Object.keys(viewKeys).find((k) => viewKeys[k] === next) || "home";
    window.history.pushState(
      {},
      "",
      key === "home"
        ? window.location.pathname
        : window.location.pathname +
            "?view=" +
            key +
            (next === "Ask Alexis" && (chatId || activeChat)
              ? "&chat=" + encodeURIComponent(chatId || activeChat!)
              : ""),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setModal(null);
    router.push("/signIn");
  }
  function notify(text: string) {
    clearTimeout(noticeTimer.current);
    setNotice(text);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  }
  function openFile(file: StudyFile) {
    setReaderFile(file);
    setModal(null);
    setResourcesOpen(false);
    setSearchOpen(false);
    setMobileMenu(false);
    const url = new URL(window.location.href);
    url.searchParams.set("document", file.id);
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0 });
  }
  function startCards() {
    setCardIndex(0);
    setFlipped(false);
    setKnown([]);
    setCardsDone(false);
    setModal("flashcards");
  }
  function startQuiz() {
    setQuizIndex(0);
    setQuizChoice(null);
    setQuizScore(0);
    setQuizDone(false);
    setQuizReview(false);
    setModal("quiz");
  }
  function newChat() {
    if (thinking) return;
    setVoiceOpen(false);
    setAttachments([]);
    setMessages([]);
    setChatResources([]);
    setResourcesOpen(false);
    setChatMode("Ask");
    setActiveChat(null);
    setPrompt("");
    setContextFileIds([]);
    navigate("Home");
  }
  function chooseMode(mode: ChatMode) {
    setChatMode(mode);
  }
  function submitComposer() {
    const text =
      prompt.trim() ||
      (chatMode === "Summary"
        ? "Summarize the main ideas in my materials"
        : chatMode === "Quiz"
          ? "Create a practice quiz"
          : chatMode === "Flashcards"
            ? "Create flashcards"
            : "");
    if (!text && !attachments.length) return;
    sendPrompt(
      text || "Help me understand these attachments",
      undefined,
      chatMode,
    );
  }
  function openReference(reference: SourceReference) {
    const item: ChatResource = {
      id: "document-" + reference.fileId,
      kind: "document",
      title: reference.title,
      fileId: reference.fileId,
      body: reference.excerpt,
      reference,
    };
    setChatResources((previous) =>
      previous.some((r) => r.id === item.id)
        ? previous.map((r) => (r.id === item.id ? item : r))
        : [...previous, item],
    );
    setExpandedResourceId(item.id);
    setResourcesOpen(true);
  }
  function sendPrompt(
    text: string,
    source?: StudyFile,
    mode: ChatMode = "Ask",
    regenerateIndex?: number,
  ) {
    if (!text.trim() || thinking) return;
    const suppliedAttachments =
      regenerateIndex !== undefined
        ? messages[regenerateIndex - 1]?.attachments || []
        : attachments;
    const earlierAttachments =
      view === "Ask Alexis" && !source && !contextFileIds.length
        ? messages
            .slice(0, regenerateIndex)
            .reverse()
            .find(
              (message) =>
                message.role === "user" && message.attachments?.length,
            )?.attachments || []
        : [];
    const attached = suppliedAttachments.length
      ? suppliedAttachments
      : earlierAttachments;
    const selected = files.filter((file) => contextFileIds.includes(file.id));
    const scoped = source ? [source] : selected.length ? selected : files;
    const selectedIds = source ? [source.id] : contextFileIds;
    const next: Message[] =
      regenerateIndex !== undefined
        ? messages.slice(0, regenerateIndex)
        : [
            ...(view === "Ask Alexis" ? messages : []),
            {
              role: "user",
              text: text.trim(),
              ...(suppliedAttachments.length
                ? { attachments: suppliedAttachments }
                : {}),
            },
          ];
    const id =
      view === "Ask Alexis" && activeChat ? activeChat : crypto.randomUUID();
    if (source) setContextFileIds([source.id]);
    setActiveChat(id);
    setMessages(next);
    setPrompt("");
    setAttachments([]);
    setModal(null);
    setThinking(true);
    navigate("Ask Alexis", id);
    replyTimer.current = setTimeout(() => {
      const detailed =
        !attached.length && (mode === "Ask" || mode === "Summary")
          ? createLearningAnswer(text, files, selectedIds)
          : undefined;
      const selectedQuote = text.match(/Selected passage:\s*“([\s\S]+)”/);
      if (detailed && source && selectedQuote && mode === "Ask") {
        const clarification = explainPassage(
          source,
          text.split("Selected passage:")[0],
          selectedQuote[1],
        );
        detailed.title = clarification.title;
        detailed.introduction = clarification.text;
        detailed.takeaway = {
          label: "Selected passage",
          text: selectedQuote[1],
        };
        detailed.sections = [];
        detailed.diagram = undefined;
        detailed.figure = undefined;
        detailed.references = [
          { ...referenceFor(source), excerpt: selectedQuote[1] },
        ];
        detailed.nextQuestion =
          "Can you explain this passage in your own words?";
      }
      let answer = detailed
        ? {
            title: detailed.title,
            body: detailed.introduction,
            points: [] as string[],
          }
        : demoAnswer(text, source);
      let resource: ChatResource | undefined;
      let usedReferences =
        detailed?.references || scoped.slice(0, 4).map(referenceFor);
      if (attached.length) {
        answer = attachmentAnswer(attached);
        usedReferences = [];
      } else if (mode === "Summary") {
        resource = {
          id: crypto.randomUUID(),
          kind: "summary",
          title:
            "Summary · " +
            (scoped.length === 1
              ? scoped[0].title
              : scoped.length + " documents"),
          body: [
            detailed!.title,
            detailed!.introduction,
            ...detailed!.sections.map(
              (section) => section.title + "\n" + section.body,
            ),
          ].join("\n\n"),
        };
      } else if (mode === "Quiz" || mode === "Flashcards") {
        const practice = createPracticeSet(scoped);
        usedReferences = scoped
          .filter((file) => practice.fileIds.includes(file.id))
          .map(referenceFor);
        if (practice.questions.length) {
          resource = {
            id: crypto.randomUUID(),
            kind: mode === "Quiz" ? "quiz" : "flashcards",
            title: mode === "Quiz" ? "Practice quiz" : "Study flashcards",
            questions: practice.questions,
            cards: practice.cards,
          };
          answer = {
            title:
              mode === "Quiz"
                ? "Let’s test your understanding"
                : "Practice the ideas that matter",
            body:
              mode === "Quiz"
                ? "Your practice questions are ready. Start below, check each explanation, and work through them at your own pace."
                : "Flip each card, explain the idea in your own words, then check it against the notes.",
            points: [],
          };
        } else {
          answer = {
            title: "This document needs its source text",
            body: "This preview only has a placeholder for that upload. Use the included course documents to try source-based quizzes and flashcards.",
            points: [],
          };
          usedReferences = [];
        }
      } else if (mode === "Writing") {
        const clean = text.trim().replace(/\s+/g, " ");
        const body =
          writingAction === "Build an outline"
            ? "Working topic: " +
              clean +
              "\n\n1. Introduction\nState your main argument and define the topic.\n\n2. Main argument\nDevelop your first point and support it with evidence.\n\n3. Discussion\nConsider another perspective and connect it to your argument.\n\n4. Conclusion\nSummarize your argument and its implications."
            : clean.charAt(0).toUpperCase() +
              clean.slice(1).replace(/\s+([,.!?;:])/g, "$1") +
              (/[.!?]$/.test(clean) ? "" : ".");
        resource = {
          id: crypto.randomUUID(),
          kind: "writing",
          title:
            writingAction === "Build an outline"
              ? "Writing outline"
              : "Revised draft",
          body,
        };
        answer = {
          title: "Your editable draft is ready",
          body: "Open the draft to review, edit, or copy your text. This preview uses basic formatting and sample outlines.",
          points: [],
        };
        usedReferences = selected.map(referenceFor);
      }
      const resources = [
        ...(view === "Ask Alexis" && activeChat ? chatResources : []),
      ];
      usedReferences.forEach((reference) => {
        const existing = resources.findIndex(
          (r) => r.kind === "document" && r.fileId === reference.fileId,
        );
        const item: ChatResource = {
          id: "document-" + reference.fileId,
          kind: "document",
          title: reference.title,
          fileId: reference.fileId,
          body: reference.excerpt,
          reference,
        };
        if (existing >= 0) resources[existing] = item;
        else resources.push(item);
      });
      if (resource) resources.push(resource);
      const reply: Message = {
        mode,
        role: "assistant",
        text: "",
        answer,
        detailed,
        resource,
        source: usedReferences[0]?.title,
      };
      const complete =
        regenerateIndex !== undefined
          ? [...next, reply, ...messages.slice(regenerateIndex + 1)]
          : [...next, reply];
      setChatResources(resources);
      setMessages(complete);
      setConversations((previous) =>
        previous.some((c) => c.id === id)
          ? previous.map((c) =>
              c.id === id
                ? {
                    ...c,
                    messages: complete,
                    resources,
                    contextIds: source ? [source.id] : contextFileIds,
                  }
                : c,
            )
          : [
              {
                id,
                title: text.slice(0, 42),
                messages: complete,
                resources,
                contextIds:
                  source && !selected.length ? [source.id] : contextFileIds,
              },
              ...previous,
            ],
      );
      setThinking(false);
    }, 1550);
  }
  function openChat(chat: Conversation) {
    setAttachments([]);
    if (thinking) return;
    setVoiceOpen(false);
    setActiveChat(chat.id);
    setMessages(chat.messages);
    setChatMode("Ask");
    setContextFileIds(chat.contextIds || []);
    setChatResources(
      chat.resources ||
        files
          .filter((f) => chat.messages.some((m) => m.source === f.title))
          .map((f) => ({
            id: `document-${f.id}`,
            kind: "document" as const,
            title: f.title,
            fileId: f.id,
          })),
    );
    navigate("Ask Alexis", chat.id);
  }
  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }
  async function attachFiles(list: FileList | null) {
    if (!list || attaching) return;
    setAttaching(true);
    try {
      const result = await prepareAttachments(list, attachments);
      setAttachments((previous) => [...previous, ...result.attachments]);
      if (result.rejected)
        notify(
          "Attach up to 10 files, each under 20 MB. Duplicate or executable files are skipped.",
        );
    } catch {
      notify("That file could not be attached. Please try again.");
    } finally {
      setAttaching(false);
      if (attachmentInput.current) attachmentInput.current.value = "";
    }
  }
  function addFiles(list: FileList | null) {
    if (!list) return;
    const valid = Array.from(list).filter(
      (f) => /\.(pdf|docx|txt|md)$/i.test(f.name) && f.size <= 20 * 1024 * 1024,
    );
    setUploadNames(valid.map((f) => f.name));
    if (valid.length < list.length)
      notify("Choose PDF, DOCX, TXT, or MD files under 20 MB.");
  }
  function finishUpload() {
    if (!uploadNames.length) return;
    setUploading(true);
    replyTimer.current = setTimeout(() => {
      const added = uploadNames.map((title) => ({
        id: crypto.randomUUID(),
        title: title.replace(/\.[^.]+$/, ""),
        subject: uploadSubject,
        kind: title.split(".").pop()!.toUpperCase(),
        pages: 1,
        date: "Just now",
        color: "sage",
        summary: `This is a demo placeholder for ${title}. Its content has not been uploaded or analyzed. Use the included sample documents to preview summaries and study activities.`,
      }));
      setFiles((prev) => [...added, ...prev]);
      if (libraryFolder)
        setLibraryCollections((previous) =>
          previous.map((folder) =>
            folder.id === libraryFolder
              ? {
                  ...folder,
                  files: [...folder.files, ...added.map((file) => file.id)],
                }
              : folder,
          ),
        );
      setUploading(false);
      setUploadNames([]);
      setModal(null);
      navigate("My library");
      notify(
        `${added.length} ${added.length === 1 ? "document added" : "documents added"} to your demo library`,
      );
    }, 900);
  }
  const searchTerm = searchText.trim().toLowerCase();
  const searchItems = [
    ...files
      .filter((f) =>
        (f.title + " " + f.subject).toLowerCase().includes(searchTerm),
      )
      .map((f) => ({
        id: f.id,
        label: f.title,
        detail: f.subject + " · " + f.kind,
        group: "Materials",
        run: () => {
          setSearchOpen(false);
          openFile(f);
        },
      })),
    ...conversations
      .filter((c) => c.title.toLowerCase().includes(searchTerm))
      .map((c) => ({
        id: c.id,
        label: c.title,
        detail: "Continue conversation",
        group: "Conversations",
        run: () => {
          setSearchOpen(false);
          openChat(c);
        },
      })),
    ...navItems
      .filter((v) =>
        `${v.name} ${v.name === "Study room" ? "Study tools" : v.name === "Home" ? "Discuss" : ""}`
          .toLowerCase()
          .includes(searchTerm),
      )
      .map((v) => ({
        id: v.name,
        label: v.name === "Study room" ? "Study tools" : v.name,
        detail: "Go to page",
        group: "Workspace",
        run: () => {
          setSearchOpen(false);
          navigate(v.name);
        },
      })),
  ].slice(0, 12);
  const composer = (hero = false) => (
    <form
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) event.preventDefault();
      }}
      onDrop={(event) => {
        if (event.dataTransfer.files.length) {
          event.preventDefault();
          void attachFiles(event.dataTransfer.files);
        }
      }}
      className={"composer " + (hero ? "hero-composer" : "")}
      onSubmit={(event) => {
        event.preventDefault();
        submitComposer();
      }}
    >
      <input
        ref={attachmentInput}
        type="file"
        multiple
        hidden
        aria-label="Choose chat attachments"
        onChange={(event) => void attachFiles(event.target.files)}
      />
      <AttachmentList
        items={attachments}
        onRemove={(id) =>
          setAttachments((previous) =>
            previous.filter((item) => item.id !== id),
          )
        }
      />
      {attaching && (
        <span className="attachment-loading" role="status">
          Preparing attachments…
        </span>
      )}
      {!!contextFileIds.length && (
        <div className="composer-context-chips">
          {files
            .filter((file) => contextFileIds.includes(file.id))
            .map((file) => (
              <span key={file.id}>
                <FileText size={12} />
                <b>{file.title}</b>
                <button
                  type="button"
                  aria-label={"Remove context " + file.title}
                  onClick={() =>
                    setContextFileIds((previous) =>
                      previous.filter((id) => id !== file.id),
                    )
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}
        </div>
      )}
      <textarea
        aria-label="Ask Alexis a question"
        rows={hero ? 2 : 1}
        placeholder={
          chatMode === "Writing"
            ? "Paste your draft, or describe what you’re writing…"
            : chatMode === "Quiz"
              ? "What would you like to practice? (optional)"
              : chatMode === "Flashcards"
                ? "Add instructions for your flashcards… (optional)"
                : chatMode === "Summary"
                  ? "What should the summary focus on? (optional)"
                  : hero
                    ? "Ask anything…"
                    : "Ask a follow-up…"
        }
        value={prompt}
        onChange={(event) => {
          setPrompt(event.target.value);
          event.currentTarget.style.height = "auto";
          event.currentTarget.style.height =
            Math.min(event.currentTarget.scrollHeight, 180) + "px";
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            submitComposer();
          }
        }}
      />
      <div className="composer-bottom">
        <div className="composer-controls">
          <button
            type="button"
            className="attach-button"
            aria-label="Attach files to chat"
            title="Attach files · This chat only"
            disabled={attaching}
            onClick={() => attachmentInput.current?.click()}
          >
            <Plus size={18} />
          </button>
          <ChatModePicker
            value={chatMode}
            onChange={chooseMode}
            writingAction={writingAction}
            onWritingActionChange={setWritingAction}
          />
          <ContextPicker
            files={files}
            selected={contextFileIds}
            onChange={setContextFileIds}
          />
        </div>
        <div className="composer-send">
          <button
            type="button"
            className="attach-button"
            aria-label="Talk to Alexis"
            title="Talk to Alexis"
            onClick={() => {
              setSearchOpen(false);
              setModal(null);
              setVoiceOpen(true);
            }}
          >
            {/* <img
              src="/brand/logo%20bot.svg"
              alt=""
              className="composer-bot-mark"
            /> */}
            <Mic size={17} />
          </button>
          <button
            className="send-button"
            aria-label="Send question"
            disabled={
              thinking ||
              attaching ||
              ((chatMode === "Ask" || chatMode === "Writing") &&
                !prompt.trim() &&
                !attachments.length) ||
              (["Summary", "Quiz", "Flashcards"].includes(chatMode) &&
                !files.length &&
                !attachments.length)
            }
          >
            {thinking ? (
              <Loader2 size={17} className="spin" />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
  const classroomFiles = files.filter(
    (file) => file.source === "classroom" || file.id.startsWith("classroom-"),
  );
  const userFiles = files.filter((file) => !classroomFiles.includes(file));
  const upcomingSessions = tasks
    .filter((task) => !task.done && taskDate(task) >= DEMO_TODAY)
    .sort((a, b) =>
      `${taskDate(a)}T${a.time}`.localeCompare(`${taskDate(b)}T${b.time}`),
    );
  const activityCount = files.length + upcomingSessions.length;
  const materialsPanel = (
    <aside
      className="materials-panel activity-panel"
      id="recent-activity"
      aria-label="Recent activity"
    >
      <div className="activity-heading">
        <h2>Recent activity</h2>
        <p className="materials-caption">A little overview of your learning.</p>
      </div>
      <div className="activity-feed px-3">
        <section className="activity-group">
          <h3>
            <GraduationCap size={14} />
            From your teachers <span>{classroomFiles.length}</span>
            {classroomFiles.length > 0 && (
              <button
                className="activity-sync-manage"
                aria-label="Manage Google Classroom sync"
                title="Google Classroom"
                onClick={() => {
                  setSyncTab("classroom");
                  setModal("sync");
                }}
              >
                <RefreshCw size={12} />
              </button>
            )}
          </h3>
          {classroomFiles.map((file) => (
            <button
              className="activity-item"
              key={file.id}
              onClick={() => openFile(file)}
            >
              <span className="activity-marker classroom">
                <GraduationCap size={15} />
              </span>
              <span>
                <b>{file.title}</b>
                <small>Teacher added · Classroom sync</small>
                <small>{file.date}</small>
              </span>
              <ArrowUpRight size={13} />
            </button>
          ))}
          {!classroomFiles.length && (
            <button
              className="activity-connect"
              onClick={() => {
                setSyncTab("classroom");
                setModal("sync");
              }}
            >
              <span>
                <b>Connect Google Classroom</b>
                <small>Sync your classroom materials.</small>
                <em className=" font-semibold">
                  Connect Classroom <ArrowRight size={12} />
                </em>
              </span>
            </button>
          )}
        </section>
        <details className="activity-group activity-disclosure" open>
          <summary>
            <FileText size={14} />
            Documents <span>{userFiles.length}</span>
            <ChevronDown size={13} />
          </summary>
          {userFiles.map((file) => (
            <button
              className="activity-item"
              key={file.id}
              onClick={() => openFile(file)}
            >
              <span className="activity-marker document">
                <FileText size={15} />
              </span>
              <span>
                <b>{file.title}</b>
                <small>
                  You added · {file.kind} · {file.date}
                </small>
              </span>
              <ArrowUpRight size={13} />
            </button>
          ))}
          {!userFiles.length && (
            <p className="activity-empty">
              Your added documents will appear here.
            </p>
          )}
        </details>
        <details className="activity-group activity-disclosure" open>
          <summary>
            <CalendarDays size={14} />
            Sessions <span>{upcomingSessions.length}</span>
            <ChevronDown size={13} />
          </summary>
          {upcomingSessions.map((task) => (
            <button
              className="activity-item"
              key={task.id}
              onClick={() => {
                setPlannerDate(taskDate(task));
                navigate("Study planner");
              }}
            >
              <span className="activity-marker session">
                <Clock3 size={15} />
              </span>
              <span>
                <b>{task.title}</b>
                <small>
                  {taskDate(task) === DEMO_TODAY
                    ? "Today"
                    : new Date(taskDate(task) + "T12:00:00").toLocaleDateString(
                        "en",
                        { month: "short", day: "numeric" },
                      )}{" "}
                  · {task.time} · {task.duration}
                </small>
              </span>
              <ArrowUpRight size={13} />
            </button>
          ))}
          {!upcomingSessions.length && (
            <p className="activity-empty">
              All caught up. Plan your next study session.
            </p>
          )}
        </details>
      </div>
    </aside>
  );
  if (readerFile)
    return (
      <DocumentReader
        key={readerFile.id}
        file={readerFile}
        folderName={
          libraryCollections.find(
            (collection) =>
              collection.kind === "folder" &&
              collection.files.includes(readerFile.id),
          )?.name ||
          (readerFile.id.startsWith("classroom-")
            ? "Classroom materials"
            : initialFiles.some((file) => file.id === readerFile.id)
              ? "Course notes"
              : "Documents")
        }
        backLabel={view === "Ask Alexis" ? "Back to chat" : "Back to library"}
        onClose={() => {
          setReaderFile(null);
          const url = new URL(window.location.href);
          url.searchParams.delete("document");
          window.history.pushState({}, "", url);
        }}
        onChat={(text, mode) => sendPrompt(text, readerFile, mode)}
      />
    );
  return (
    <div
      className={`alexis-app inset-workspace ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${view === "My library" ? "view-library" : view === "Study room" ? "view-tools" : view === "Study planner" ? "view-planner" : ""} ${view === "Home" ? "view-discuss" : view === "Ask Alexis" && !voiceOpen ? "view-chat" : ""} ${focusMode ? "is-focused" : ""} ${materialsCollapsed ? "materials-collapsed" : ""}`}
    >
      {mobileMenu && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside
        id="workspace-sidebar"
        className={`sidebar ${mobileMenu ? "is-open" : ""}`}
        aria-label="Workspace navigation"
      >
        <div className="sidebar-brand-row">
          <button
            className="brand"
            onClick={() => {
              setVoiceOpen(false);
              navigate("Home");
            }}
            aria-label="Alexis home"
          >
            <Emblem />
          </button>
          <button
            className="sidebar-collapse-button icon-button"
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
            aria-controls="workspace-sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>
        </div>
        <button
          className="new-session"
          onClick={newChat}
          aria-label="New chat"
          title="New chat"
        >
          <Plus size={17} />
          <span>New chat</span>
        </button>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              aria-label={
                item.name === "My library"
                  ? "Library"
                  : item.name === "Study planner"
                    ? "Planner"
                    : item.name
              }
              title={
                item.name === "My library"
                  ? "Library"
                  : item.name === "Study planner"
                    ? "Planner"
                    : item.name
              }
              aria-current={
                view === item.name ||
                (item.name === "Home" && view === "Ask Alexis")
                  ? "page"
                  : undefined
              }
              className={`nav-item ${view === item.name || (item.name === "Home" && view === "Ask Alexis") ? "active" : ""}`}
              onClick={() => navigate(item.name)}
            >
              <item.icon size={19} strokeWidth={1.6} />
              <span>
                {item.name === "Home"
                  ? "Discuss"
                  : item.name === "My library"
                    ? "Library"
                    : item.name === "Study planner"
                      ? "Planner"
                      : "Study tools"}
              </span>
              {item.name === "My library" && <small>{files.length}</small>}
            </button>
          ))}
        </nav>
        <ConversationOrganizer
          conversations={conversations}
          activeId={view === "Ask Alexis" ? activeChat : null}
          onOpen={(id) => {
            const chat = conversations.find((c) => c.id === id);
            if (chat) openChat(chat);
          }}
        />
        <div className="sidebar-bottom">
          <SidebarProfile
            name={name}
            email={email}
            onPlus={() => {
              setMobileMenu(false);
              setModal("upgrade");
            }}
            onPersonalize={() => {
              setMobileMenu(false);
              setModal("account");
            }}
            onSettings={() => navigate("Settings")}
            onHelp={() => {
              setMobileMenu(false);
              setModal("welcome");
            }}
            onLogout={logout}
          />
        </div>
      </aside>
      <div className="workspace-main">
        {!focusMode && (view === "Home" || view === "Ask Alexis") && (
          <div className="workspace-view-controls">
            <button
              className="workspace-search-trigger"
              aria-label="Search workspace"
              aria-keyshortcuts="Meta+K Control+K"
              onClick={() => {
                setSearchText("");
                setSearchIndex(0);
                setSearchOpen(true);
              }}
            >
              <Search size={15} />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            {(view === "Home" || view === "Ask Alexis") && (
              <>
                <button onClick={enterFocus}>
                  <Focus size={15} />
                  <span>Focus</span>
                </button>
                <button
                  className="activity-toggle"
                  aria-expanded={!materialsCollapsed}
                  aria-controls="recent-activity"
                  onClick={() => setMaterialsCollapsed(!materialsCollapsed)}
                >
                  {materialsCollapsed ? (
                    <PanelRightOpen size={15} />
                  ) : (
                    <PanelRightClose size={15} />
                  )}
                  <span>Recent activity</span>
                  {activityCount > 0 && (
                    <span
                      className="activity-count"
                      aria-label={`${activityCount} activities`}
                    >
                      {activityCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        )}
        {focusMode && (
          <FocusSession
            seconds={secondsLeft}
            duration={timerDuration}
            running={timerRunning}
            onDuration={resetTimer}
            onToggle={toggleTimer}
            onReset={() => resetTimer()}
            onExit={exitFocus}
          />
        )}

        <button
          className="floating-menu icon-button"
          aria-label="Open navigation"
          onClick={() => setMobileMenu(true)}
        >
          <Menu size={20} />
        </button>
        {focusMode && (
          <>
            <div
              className={`focus-breathing-glow ${timerRunning ? "is-running" : "is-paused"}`}
              aria-hidden="true"
            />
            <FocusPlant
              running={timerRunning}
              progress={1 - secondsLeft / (timerDuration * 60)}
              complete={secondsLeft === 0}
              onExit={exitFocus}
            />
          </>
        )}
        <main className={`page-content ${voiceOpen ? "has-inline-voice" : ""}`}>
          {voiceOpen ? (
            <div className="voice-mode-layout">
              <VoiceAssistant
                buildReply={(text) => {
                  const answer = createLearningAnswer(
                    text,
                    files,
                    contextFileIds,
                  );
                  return answer.introduction + " " + answer.takeaway.text;
                }}
                onClose={() => setVoiceOpen(false)}
                onPrompt={(text) =>
                  sendPrompt(
                    text,
                    files.find((f) => contextFileIds.includes(f.id)),
                  )
                }
                source={files.find((f) => contextFileIds.includes(f.id))}
              />
              {!materialsCollapsed && !focusMode && materialsPanel}
            </div>
          ) : (
            <>
              {view === "Home" && (
                <div className="discuss-layout">
                  <section className="discuss-main">
                    <div className="discuss-welcome">
                      <h1>What are we learning today?</h1>
                      <p>Ask a question, or work with your course materials.</p>
                      <div className="discuss-composer">{composer(true)}</div>
                      <div className="prompt-starters">
                        <button
                          onClick={() =>
                            sendPrompt(
                              "Summarize my cell biology notes",
                              files.find((f) => f.id === "bio-1"),
                            )
                          }
                        >
                          <FileText size={14} />
                          Summarize notes
                        </button>
                        <button
                          onClick={() =>
                            sendPrompt("Explain cellular respiration simply")
                          }
                        >
                          <Sparkles size={14} />
                          Explain a concept
                        </button>
                        <button onClick={() => chooseMode("Quiz")}>
                          <ListChecks size={14} />
                          Practice a quiz
                        </button>
                      </div>
                    </div>
                  </section>
                  {!materialsCollapsed && !focusMode && materialsPanel}
                </div>
              )}
              {view === "My library" && (
                <LibraryBrowser
                  files={files}
                  collections={libraryCollections}
                  onFilesChange={setFiles}
                  onCollectionsChange={setLibraryCollections}
                  onOpen={openFile}
                  onUpload={(subject, folderId) => {
                    setUploadSubject(subject);
                    setLibraryFolder(folderId || null);
                    setUploadNames([]);
                    setModal("upload");
                  }}
                  onSync={() => {
                    setSyncTab("classroom");
                    setModal("sync");
                  }}
                />
              )}
              {view === "Study planner" && (
                <StudyPlanner
                  tasks={tasks}
                  selectedDate={plannerDate}
                  onDateChange={setPlannerDate}
                  onAdd={(date) => {
                    setPlannerDate(date);
                    setPlanDay(weekDay(date));
                    setEditingSession(null);
                    setPlanTitle("");
                    setPlanError("");
                    setModal("plan");
                  }}
                  onEdit={(task) => {
                    setEditingSession(task.id);
                    setPlanTitle(task.title);
                    setUploadSubject(task.subject);
                    setPlanTime(task.time);
                    setPlanDuration(task.duration);
                    setPlannerDate(taskDate(task));
                    setPlanDay(task.day);
                    setPlanError("");
                    setModal("plan");
                  }}
                  onToggle={toggleTask}
                  onRemove={(id) =>
                    setTasks((previous) =>
                      previous.filter((task) => task.id !== id),
                    )
                  }
                  onSync={() => {
                    setSyncTab("calendar");
                    setModal("sync");
                  }}
                  onStudy={(task) => {
                    newChat();
                    setContextFileIds(
                      files
                        .filter((file) => file.subject === task.subject)
                        .map((file) => file.id),
                    );
                    setPrompt("Help me review " + task.title);
                    const duration = parseInt(task.duration) || 25;
                    setTimerDuration(duration);
                    setSecondsLeft(duration * 60);
                    timerDeadline.current = Date.now() + duration * 60000;
                    setTimerRunning(true);
                    setFocusMode(true);
                  }}
                />
              )}
              {view === "Explore" && (
                <>
                  <PageHeading
                    eyebrow="FOLLOW YOUR CURIOSITY"
                    title="There’s always a little more to discover."
                    description="Fresh perspectives and thoughtful ways to learn better."
                  />
                  <div className="explore-banner">
                    <span className="eyebrow">THE ART OF LEARNING</span>
                    <h2>
                      Better questions.
                      <br />
                      <em>Deeper understanding.</em>
                    </h2>
                    <p>
                      Try asking “why” one more time.
                      <br />
                      You might be surprised where it takes you.
                    </p>
                    <button
                      className="cream-button"
                      onClick={() =>
                        sendPrompt(
                          "Explain cellular respiration with a real-world analogy",
                        )
                      }
                    >
                      Follow a little curiosity
                      <ArrowUpRight size={16} />
                    </button>
                    <div className="explore-flower" aria-hidden="true">
                      ✳
                    </div>
                  </div>
                  <SectionTitle title="A few ideas to get you going" />
                  <div className="explore-grid">
                    {[
                      {
                        title: "The science of remembering",
                        category: "LEARN HOW TO LEARN",
                        text: "Why testing yourself beats reading the same page again.",
                        prompt: "Explain active recall and memory",
                        icon: Layers3,
                      },
                      {
                        title: "Your brain needs breathing room",
                        category: "A MINDFUL STUDY MOMENT",
                        text: "A calmer, more focused approach to exam season.",
                        prompt: "Make a balanced study plan with breaks",
                        icon: Leaf,
                      },
                      {
                        title: "The beauty of small connections",
                        category: "CONNECT THE DOTS",
                        text: "How a simple analogy can make a complex idea click.",
                        prompt: "Explain cellular respiration with an analogy",
                        icon: Sparkles,
                      },
                    ].map((item, i) => (
                      <button
                        className={`explore-card explore-${i}`}
                        key={item.title}
                        onClick={() => sendPrompt(item.prompt)}
                      >
                        <div className="explore-art">
                          <item.icon size={45} strokeWidth={1} />
                          <span className="art-ring" />
                        </div>
                        <div>
                          <small>{item.category}</small>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                          <span className="text-button">
                            Explore the idea
                            <ArrowUpRight size={15} />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {view === "Ask Alexis" && (
                <div className="chat-page">
                  <div className="chat-heading">
                    <div>
                      <span className="conversation-kicker">CONVERSATION</span>
                    </div>
                    <button
                      className="chat-resources-trigger"
                      onClick={() => {
                        setExpandedResourceId(null);
                        setResourcesOpen(true);
                      }}
                      aria-label="Open chat resources"
                    >
                      <FolderOpen size={16} />
                      Resources<span>{chatResources.length}</span>
                    </button>
                  </div>
                  <ChatScrollArea>
                    {!messages.length && (
                      <div className="chat-empty">
                        <Emblem />
                        <h2>
                          What would you like
                          <br />
                          <em>to understand?</em>
                        </h2>
                        <p>Ask a question or attach your notes.</p>
                        <div className="chat-suggestions">
                          {[
                            "Explain cellular respiration simply",
                            "How does memory work?",
                            "Help me plan my revision",
                          ].map((s) => (
                            <button key={s} onClick={() => sendPrompt(s)}>
                              {s}
                              <ArrowUpRight size={15} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {messages.map((m, i) => (
                      <div className={`chat-message ${m.role}`} key={i}>
                        {m.role === "assistant" ? (
                          <Emblem />
                        ) : (
                          <span className="message-avatar">
                            <img
                              src="/brand/randomprofile.jpg"
                              alt="Your profile"
                            />
                          </span>
                        )}
                        <div>
                          <span className="message-author">
                            {m.role === "assistant" ? "Alexis" : "You"}
                            {m.role === "assistant" && (
                              <span className="sample-label">
                                Sample response
                              </span>
                            )}
                          </span>
                          {m.role === "user" ? (
                            <>
                              {" "}
                              <AttachmentList items={m.attachments || []} />
                              <p>{m.text}</p>{" "}
                            </>
                          ) : (
                            <>
                              {m.detailed ? (
                                <RichAnswer
                                  answer={m.detailed}
                                  onReference={openReference}
                                  onOpenDocument={(id) => {
                                    const file = files.find(
                                      (file) => file.id === id,
                                    );
                                    if (file) openFile(file);
                                  }}
                                />
                              ) : (
                                <>
                                  <h2>{m.answer?.title}</h2>
                                  <p>{m.answer?.body}</p>
                                  {!!m.answer?.points.length && (
                                    <div className="answer-points">
                                      {m.answer.points.map((point, index) => (
                                        <div key={index}>
                                          <span>{index + 1}</span>
                                          <p>{point}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                              {m.resource && (
                                <InlineStudyResource
                                  resource={m.resource}
                                  onOpen={() => {
                                    setExpandedResourceId(m.resource!.id);
                                    setResourcesOpen(true);
                                  }}
                                />
                              )}
                              {!m.detailed && !m.resource && (
                                <FurtherReading
                                  topic={
                                    (m.answer?.title || "") +
                                    " " +
                                    (m.answer?.body || "")
                                  }
                                />
                              )}
                              <div className="answer-actions">
                                <button
                                  className="icon-button"
                                  aria-label="Regenerate response"
                                  title="Regenerate response"
                                  disabled={thinking}
                                  onClick={() => {
                                    const question = messages
                                      .slice(0, i)
                                      .reverse()
                                      .find(
                                        (message) => message.role === "user",
                                      );
                                    if (question)
                                      sendPrompt(
                                        question.text,
                                        undefined,
                                        m.mode ||
                                          (m.resource?.kind === "quiz"
                                            ? "Quiz"
                                            : m.resource?.kind === "flashcards"
                                              ? "Flashcards"
                                              : "Ask"),
                                        i,
                                      );
                                  }}
                                >
                                  <RotateCcw size={14} />
                                </button>
                                {(["helpful", "unhelpful"] as const).map(
                                  (rating) => (
                                    <button
                                      key={rating}
                                      className="icon-button"
                                      aria-label={
                                        rating === "helpful"
                                          ? "Good response"
                                          : "Bad response"
                                      }
                                      title={
                                        rating === "helpful"
                                          ? "Good response"
                                          : "Bad response"
                                      }
                                      aria-pressed={m.rating === rating}
                                      onClick={() => {
                                        const updated = messages.map(
                                          (message, index) =>
                                            index === i
                                              ? {
                                                  ...message,
                                                  rating:
                                                    message.rating === rating
                                                      ? undefined
                                                      : rating,
                                                }
                                              : message,
                                        );
                                        setMessages(updated);
                                        setConversations((previous) =>
                                          previous.map((chat) =>
                                            chat.id === activeChat
                                              ? { ...chat, messages: updated }
                                              : chat,
                                          ),
                                        );
                                      }}
                                    >
                                      {rating === "helpful" ? (
                                        <ThumbsUp size={14} />
                                      ) : (
                                        <ThumbsDown size={14} />
                                      )}
                                    </button>
                                  ),
                                )}
                                <button
                                  className="icon-button"
                                  aria-label="Copy response"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(
                                        [
                                          m.detailed?.title || m.answer?.title,
                                          m.detailed?.introduction ||
                                            m.answer?.body,
                                          ...(m.detailed?.sections.map(
                                            (section) =>
                                              section.title +
                                              "\n" +
                                              section.body,
                                          ) ||
                                            m.answer?.points ||
                                            []),
                                          m.resource?.body,
                                        ].join("\n\n"),
                                      );
                                      notify("Response copied");
                                    } catch {
                                      notify(
                                        "Clipboard access isn’t available in this browser.",
                                      );
                                    }
                                  }}
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {thinking && (
                      <div className="chat-message assistant">
                        <Emblem />
                        <AnswerProgress
                          mode={chatMode}
                          count={contextFileIds.length || files.length}
                        />
                      </div>
                    )}
                    <div ref={chatEnd} />
                  </ChatScrollArea>
                  <div className="chat-composer-wrap">{composer()}</div>
                </div>
              )}
              {view === "Settings" && (
                <>
                  <PageHeading
                    eyebrow="ACCOUNT"
                    title="Settings"
                    description="Manage your profile and study settings."
                  />
                  <div className="settings-layout">
                    <section className="settings-card">
                      <SectionTitle title="Your profile" />
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          notify("Your preferences have been saved");
                        }}
                      >
                        <label>
                          Your name
                          <input
                            required
                            maxLength={40}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </label>
                        <label>
                          Email address
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>
                        <label>
                          Weekly study goal
                          <PlatformSelect
                            value={goal}
                            onChange={(e) => setGoal(Number(e.target.value))}
                          >
                            {[3, 5, 7, 10].map((n) => (
                              <option key={n} value={n}>
                                {n} hours per week
                              </option>
                            ))}
                          </PlatformSelect>
                        </label>
                        <div className="settings-toggle">
                          <span>
                            <b>Study reminders</b>
                            <small>
                              Remember my study reminder preference in this demo
                            </small>
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={reminders}
                            aria-label="Study reminders"
                            className={`switch ${reminders ? "on" : ""}`}
                            onClick={() => setReminders(!reminders)}
                          >
                            <span />
                          </button>
                        </div>
                        <div className="settings-toggle">
                          <span>
                            <b>Palette</b>
                            <small>Sage, Iris, Chrome or Amber</small>
                          </span>
                          <div
                            className="palette-dots"
                            role="group"
                            aria-label="Colour palette"
                          >
                            {palettes.map((palette) => (
                              <button
                                key={palette.id}
                                type="button"
                                data-palette={palette.id}
                                className={
                                  accent === palette.id ? "active" : ""
                                }
                                aria-pressed={accent === palette.id}
                                aria-label={`${palette.name} palette`}
                                title={palette.name}
                                onClick={() => setAccent(palette.id)}
                              />
                            ))}
                          </div>
                        </div>
                        <button className="primary-button" type="submit">
                          Save preferences
                          <Check size={15} />
                        </button>
                      </form>
                    </section>
                    <aside className="settings-card demo-info">
                      <span className="pill">
                        <span className="status-dot" />
                        DEMO WORKSPACE
                      </span>
                      <h2>
                        Demo workspace
                        <br />
                        at what’s possible.
                      </h2>
                      <p>
                        This workspace comes with realistic sample content so
                        you can explore the study experience.
                      </p>
                      <p>
                        Changes are saved in this browser. Uploaded files are
                        represented by local placeholders; no file contents are
                        sent to a server.
                      </p>
                      {!storageAvailable && (
                        <p>
                          Browser storage is unavailable. Changes will last for
                          this session only.
                        </p>
                      )}
                      <button
                        className="secondary-button"
                        onClick={() => setModal("welcome")}
                      >
                        See the demo guide
                        <ArrowUpRight size={15} />
                      </button>
                      <a className="text-button" href="/discussion">
                        Open existing live workspace
                        <ArrowUpRight size={14} />
                      </a>
                      <button
                        className="reset-button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Reset the demo? This removes local demo documents, sessions, and preferences.",
                            )
                          ) {
                            setFiles(initialFiles);
                            setTasks(initialTasks);
                            setConversations(seedConversations);
                            setName("Sara");
                            setEmail("sara@example.com");
                            setGoal(5);
                            setReminders(true);
                            setMessages([]);
                            setActiveChat(null);
                            notify("A fresh start. Demo data restored.");
                          }
                        }}
                      >
                        <RotateCcw size={14} />
                        Reset demo data
                      </button>
                    </aside>
                  </div>
                </>
              )}
            </>
          )}
        </main>
        {view === "Ask Alexis" &&
          !voiceOpen &&
          !materialsCollapsed &&
          !focusMode && (
            <div className="conversation-materials">{materialsPanel}</div>
          )}
      </div>
      {resourcesOpen && (
        <ChatResources
          resources={chatResources}
          files={files}
          expandedId={expandedResourceId}
          onToggle={setExpandedResourceId}
          onClose={() => setResourcesOpen(false)}
          onOpenDocument={(id) => {
            const file = files.find((file) => file.id === id);
            if (file) openFile(file);
          }}
          onUpdate={(id, body) => {
            setChatResources((p) =>
              p.map((r) => (r.id === id ? { ...r, body } : r)),
            );
            setConversations((p) =>
              p.map((c) =>
                c.id === activeChat
                  ? {
                      ...c,
                      resources: (c.resources || chatResources).map((r) =>
                        r.id === id ? { ...r, body } : r,
                      ),
                    }
                  : c,
              ),
            );
          }}
        />
      )}
      {notice && (
        <div className="notice" role="status">
          <CheckCheck size={18} />
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {searchOpen && (
        <div
          className="command-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <section
            className="command-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search workspace"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                const items =
                  e.currentTarget.querySelectorAll<HTMLElement>("input,button");
                const first = items[0],
                  last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="command-input">
              <Search size={20} />
              <input
                ref={searchRef}
                aria-label="Search documents and conversations"
                role="combobox"
                aria-expanded={searchOpen}
                aria-controls="workspace-search-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  searchItems.length
                    ? `search-result-${Math.min(searchIndex, searchItems.length - 1)}`
                    : undefined
                }
                placeholder="Search materials, conversations, pages…"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setSearchIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSearchIndex(
                      (i) => (i + 1) % Math.max(searchItems.length, 1),
                    );
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSearchIndex(
                      (i) =>
                        (i - 1 + Math.max(searchItems.length, 1)) %
                        Math.max(searchItems.length, 1),
                    );
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchItems[
                      Math.min(searchIndex, searchItems.length - 1)
                    ]?.run();
                  }
                }}
              />
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <kbd>esc</kbd>
              </button>
            </div>
            <div
              className="command-results"
              id="workspace-search-results"
              role="listbox"
              aria-label="Search results"
            >
              {searchItems.length ? (
                searchItems.map((item, i) => (
                  <div key={item.id}>
                    {(i === 0 || searchItems[i - 1].group !== item.group) && (
                      <h3>{item.group}</h3>
                    )}
                    <button
                      id={`search-result-${i}`}
                      role="option"
                      aria-selected={searchIndex === i}
                      className={searchIndex === i ? "highlighted" : ""}
                      onMouseEnter={() => setSearchIndex(i)}
                      onClick={item.run}
                    >
                      {item.group === "Materials" ? (
                        <FileText size={17} />
                      ) : item.group === "Conversations" ? (
                        <MessageCircle size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                      <span>
                        <b>{item.label}</b>
                        <small>{item.detail}</small>
                      </span>
                      <span className="command-enter">↵</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="command-empty">
                  <Search size={25} />
                  <h3>No results for “{searchText}”</h3>
                  <p>Try a document title, subject, or conversation.</p>
                </div>
              )}
            </div>
            <div className="command-footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd>navigate
              </span>
              <span>
                <kbd>↵</kbd>open
              </span>
              <span>
                <kbd>esc</kbd>close
              </span>
            </div>
          </section>
        </div>
      )}
      {modal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !uploading) setModal(null);
          }}
        >
          <section
            className={`modal modal-${modal}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            <button
              className="modal-close icon-button"
              aria-label="Close dialog"
              disabled={uploading}
              onClick={() => setModal(null)}
            >
              <X size={20} />
            </button>
            {modal === "account" && (
              <>
                <div className="account-modal-head">
                  <div>
                    <span className="eyebrow">MAKE IT YOURS</span>
                    <h2 id="modal-title">Personalization</h2>
                    <p>Choose your mode and colour palette.</p>
                  </div>
                </div>
                <div className="account-modal-section">
                  <span className="account-modal-label">Mode</span>
                  <div
                    className="account-mode-options"
                    role="group"
                    aria-label="Appearance"
                  >
                    <button
                      className={theme === "light" ? "active" : ""}
                      aria-pressed={theme === "light"}
                      onClick={() => setTheme("light")}
                    >
                      <Sun size={17} />
                      <span>
                        <b>Light</b>
                        <small>Bright and clear</small>
                      </span>
                    </button>
                    <button
                      className={theme === "dark" ? "active" : ""}
                      aria-pressed={theme === "dark"}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon size={17} />
                      <span>
                        <b>Dark</b>
                        <small>Easy on the eyes</small>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="account-modal-section">
                  <span className="account-modal-label">Palette</span>
                  <div
                    className="account-palette-options"
                    role="group"
                    aria-label="Colour palette"
                  >
                    {palettes.map((palette) => (
                      <button
                        key={palette.id}
                        data-palette={palette.id}
                        className={accent === palette.id ? "active" : ""}
                        aria-pressed={accent === palette.id}
                        onClick={() => setAccent(palette.id)}
                      >
                        <span className="palette-swatch" />
                        <span>
                          <b>{palette.name}</b>
                          <small>{palette.hint}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {modal === "sync" && (
              <>
                <span className="modal-icon">
                  <RefreshCw size={24} />
                </span>
                <span className="eyebrow">CONNECTIONS</span>
                <h2 id="modal-title">Calendar & Classroom</h2>
                <p>Your schedule and course materials, in one workspace.</p>
                <div className="sync-tabs">
                  <button
                    className={syncTab === "calendar" ? "active" : ""}
                    onClick={() => setSyncTab("calendar")}
                  >
                    <CalendarDays size={15} />
                    Calendar
                  </button>
                  <button
                    className={syncTab === "classroom" ? "active" : ""}
                    onClick={() => setSyncTab("classroom")}
                  >
                    <GraduationCap size={15} />
                    Google Classroom
                  </button>
                </div>
                {syncTab === "calendar" ? (
                  <>
                    <div className="sync-summary">
                      <CalendarDays size={25} />
                      <div>
                        <h3>Your study week</h3>
                        <p>{tasks.length} sessions · October 21–27, 2024</p>
                      </div>
                      <span className="sync-status">Ready to export</span>
                    </div>
                    <p className="sync-description">
                      Export your sessions to Google Calendar, Apple Calendar,
                      or Outlook. Session titles, times, and durations are
                      included.
                    </p>
                    <button
                      className="primary-button full-width"
                      disabled={!tasks.length}
                      onClick={exportCalendar}
                    >
                      <Download size={16} />
                      Export calendar (.ics)
                    </button>
                    <div className="sync-note">
                      Live two-way sync needs a Google account connection. This
                      demo exports a calendar file; it does not connect to your
                      account.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sync-summary">
                      <GraduationCap size={25} />
                      <div>
                        <h3>Google Classroom</h3>
                        <p>Course materials & references</p>
                      </div>
                      <span className="sync-status">Demo preview</span>
                    </div>
                    <div className="classroom-preview">
                      <div>
                        <span>B</span>
                        <div>
                          <b>Biology 201</b>
                          <small>Cellular Systems · 28 pages</small>
                        </div>
                        <Check size={14} />
                      </div>
                      <div>
                        <span>P</span>
                        <div>
                          <b>Memory & Cognition</b>
                          <small>Psychology · 16 pages</small>
                        </div>
                        <Check size={14} />
                      </div>
                    </div>
                    <button
                      className="primary-button full-width"
                      disabled={
                        importedClassroom ||
                        files.some((f) => f.id === "classroom-bio")
                      }
                      onClick={importClassroom}
                    >
                      {importedClassroom ||
                      files.some((f) => f.id === "classroom-bio") ? (
                        <>
                          <CheckCheck size={16} />
                          Demo materials imported
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          Import demo course materials
                        </>
                      )}
                    </button>
                    <div className="sync-note">
                      Preview with sample courses. Live Classroom sync requires
                      Google OAuth and a backend connection; no Google account
                      is accessed here.
                    </div>
                  </>
                )}
              </>
            )}
            {modal === "upload" && (
              <>
                <span className="eyebrow">Library</span>
                <h2 id="modal-title">Add documents</h2>
                <p>Save study documents to a subject in your library.</p>
                <button
                  className={`dropzone ${uploadNames.length ? "has-files" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                >
                  <Upload size={28} />
                  <b>
                    {uploadNames.length
                      ? `${uploadNames.length} ${uploadNames.length === 1 ? "file" : "files"} ready to add`
                      : "Drop your documents here"}
                  </b>
                  <span>
                    {uploadNames.length
                      ? uploadNames.join(", ")
                      : "or click to browse your files"}
                  </span>
                  <small>PDF, DOCX, TXT, MD · Up to 20 MB per file</small>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  hidden
                  onChange={(e) => addFiles(e.target.files)}
                />
                <label className="field-label">
                  Subject
                  <PlatformSelect
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                  >
                    {subjects.slice(1).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </PlatformSelect>
                </label>

                <button
                  className="primary-button full-width"
                  onClick={finishUpload}
                  disabled={!uploadNames.length || uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="spin" size={17} />
                      Adding documents…
                    </>
                  ) : (
                    <>
                      Add to library
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </>
            )}
            {modal === "flashcards" && (
              <>
                <span className="eyebrow">A LITTLE ACTIVE RECALL</span>
                <h2 id="modal-title">Flashcards.</h2>
                <p>Cell biology · {flashcards.length} thoughtful questions</p>
                {cardsDone ? (
                  <div className="session-result">
                    <span className="result-icon">
                      <Leaf size={32} />
                    </span>
                    <h3>Review complete</h3>
                    <b>
                      {known.length}
                      <span>/{flashcards.length}</span>
                    </b>
                    <p>
                      cards marked as understood.{" "}
                      {known.length < flashcards.length
                        ? "Review the cards you missed."
                        : "Those connections are getting stronger."}
                    </p>
                    <button className="primary-button" onClick={startCards}>
                      <RotateCcw size={16} />
                      Practice again
                    </button>
                    <button className="text-button" onClick={startQuiz}>
                      Ready for a quiz?
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="card-progress">
                      <span>
                        Card {cardIndex + 1} of {flashcards.length}
                      </span>
                      <span>{known.length} understood</span>
                    </div>
                    <button
                      className={`flashcard ${flipped ? "flipped" : ""}`}
                      onClick={() => setFlipped(!flipped)}
                      aria-label={flipped ? "Show question" : "Reveal answer"}
                    >
                      <span className="flashcard-kind">
                        {flipped ? "THE LITTLE ANSWER" : "A GOOD QUESTION"}
                      </span>
                      <span className="flashcard-content">
                        {flipped
                          ? flashcards[cardIndex].answer
                          : flashcards[cardIndex].question}
                      </span>
                      <span className="flashcard-hint">
                        <RotateCcw size={14} />
                        Click to{" "}
                        {flipped ? "see the question" : "reveal the answer"}
                      </span>
                    </button>
                    <div className="flashcard-controls">
                      <button
                        className="secondary-button"
                        disabled={cardIndex === 0}
                        aria-label="Previous flashcard"
                        onClick={() => {
                          setCardIndex(cardIndex - 1);
                          setFlipped(false);
                        }}
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setFlipped(false);
                          if (cardIndex === flashcards.length - 1)
                            setCardsDone(true);
                          else setCardIndex(cardIndex + 1);
                        }}
                      >
                        Practice again later
                      </button>
                      <button
                        className="primary-button"
                        disabled={!flipped}
                        onClick={() => {
                          setKnown((prev) =>
                            prev.includes(cardIndex)
                              ? prev
                              : [...prev, cardIndex],
                          );
                          setFlipped(false);
                          if (cardIndex === flashcards.length - 1)
                            setCardsDone(true);
                          else setCardIndex(cardIndex + 1);
                        }}
                      >
                        <Check size={16} />
                        Got it
                      </button>
                    </div>
                    <p className="modal-footnote">
                      Flip each card, then rate your recall.
                    </p>
                  </>
                )}
              </>
            )}
            {modal === "quiz" && (
              <>
                <span className="eyebrow">PRACTICE QUIZ</span>
                <h2 id="modal-title">Cell biology quiz</h2>
                <p>
                  Cell biology · {quizQuestions.length} questions · At your own
                  pace
                </p>
                {quizDone ? (
                  <div className="session-result">
                    <span className="result-icon">
                      <Sparkles size={32} />
                    </span>
                    <h3>
                      {quizScore >= 4 ? "Quiz complete" : "Quiz complete"}
                    </h3>
                    <b>
                      {Math.round((quizScore / quizQuestions.length) * 100)}
                      <span>%</span>
                    </b>
                    <p>
                      {quizScore} of {quizQuestions.length} correct.{" "}
                      {quizScore >= 4
                        ? "Review your answers below."
                        : "Review your answers and try again."}
                    </p>
                    <button className="primary-button" onClick={startQuiz}>
                      <RotateCcw size={16} />
                      Try again
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setQuizReview(!quizReview)}
                    >
                      {quizReview ? "Hide" : "Review"} answers
                      <ChevronDown size={14} />
                    </button>
                    {quizReview && (
                      <div className="quiz-review">
                        {quizQuestions.map((q, i) => (
                          <div key={q.question}>
                            <b>
                              {i + 1}. {q.question}
                            </b>
                            <p>
                              <Check size={14} />
                              {q.options[q.answer]}
                            </p>
                            <small>{q.explanation}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="card-progress">
                      <span>
                        Question {quizIndex + 1} of {quizQuestions.length}
                      </span>
                      <span>{quizScore} correct</span>
                    </div>
                    <div className="thin-progress">
                      <span
                        style={{
                          width: `${((quizIndex + 1) / quizQuestions.length) * 100}%`,
                        }}
                      />
                    </div>
                    <h3 className="quiz-question">
                      {quizQuestions[quizIndex].question}
                    </h3>
                    <div className="quiz-options">
                      {quizQuestions[quizIndex].options.map((option, i) => (
                        <button
                          key={option}
                          disabled={quizChoice !== null}
                          className={`${quizChoice !== null && i === quizQuestions[quizIndex].answer ? "correct" : ""} ${quizChoice === i && i !== quizQuestions[quizIndex].answer ? "incorrect" : ""}`}
                          onClick={() => {
                            setQuizChoice(i);
                            if (i === quizQuestions[quizIndex].answer)
                              setQuizScore(quizScore + 1);
                          }}
                        >
                          <span>{String.fromCharCode(65 + i)}</span>
                          {option}
                          {quizChoice !== null &&
                            i === quizQuestions[quizIndex].answer && (
                              <Check size={17} />
                            )}
                        </button>
                      ))}
                    </div>
                    {quizChoice !== null && (
                      <div className="quiz-explanation">
                        <b>
                          {quizChoice === quizQuestions[quizIndex].answer
                            ? "Correct"
                            : "Review the explanation"}
                        </b>
                        <p>{quizQuestions[quizIndex].explanation}</p>
                      </div>
                    )}
                    <button
                      className="primary-button full-width"
                      disabled={quizChoice === null}
                      onClick={() => {
                        if (quizIndex === quizQuestions.length - 1)
                          setQuizDone(true);
                        else {
                          setQuizIndex(quizIndex + 1);
                          setQuizChoice(null);
                        }
                      }}
                    >
                      {quizIndex === quizQuestions.length - 1
                        ? "See results"
                        : "Next question"}
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </>
            )}
            {modal === "plan" && (
              <>
                <span className="modal-icon">
                  <CalendarDays size={25} />
                </span>
                <span className="eyebrow">STUDY SESSION</span>
                <h2 id="modal-title">
                  {editingSession ? "Edit session" : "Plan a session"}
                </h2>
                <p>Choose a subject, time, and duration.</p>
                <form
                  className="plan-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const parts = planTime.split(":").map(Number);
                    const start = parts[0] * 60 + parts[1];
                    const end = start + (parseInt(planDuration) || 25);
                    if (end > 1440) {
                      setPlanError(
                        "Choose a time that finishes before midnight.",
                      );
                      return;
                    }
                    const conflict = sessionConflict(
                      tasks,
                      plannerDate,
                      planTime,
                      planDuration,
                      editingSession,
                    );
                    if (conflict) {
                      setPlanError(
                        "This overlaps with “" +
                          conflict.title +
                          "” at " +
                          conflict.time +
                          ". Choose another time.",
                      );
                      return;
                    }
                    const task: StudyTask = {
                      id: editingSession || crypto.randomUUID(),
                      title: planTitle.trim(),
                      subject: uploadSubject,
                      time: planTime,
                      duration: planDuration,
                      done: editingSession
                        ? tasks.find((task) => task.id === editingSession)
                            ?.done || false
                        : false,
                      day: weekDay(plannerDate),
                      date: plannerDate,
                    };
                    setTasks((previous) =>
                      editingSession
                        ? previous.map((item) =>
                            item.id === editingSession ? task : item,
                          )
                        : [...previous, task],
                    );
                    setDay(task.day);
                    setModal(null);
                    navigate("Study planner");
                    notify(
                      editingSession
                        ? "Session updated."
                        : "Session added to planner.",
                    );
                    setEditingSession(null);
                    setPlanError("");
                  }}
                >
                  <label>
                    What will you work on?
                    <input
                      required
                      maxLength={100}
                      placeholder="e.g. Review cellular respiration"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Subject
                    <PlatformSelect
                      value={uploadSubject}
                      onChange={(e) => setUploadSubject(e.target.value)}
                    >
                      {subjects.slice(1).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </PlatformSelect>
                  </label>
                  <div className="form-row">
                    <label>
                      Date
                      <input
                        required
                        type="date"
                        value={plannerDate}
                        onChange={(event) => {
                          if (!event.target.value) return;
                          setPlannerDate(event.target.value);
                          setPlanDay(weekDay(event.target.value));
                          setPlanError("");
                        }}
                      />
                    </label>
                    <label>
                      Time
                      <input
                        required
                        type="time"
                        value={planTime}
                        onInput={(e) => setPlanTime(e.currentTarget.value)}
                        onChange={(e) => setPlanTime(e.target.value)}
                      />
                    </label>
                  </div>
                  <label>
                    Duration
                    <PlatformSelect
                      value={planDuration}
                      onChange={(e) => setPlanDuration(e.target.value)}
                    >
                      {[
                        "15 min",
                        "20 min",
                        "25 min",
                        "30 min",
                        "45 min",
                        "50 min",
                        "60 min",
                        "90 min",
                      ].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </PlatformSelect>
                  </label>
                  {planError && (
                    <p className="planner-form-error" role="alert">
                      {planError}
                    </p>
                  )}
                  <button
                    className="primary-button full-width"
                    disabled={!planTitle.trim()}
                  >
                    {editingSession ? "Save changes" : "Create session"}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}
            {modal === "upgrade" && (
              <div className="upgrade-modal-content">
                <Emblem />
                <h2 id="modal-title">Upgrade to Alexis Plus</h2>
                <p>Everything you need to study smarter.</p>
                <div className="plan-price">
                  $12<span>/ month</span>
                </div>
                <ul>
                  {[
                    "Upload up to 200 documents",
                    "Unlimited conversations",
                    "Integrate with Google Calendar and Classroom",
                    "Personalized study plans and progress tracking",
                  ].map((t) => (
                    <li key={t}>
                      <Check size={16} />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="demo-note">
                  <p>
                    Free for 1 month, then $12/month. Cancel anytime before your
                    trial ends{" "}
                  </p>
                </div>
                <button
                  className="primary-button full-width"
                  onClick={() => {
                    setModal(null);
                    notify(
                      "You’re already free to explore every feature in this demo.",
                    );
                  }}
                >
                  Unlock Alexis Plus
                  <ArrowUpRight size={16} />
                </button>
              </div>
            )}
            {modal === "welcome" && (
              <>
                <Emblem />
                <span className="eyebrow">
                  A LITTLE GUIDE TO YOUR WORKSPACE
                </span>
                <h2 id="modal-title">Hello, curious mind.</h2>
                <p>A calmer space to learn deeper. Here’s where to begin.</p>
                <div className="demo-guide">
                  {[
                    {
                      icon: FolderOpen,
                      title: "Bring your knowledge",
                      text: "Open the sample documents or add local placeholders in My library.",
                    },
                    {
                      icon: MessageCircle,
                      title: "Think it through",
                      text: "Try a question or continue a prepared conversation with Alexis.",
                    },
                    {
                      icon: Layers3,
                      title: "Make it yours",
                      text: "Flip flashcards, take a biology quiz, and plan a study session.",
                    },
                  ].map((s) => (
                    <div key={s.title}>
                      <span>
                        <s.icon size={21} />
                      </span>
                      <div>
                        <h3>{s.title}</h3>
                        <p>{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="demo-note">
                  <p>
                    This is an interactive demo with prepared responses. Your
                    changes stay in this browser, and you can reset them in
                    Settings.
                  </p>
                </div>
                <button
                  className="primary-button full-width"
                  onClick={() => setModal(null)}
                >
                  A little curiosity starts here
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
