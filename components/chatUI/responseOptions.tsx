"use client";

import {
  ThumbsUp,
  ThumbsDown,
  BookmarksSimple,
  Gear,
} from "@phosphor-icons/react";
import { TooltipButton } from "./chatModeBtn";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { ResponseSources } from "./responseSources";
import { ResponsePreferences } from "./responsePreferences";
import { rateAlexisResponse } from "@/lib/api";
import { useLocalStorage } from "usehooks-ts";

type ResponseOptionsProps = {
  id: string | null;
  isLastMessage: boolean;
  responseContent: string;
  retriever_resources: any;
  isStreamCompleted: boolean;
  lastMessageId: string;
  conversationId: string;
  setConversation: any;
  setLastMessageId: any;
  setIsStreamingCompleted: any;
  setLoading: any;
};

export const ResponseOptions: React.FC<ResponseOptionsProps> = ({
  id,
  isLastMessage,
  responseContent,
  retriever_resources,
  isStreamCompleted,
  lastMessageId,
  conversationId,
  setConversation,
  setLastMessageId,
  setIsStreamingCompleted,
  setLoading,
}: ResponseOptionsProps) => {
  const [isClicked, setIsClicked] = useState<string>("");
  const [tempRating, setTempRating] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const [user] = useLocalStorage<User | null>("user", null);

  const handleClick = (option: string) => {
    if (isClicked === option) {
      setIsClicked("");
    } else {
      setIsClicked(option);
    }
  };

  const handleFeedBack = async (rating: any) => {
    setTempRating(rating);

    if (tempRating === rating) {
      await rateAlexisResponse(user?.id ?? "", id ?? "", null);
      setTempRating(null);
    } else {
      await rateAlexisResponse(user?.id ?? "", id ?? "", rating);
      setTempRating(rating);
    }
  };

  const options: any = [
    {
      description: "Like",
      icon: (
        <ThumbsUp
          size={18}
          color={tempRating === "like" ? "#8E4EC6" : "#402060"}
          weight={tempRating === "like" ? "fill" : "regular"}
        />
      ),
      onClick: () => handleFeedBack("like"),
    },
    {
      description: "Dislike",
      icon: (
        <ThumbsDown
          size={18}
          color={tempRating === "dislike" ? "#8E4EC6" : "#402060"}
          weight={tempRating === "dislike" ? "fill" : "regular"}
        />
      ),
      onClick: () => handleFeedBack("dislike"),
    },
    {
      description: "Sources",
      icon: (
        <BookmarksSimple
          size={18}
          color={isClicked === "Sources" ? "#8E4EC6" : "#402060"}
          weight={isClicked === "Sources" ? "fill" : "regular"}
        />
      ),
      onClick: () => handleClick("Sources"),
      content: (
        <ResponseSources
          setIsClicked={setIsClicked}
          retriever_resources={retriever_resources}
        />
      ),
    },
    isLastMessage && {
      description: "Preferences",
      icon: (
        <Gear
          size={18}
          color={isClicked === "Preferences" ? "#8E4EC6" : "#402060"}
          weight={isClicked === "Preferences" ? "fill" : "regular"}
        />
      ),
      onClick: () => handleClick("Preferences"),
      content: (
        <ResponsePreferences
          id={id}
          responseContent={responseContent}
          setIsClicked={setIsClicked}
          conversationId={conversationId}
          setIsStreamingCompleted={setIsStreamingCompleted}
          setConversation={setConversation}
          setLastMessageId={setLastMessageId}
          setLoading={setLoading}
        />
      ),
    },
  ];

  useEffect(() => {
    if (lastMessageId == id && isStreamCompleted) {
      setIsStreaming(false);
    }
    if (lastMessageId == id && !isStreamCompleted) {
      setIsStreaming(true);
    }
  }, [lastMessageId, isStreamCompleted]);

  return (
    <div className="flex flex-col gap-2 items-center h-fit pb-4 w-[30px] bg-purple-300 border-[1.5px] border-purple-700 rounded-full">
      {options.map((option: any, index: any) =>
        index == 3 && !isLastMessage ? null : (
          <DropdownMenu key={index}>
            {index == 2 && retriever_resources?.length == 0 ? null : (
              <DropdownMenuTrigger className="h-5">
                <TooltipButton
                  content={option.description}
                  side="right"
                  sideOffset={5}
                  className="font-medium text-mauve-1200 bg-white shadow-md border border-mauve-400 "
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="group hover:bg-transparent"
                    onClick={option.onClick}
                  >
                    {option.icon}
                  </Button>
                </TooltipButton>
              </DropdownMenuTrigger>
            )}
            {isClicked === option.description && option.content && (
              <DropdownMenuContent
                avoidCollisions
                side="right"
                align="start"
                alignOffset={-70}
              >
                {option.content}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )
      )}
    </div>
  );
};
