"use client";

import { BookOpen, MessageCircle, PenLine } from "lucide-react";
import MacPreview from "./mac-preview";
import AppearanceToggle from "./appearance-toggle";
import LandingActions from "./landing-actions";

export default function HeroSection() {
  return (
    <section className="lp-container lp-hero lp-editorial-hero lp-word-hero my-4">
      <div className="lp-hero-copy mb-4">
        <h1>
          <span className="lp-word-line">
            A space for your{" "}
            <span className="lp-hero-tiles" aria-hidden="true">
              <span>
                <BookOpen size={22} />
              </span>
              <span>
                <PenLine size={22} />
              </span>
            </span>
            <strong>notes,</strong>
          </span>
          <span className="lp-word-line">
            <span className="lp-headline-chat" aria-hidden="true">
              <MessageCircle size={24} />
            </span>
            <strong>conversations,</strong> and everything
          </span>
          <span className="lp-word-line">
            you’re learning <AppearanceToggle />
              <strong>along the way.</strong>
          </span>
        </h1>
        <p>A little less scattered. A little more understood.</p>
        <LandingActions />
      </div>
      <MacPreview />
    </section>
  );
}
