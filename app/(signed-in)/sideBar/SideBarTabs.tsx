"use client";

import React, { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SideBarItems from "./SideBarConstants";
import { ConversationsHistory } from "@/types/global";
import { getConversations } from "@/lib/api";
import ConversationItem from "@/components/chatHistoryUI/conversationItem";
import { EmptyHistory } from "@/components/chatHistoryUI/emptyHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRelativeDate } from "@/lib/helpers";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import HistoryTab from "./HistoryTab";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SideBarTabsProps {
  setActiveConversation: React.Dispatch<React.SetStateAction<any>>;
  ActiveConversation: string;
  NewestConversation: boolean;
}

export const SideBarTabs: React.FC<any> = () => {
  const pathname = usePathname();
  const [conversations, setConversations] =
    useState<ConversationsHistory | null>(null);

  const getPreviousConversationDate = (index: number) => {
    if (index === 0 || !conversations) return -1;
    return conversations.data[index - 1].created_at;
  };

  const router = useRouter();

  return (
    <>
      <Tabs defaultValue="Menu" className="md:w-52 w-full ">
        <TabsList className="mb-3 mt-8 w-full bg-purple-400">
          <TabsTrigger
            value="Menu"
            className="w-full  hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger
            value="History"
            className="w-full  hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100"
          >
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Menu" className=" w-full">
          <div className="flex flex-col my-2 ">
            {SideBarItems.map((item) => (
              <motion.div key={item.title} className="my-1 rounded-lg ">
                <Button
                  disabled={
                    !(item.title === "Discuss" || item.title === "Planner")
                  }
                  variant="ghost"
                  className="bg-transparent space-x-2 w-full justify-start -ml-2"
                  onClick={() => router.push(item.path)}
                >
                  {item.icon}
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      pathname.includes("/discussion") &&
                        item.title === "Discuss"
                        ? "text-purple-1100"
                        : "text-mauve-1100",
                    )}
                  >
                    {item.title}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
          <Separator orientation="horizontal" className=" bg-mauve-700 mt-4" />
        </TabsContent>
        <TabsContent value="History" className="w-full">
          <HistoryTab
            conversations={conversations}
            setConversations={setConversations}
            getPreviousConversationDate={getPreviousConversationDate}
            getRelativeDate={getRelativeDate}
            getConversations={getConversations}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
