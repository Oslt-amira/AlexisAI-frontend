"use client";
import React, { useEffect, useState } from "react";
import { ChatMode } from "./chatBar";
import { motion } from "framer-motion";
import { Brain, Notepad, NotePencil } from "@phosphor-icons/react";

import { ImageDialog } from "./imageDialog";

import { ResponseOptions } from "./responseOptions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RemarkMathPlugin from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

type AlexisResponseProps = {
  content: string;
  created_at: any;
  mode: ChatMode;
  file: File | null;
  isLastMessage: boolean;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  ref: React.RefObject<HTMLDivElement> | null;
  id: string | null;
  retriever_resources: any;
  isStreamCompleted?: boolean;
  lastMessageId?: string;
  conversationId: string;
  setConversation: any;
  setLastMessageId: any;
  setIsStreamingCompleted: any;
};

export const getRelativeDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toDateString();
  }
};

export default function AlexisResponse({
  content,
  created_at,
  mode,
  file,
  isLastMessage,
  setLoading,
  ref,
  id,
  retriever_resources,
  isStreamCompleted,
  lastMessageId,
  conversationId,
  setConversation,
  setLastMessageId,
  setIsStreamingCompleted,
}: AlexisResponseProps) {
  const modes = {
    problemSolving: { icon: <Brain size={16} />, label: "Problem solving" },
    mcq: { icon: <NotePencil size={16} />, label: "MCQ" },
    writing: { icon: <Notepad size={16} />, label: "Writing" },
  };

  const dateObject = new Date(created_at * 1000);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const timeString = `${hours}h${minutes < 10 ? "0" : ""}${minutes}`;
  const relativeDate = getRelativeDate(created_at);

  const preprocessLaTeX = (content: string) => {

        // Replace block-level LaTeX delimiters \[ \] with $$ $$
    const blockProcessedContent = content.replace(
      /\\\[(.*?)\\\]/gs,
      (_, equation) => `$$${equation}$$`
    );
    // Replace inline LaTeX delimiters \( \) with $ $
    const inlineProcessedContent = blockProcessedContent.replace(
      /\\\((.*?)\\\)/gs,
      (_, equation) => `$${equation}$`
    );
    return inlineProcessedContent;
  };

  return (
    <div
      className=" w-full h-auto flex flex-col items-start gap-2 transition-all animate-fade-up-sm "
    >
      <div className="flex flex-row gap-[10px] items-end">
        <div className="px-4 py-3 w-fit max-w-[70vw] sm:max-w-lg bg-purple-300 border-[1.5px] border-purple-700 rounded-2xl flex flex-col">
          <div className="text-sm">
            {mode && modes[mode] && (
              <div className="py-1 flex flex-row items-center justify-start">
                {modes[mode].icon}
                <span className="font-semibold text-xs select-none text-purple-1200 mx-1">
                  {modes[mode].label}
                </span>
              </div>
            )}
            <div className="text-sm text-purple-1200 text-wrap">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, RemarkMathPlugin]}

                rehypePlugins={[rehypeKatex]}
                components={{
                  li: ({ node, ...props }) => (
                    <li  className="py-1 " {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="my-2 px-1 " {...props} />
                  ),

                  ul: ({ node, ...props }) => (
                    <ul className="my-1 px-1 " {...props} />
                  ),
        
                  h3: ({ node, ...props }) => (
                    <h3
                      className=" font-semibold text-[14px] my-1"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className=" font-semibold text-[16px] mb-2 mt-1"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className=" font-medium text-[18px] mb-2 mt-1 "
                      {...props}
                    />
                  ),
                }}
              >
                {preprocessLaTeX(content)}
              </ReactMarkdown>
            </div>
          </div>
          {/* {files && (
            <div className="flex flex-col w-fit gap-1 items-start  py-1">
              <span className="text-xs font-bold text-purple-1200 py-1">
                Reference images:
              </span>
              <div className="flex flex-row flex-wrap gap-[10px] items-center">
                {files.map((file, index) => (
                  <div key={index}>
                    <ImageDialog file={file} />
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
        <ResponseOptions
          id={id}
          isLastMessage={isLastMessage}
          responseContent={content}
          retriever_resources={retriever_resources}
          isStreamCompleted={isStreamCompleted ? true : false}
          lastMessageId={lastMessageId ?? ""}
          conversationId={conversationId ?? ""}
          setConversation={setConversation}
          setLastMessageId={setLastMessageId}
          setIsStreamingCompleted={setIsStreamingCompleted}
          setLoading={setLoading}
        />
      </div>
      <p className="text-xs text-mauve-900 ">
        Alexis {relativeDate} at <span className="font-bold">{timeString}</span>
      </p>


      
    </div>
  );
}
