import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
export default function CTA() {
  return (
    <section className="w-full h-auto flex flex-col gap-6 items-center pt-16 pb-40">
      <div className="flex flex-col pb-6">
        <h2 className="text-center py-6 text-4xl font-medium text-mauve-1200 leading-none tracking-tighter sm:text-5xl md:text-6xl capitalize translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        Unleash Your Full Potential with Alexis
        </h2>
        <p className="text-center max-w-xs mx-auto text-mauve-1000 text-base sm:max-w-lg sm:text-xl md:text-2xl md:max-w-xl lg:text-lg lg:max-w-2xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:30ms]">
        Dive into a transformative learning experience with Alexis. Begin your journey today and watch your potential unfold like never before.
        </p>
      </div>
      <Button size="lg" className="bg-purple-900 hover:bg-purple-900/90">
        <Link href="/signIn"> Start now </Link>
      </Button>
    </section>
  );
}
