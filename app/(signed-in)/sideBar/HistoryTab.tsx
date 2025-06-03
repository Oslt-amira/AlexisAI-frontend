"use client";

import ConversationItem from "@/components/chatHistoryUI/conversationItem";
import { EmptyHistory } from "@/components/chatHistoryUI/emptyHistory";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "@phosphor-icons/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getConversations } from "@/lib/api";
import Link from "next/link";
import { ConversationsHistory, GeneralConversationInfo } from "@/types/global";
import { getRelativeDate } from "@/lib/helpers";
import { useParams } from "next/navigation";
import ConversationSkeleton from "@/app/conversationSkeleton";
import { useLocalStorage } from "usehooks-ts";

type HistoryTabProps = {
  startNewChat: () => void;
  conversations: any;
  setConversations: any;
  getPreviousConversationDate: (index: number) => number;
  getRelativeDate: (timestamp: number) => string;
  selectConversation: (conversationId: string) => void;
  ActiveConversation: string;
  getConversations: any;
};

export default function HistoryTab({}: any) {
  const { toast } = useToast();
  const [conversations, setConversations] =
    useState<ConversationsHistory | null>(null);
  const params = useParams<{ id: string }>();
  const [triggerRetrieval, setTriggerRetrieval] = useState<boolean>(false);
  const [loadingData, setloadingData] = useState<boolean>(false);
  const [user, setUser, removeUser] = useLocalStorage<User | any | null>(
    "user",
    null
  );
  useEffect(() => {
    if (
      params.id != null &&
      !conversations?.data
        .map((conversation: GeneralConversationInfo) => conversation.id)
        .includes(params.id)
    ) {
      setTriggerRetrieval(true);
    } else {
      setTriggerRetrieval(false);
    }
  }, [params.id]);

  const getUserConversations = async () => {
    try {
      setloadingData(true);
      const response = await getConversations();
      if (response.data.data) {
        setConversations(response.data);
      }
      setloadingData(false);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          "We couldn't retrieve your conversation history .Try again later.",
      });
    }
  };
  useEffect(() => {
    if (triggerRetrieval || !conversations || user.currentFieldOfStudy) {
      getUserConversations();
    }

    // const groupedConversations = conversations?.data.reduce(
    //   (acc: any, curr: any) => ({
    //     ...acc,
    //     [moment(curr.created_at * 1000).format("MMMM DD, YYYY")]: [
    //       ...(acc[moment(curr.created_at * 1000).format("MMMM DD, YYYY")] ||
    //         []),
    //       curr,
    //     ],
    //   }),
    //   {}
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.currentFieldOfStudy,triggerRetrieval]);
  const getPreviousConversationDate = (index: number) => {
    if (index === 0 || !conversations) return -1;
    return conversations.data[index - 1].created_at;
  };

  return (
    <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
      <div className="flex flex-col w-full gap-5">
        <Button
          variant="outline"
          asChild
          className=" group hover:bg-mauve-300/90 shadow-none hover:bg-purple-300 space-x-2 py-1.5 w-full bg-white  justify-start h-9 border-[1px] border-mauve-700 hover:border-purple-800"
        >
          <Link href="/discussion">
            <Plus
              size={20}
              color="#8E8C99"
              className="group-hover:fill-purple-1100 fill-mauve-900"
            />
            <span className="font-medium text-sm  text-mauve-900 group-hover:text-purple-1100">
              New chat
            </span>
          </Link>
        </Button>
        {loadingData && <ConversationSkeleton />}
        {conversations && conversations.data.length > 0 ? (
          <div className="w-full h-full">
            <ScrollArea type="scroll">
              <div className="h-auto flex flex-col gap-1  max-h-[60vh] animate-transition ">
                {conversations.data.map((conversation: any, index: any) => (
                  <div key={index} className=" flex flex-col   ">
                    {(index === 0 ||
                      (index > 0 &&
                        getPreviousConversationDate(index) !== -1 &&
                        getRelativeDate(getPreviousConversationDate(index)) !==
                          getRelativeDate(conversation.created_at))) && (
                      <span className="font-semibold text-mauve-1100 text-sm mt-6 py-1 ">
                        {getRelativeDate(conversation.created_at)}
                      </span>
                    )}

                    <ConversationItem
                      conversation={conversation}
                      conversations={conversations}
                      setConversations={setConversations}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          !loadingData && <EmptyHistory />
        )}
      </div>
    </Suspense>
  );
}
