import React, { useEffect, useState } from "react";

import { Profile } from "./Profile";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import { SideBarTabs } from "./SideBarTabs";
import { Button } from "@/components/ui/button";
import { ArrowsOutLineHorizontal } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type SideBarProps = {
  setActiveConversation: React.Dispatch<React.SetStateAction<any>>;
  ActiveConversation: string;
  NewestConversation: boolean;
};

export default function SideBar({ sheet }: any) {
  const [show, setShow] = useState<boolean>(true);

  const toggleSidebar = () => {
    setShow(!show);
  };

  return (
    <div>
      <div
        className={` py-4 flex flex-col h-screen  bg-mauve-200 border-r border-mauve-400 transition-all duration-300 ease-in-out ${
          show ? " w-full px-4" : " w-0 overflow-hidden opacity-0 px-0"
        } `}
      >
        <div className="flex flex-col ">
          <div className="flex flex-row items-center justify-between pl-1 pt-2">
            <div className="flex flex-row">
              <AlexisLogo color="#65636D" width="28" height="30"></AlexisLogo>
              <h2 className=" font-semibold text-mauve-1100 text-xl ml-2 ">
                Alexis
              </h2>
            </div>

            <Button
              className={` justify-self-end aspect-square z-10 group bg-mauve-200 shadow-none border-mauve-800 w-8 h-8 hover:bg-purple-300 border-[1px] hover:border-purple-800 ${
                sheet ? "hidden" : ""
              }`}
              size="icon"
              variant="outline"
              onClick={toggleSidebar}
            >
              <ArrowsOutLineHorizontal
                color="#65636D"
                size={18}
                className="group-hover:fill-purple-1100"
              />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
          {/* <Credits /> */}
        </div>
        <div>
          <SideBarTabs />
        </div>
        <div className=" flex flex-col w-full justify-items-center self-end mt-auto">
          <Profile />
        </div>
      </div>
      <Button
        className={cn(
          "aspect-square absolute top-4 left-8 shadow-none border-mauve-800 w-8 h-8 hover:bg-purple-300 border-[1px] hover:border-purple-800 ",
          !show ? "opacity-100" : "opacity-0"
        )}
        size="icon"
        onClick={toggleSidebar}
        variant="outline"
      >
        <ArrowsOutLineHorizontal
          color="#65636D"
          size={18}
          className=" group-hover:fill-purple-1100"
        />
      </Button>
    </div>
  );
}
