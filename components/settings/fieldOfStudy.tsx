import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Field } from "./librarySection";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";

import { Brain, NotePencil, Notepad } from "@phosphor-icons/react";

type Modes = "problemSolving" | "mcq" | "writing";

type FieldProps = {
  label: string;
  id: Field;
  onFieldClick: (id: Field) => void;
  checkedField: string | null;
  availableModes: Modes[];
  description: string;
};

export default function FieldOfStudy({
  label,
  id,
  onFieldClick,
  checkedField,
  availableModes,
  description,
}: FieldProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-between w-full border-[1px] border-mauve-500 rounded-md px-4 py-3 cursor-pointer hover:border-purple-700 transition-colors duration-200 ease-in-ou",
            checkedField === id && "border-purple-700"
          )}
          onClick={() => onFieldClick(id)}
        >
          <div className="flex flex-col w-3/4">
            <Label className="text-sm font-semibold text-mauve-1200 pointer-events-none select-none ">
              {label}
            </Label>
            <p className="text-xs text-mauve-1100 pointer-events-none select-none">
              Make changes to your profile here. Click save when you&apos;re done.
            </p>
          </div>
          <Checkbox checked={checkedField === id} id={id ?? ""} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="right" sideOffset={10}>
        <Label className="text-base font-semibold text-mauve-1200 pointer-events-none select-none">
          Description
        </Label>
        <p className="text-sm text-mauve-1100 pointer-events-none select-none mb-1">
          {description}
        </p>
        <Label className="text-base font-semibold text-mauve-1200 pointer-events-none select-none">
          Modes available
        </Label>
        <p className="text-sm text-mauve-1100 pointer-events-none select-none">
          These are the available modes in this section
        </p>
        <div className="flex mt-2 w-full flex-wrap gap-2">
          {availableModes.map((mode, index) => (
            <div
              className="flex items-center gap-1 bg-purple-300 border border-purple-800 rounded-md py-1 px-2 "
              key={index}
            >
              {mode === "mcq" && <NotePencil size={17} color="#793AAF" />}
              {mode === "problemSolving" && <Brain size={17} color="#793AAF" />}
              {mode === "writing" && <Notepad size={17} color="#793AAF" />}
              <span className="text-purple-1100 text-xs font-semibold">
                {mode === "mcq" && "QCM"}
                {mode === "problemSolving" && "Problem Solving"}
                {mode === "writing" && "Writing"}
              </span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
