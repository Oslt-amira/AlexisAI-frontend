"use client";
import { ArrowRight, ChevronDown } from "lucide-react";
import { faqs } from "./landing-shared";
export default function Faq() {
  return (
    <section id="FAQ" className="lp-container lp-section lp-faq">
      <div>
        <span className="eyebrow lp-eyebrow">FAQ</span>
        <h2>
          A few things
          <br />
          <em>to know.</em>
        </h2>
        <a href="mailto:amira.oslt13@gmail.com" className="lp-text-link">
          Get in touch <ArrowRight size={14} />
        </a>
      </div>
      <div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={17} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
