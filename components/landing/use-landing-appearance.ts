"use client";

import { useEffect, useState } from "react";

export const landingPalettes = [
  { id: "green", name: "Sage" },
  { id: "purple", name: "Iris" },
  { id: "chrome", name: "Chrome" },
  { id: "amber", name: "Amber" },
] as const;

export function useLandingAppearance() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState("green");
  useEffect(() => {
    const read = () => {
      setDark(document.documentElement.dataset.theme === "dark");
      setAccent(document.documentElement.dataset.accent || "green");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-accent"] });
    return () => observer.disconnect();
  }, []);
  function chooseTheme(next: boolean) {
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("alexis-theme", next ? "dark" : "light"); } catch {}
  }
  function chooseAccent(next: string) {
    document.documentElement.dataset.accent = next;
    try { localStorage.setItem("alexis-accent", next); } catch {}
  }
  return { dark, accent, chooseTheme, chooseAccent };
}
