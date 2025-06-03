"use client";

import React, { useEffect, useState } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { chatWithAlexis, getConversationMessages } from "@/lib/api";
import { lawPrompts, medicalPrompts, stemPrompts } from "./chatUIConstants";


type PromptSuggestionProps = {
  userId: string;
  NewestConversation: any;
  setNewestConversation: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  setIsActiveChat: React.Dispatch<React.SetStateAction<any>>;
};

export default function PromptSuggestion({
  userId,
  NewestConversation,
  setNewestConversation,
  setLoading,
  setIsActiveChat,
}: PromptSuggestionProps) {


  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    const user = JSON.parse(userString || "{}");
    if (user.fieldOfStudy === "STEM") {
      setPrompts(stemPrompts)
    }
    if (user.fieldOfStudy === "Legal Studies") {
      setPrompts(lawPrompts)
    }
    if (user.fieldOfStudy === "Medical Field") {
      setPrompts(medicalPrompts)
    }
  }, []);

  async function handlePromptClick(prompt: string) {
    if (prompt) {
      setLoading(true);
      setIsActiveChat(true);
      if (!NewestConversation) {
        const response = await chatWithAlexis(
          "NewChat",
          userId,
          prompt,
          null,
          null
        );

        const responseData = JSON.parse(response.substring(6));
        setNewestConversation(responseData.conversation_id);
      }
    }
    setLoading(true);


  }

  return (
    <motion.div
      className="w-full h-auto flex flex-col bg-white border-2 mb-4 border-mauve-300 rounded-xl px-5 py-4"
      key="suggestions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-base text-mauve-1100 font-medium">
        Prompt suggestions for you
      </h3>
      <p className="text-xs text-mauve-1000">
        People in your field always struggles with these subjects
      </p>
      <div className="flex gap-2 mt-3 flex-wrap">
        {prompts.map((prompt, index) => (
          <div
            className="flex items-center gap-1 border-[1px] px-3 py-1 rounded-full border-mauve-600 cursor-pointer"
            key={index}
            onClick={() => handlePromptClick(prompt)}
          >
            <Sparkle size={16} color="#211F26" weight="fill" />
            <span className="text-[13px] text-mauve-1200 select-none ">
              {prompt}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
