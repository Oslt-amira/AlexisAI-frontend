"use client";

import React, { useRef, useEffect } from "react";
import { ChatMode } from "./chatBar";
import { MentionsInput, Mention } from "react-mentions";
import AutoSizeTextArea from "react-textarea-autosize";

type TextAreaProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  chatMode: ChatMode;
  setChatMode: (value: ChatMode) => void;
  handleSubmit: () => void;
};

export default function TextArea({
  prompt,
  setPrompt,
  setChatMode,
  chatMode,
  handleSubmit,
}: TextAreaProps) {
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.ctrlKey && e.key === "1") {
      e.preventDefault();
      if (chatMode === "problemSolving") {
        setChatMode(null);
        return;
      }
      setChatMode("problemSolving");
    }
    if (e.ctrlKey && e.key === "2") {
      e.preventDefault();
      if (chatMode === "mcq") {
        setChatMode(null);
        return;
      }
      setChatMode("mcq");
    }
    if (e.ctrlKey && e.key === "3") {
      e.preventDefault();
      if (chatMode === "writing") {
        setChatMode(null);
        return;
      }
      setChatMode("writing");
    }
  }

  return (
    <div className="relative w-full">
      <AutoSizeTextArea
        className="bg-transparent text-[15px] z-10 w-full h-min max-h-32 pt-5 pr-3  text-mauve-1200 placeholder:text-mauve-900 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none focus-within:outline-none focus:outline-none overflow-y-scroll"
        placeholder="Ask me anything you want.."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
