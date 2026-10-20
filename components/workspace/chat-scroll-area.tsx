"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";

export default function ChatScrollArea({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ progress: 0, size: 100, remaining: 0 });

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => {
      const range = element.scrollHeight - element.clientHeight;
      setScroll({
        progress: range > 0 ? (element.scrollTop / range) * 100 : 0,
        size: Math.min(100, (element.clientHeight / Math.max(1, element.scrollHeight)) * 100),
        remaining: Math.max(0, range - element.scrollTop),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (content.current) observer.observe(content.current);
    element.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => { observer.disconnect(); element.removeEventListener("scroll", measure); };
  }, []);

  const scrollToPointer = (clientY: number) => {
    if (!viewport.current || !rail.current) return;
    const bounds = rail.current.getBoundingClientRect();
    const fraction = (clientY - bounds.top) / Math.max(1, bounds.height);
    viewport.current.scrollTop = Math.max(0, Math.min(1, fraction)) * (viewport.current.scrollHeight - viewport.current.clientHeight);
  };

  return (
    <div className="chat-scroll-region">
      <div className="chat-messages" id="chat-message-viewport" ref={viewport} tabIndex={0} aria-label="Conversation messages">
        <div className="chat-message-content" ref={content}>{children}</div>
      </div>
      {scroll.size < 100 && (
        <div
          className="chat-scroll-rail"
          ref={rail}
          role="scrollbar"
          aria-label="Scroll conversation"
          aria-controls="chat-message-viewport"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scroll.progress)}
          tabIndex={0}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            scrollToPointer(event.clientY);
          }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) scrollToPointer(event.clientY); }}
          onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onKeyDown={(event) => {
            const element = viewport.current;
            if (!element) return;
            const steps: Record<string, number> = { ArrowDown: 60, ArrowUp: -60, PageDown: element.clientHeight * .8, PageUp: -element.clientHeight * .8 };
            if (event.key in steps || event.key === "Home" || event.key === "End") {
              event.preventDefault();
              element.scrollTo({ top: event.key === "Home" ? 0 : event.key === "End" ? element.scrollHeight : element.scrollTop + steps[event.key], behavior: "smooth" });
            }
          }}
        >
          <span className="chat-scroll-ticks" aria-hidden="true">{Array.from({ length: 19 }, (_, index) => <i key={index} className={index === Math.round(scroll.progress / 100 * 18) ? "is-current" : ""} />)}</span>
        </div>
      )}
      {scroll.remaining > 120 && <button className="chat-jump-latest" onClick={() => viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" })}><ArrowDown size={14} /></button>}
    </div>
  );
}
