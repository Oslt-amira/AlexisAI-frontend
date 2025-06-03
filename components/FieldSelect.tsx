import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { HeartIcon, ReaderIcon, RocketIcon } from "@radix-ui/react-icons";

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ value, onChange }) => {
  return (
    <Select onValueChange={onChange} >
      <SelectTrigger>
        <SelectValue placeholder="Select a field" />
      </SelectTrigger>
      <SelectContent >
        <SelectItem value="Medical Field" className="font-normal text-muted-foreground w-full cursor-pointer hover:cursor-pointer">
          <div className="flex items-center">
            <HeartIcon className="h-10 mr-2" />
            Medical Field
          </div>
        </SelectItem>
        <SelectItem value="Legal Studies" className="font-normal text-muted-foreground cursor-pointer hover:cursor-pointer">
          <div className="flex items-center">
            <ReaderIcon className="h-10 mr-2" />
            Legal Studies
          </div>
        </SelectItem>
        <SelectItem value="STEM" className="font-normal text-muted-foreground cursor-pointer hover:cursor-pointer">
          <div className="flex items-center">
            <RocketIcon className="h-10 mr-2" />
            STEM
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
