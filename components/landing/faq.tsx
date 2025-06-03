"use client";

import React from "react";
import FaqItem from "./faqItem";
import { Button } from "../ui/button";
import { Envelope } from "@phosphor-icons/react";
import Link from "next/link";

export default function Faq() {
  const questions = [
    {
      label: "What resources does Alexis use to ensure up-to-date information?",
      answer:
        "Alexis relies on a vast library of updated academic resources to provide reliable and relevant data.",
    },
    {
      label: "How can Alexis help me prepare for national exams?",
      answer:
        "Alexis provides a comprehensive preparation plan by leveraging reliable, up-to-date resources and a variety of learning modes. Whether you're focusing on practice tests, personalized study plans, or interactive lessons, Alexis adapts to your needs to ensure you're fully equipped for success in your national exams.",
    },
    {
      label: "What payment options are available for Alexis?",
      answer:
        "We offer a variety of secure online payment methods to suit your needs, such as using your bank card or eDinar card.",
    },
    {
      label: "How is my personal data protected with Alexis?",
      answer:
        "Your privacy is our highest priority. Alexis employs state-of-the-art encryption protocols and secure data handling practices to safeguard your personal information, ensuring that your data remains private and protected at all times.",
    },
    {
      label: "Can Alexis communicate in different languages?",
      answer:
        "Alexis is built with multilingual capabilities to understand and interact in several languages, ensuring seamless communication and a tailored experience for users worldwide.",
    },
  ];
  
  return (
    <section id="FAQ" className="w-full h-auto flex flex-col gap-16 items-center pt-32 pb-24">
      <div className="flex flex-col">
        <h2 className="text-center py-6 text-4xl font-medium text-mauve-1200 leading-none tracking-tighter sm:text-5xl md:text-6xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        We&apos;ve Got Your Questions Covered        </h2>
        <p className="text-center max-w-xs mx-auto text-mauve-1000 text-base sm:max-w-lg sm:text-xl md:text-2xl md:max-w-xl lg:text-lg lg:max-w-2xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:30ms]">
        Dive into our frequently asked questions to find detailed answers and insights on how Alexis can support your learning journey and help you achieve your goals.
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center ">
        {questions.map((question, index) => (
          <FaqItem key={index} {...question} />
        ))}
        <div className=" w-4/6 sm:w-[600px]  h-fit bg-mauve-100 border border-mauve-600 rounded-lg flex flex-col justify-center px-6 py-3 ">
          <div className="flex justify-between items-center">
            <span className="text-mauve-1200 font-medium w-5/6">
            Have More Questions?
            </span>
            <Link href="mailto:jawherarbia@gmail.com">
              <Button className="flex items-center gap-2 bg-purple-900 hover:bg-purple-900/90">
                <Envelope size={20} />
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
