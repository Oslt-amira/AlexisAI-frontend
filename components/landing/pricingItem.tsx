"use client";
import React from "react";
import { Separator } from "../ui/separator";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type PricingItemProps = {
  description: string;
  label: string;
  prices: string[];
  benefits: string[];
  button: string;
  isRecommended: boolean;
};

export default function PricingItem({
  data,
  activeTab,
}: {
  data: PricingItemProps;
  activeTab: "monthly" | "halfYearly" | "yearly";
}) {
  return (
    <div
      className={cn(
        "w-72 h-fit rounded-lg border border-mauve-500 flex flex-col p-6 gap-6 shadow-[0px_5px_20px_0px_#2d374815]",
        data.isRecommended &&
          "border-purple-700 shadow-[0px_5px_20px_0px_#6b46c120]"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-mauve-1200 text-2xl font-medium">{data.label}</h3>
          {data.isRecommended && (
            <span className="text-xs bg-purple-400 px-3 py-1 rounded-full font-medium text-purple-1000">
              Recommended
            </span>
          )}
        </div>
        <p className="text-mauve-1100 text-sm">
          {data.description}
        </p>
        {data.prices.length == 1 && (
          <span className="text-mauve-1200 text-2xl font-medium mt-1">
            {data.prices[0]}
          </span>
        )}
        {data.prices.length > 1 && (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              className="text-mauve-1200 text-2xl font-medium mt-1"
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              key={activeTab + data.label}
            >
              {
                data.prices[
                  activeTab == "monthly" ? 0 : activeTab == "halfYearly" ? 1 : 2
                ]
              }
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        {data.benefits.map((benefit, index) => (
          <div className="flex gap-2 items-center" key={index}>
            <CheckCircle className="text-purple-900" size={20} />
            <span className="text-mauve-1200 text-sm">{benefit}</span>
          </div>
        ))}
      </div>
      <Link href="/signIn" className="w-full">
        <Button className="mt-4 bg-purple-900 w-full hover:bg-purple-900/90">{data.button}</Button>
      </Link>
    </div>
  );
}
