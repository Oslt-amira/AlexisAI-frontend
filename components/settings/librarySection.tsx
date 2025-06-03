"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FieldOfStudy from "@/components/settings/fieldOfStudy";
import { Button } from "../ui/button";
import { ErrorToast } from "../authToast";
import { updateUser } from "@/lib/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export type Field = "médecine" | "prepa" | "droits" | null;

export default function LibrarySection() {
  const [user, setUser, removeUser] = useLocalStorage<User | undefined>(
    "user",
    undefined
  );

  const router = useRouter();


  const [currentFieldOfStudy, setCurrentFieldOfStudy] = useState<string | null>(
    user?.currentFieldOfStudy ??
      (user?.fieldOfStudy === "Medical Field"
        ? "médecine"
        : user?.fieldOfStudy === "STEM"
        ? "prepa"
        : user?.fieldOfStudy === "Legal Studies"
        ? "droits"
        : null)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldClick = (id: Field) => {
    // Change the checked field
    setCurrentFieldOfStudy(id);
  };

  async function onSubmit() {
    setIsSubmitting(true);

    try {
      // Update user profile in the database
      await updateUser(user?.id ?? "", { currentFieldOfStudy });
      const userTemp:any = user;
      userTemp.currentFieldOfStudy = currentFieldOfStudy;
      // Update user context
      setUser(userTemp);
      // Update sessionStorage
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, currentFieldOfStudy })
      );
      setIsSubmitting(false);
      router.push(`/discussion`, {
        scroll: false,
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast(ErrorToast);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit your knowledge base</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="w-full flex flex-col gap-3">
        <FieldOfStudy
          label="Médecine - Résidanat"
          id="médecine"
          checkedField={currentFieldOfStudy}
          onFieldClick={handleFieldClick}
          availableModes={["problemSolving", "mcq"]}
          description="This mode offers you our currated collection of knowledge based on Medecine's final exam"
        />
        <FieldOfStudy
          label="Prépa - Concours"
          id="prepa"
          checkedField={currentFieldOfStudy}
          onFieldClick={handleFieldClick}
          availableModes={["problemSolving", "mcq"]}
          description="This mode offers you our currated collection of knowledge based on Pre-Engineering final exam"
        />
        <FieldOfStudy
          label="Droits - Concours"
          id="droits"
          checkedField={currentFieldOfStudy}
          onFieldClick={handleFieldClick}
          availableModes={["mcq", "writing"]}
          description="This mode offers you our currated collection of knowledge based on Law's final exams"
        />
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-purple-900 hover:bg-purple-900/90"
          onClick={onSubmit}
          disabled={
            isSubmitting ||
            currentFieldOfStudy === user?.currentFieldOfStudy ||
            (currentFieldOfStudy === "prepa" &&
              user?.fieldOfStudy === "STEM" &&
              !user.currentFieldOfStudy) ||
            (currentFieldOfStudy === "médecine" &&
              user?.fieldOfStudy === "Medical Field" &&
              !user.currentFieldOfStudy) ||
            (currentFieldOfStudy === "droits" &&
              user?.fieldOfStudy === "Legal Studies" &&
              !user.currentFieldOfStudy)
          }
        >
          {isSubmitting && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" color="white" />
          )}
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
