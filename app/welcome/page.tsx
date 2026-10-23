import type { Metadata } from "next";
import HeroSection from "@/components/landing/heroSection";
import BentoGrid from "@/components/landing/bentoGrid";
import Fields from "@/components/landing/fields";
import Pricing from "@/components/landing/pricing";
import Faq from "@/components/landing/faq";
import Navbar from "@/components/landing/navbar";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import LandingMotion from "@/components/landing/landing-motion";

import "@/components/workspace/design-system.css";
import "@/components/landing/alexis-landing.css";
import "@/components/landing/landing-refinement.css";
import "@/components/landing/landing-interactive.css";
import "@/components/landing/landing-polish.css";

export const metadata: Metadata = { title: "Alexis — Your study companion", description: "Courses, notes, conversations and revision in one calm workspace. Tailored course libraries for medicine, STEM and law." };

export default function Home() {
  return (
    <LandingMotion>
      <a className="lp-skip" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <BentoGrid />
        <Fields />
        <Pricing />
        <Faq />
        <CTA />
      </main>
      <Footer />

    </LandingMotion>
  );
}
