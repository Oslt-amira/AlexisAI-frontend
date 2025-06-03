"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { User } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import SettingsDialog from "@/components/settings/settingsDialog";
import { SelectItem } from "@/components/ui/select";

interface AccountProps {
  user: any;
}

export const Account: React.FC<AccountProps> = ({ user }) => {
  const [section, setSection] = useState("account");

  return (
    <SettingsDialog section={section} setSection={setSection}>
      <div className=" rounded-sm  group/account cursor-pointer hover:bg-slate-100 flex items-center py-2 px-1">
        <Button
          variant="ghost"
          onClick={() => setSection("account")}
          className=" space-x-2 px-2 w-full bg-transparent group-hover/account:bg-transparent justify-start h-[10px]"
        >
          <User size={18} color="#65636D" />

          <span className="font-medium text-[12px] text-mauve-1100">
            Account
          </span>
        </Button>
      </div>
    </SettingsDialog>
  );
};
