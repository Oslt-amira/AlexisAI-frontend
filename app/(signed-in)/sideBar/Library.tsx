"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Database } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import SettingsDialog from "@/components/settings/settingsDialog";
import { SelectItem } from "@/components/ui/select";

interface LibraryProps {
  user: any;
}

export const Library: React.FC<LibraryProps> = ({ user }) => {
  const [section, setSection] = useState("library");

  return (
    <SettingsDialog section={section} setSection={setSection}>
      <motion.div
        className=" rounded-sm  group/account cursor-pointer hover:bg-slate-100 flex items-center py-2 px-1"
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          onClick={() => setSection("library")}
          className=" space-x-2 px-2 w-full bg-transparent group-hover/library:bg-transparent justify-start h-[10px]"
        >
          <Database size={18} color="#65636D" />

          <span className="font-medium text-[12px] text-mauve-1100">
            Library
          </span>
        </Button>
      </motion.div>
    </SettingsDialog>
  );
};
