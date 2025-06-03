"use client";

import React, { useState } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Brain, Notepad, NotePencil } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChatModeBtnProps = {
  mode: "problemSolving" | "mcq" | "writing";
  ismodeSelected: boolean;
  setIsModeSelected: (value: boolean) => void;
};

export default function ChatModeBtn({
  mode,
  ismodeSelected,
  setIsModeSelected,
}: ChatModeBtnProps) {
  return (
    <Button
      size="icon"
      disabled
      className={cn(
        "group bg-mauve-300 hover:bg-mauve-300/90 h-8 w-8 shadow-none hover:bg-purple-300",
        ismodeSelected && "bg-purple-300 border-[1px] border-purple-800"
      )}
      onClick={() => setIsModeSelected(!ismodeSelected)}
    >
      {mode === "problemSolving" ? (
        <TooltipButton content="Problem solving">
          <Brain
            size={18}
            color={ismodeSelected ? "#793AAF" : "#65636D"}
            className="group-hover:fill-purple-1100"
          />
        </TooltipButton>
      ) : mode === "mcq" ? (
        <TooltipButton content="QCM">
          <NotePencil
            size={18}
            color={ismodeSelected ? "#793AAF" : "#65636D"}
            className="group-hover:fill-purple-1100"
          />
        </TooltipButton>
      ) : mode === "writing" ? (
        <TooltipButton content="Writing">
          <Notepad
            size={18}
            color={ismodeSelected ? "#793AAF" : "#65636D"}
            className="group-hover:fill-purple-1100"
          />
        </TooltipButton>
      ) : null}
    </Button>
  );
}

export function TooltipButton({
  children,
  content,
  side = "bottom",
  align = "start",
  sideOffset = 10,
  className,
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: any;
  sideOffset?: number;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={20}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={className}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
