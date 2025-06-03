"use client";

import React, { useState, useContext, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

import ChatBar from "@/components/chatUI/chatBar";
import PromptSuggestion from "@/components/chatUI/promptSuggestion";
import ChatLogo from "@/components/chatUI/chatLogo";
import ChatContainer from "@/components/chatUI/chatContainer";

// import { formatConversation } from "@/lib/utils";

// import { ChatMode } from "@/components/chatUI/chatBar";

import { Toaster } from "@/components/ui/toaster";
import { getConversationMessages } from "@/lib/api";
import { formatConversation } from "@/lib/utils";

export default function ChatWrapper({ discussionId }: any) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isStreamCompleted, setIsStreamCompleted] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string>("");
  const [retrievalError, setRetrievalError] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const data = await getConversationMessages(discussionId);
      const formattedData = formatConversation(data);
      setConversation(formattedData);
    };
    if (discussionId) {
      getData();
    }
    setRetrievalError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievalError]);

  useEffect(() => {
    localStorage.getItem("accessToken")
      ? setLoading(false)
      : router.push("/signIn");
  }, [router]);

  const params = useParams<{ id: string; topic: string }>();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  useEffect(() => {
    console.log("topic : ", topic);
  }, [topic]);

  return (
    <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
      <div className="w-full h-screen flex bg-mauve-100 justify-center   ">
        <div className="h-screen w-full md:max-w-2xl px-4 bg-mauve-100 flex flex-col  justify-end relative">
          {!conversation?.length && !params.id ? (
            <div key="chat_descr">
              <div
                className="w-full h-auto my-auto flex flex-col mb-20 justify-between items-center "
                key="Alexislogo"
              >
                <ChatLogo />
                <div className="flex flex-col gap-1 w-full items-center">
                  <h2 className="text-center text-2xl font-semibold text-mauve-900">
                    Discuss it with Alexis
                  </h2>
                  <p className="text-center text-sm w-2/3 text-mauve-800">
                    Discuss with Alexis to solve tricky problems or create quiz
                    questions, all tailored to your exam prep needs!
                  </p>
                </div>
              </div>
              {/* <PromptSuggestion
                  userId={user?.id ?? ""}
                  NewestConversation={NewestConversation}
                  setNewestConversation={setNewestConversation}
                  setLoading={setLoading}
                  setIsActiveChat={setIsActiveChat}
                /> */}
            </div>
          ) : (
            <ChatContainer
              loading={loading}
              setLoading={setLoading}
              ActiveConversation={discussionId ? discussionId : ""}
              setConversation={setConversation}
              conversation={conversation}
              isStreamCompleted={isStreamCompleted}
              setIsStreamCompleted={setIsStreamCompleted}
              lastMessageId={lastMessageId}
              setLastMessageId={setLastMessageId}
              setRetrievalError={setRetrievalError}
            />
          )}
          {/* {loading && <Loading />} */}
          <ChatBar
            loading={loading}
            setLoading={setLoading}
            conversation={conversation}
            setConversation={setConversation}
            isStreamCompleted={isStreamCompleted}
            setIsStreamCompleted={setIsStreamCompleted}
            lastMessageId={lastMessageId}
            setLastMessageId={setLastMessageId}
            plannerTopic={topic ?? null}
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-mauve-900 w-full text-center">
            This is a beta version, Alexis may produce innacurate information
            about facts.
          </span>
        </div>
      </div>
      <Toaster />
    </Suspense>
  );
}
