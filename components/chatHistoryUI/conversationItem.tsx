import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChatCircleText,
  DotsThree,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { Variants, motion } from "framer-motion";
import { ConversationsHistory, GeneralConversationInfo } from "@/types/global";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Card, CardContent } from "../ui/card";
import ConversationSettingsDialog from "./conversationSettingsDialog";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface ConversationItemProps {
  conversation: GeneralConversationInfo;
  conversations: ConversationsHistory;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationsHistory | null>
  >;
}

const ConversationItem: React.FC<any> = ({
  conversation,
  conversations,
  setConversations,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams<{ id: string }>();

  const isSelected = conversation.id === params.id;

  return (
    <div className="flex flex-row group justify-between   ">
      <Button
        variant="ghost"
        asChild
        className="relative p-0 gap-1 h-fit  max-w-[180px] bg-transparent group-hover:bg-transparent content-center flex  my-1 "
      >
        <Link href={`/discussion/${conversation.id}`}>
          <ChatCircleText
            size={24}
            color="#BCBAC7"
            className={`group-hover:fill-purple-1100 w-6 h-6  place-self-start ${
              isSelected ? "fill-purple-1100" : "fill-mauve-800 "
            }`}
          />
          <span
            className={`text-sm group-hover:text-purple-1100 w-44 overflow-hidden text-ellipsis h-fit  truncate ${
              isSelected ? "text-purple-1100" : "text-mauve-800 "
            } text-left text-wrap `}
          >
            {conversation.name}
          </span>
        </Link>
      </Button>
      <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <PopoverTrigger>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className=" bg-transparent group-hover:bg-transparent place-self-center "
            >
              <DotsThree
                size={20}
                color="#BCBAC7"
                weight="bold"
                className={`  group-hover:fill-purple-1100 group-hover:opacity-100 `}
              />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          hideWhenDetached={true}
          className="z-50 ml-1"
          sideOffset={-12}
          align="start"
        >
          <Card>
            <CardContent className="flex flex-col gap-1 w-full py-2 px-1 ">
              <ConversationSettingsDialog
                conversation={conversation}
                action="rename"
                conversations={conversations}
                setConversations={setConversations}
                setIsOpen={setIsOpen}
              >
                <Button
                  variant="ghost"
                  className=" space-x-3 px-2 mb-2 w-36 group/rename bg-white hover:bg-white justify-start h-8"
                >
                  <PencilSimple
                    size={16}
                    color="#65636D"
                    className={`  group-hover/rename:fill-purple-1100  `}
                  />

                  <span className="text-sm group-hover/rename:text-purple-1100  text-mauve-1100">
                    Rename
                  </span>
                </Button>
              </ConversationSettingsDialog>
              <ConversationSettingsDialog
                conversation={conversation}
                action="delete"
                conversations={conversations}
                setConversations={setConversations}
                setIsOpen={setIsOpen}
              >
                <Button
                  variant="ghost"
                  className=" space-x-3 px-2 group/delete  w-36  bg-white hover:bg-white justify-start h-8"
                >
                  <TrashSimple
                    size={16}
                    color="#65636D"
                    className={`  group-hover/delete:fill-purple-1100  `}
                  />

                  <span className="  text-sm group-hover/delete:text-purple-1100 text-mauve-1100">
                    Delete
                  </span>
                </Button>
              </ConversationSettingsDialog>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ConversationItem;
