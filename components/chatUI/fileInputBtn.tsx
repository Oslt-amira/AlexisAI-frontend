"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Paperclip } from "@phosphor-icons/react";
import { TooltipButton } from "./chatModeBtn";
import { cn } from "@/lib/utils";

type FileInputBtnProps = {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  setIsFileLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FileInputBtn({
  files,
  setFiles,
  setIsFileLoading,
}: FileInputBtnProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFiles((prevFiles) =>
        prevFiles?.length ? [...prevFiles, selectedFile] : [selectedFile]
      );
    }
  }

  return (
    <TooltipButton content="Attach file">
      <Button
        size="icon"
        className={cn(
          "group bg-mauve-300 hover:bg-mauve-300/90 h-8 w-8 shadow-none hover:bg-purple-300",
          files &&
            files.length > 0 &&
            "bg-purple-300 border-[1px] border-purple-800"
        )}
        disabled={files?.length === 6 || true}
        onClick={onClick}
      >
        <Paperclip
          size={18}
          color={files && files.length > 0 ? "#793AAF" : "#65636D"}
        />
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          id="inputFile"
          accept="image/*, .pdf"
          onChange={onFileChange}
          onLoadStart={() => setIsFileLoading(true)}
          onLoad={() => setIsFileLoading(false)}
        />
      </Button>
    </TooltipButton>
  );
}
