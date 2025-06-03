"use client";

import { Sparkle } from "@phosphor-icons/react";
import React from "react";
import { CardContent } from "../ui/card";
import { motion } from "framer-motion";

type LoadingProps = {};

export default function Loading({}: LoadingProps) {
  return (
    <motion.div
      animate={{ y: [0, 2, 0] }}
      transition={{
        ease: "easeInOut",
        duration: 1.5,
        repeat: Infinity,
      }}
      exit={{ opacity: 0 }}
      className=" place-self-center  "
    >
      <div
        className="bg-purple-300 
      w-fit border border-purple-700  mb-4 rounded-full"
        style={{ filter: "drop-shadow(0px 3px 3px rgba(121, 58, 175, 0.15))" }}
      >
        <CardContent className="flex flex-row items-center h-fit w-fit py-2 px-4 justify-center gap-1.5">
          <Sparkle size={16} color="#793AAF" weight="fill" />
          <span className="font-semibold text-[11px] select-none text-purple-1100">
            Just a moment...
          </span>
        </CardContent>
      </div>
    </motion.div>
  );
}
