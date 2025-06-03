"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function QuestionCard({
  index,
  content,
  tag,
}: {
  index: number;
  content: string;
  tag?: string;
}) {
  return (
    <motion.div
      className=" justify-center px-4 py-3 w-fit max-w-xs h-fit bg-mauve-200 border border-mauve-600 rounded-2xl flex flex-col gap-1 cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        bounce: 0,
        delay: index * 0.15,
      }}
    >
      <span
        className={cn(
          "text-xs capitalize font-semibold w-fit px-1 py-[2px] rounded-sm",
          tag == "Medicine" &&
            "text-purple-1200 border border-purple-600 bg-purple-400",
          tag == "Law" &&
            "text-green-900 border border-green-200 bg-green-100",
          tag == "STEM" &&
            "text-orange-900 border border-orange-200 bg-orange-100"
        )}
      >
        {tag}
      </span>
      <p className="select-none text-sm">{content}</p>
    </motion.div>
  );
}
