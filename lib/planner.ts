import { Dispatch, SetStateAction } from "react";

export interface StudySession {
  time_slot: string;
  focus_topic: string;
  break: string;
}

export interface DailySchedule {
  day: string;
  date: string;
  study_sessions: StudySession[];
}

interface StudyPlan {
  time_period: string;
  daily_schedule: DailySchedule[];
}

export interface StudyPlanOutput {
  study_plan: StudyPlan;
}

export async function getStudyPlan(
  setPlan: Dispatch<SetStateAction<string | null>>,
  setIsCompleted: Dispatch<SetStateAction<boolean>>,
  timePeriod: string,
  workRange: string,
  restRange: string,
  subject: string,
) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer app-Ol5rB6kgn160O1GRQDbtvz3B");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    inputs: {
      time_period: timePeriod,
      work_range: workRange,
      rest_range: restRange,
      subject: subject,
    },
    query: "Give me my study plan",
    response_mode: "streaming",
    conversation_id: "",
    user: "user-123",
  });

  const requestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://dify.ccdev.space/v1/chat-messages", requestOptions).then(
    (res: any) => {
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
          setPlan((prev) => {
            return prev ? prev + str : str;
          });
        },
        (messageId: string) => {
          console.log("completed", messageId);
          setIsCompleted(true);
        },
      );
    },
  );

  return;
}

function cleanJsonString(jsonString: string): string {
  // Detect and remove Markdown JSON marks if present
  if (jsonString.startsWith("```json") && jsonString.endsWith("```")) {
    jsonString = jsonString.slice(7, -3).trim();
  }
  return jsonString;
}

export function parseStudyPlan(jsonString: string): StudyPlanOutput | null {
  try {
    // Clean the JSON string from any markdown marks
    const cleanString = cleanJsonString(jsonString);

    // Parse the cleaned JSON string
    const parsedObject: StudyPlanOutput = JSON.parse(cleanString);

    // Return the parsed object
    return parsedObject;
  } catch (error) {
    console.error("Invalid JSON string provided:", error);
    return null;
  }
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
