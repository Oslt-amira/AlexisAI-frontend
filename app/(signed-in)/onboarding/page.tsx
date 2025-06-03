"use client";

import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import steps from "./steps";
import { Button } from "@/components/ui/button";
import { FormStep } from "@/components/FormStep";
import { MessageForm } from "@/components/MessageForm";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import { updateUser } from "@/lib/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "usehooks-ts";

const formSchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.date(),
  university: z.string().min(2),
  studyField: z.enum(["Medical Field", "Legal Studies", "STEM"]),
});

export default function OnBoarding() {
  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    "user",
    null
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      university: "",
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTime = () => {
    const date = new Date();
    setCurrentTime(
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/signIn");
    }
  });

  useEffect(() => {
    updateTime();
  }, [currentStep]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const userInfo = {
      name: values.name,
      dateOfBirth: values.dateOfBirth,
      university: values.university,
      fieldOfStudy: values.studyField,
      currentFieldOfStudy:
          values.studyField === "Medical Field"
              ? "médecine"
              : values.studyField === "Legal Studies"
              ? "droits"
              : "prepa",
  };

  await updateUser(user?.id ?? "", userInfo);


  setUser(prevUser => {
    if (!prevUser) return null; 

    return {
        ...prevUser,
        ...userInfo,
        email: prevUser.email ?? "", 
        id: prevUser.id ?? "", 
       
    };
});
    setIsSubmitting(false);
    router.push("/discussion");
  };

  const handleFieldValidation = async (fieldName: any) => {
    form.trigger(fieldName).then((isValid) => {
      if (isValid) {
        next();
      } else {
        console.log(`${fieldName} is not valid`);
      }
    });
  };

  return (
    <>
      <motion.div className="w-screen h-screen bg-mauve-100 flex justify-center items-center">
        <div className="flex flex-col items-center w-3/4 sm:w-2/5 md:w-1/4">
          <motion.div className="place-self-center mb-28">
            <AlexisLogo
              width="62"
              height="68"
              className={`w-15 h-15  ${currentStep >= 2 ? "opacity-0" : ""}`}
            ></AlexisLogo>
          </motion.div>

          <MessageForm
            steps={steps}
            currentStep={currentStep}
            currentTime={currentTime}
          />

          <div className="w-full mb-1 px-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className=" space-y-2"
              >
                <FormStep
                  key={steps[currentStep].id}
                  control={form.control}
                  name={steps[currentStep]?.id || ""}
                  onClick={() => {
                    handleFieldValidation(steps[currentStep].id);
                  }}
                />
              </form>
              {currentStep === 4 && (
                <Button
                  type="submit"
                  className="bg-purple-900 hover:bg-purple-900/90 text-white w-full mt-1 "
                  onClick={() => {
                    handleSubmit(form.getValues());
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <ReloadIcon
                      className="mr-2 h-4 w-4 animate-spin"
                      color="white"
                    />
                  )}
                  Continue
                </Button>
              )}
            </Form>
          </div>
        </div>
      </motion.div>
    </>
  );
}
