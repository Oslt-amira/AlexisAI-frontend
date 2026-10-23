"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Sparkles, X } from "lucide-react";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import * as Dialog from "@radix-ui/react-dialog";

export default function Pricing() {
  const [plus, setPlus] = useState(false);
  const landingRoot = useRef<HTMLDivElement>(null);
  return (
    <div ref={landingRoot}>
      <section
        id="Pricing"
        className="lp-container lp-section lp-pricing lp-growth-pricing"
      >
        <div className="lp-pricing-heading">
          <span className="lp-pricing-label">PRICING</span>
          <h2>A plan for every chapter.</h2>
          <p>
            Start with a little curiosity. Make room for more when you need it.
          </p>
        </div>
        <div className="lp-growth-shell">
          <article className="lp-growth-plan">
            <span className="lp-growth-icon">
              <BookOpen size={18} />
            </span>
            <h3>Alexis Free</h3>
            <p>A good place to begin.</p>
            <div className="lp-growth-price">
              $0<span>/ month</span>
            </div>
            <div className="lp-growth-inclusions">
              <h4>What’s included</h4>
              <ul>
                {[
                  "Upload up to 20 Documents",
                  "Limited conversations",
                  "Explore the study workspace",
                  ,
                ].map((feature) => (
                  <li key={feature}>
                    <Check size={13} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signIn" className="lp-growth-button">
              Start Learning <ArrowRight size={14} />
            </Link>
          </article>
          <article className="lp-growth-plan is-featured">
            <div className="lp-growth-card-top">
              <span className="lp-growth-icon is-plus">
                <Sparkles size={18} />
              </span>
              <span className="lp-popular">
                <Sparkles size={10} /> A little more room
              </span>
            </div>
            <h3>Alexis Plus</h3>
            <p>For everything you’re getting into.</p>
            <div className="lp-growth-price">
              $12<span>/ month</span>
            </div>
            <div className="lp-growth-inclusions">
              <h4>Everything in Free, plus</h4>
              <ul>
                {[
                  "Upload up to 200 documents",
                  "Unlimited conversations",
                  "Sync with Google Calendar & Classroom",
                  "Personalized plans & progress tracking",
                ].map((feature) => (
                  <li key={feature}>
                    <Check size={13} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="lp-growth-button" onClick={() => setPlus(true)}>
              Explore Plus <ArrowRight size={14} />
            </button>
            <small>
              Free for 1 month, then $12/month. Cancel before your trial ends.
            </small>
          </article>
        </div>
      </section>
      <Dialog.Root open={plus} onOpenChange={setPlus}>
        <Dialog.Portal container={landingRoot.current}>
          <Dialog.Overlay className="lp-dialog-overlay" />
          <Dialog.Content className="lp-plus-dialog">
            <Dialog.Close
              className="lp-dialog-close"
              aria-label="Close Plus preview"
            >
              <X size={19} />
            </Dialog.Close>
            <div className="upgrade-modal-content">
              <span className="emblem">
                <AlexisLogo width={36} height={36} />
              </span>
              <Dialog.Title>Upgrade to Alexis Plus</Dialog.Title>
              <Dialog.Description>
                Everything you need to study smarter.
              </Dialog.Description>
              <div className="plan-price">
                $12<span>/ month</span>
              </div>
              <ul>
                {[
                  "Upload up to 200 documents",
                  "Unlimited conversations",
                  "Integrate with Google Calendar and Classroom",
                  "Personalized study plans and progress tracking",
                ].map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="demo-note">
                <p>
                  Free for 1 month, then $12/month. Cancel anytime before your
                  trial ends.
                </p>
              </div>
              <Link href="/demo" className="primary-button full-width">
                Try Plus in the demo <ArrowRight size={15} />
              </Link>
              <p className="modal-footnote">
                No subscription is started in the demo.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
