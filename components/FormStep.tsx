import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { DatePicker } from "./DatePicker";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { FieldSelect } from "./FieldSelect";

interface FormStepProps {
  control: any;
  name: string;
  onClick: () => void;
}

export const FormStep: React.FC<FormStepProps> = ({
  control,
  name,
  onClick,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {name === "name" && (
            <FormControl>
              <Input placeholder="Name" {...field} />
            </FormControl>
          )}
          {name === "dateOfBirth" && (
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} />
            </FormControl>
          )}

          {name === "studyField" && (
            <FormControl>
              <FieldSelect value={field.value} onChange={field.onChange} />
            </FormControl>
          )}

          {name === "university" && (
            <FormControl>
              <Input placeholder="University" {...field} />
            </FormControl>
          )}

          <FormMessage />

          {name != "complete" && (
            <Button
              type="button"
              className="bg-purple-900  text-white w-full mt-1 hover:bg-purple-900/90"
              onClick={onClick}
            >
              Continue
            </Button>
          )}
        </FormItem>
      )}
    />
  );
};
