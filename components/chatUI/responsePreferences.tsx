"use client";

import {
  ArrowsCounterClockwise,
  Gear,
  Minus,
  Plus,
} from "@phosphor-icons/react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { regenerateResponse, showMoreOrLessDetails } from "@/lib/api";
import { useLocalStorage } from "@uidotdev/usehooks";
import { getResponseFromAlexis } from "@/lib/utils";

type ResponsePreferencesProps = {
  id: string | null;
  responseContent: string;
  setIsClicked: React.Dispatch<React.SetStateAction<any>>;
  conversationId: string;
  setConversation: any;
  setLastMessageId: any;
  setIsStreamingCompleted: any;
  setLoading: any;
};

export const ResponsePreferences: React.FC<ResponsePreferencesProps> = ({
  id,
  responseContent,
  setIsClicked,
  conversationId,
  setConversation,
  setLastMessageId,
  setIsStreamingCompleted,
  setLoading,
}) => {
  // const [userId, setUserId] = useState("");
  const [loadingResponse, setloadingResponse] = useState(false);

  const [user] = useLocalStorage<User | null>("user", null);

  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleOutSideClick = (event: { target: any }) => {
      if (!ref.current?.contains(event.target)) {
        setIsClicked("");
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref, setIsClicked]);

  const handleDetails = async (Preference: string) => {
    setloadingResponse(true);
    setLoading(true);
    await getResponseFromAlexis(
      user?.id ?? "",
      conversationId ?? "",
      user?.currentFieldOfStudy ?? "",
      setLoading,
      setConversation,
      `${
        Preference === "more" ? "developpe" : "résume"
      } votre dernière réponse`,
      setIsStreamingCompleted,
      setLastMessageId
    );
    setloadingResponse(false);
  };
  const regenerate = async () => {
    setloadingResponse(true);
    setLoading(true);
    await getResponseFromAlexis(
      user?.id ?? "",
      conversationId ?? "",
      user?.currentFieldOfStudy ?? "",
      setLoading,
      setConversation,
      `regenerate this message differently : ${responseContent}`,
      setIsStreamingCompleted,
      setLastMessageId
    );

    setloadingResponse(false);
  };

  return (
    <div ref={ref} className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-start gap-2 py-2">
        <div className="bg-purple-400 p-1 flex justify-center items-center rounded-sm ml-[-5px]">
          <Gear size={16} color="#8E4EC6" weight="fill" />
        </div>
        <span className="font-semibold text-xs select-none text-mauve-1200 ">
          Preferences
        </span>
      </div>
      <Separator orientation="horizontal" className="bg-mauve-400" />

      <div className="flex flex-col justify-center mt-1 ">
        <Button
          variant="ghost"
          disabled={loadingResponse}
          className="hover:bg-mauve-300 justify-start "
          onClick={regenerate}
        >
          <div className=" group cursor-pointer hover:cursor-pointer flex flex-row gap-2 items-center ">
            <ArrowsCounterClockwise size={18} color="#65636D" weight="fill" />
            <span className="font-medium text-xs select-none text-mauve-120">
              Regenerate
            </span>
          </div>
        </Button>
        <Button
          variant="ghost"
          disabled={loadingResponse}
          className="hover:bg-mauve-300"
          onClick={() => handleDetails("more")}
        >
          <div className="group cursor-pointer hover:cursor-pointer flex flex-row gap-2 items-center">
            <Plus size={18} color="#65636D" />
            <span className="font-medium text-xs select-none text-mauve-120">
              More details
            </span>
          </div>
        </Button>
        <Button
          variant="ghost"
          disabled={loadingResponse}
          className="hover:bg-mauve-300"
          onClick={() => handleDetails("less")}
        >
          <div className=" group cursor-pointer hover:cursor-pointer flex flex-row gap-2 items-center">
            <Minus size={18} color="#65636D" />
            <span className="font-medium text-xs select-none text-mauve-120">
              Less details
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};
