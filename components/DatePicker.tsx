import React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, getYear, subYears } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PersonalizedCalendar } from "./ui/PersonalizedCalendar";



interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date|undefined) => void;

}

export const DatePicker: React.FC<DatePickerProps> = ({ value,onChange }) => {

  const currentYear = getYear(new Date());
  const maxAllowedYear = subYears(new Date(), 17).getFullYear();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd-MM-yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <PersonalizedCalendar
          mode="single"
          captionLayout="dropdown"
          fromYear={1900}
          toYear={Math.min(currentYear, maxAllowedYear)}          
          onSelect={onChange}
          fixedWeeks
        />
      </PopoverContent>
    </Popover>
  );
};
