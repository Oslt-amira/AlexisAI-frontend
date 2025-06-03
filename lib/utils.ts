import { metadata } from "@/app/layout";
import { type ClassValue, clsx } from "clsx";
import { unique } from "next/dist/build/utils";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConversation(conversation: Conversation) {
  const formattedConversation: ConversationMessage[] =
    conversation?.data?.flatMap((interaction: Interaction) => {
      let uniqueResources: any = [];
      if (
        interaction?.retriever_resources &&
        interaction?.retriever_resources.length > 1
      ) {
        uniqueResources = interaction?.retriever_resources.filter(
          (obj: any, index: number, self: any) =>
            index ===
            self.findIndex((t: any) => t.document_id === obj.document_id),
        );
      }
      return [
        {
          id: interaction.id,
          role: "user",
          content: interaction.query,
          date: interaction.created_at,
          conversationId: interaction.conversation_id,
        },
        {
          id: interaction.id,
          role: "alexis",
          content:
            interaction.answer || interaction.agent_thoughts?.[0]?.thought,
          date: interaction.created_at,
          retriever_resources:
            uniqueResources.length > 0
              ? uniqueResources
              : interaction.retriever_resources,
          conversationId: interaction.conversation_id,
          agent_thoughts: interaction.agent_thoughts,
        },
      ];
    });
  return formattedConversation;
}

export function getAPIKey(field: string) {
  let apiKey = "";
  switch (field) {
    case "médecine":
      apiKey = process.env.NEXT_PUBLIC_DIFY_MED_KEY ?? "";
      break;
    case "droits":
      apiKey = process.env.NEXT_PUBLIC_DIFY_LAW_KEY ?? "";
      break;
    case "prepa":
      apiKey = process.env.NEXT_PUBLIC_DIFY_STEM_KEY ?? "";
      break;
    default:
      throw new Error();
  }
  return apiKey;
}

function unicodeToChar(text: string) {
  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

const handleStream = (
  response: Response,
  onData: any,
  onCompleted?: any,
  onThought?: any,
  onMessageEnd?: any,
  onMessageReplace?: any,
  onFile?: any,
) => {
  if (!response.ok) throw new Error("Network response was not ok");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let bufferObj: Record<string, any>;
  let isFirstMessage = true;
  let messageId = "";
  function read() {
    let hasError = false;

    reader?.read().then((result: any) => {
      if (result.done) {
        onCompleted && onCompleted(messageId);
        return;
      }
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split("\n");
      try {
        lines.forEach((message) => {
          if (message.startsWith("data: ")) {
            // check if it starts with data:
            try {
              bufferObj = JSON.parse(message.substring(6)) as Record<
                string,
                any
              >; // remove data: and parse as json
            } catch (e) {
              // mute handle message cut off
              onData("", isFirstMessage, {
                conversationId: bufferObj?.conversation_id,
                messageId: bufferObj?.message_id,
                created_at: bufferObj?.created_at,
                metadata: bufferObj,
              });

              return;
            }
            if (bufferObj.status === 400 || !bufferObj.event) {
              onData("", false, {
                conversationId: undefined,
                messageId: "",
                errorMessage: bufferObj?.message,
                errorCode: bufferObj?.code,
              });
              hasError = true;
              onCompleted?.(true);
              return;
            }
            if (
              bufferObj.event === "message" ||
              bufferObj.event === "agent_message"
            ) {
              // can not use format here. Because message is splited.
              onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
                conversationId: bufferObj.conversation_id,
                taskId: bufferObj.task_id,
                messageId: bufferObj.id,
                created_at: bufferObj?.created_at,
              });
              isFirstMessage = false;
              if (messageId === "") {
                messageId = bufferObj?.message_id;
              }
            } else if (bufferObj.event === "agent_thought") {
              onThought?.(bufferObj as any);
            } else if (bufferObj.event === "message_file") {
              onFile?.(bufferObj as any);
            } else if (bufferObj.event === "message_end") {
              onMessageEnd?.(bufferObj as any);
            } else if (bufferObj.event === "message_replace") {
              onMessageReplace?.(bufferObj as any);
            }
          }
        });
        buffer = lines[lines.length - 1];
      } catch (e) {
        onData("", false, {
          conversationId: undefined,
          messageId: "",
          errorMessage: `${e}`,
        });
        hasError = true;
        onCompleted?.(true);
        return;
      }
      if (!hasError) read();
    });
  }
  read();
};

export async function getResponseFromAlexis(
  userId: string,
  conversationId: string,
  currentFieldOfStudy: string,
  setLoading: any,
  setConversation: any,
  prompt: string,
  setIsStreamCompleted: any,
  setLastMessageId: any,
) {
  console.log(getAPIKey(currentFieldOfStudy ?? ""));
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${getAPIKey(currentFieldOfStudy ?? "")}`,
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    inputs: {},
    query: prompt,
    response_mode: "streaming",
    conversation_id: conversationId ?? "",
    user: userId,
  });

  const requestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://dify.ccdev.space/v1/chat-messages", requestOptions)
    .then((res: any) => {
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        // eslint-disable-next-line no-new
        new Promise(() => {
          res.json().then((data: any) => {});
        });

        return;
      }
      return handleStream(
        res,
        (str: string, isFirstMessage: boolean, moreInfo: any) => {
          if (isFirstMessage) {
            setLoading(false);
            setConversation((prevConversation: ConversationMessage[]) => [
              ...prevConversation,
              {
                id: moreInfo.messageId,
                role: "alexis",
                content: str,
                date: moreInfo.created_at,
                conversationId: moreInfo.conversationId,
                metadata: moreInfo.metadata,
              },
            ]);
          } else {
            setConversation((prevConversation: ConversationMessage[]) => {
              const lastMessage = prevConversation[prevConversation.length - 1];
              const updatedLastMessage = {
                ...lastMessage,
                content: lastMessage.content + str,
              };

              prevConversation[prevConversation.length - 1] =
                updatedLastMessage;

              // Return the updated conversation array
              return [...prevConversation];
            });
          }
        },
        (messageId: string) => {
          setIsStreamCompleted(true);
          setLastMessageId(messageId);
        },
      );
    })
    .catch((e) => console.log(e));
}

export async function getLastConversationMessage(
  currentFieldOfStudy: string,
  conversationId: string,
  userId: string,
) {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${getAPIKey(currentFieldOfStudy ?? "")}`,
  );

  const requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `https://dify.ccdev.space/v1/messages?user=${userId}&conversation_id=${conversationId}&limit=1`,
    requestOptions,
  )
    .then((response) => response.text())
    .then((result) => {
      const retriever_resources =
        JSON.parse(result)?.data[0]?.retriever_resources;
      const uniqueResources = retriever_resources?.filter(
        (obj: any, index: number, self: any) =>
          index ===
          self.findIndex((t: any) => t.document_id === obj.document_id),
      );
      const filteredResult = JSON.parse(result).data[0];
      if (filteredResult && filteredResult.retriever_resources) {
        filteredResult.retriever_resources = uniqueResources;
        return filteredResult;
      }
      return filteredResult;
    })
    .catch((error) => console.log(error));
}

export function removeDuplicateSources(retriever_resources: any): any {
  const uniqueResources = retriever_resources?.reduce(
    (acc: any, current: any) => {
      const duplicateResource = acc.find(
        (item: any) => item.document_name === current.document_name,
      );
      if (!duplicateResource) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    },
    [],
  );
  return uniqueResources;
}

export async function getConversationRemakers(
  userId: string,
  messageId: string,
  currentFieldOfStudy: string,
) {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${getAPIKey(currentFieldOfStudy ?? "")}`,
  );

  myHeaders.append("Content-Type", "application/json");

  const requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `https://dify.ccdev.space/v1/messages/${messageId}/suggested?user=${userId}`,
    requestOptions,
  )
    .then((response) => response.text())
    .then((result) => JSON.parse(result).data)
    .catch((error) => console.error(error));
}
