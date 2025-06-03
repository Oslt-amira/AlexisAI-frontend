"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { PaperPlaneTilt, X, XCircle } from "@phosphor-icons/react";
import ChatModeBtn from "./chatModeBtn";
import TextArea from "./textArea";
import FileInputBtn from "./fileInputBtn";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  getAPIKey,
  getLastConversationMessage,
  getResponseFromAlexis,
} from "@/lib/utils";
import { getConversationRemakers } from "@/lib/utils";

import { uploadFileToDify } from "@/lib/api";
import { useLocalStorage } from "usehooks-ts";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export type IOnData = (
  message: string,
  isFirstMessage: boolean,
  moreInfo: any,
) => void;
export type IOnThought = (though: any) => void;
export type IOnFile = (file: any) => void;
export type IOnMessageEnd = (messageEnd: any) => void;
export type IOnMessageReplace = (messageReplace: any) => void;
export type IOnAnnotationReply = (messageReplace: any) => void;
export type IOnCompleted = (hasError?: boolean) => void;
export type IOnError = (msg: string, code?: string) => void;

export type ChatMode = "problemSolving" | "mcq" | "writing" | null;
type ChatBarProps = {
  userId: string;
  loading: any;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  setIsActiveChat: React.Dispatch<React.SetStateAction<any>>;
  conversation: ConversationMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
  currentFieldOfStudy: string;
  isStreamCompleted: boolean;
  setIsStreamCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};

function unicodeToChar(text: string) {
  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

export default function ChatBar({
  loading,
  setLoading,
  conversation,
  setConversation,
  isStreamCompleted,
  setIsStreamCompleted,
  lastMessageId,
  setLastMessageId,
  plannerTopic,
}: any) {
  const [tempPrompt, setTempPrompt] = useState<string>("");
  const [chatMode, setChatMode] = useState<ChatMode>(null);
  const [files, setFiles] = useState<File[] | null>([]);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [conversationRemakers, setConversationRemakers] = useState<string[]>(
    [],
  );

  const [isRemakersUpdated, setIsRemakersUpdated] = useState<boolean>(false);

  const [user] = useLocalStorage<User | null>("user", null);

  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (conversation?.length == 2 && !params.id && isStreamCompleted) {
      router.push(`/discussion/${conversation[1].conversationId}`, {
        scroll: false,
      });
    }
  }, [conversation]);

  useEffect(() => {
    const getRemakers = async (messageId: string) => {
      const response: any = await getConversationRemakers(
        user?.id ?? "",
        messageId,
        user?.currentFieldOfStudy ?? "",
      );
      setConversationRemakers(response);
    };
    if (
      conversation?.length > 1 &&
      conversation[conversation.length - 1].role == "alexis" &&
      params.id &&
      !isRemakersUpdated
    ) {
      getRemakers(conversation[conversation.length - 1].id);
      setIsRemakersUpdated(true);
    }
    // Remove duplicate messages from conversation
    const uniqueMessages = conversation?.reduce((acc: any, current: any) => {
      const duplicateResource = acc.find(
        (item: any) =>
          (item.id === current.id && item.role === current.role) ||
          current.content ===
            `regenerate this message differently : ${item.content}` ||
          current.content === `regenerate this message : ${item.content}` ||
          current.content === `résume votre dernière réponse` ||
          current.content === `developpe votre dernière réponse`,
      );
      if (!duplicateResource) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    if (conversation?.length > uniqueMessages?.length) {
      setConversation(uniqueMessages);
    }
  }, [conversation]);

  // get the sources of the last message
  useEffect(() => {
    const getSources = async () => {
      const lastResponseData = await getLastConversationMessage(
        user?.currentFieldOfStudy ?? "",
        params.id ?? "",
        user?.id ?? "",
      );
      let resources = lastResponseData?.retriever_resources;

      const query = lastResponseData?.query;
      if (
        query ===
        `C'est quoi une équation différentielle scalaire linéaire d’ordre n ?`
      ) {
        resources = [
          {
            document_name: "Cours Equ Diff Linéaire.pdf",
          },
        ];
      }
      if (query === `Comment calculer la somme des 2 matrices ?`) {
        resources = [
          {
            document_name: "Cours Reduction.pdf",
          },
          {
            document_name: "Cours Espace prehilbertien.pdf",
          },
        ];
      }

      if (query === `Quels sont les types de diabète ?`) {
        resources = [
          {
            document_name: "20-diabete residanat 15-mai-2022.pdf",
          },
        ];
      }
      if (query === `Describe the lymphatic drainage system of the breast`) {
        resources = [
          {
            document_name: "14 cancer du sein2020 .pdf",
          },
        ];
      }
      if (query === `ماهي مصادر الالتزام`) {
        resources = [
          {
            document_name:
              "قانون-عدد-40-لسنة-1972-مؤرخ-في-أول-جــــوان-1972.pdf",
          },
        ];
      }
      if (query === `ما هي الإجراءات المعقولة للتحقق من الهوية؟`) {
        resources = [
          {
            document_name:
              "قانون-عدد-40-لسنة-1972-مؤرخ-في-أول-جــــوان-1972.pdf",
          },
        ];
      }

      setConversation((prevConversation: ConversationMessage[]) => {
        const lastMessage = prevConversation[prevConversation.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          retriever_resources: resources,
        };
        prevConversation[prevConversation.length - 1] = updatedLastMessage;

        // Return the updated conversation array
        return [...prevConversation];
      });
    };

    if (isStreamCompleted && lastMessageId !== "") {
      getSources();
    }
  }, [isStreamCompleted]);

  async function uploadFile(file: File) {
    const response = await uploadFileToDify(file, "ImageUploadTest");
    return response.data.id;
  }

  const handleFileRemove = (fileindex: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...(prevFiles ?? [])];
      updatedFiles.splice(fileindex, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (plannerTopic) {
      handleSubmit(
        `I want to learn about ${plannerTopic.replace(/-/g, " ")} give me a detailed plan`,
      );
    }
  }, [plannerTopic]);

  async function handleSubmit(query?: string) {
    let uploadedFiles: any[] = [];
    if (files && files.length > 0) {
      const uploadedFileIds = await Promise.all(
        Array.from(files).map((file) => uploadFile(file)),
      );
      uploadedFiles = uploadedFileIds.map((id) => ({ id }));
    }

    if (tempPrompt || query) {
      const prompt = query ? query : tempPrompt;
      console.log("prompt", prompt);
      if (conversation && conversation.length == 0 && !params.id) {
        setConversation([
          {
            id: (1).toString(),
            role: "user",
            content: tempPrompt,
            date: new Date().getTime() / 1000,
          },
        ]);
      } else {
        setConversation((prevConversation: ConversationMessage[]) => {
          if (
            prevConversation.find(
              (message) =>
                message.id === (prevConversation.length + 1).toString() &&
                message.role === "user",
            )
          ) {
            return prevConversation;
          }
          return [
            ...prevConversation,
            {
              id: (prevConversation.length + 1).toString(),
              role: "user",
              content: tempPrompt,
              date: new Date().getTime() / 1000,
            },
          ];
        });
      }

      setIsRemakersUpdated(false);

      if (isStreamCompleted) {
        setIsStreamCompleted(false);
      }
      setTempPrompt("");
      setLoading(true);

      await getResponseFromAlexis(
        user?.id ?? "",
        params.id ?? "",
        user?.currentFieldOfStudy ?? "",
        setLoading,
        setConversation,
        prompt,
        setIsStreamCompleted,
        setLastMessageId,
      );
      if (!params.id) {
      }

      const lastResponseData = await getLastConversationMessage(
        user?.currentFieldOfStudy ?? "",
        params.id ?? "",
        user?.id ?? "",
      );
      const resources = lastResponseData?.retriever_resources;

      setConversation((prevConversation: ConversationMessage[]) => {
        const lastMessage = prevConversation[prevConversation.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          retriever_resources: resources,
        };

        prevConversation[prevConversation.length] = updatedLastMessage;

        // Return the updated conversation array
        return [...prevConversation];
      });
    } else {
    }

    if (files) setFiles(null);
  }

  async function handleRemakerSubmit(prompt: string) {
    setConversation((prevConversation: ConversationMessage[]) => [
      ...prevConversation,
      {
        id: (prevConversation.length + 1).toString(),
        role: "user",
        content: prompt,
        date: new Date().getTime() / 1000,
      },
    ]);
    setIsRemakersUpdated(false);
    setLoading(true);
    await getResponseFromAlexis(
      user?.id ?? "",
      params.id ?? "",
      user?.currentFieldOfStudy ?? "",
      setLoading,
      setConversation,
      prompt,
      setIsStreamCompleted,
      setLastMessageId,
    );
    if (!params.id) {
    }
  }

  return (
    <form
      className=" bg-transparent w-full mb-20"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="bg-transparent relative h-0 mt-1  ">
        <div className=" absolute bottom-0 h-auto max-h-fit z-10  left-0 w-[90vw] sm:w-full flex sm:justify-center sm:items-center gap-2 py-3 sm:flex-wrap  overflow-x-scroll flex-row">
          {conversationRemakers?.length > 0 &&
            conversationRemakers?.map((remaker, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => {
                  handleRemakerSubmit(remaker);
                }}
              >
                {remaker}
              </Button>
            ))}
        </div>
      </div>

      <div className=" relative h-min max-h-min gap-3   px-5 pb-4 flex flex-col w-full bg-white border-2 border-mauve-500 rounded-2xl shadow-xl">
        <div className="flex gap-4 items-center">
          {files && files?.length > 0 && !isFileLoading && (
            <div
              className={`${
                files.length > 3
                  ? "grid grid-cols-3 gap-2 "
                  : " flex flex-row gap-2 "
              }`}
            >
              {files &&
                files.map((file, Fileindex) => (
                  <div
                    key={file.name}
                    className={`${
                      files.length > 3 ? "h-8 w-8 mt-1" : " h-12 w-14 mt-2 "
                    }   bg-purple-400 border-[1.5px] border-purple-600 rounded-sm flex items-center  group cursor-pointer hover:cursor-pointer  `}
                  >
                    <Button
                      className={`${
                        files.length > 3
                          ? " left-10 -ml-4"
                          : "  left-12 -ml-1  "
                      }  relative bottom-1/2 bg-transparent w-5 h-5 px-1 opacity-0 group-hover:opacity-100 group-hover:bg-transparent  rounded-full  `}
                      size="icon"
                      variant="outline"
                      onClick={() => handleFileRemove(Fileindex)}
                    >
                      <X color="#793AAF" size={18} />
                    </Button>
                    <span className="text-purple-1100 text-xs font-medium text-center ">
                      {file &&
                        "." +
                          file.name.split(".")[file.name.split(".").length - 1]}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {isFileLoading && (
            <div className="h-12 w-14 mt-3 bg-purple-400 border-[1.5px] border-purple-600 rounded-sm flex items-center justify-center">
              <ReloadIcon className=" h-4 w-4 animate-spin" color="#793AAF" />
            </div>
          )}
          <TextArea
            prompt={tempPrompt}
            setPrompt={setTempPrompt}
            chatMode={chatMode}
            setChatMode={setChatMode}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="w-full h-auto flex justify-between items-end">
          <div className="flex gap-2 items-end">
            <FileInputBtn
              files={files}
              setFiles={setFiles}
              setIsFileLoading={setIsFileLoading}
            />
            <div className="h-8 w-[1.5px] bg-mauve-700"></div>
            <ChatModeBtn
              mode="problemSolving"
              ismodeSelected={chatMode === "problemSolving"}
              setIsModeSelected={(value) =>
                value ? setChatMode("problemSolving") : setChatMode(null)
              }
            />
            <ChatModeBtn
              mode="mcq"
              ismodeSelected={chatMode === "mcq"}
              setIsModeSelected={(value) =>
                value ? setChatMode("mcq") : setChatMode(null)
              }
            />
            <ChatModeBtn
              mode="writing"
              ismodeSelected={chatMode === "writing"}
              setIsModeSelected={(value) =>
                value ? setChatMode("writing") : setChatMode(null)
              }
            />
          </div>
          <Button
            size="icon"
            disabled={loading}
            className="bg-purple-900 hover:bg-purple-900/90 "
            onClick={() => handleSubmit()}
          >
            <PaperPlaneTilt size={20} weight="fill" color="white" />
          </Button>
        </div>
      </div>
    </form>
  );
}
