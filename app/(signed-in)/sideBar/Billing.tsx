"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { CreditCard } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import SettingsDialog from "@/components/settings/settingsDialog";
import { SelectItem } from "@/components/ui/select";

interface BillingProps {
  user: any;
}

export const Billing: React.FC<BillingProps> = ({ user }) => {
  const [section, setSection] = useState("billing");

  return (
    <SettingsDialog section={section} setSection={setSection}>
      <motion.div
        className=" rounded-sm  group/account cursor-pointer hover:bg-slate-100 flex items-center py-2 px-1"
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          onClick={() => setSection("billing")}
          className="  space-x-2 px-2 w-full bg-transparent group-hover/billing:bg-transparent justify-start h-[10px] "
        >
          <CreditCard size={18} color="#65636D" />

          <span className="font-medium text-[12px] text-mauve-1100">
            Billing
          </span>
        </Button>
      </motion.div>
    </SettingsDialog>
  );
};
