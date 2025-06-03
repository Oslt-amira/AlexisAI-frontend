import React from "react";
import { ChatsCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export const EmptyHistory: React.FC = () => {
  return (
    <motion.div className=" flex flex-col justify-center items-center mt-20 ">
      <ChatsCircle
        size={50}
        color="#D5D3DB"
        weight="duotone"
        className="mb-4"
      />
      <span className="text-mauve-900 text-[16px] font-semibold mb-2">
        No Discussions Found
      </span>
      <span className="text-mauve-900 text-sm">Why not start one?</span>
      <span className="text-mauve-900 text-sm text-center ">
        Feel free to initiate a conversation
      </span>
    </motion.div>
  );
};
