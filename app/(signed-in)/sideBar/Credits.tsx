// FormMessage.tsx

import React from "react";

import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export const Credits: React.FC = () => {
  return (
    <>
      <Card className=" bg-white my-8   ">
        <CardHeader>
          <CardTitle className=" font-bold text-sm text-mauve-1100">
            Information
          </CardTitle>
          <CardDescription className="text-[11px] text-left mr-3 ">
            You currently have{" "}
            <span className=" mx-1 font-bold ">20 questions </span>
            left, you can extend this limit .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={33} className="text-purple-500 mb-3" />
          <Button
            type="button"
            className="bg-gradient-to-b from-[#8E4EC6] to-[#693894]  text-white w-full shadow-md shadow-purple-900/50 font-semibold text-[8px] "
          >
            Extend
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
