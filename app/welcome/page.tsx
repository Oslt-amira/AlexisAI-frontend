import HeroSection from "@/components/landing/heroSection";
import BentoGrid from "@/components/landing/bentoGrid";
import Fields from "@/components/landing/fields";
import Pricing from "@/components/landing/pricing";
import Faq from "@/components/landing/faq";
import Navbar from "@/components/landing/navbar";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col relative justify-items-center ">
      <Navbar />
      <HeroSection />
      <BentoGrid />
      <Fields />
      <Pricing />
      <Faq />
      <CTA />
      <Footer />

    </div>
  );
}
