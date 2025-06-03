"use client";

import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FaqItemProps = {
  label: string;
  answer: string;
};

export default function FaqItem({ label, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="  w-4/6 sm:w-[600px] h-fit bg-mauve-100 border border-mauve-600 rounded-lg flex flex-col justify-center px-6 py-3 transform-gpu"
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.3,
      }}
    >
      <div
        className={cn("flex justify-between items-center", isOpen && "pb-2")}
      >
        <span className="text-mauve-1200 font-medium w-5/6">{label}</span>
        <CaretDown
          size={20}
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.p
            className="text-mauve-1100 text-sm transform-gpu"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 2 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            key={label}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.3,
            }}
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
