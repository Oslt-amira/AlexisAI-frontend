"use client";

import React, { useContext, useState } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { initPayment } from "@/lib/api";
import { useLocalStorage } from "usehooks-ts";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

export default function BillingSection() {
  const [isProSelected, setIsProSelected] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "monthly" | "halfYearly" | "yearly"
  >("monthly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    "user",
    null
  );
  async function onInitPayment() {
    setIsSubmitting(true);
    // Make a request to the server to initiate the payment process
    const response: any = await initPayment(
      user?.name ?? "",
      user?.email ?? "",
      activeTab
    );
    setIsSubmitting(false);
    if (response?.data?.payUrl) {
      // Open the payment page in a new tab
      window.open(response?.data?.payUrl, "_blank");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Choose your plan</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <Tabs
        defaultValue="monthly"
        onValueChange={(e: any) => {
          setActiveTab(e);
        }}
      >
        <TabsList className="bg-purple-400 w-full">
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            value="monthly"
          >
            Mensuel
          </TabsTrigger>
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            value="halfYearly"
          >
            Semestriel
          </TabsTrigger>
          <TabsTrigger
            className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            value="yearly"
          >
            Annuel
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div
        className="w-full flex flex-col mb-2"
        onClick={() => setIsProSelected(!isProSelected)}
      >
        <div
          className={cn(
            "flex items-center w-full border-[1px] border-mauve-500 rounded-md px-4 py-3 cursor-pointer hover:border-purple-700 transition-colors duration-200 ease-in-ou",
            isProSelected && "border-purple-700"
          )}
        >
          <div className="w-9 h-9 bg-purple-500 mr-4 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 border-[2px] border-purple-1000 rounded-[3px] rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-1">
              <span className="text-base font-bold text-purple-1100 select-none pointer-events-none">
                Pro Plan -
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                {activeTab == "monthly" ? (
                  <motion.span
                    className="text-base font-bold text-purple-1100 select-none pointer-events-none"
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    key={"monthly"}
                  >
                    49,90
                  </motion.span>
                ) : activeTab == "halfYearly" ? (
                  <motion.span
                    className="text-base font-bold text-purple-1100 select-none pointer-events-none"
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    key={"halfYearly"}
                  >
                    44,90
                  </motion.span>
                ) : (
                  <motion.span
                    className="text-base font-bold text-purple-1100 select-none pointer-events-none"
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    key={"Yearly"}
                  >
                    39,90
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-base font-bold text-purple-1100 select-none pointer-events-none">
                TND/Mois
              </span>
            </div>
            <p className="text-xs text-mauve-1100 select-none pointer-events-none">
              Unlock the full potential of Alexis.
            </p>
          </div>
          <Checkbox
            checked={isProSelected || user?.isPro}
            id="pro"
            className="ml-auto"
          />
        </div>

        {user?.isPro && user?.proEndsAt && (
          <p className="w-full text-end text-xs text-mauve-1100 select-none pointer-events-none font-medium mt-2">
            This plan ends on{" "}
            {new Date(user?.proEndsAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-purple-900 hover:bg-purple-900/90"
          disabled={!isProSelected || isSubmitting || user?.isPro}
          onClick={() => onInitPayment()}
        >
          {isSubmitting && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" color="white" />
          )}
          Activate plan
        </Button>
      </DialogFooter>
    </>
  );
}
