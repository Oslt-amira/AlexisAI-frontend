// FormMessage.tsx
import { ISteps } from "@/app/(signed-in)/onboarding/steps";

import { motion } from "framer-motion";
import React from "react";

interface FormMessageProps {
  steps: ISteps[];
  currentStep: number;
  currentTime: string;
}

export const MessageForm: React.FC<FormMessageProps> = ({
  steps,
  currentStep,
  currentTime,
}) => {
  return (
    <>
      <div
        className="flex flex-grow flex-col w-full max-h-[100px] mb-6 px-1 "
        style={{ transform: `translateY(-${currentStep * 65}px)` }}
      >
        {steps.map(
          (step, i) =>
            i <= currentStep && (
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -5, opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeIn" }}
                key={step.id}
                className=" container p-3 bg-purple-300 rounded-xl 
          border-2 border-purple-700 mb-1 "
              >
                <p className="text-purple-1200 text-xs ">{step.message}</p>
              </motion.div>
            )
        )}
        <motion.div
          className="text-mauve-900 text-xs motion.px-1 font-normal"    
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -5, opacity: 1 }}
          transition={{ duration: 0.1, ease: "easeIn" }}
        >
          Alexis Today at{"  "}
          <span className=" ml-1 font-semibold text-xs">{currentTime}</span>
        </motion.div>

      </div>
    </>
  );
};
