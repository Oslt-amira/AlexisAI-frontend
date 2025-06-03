import React, { useEffect } from "react";
import { ChatMode } from "./chatBar";
import { motion } from "framer-motion";
import { Paperclip } from "@phosphor-icons/react";
import { ImageDialog } from "./imageDialog";

type UserMessageProps = {
  message: string;
  date: number;
  mode: ChatMode;
  files: any[] | null;
  ref: React.RefObject<HTMLDivElement> | null;
};

const getRelativeDate = (timestamp: number) => {
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

export default function UserMessage({
  message,
  date,
  mode,
  files,
  ref,
}: UserMessageProps) {
  const dateObject = new Date(date * 1000);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const timeString = `${hours}h${minutes < 10 ? "0" : ""}${minutes}`;
  const relativeDate = getRelativeDate(date);


  return (
    <div
      className="w-full h-auto flex flex-col items-end gap-2  transition-all animate-fade-up-sm"

    >
      <div className="px-4 py-3 w-fit max-w-xl bg-mauve-300 border-[1.5px] border-mauve-700 rounded-2xl flex flex-col">
        <p className="text-sm">
          {mode && (
            <span className="px-2 py-1 bg-purple-400 border-[1px] border-purple-700 rounded-sm text-xs select-none text-purple-1100 font-medium mr-1">
              {mode === "problemSolving" && "/Problem solving"}
              {mode === "mcq" && "/MCQ"}
              {mode === "writing" && "/Writing"}
            </span>
          )}
          {message}
        </p>
        {files && (
          <div className="flex gap-4">
            {files.map((fileData, index) => (
              <div
                key={index}
                className="flex w-fit gap-1 items-center px-1 py-[3px] rounded-md bg-purple-300 border-[1px] border-purple-700 mt-5 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://dify.ccdev.space${fileData.url}`,
                    "_blank"
                  )
                }
              >
                <Paperclip size={16} color="#793AAF" />
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-mauve-900">
        You {relativeDate} at <span className="font-bold">{timeString}</span>
      </p>
    </div>
  );
}
