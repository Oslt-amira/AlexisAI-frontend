"use client";

import React, { useMemo } from "react";
import QuestionCard from "./questionCard";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";

const questions = [
  {
    question:
      "List the main diagnoses to consider for a sudden-onset headache",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What is a linear scalar differential equation of order n?",
    tag: "STEM",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "What is the process of criminal trials in Tunisia?",
    tag: "Law",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "Describe the lymphatic drainage system of the breast.",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What are the first-line antidepressants for treating depression?",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "How to determine if a series is convergent or divergent?",
    tag: "STEM",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What are the specific deadlines within which one must file an appeal ",
    tag: "Law",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "How is hypertension diagnosed by healthcare professionals.",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What urgent measures should be taken in case of a suspected stroke?",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What are the fundamental operations defined in a vector space?",
    tag: "STEM",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "What are reasonable identity verification measures?",
    tag: "Law",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "List the main diagnoses to consider for a sudden-onset headache",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "What are the different causes of chest pain?",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "What are the properties of matrix addition?",
    tag: "STEM",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question: "What is the process of criminal trials in Tunisia?",
    tag: "Law",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
  {
    question:
      "List the main diagnoses to consider for a sudden-onset headache",
    tag: "Medicine",
    answer:
      "The main diagnoses to consider for a sudden-onset headache are:",
  },
];


export default function Fields() {
  const [activeTab, setActiveTab] = React.useState<
    "all" | "Medicine" | "Law" | "STEM"
  >("all");

  const filteredQuestions = useMemo(() => {
    if (activeTab === "all") {
      return questions;
    }
    return questions.filter((question) => question.tag === activeTab);
  }, [activeTab, questions]);

  return (
    <section
      id="Examples"
      className="w-full h-auto flex flex-col items-center pt-24 relative"
    >
      <div className="flex flex-col">
        <h2 className="text-center py-6 text-4xl font-medium text-mauve-1200 leading-none tracking-tighter sm:text-5xl md:text-6xl capitalize translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          Need answers? Alexis has them.
        </h2>
        <p className="text-center max-w-xs mx-auto text-mauve-1000 text-base sm:max-w-lg sm:text-xl md:text-2xl md:max-w-xl lg:text-lg lg:max-w-2xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:30ms]">
          With its vast library of courses tailored to various sectors, Alexis
          is your trusted source for accurate information .
        </p>
      </div>

      <div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-16 lg:px-36 lg:py-16 flex flex-col gap-10 sm:items-center 	 ">
        <Tabs defaultValue="all" onValueChange={(e: any) => setActiveTab(e)}>
          <TabsList className="bg-purple-400  sm:overflow-x-hidden overflow-x-scroll w-full ">
            <TabsTrigger
              value="all"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 "
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Medicine"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            >
              Medicine (Residency)
            </TabsTrigger>
            <TabsTrigger
              value="STEM"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            >
              STEM 
            </TabsTrigger>
            <TabsTrigger
              value="Law"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
            >
              Law
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap justify-center gap-6">
          {filteredQuestions.map((content, index) => (
            <QuestionCard
              key={index}
              index={index}
              content={content.question}
              tag={content.tag}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-16 h-1/3 bg-gradient-to-t from-white flex items-end justify-center pb-8 z-10">
        <Link href="/signIn">
          <Button className="pointer-events-auto bg-purple-900 hover:bg-purple-900/90">
            Ask your question now !
          </Button>
        </Link>
      </div>
    </section>
  );
}
