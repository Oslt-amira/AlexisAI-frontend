"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = root.current.querySelectorAll<HTMLElement>(".lp-section-heading, .lp-tool-card, .lp-course-card, .lp-growth-plan, .lp-pricing-heading, .lp-final, .lp-mac-wrap, .lp-faq > div");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -24px 0px" });
    items.forEach((item, index) => {
      item.classList.add("lp-scroll-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
      item.dataset.reveal = "waiting";
      observer.observe(item);
    });
    return () => { observer.disconnect(); items.forEach(item => { item.classList.remove("lp-scroll-reveal"); delete item.dataset.reveal; }); };
  }, []);
  return <div className="alexis-app alexis-landing" ref={root}>{children}</div>;
}
