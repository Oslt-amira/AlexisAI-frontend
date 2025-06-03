"use client";

import React from "react";
import PricingItem from "./pricingItem";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Pricing() {
  const [activeTab, setActiveTab] = React.useState<
    "monthly" | "halfYearly" | "yearly"
  >("monthly");
  const pricingData = [
    {
      label: "Basic",
      prices: ["Free"],
      description: `Start your learning journey and explore Alexis  with this free trial.`,
      benefits: [
        "10 available questions",
        "Instant chat in Q&A mode",
      ],
      button: "Start for Free",
      isRecommended: false,
    },
    {
      label: "Pro",
      prices: ["49.90 TND/Month", "250 TND/6Months", "450 TND/Year"],
      description: `Unlock the full potential of Alexis and enjoy an ultimate learning experience.`,
      benefits: [
        "Instant chat in Q&A mode",
        "MCQ, Problem Solving, and Writing",
        "Course libraries",
        "PDF integration",
        "Focus mode",
        "Revision planner",
      ],
      button: "Sign Up",
      isRecommended: true,
    },
  ];
  
  return (
    <section id="Pricing" className="w-full h-auto flex flex-col gap-6 items-center pt-16">
      <div className="flex flex-col pb-6">
        <h2 className="text-center py-6 text-4xl font-medium text-mauve-1200 leading-none tracking-tighter sm:text-5xl md:text-6xl capitalize translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          Pricing
        </h2>
        <p className="text-center max-w-xs mx-auto text-mauve-1000 text-base sm:max-w-lg sm:text-xl md:text-2xl md:max-w-xl lg:text-lg lg:max-w-2xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:30ms]">
        Unlock Alexis&apos; full potential .<br />
        Our flexible pricing options make it easy to upgrade your learning journey .
        </p>
      </div>
      <Tabs defaultValue="monthly" onValueChange={(e: any) => setActiveTab(e)}>
        <TabsList className="bg-purple-400">
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            value="monthly"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            value="halfYearly"
          >
            Semiannually
          </TabsTrigger>
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            value="yearly"
          >
            Annually
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col md:flex-wrap md:flex-row md:justify-center gap-6 items-end">
        <PricingItem data={pricingData[0]} activeTab={activeTab} />
        <PricingItem data={pricingData[1]} activeTab={activeTab} />
      </div>
    </section>
  );
}
