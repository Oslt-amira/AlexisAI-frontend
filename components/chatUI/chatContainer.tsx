import React, { useEffect, useRef} from "react";
import UserMessage from "./userMessage";
import AlexisResponse from "./AlexisResponse";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";


type ChatContainerProps = {
  conversation: ConversationMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  ActiveConversation: string;
  loading: any;
  isStreamCompleted: boolean;
  setIsStreamCompleted: React.Dispatch<React.SetStateAction<any>>;
  lastMessageId: string;
  setLastMessageId: React.Dispatch<React.SetStateAction<string>>;
  setRetrievalError: React.Dispatch<React.SetStateAction<boolean>>
};

export default function ChatContainer({
  conversation,
  setConversation,
  setLoading,
  ActiveConversation,
  loading,
  isStreamCompleted,
  setIsStreamCompleted,
  lastMessageId,
  setLastMessageId,
  setRetrievalError
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // scroll to the bottom of the chat when conversation changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, [conversation]);
  
  useEffect(() => {
    if(!conversation){
      router.replace("/not-found")
    }
    const emptyMessage = conversation?.find(message => !message.content);

    if (emptyMessage) {
      setRetrievalError(true);
    } 
  }, [conversation]);

  return (
    <ScrollArea type="scroll" >
      <div
        ref={scrollRef}
        key={"chatContainer"}
        className={`h-full w-full  flex flex-col gap-4 ${
          loading ? "pb-14" : "pb-24"
        } px-2 pt-4 mb-2`}
      >
        {conversation &&
          conversation.map((message, index) => {
            const content = message.content || message.agent_thoughts?.[0]?.thought;
            return (
              <div key={index}>
                {message.role === "user" ? (
                  <UserMessage
                    message={ message.content}
                    date={message.date}
                    mode={null}
                    files={null}
                    ref={
                      index == conversation.length - 1 ? lastMessageRef : null
                    }
                  />
                ) : message.role === "alexis" && content? (
                  <AlexisResponse
                    content={content}
                    created_at={message.date}
                    file={null}
                    mode={null}
                    setLoading={setLoading}
                    isLastMessage={index === conversation.length - 1}
                    ref={
                      index == conversation.length - 1 ? lastMessageRef : null
                    }
                    id={message.id}
                    retriever_resources={message.retriever_resources}
                    isStreamCompleted={isStreamCompleted}
                    lastMessageId={lastMessageId}
                    conversationId={message.conversationId ?? ""}
                    setConversation={setConversation}
                    setLastMessageId={setLastMessageId}
                    setIsStreamingCompleted={setIsStreamCompleted}
                  />
                ) : null}
              </div>
            );
          })}

        {loading && <Skeleton className="h-4 w-[250px] mt-4 bg-mauve-400" />}
      </div>

    </ScrollArea>
  );
}
