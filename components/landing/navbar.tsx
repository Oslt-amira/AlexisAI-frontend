"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import { useLandingAppearance } from "./use-landing-appearance";
export default function Navbar() {
  const { dark, chooseTheme } = useLandingAppearance();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".lp-header")) setMenu(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLButtonElement>(".lp-mobile-menu")?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menu]);
  function toggleTheme() {
    chooseTheme(!dark);
  }
  return (
    <header className="lp-header" aria-label="Navigation dock">
      <div className="lp-container lp-header-inner">
        <Link className="lp-brand" href="/welcome" aria-label="Alexis home">
          <AlexisLogo width={34} height={34} />
          <span>Alexis</span>
        </Link>
        <nav
          id="landing-navigation"
          className={menu ? "lp-nav is-open" : "lp-nav"}
          aria-label="Main navigation"
        >
          {[
            ["Features", "Features"],
            ["Courses", "Examples"],
            ["Pricing", "Pricing"],
            ["FAQ", "FAQ"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="lp-header-actions">
          <button
            className="lp-theme"
            onClick={toggleTheme}
            aria-label={dark ? "Use light mode" : "Use dark mode"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link className="lp-login" href="/signIn">
            Log in
          </Link>
          <Link
            className="primary-button lp-button lp-button-small"
            href="/demo"
          >
            Start Learning <ArrowRight size={14} />
          </Link>
          <button
            className="lp-mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            aria-controls="landing-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
