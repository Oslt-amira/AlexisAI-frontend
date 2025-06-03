"use client";

import { BookmarksSimple } from "@phosphor-icons/react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useEffect, useRef } from "react";
import { removeDuplicateSources } from "@/lib/utils";

type ResponseSourcesProps = {
  setIsClicked: React.Dispatch<React.SetStateAction<any>>;
  retriever_resources: any;
};

export const ResponseSources: React.FC<ResponseSourcesProps> = ({
  setIsClicked,
  retriever_resources,
}) => {
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
  

  return (
    <div
      ref={ref}
      className=" flex flex-col  justify-start p-2 gap-3 pb-3 max-w-[200px]"
    >
      <div className="flex flex-row items-center justify-start gap-1.5">
        <div className="bg-purple-400 p-1 flex justify-center items-center rounded-sm ">
          <BookmarksSimple size={16} color="#8E4EC6" weight="fill" />
        </div>
        <span className="font-medium text-sm select-none text-mauve-1200 ">
          Sources
        </span>
      </div>

      <span className="font-regular text-xs select-none text-mauve-1000 ">
        This response was retrieved from these sources :
      </span>
      <ScrollArea className="h-full w-full">
        {retriever_resources &&
          retriever_resources?.map((source: any, index: any) => (
            <div key={index} className="flex flex-col gap-1">
              <h4 className="text-sm font-base  text-mauve-1200">
                {source?.document_name.replace(".pdf", "")}
              </h4>
              {index !== retriever_resources.length - 1 ? (
                <Separator
                  orientation="horizontal"
                  className="my-1.5 bg-mauve-400"
                />
              ) : null}
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};
