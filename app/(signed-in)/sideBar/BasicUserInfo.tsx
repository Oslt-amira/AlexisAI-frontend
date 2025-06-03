
import React from "react";

import { UserCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";

interface InfoProps {
  user: any;
}

export const BasicUserInfo: React.FC<InfoProps> = ({ user }) => {
  return (
    <>
      <div className="flex items-center px-1 h-full w-full justify-between mt-2 ">
        <div className="flex place-items-center mr-4 col-span-9   ">

           {/* <UserAvatar user={user} /> */}
          <div className="pl-2 w-full">
            <div className=" font-bold text-xs  text-mauve-1100 min-w-full ">
              {user?.name}
            </div>
            <div className=" text-[10px] text-mauve-1100">{user?.email}</div>
          </div>
        </div>

        <Badge
          variant={"outline"}
          className="text-[10px] col-span-1 font-semibold place-self-center px-1 bg-[#FFC53D] bg-opacity-50 text-[#A37200]"
        >
          {user?.isPro ? "Pro" : "Free"}
        </Badge>
      </div>
    </>
  );
};
