"use client";

import { Moon, Sun } from "lucide-react";
import { useLandingAppearance } from "./use-landing-appearance";

export default function AppearanceToggle() {
  const { dark, chooseTheme } = useLandingAppearance();
  return <button className={`lp-hero-switch lp-living-switch ${dark ? "is-night" : "is-day"}`} role="switch" aria-label="Dark mode" aria-checked={dark} title={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => chooseTheme(!dark)}>
    <i className="lp-switch-stars" aria-hidden="true"><i /><i /><i /></i>
    <span className="lp-switch-knob">{dark ? <Moon size={15} /> : <Sun size={15} />}</span>
  </button>;
}
