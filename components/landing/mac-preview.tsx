"use client";

import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Focus,
  Folder,
  FolderOpen,
  ListChecks,
  MessageCircle,
  Mic,
  Moon,
  Palette,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import {
  landingPalettes,
  useLandingAppearance,
} from "./use-landing-appearance";

export default function MacPreview() {
  const { dark, accent, chooseAccent } = useLandingAppearance();
  return (
    <div className="lp-mac-wrap lp-platform-preview">
      <div
        role="img"
        aria-label="Alexis chat preview: chat folders, a question composer, and shortcuts for summaries, explanations, and quizzes."
      >
        <div className="lp-mac-window lp-static-workspace" {...{ inert: "" }}>
          <div className="lp-mac-titlebar">
            <span className="lp-traffic-lights">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="lp-mac-body">
            <aside className="lp-mac-sidebar">
              <div className="lp-preview-brand">
                <button tabIndex={-1}>
                  <AlexisLogo width={27} height={27} />
                </button>
                <button tabIndex={-1}>
                  <PanelLeftClose size={13} />
                </button>
              </div>
              <button tabIndex={-1} className="lp-preview-new">
                <Plus size={14} />
                <span>New chat</span>
              </button>
              <nav>
                <button tabIndex={-1}>
                  <FolderOpen size={15} />
                  <span>Library</span>
                  <small>6</small>
                </button>
                <button tabIndex={-1}>
                  <CalendarDays size={15} />
                  <span>Planner</span>
                </button>
              </nav>
              <div className="lp-preview-chats">
                <span>
                  Chats <Folder size={11} />
                </span>
                <p>
                  <ChevronDown size={10} />
                  <Folder size={12} />
                  Biology <small>1</small>
                </p>
                <a>Understanding cellular respiration</a>
                <p>
                  <ChevronRight size={10} />
                  <Folder size={12} />
                  First semester revision
                </p>
              </div>
            </aside>
            <div className="lp-mac-main">
              <div className="lp-mac-toolbar">
                <a>
                  <Search size={12} />
                  <span>Search</span>
                  <kbd>⌘ K</kbd>
                </a>
                <button tabIndex={-1}>
                  <Focus size={12} />
                  <span>Focus</span>
                </button>
                <button tabIndex={-1}>
                  <PanelRightClose size={12} />
                  <span>Recent activity</span>
                  <small>10</small>
                </button>
              </div>
              <div className="lp-preview-chat-layout">
                <div className="lp-preview-welcome">
                  <h3>What are we learning today?</h3>
                  <p>Ask a question, or work with your course materials.</p>
                  <div className="lp-platform-composer">
                    <div className="lp-preview-placeholder">Ask anything…</div>
                    <div className="lp-preview-composer-bottom">
                      <a>
                        <Plus size={15} />
                      </a>
                      <div className="chat-mode-picker">
                        <button tabIndex={-1} className="chat-mode-trigger">
                          <MessageCircle size={15} />
                          <span>Ask</span>
                          <ChevronDown size={12} />
                        </button>
                      </div>
                      <a className="lp-preview-context">
                        <BookOpen size={13} />
                        <span>All library</span>
                      </a>
                      <div className="lp-preview-send">
                        <a>
                          <Mic size={14} />
                        </a>
                        <button tabIndex={-1} disabled>
                          <ArrowUp size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="lp-preview-starters">
                    <button tabIndex={-1}>
                      <FileText size={12} />
                      Summarize notes
                    </button>
                    <button tabIndex={-1}>
                      <Sparkles size={12} />
                      Explain a concept
                    </button>
                    <button tabIndex={-1}>
                      <ListChecks size={12} />
                      Practice a quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lp-mac-caption lp-palette-bar">
        <div className="lp-palette-copy">
          <Palette size={15} />
          <span>Make it feel like you.</span>
        </div>
        <div role="group" aria-label="Choose a workspace palette">
          {landingPalettes.map((palette) => (
            <button
              key={palette.id}
              data-palette={palette.id}
              aria-label={`${palette.name} palette`}
              aria-pressed={accent === palette.id}
              onClick={() => chooseAccent(palette.id)}
            >
              <i aria-hidden="true">
                {accent === palette.id && <Check size={10} />}
              </i>
              <span>{palette.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
