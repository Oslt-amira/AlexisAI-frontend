"use client";
import React, { useEffect, useContext, useState } from "react";
import { WhoAmI } from "@/lib/hooks/user";
import SideBar from "./sideBar/SideBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowsOutLineHorizontal } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useIsClient } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import useNetworkState from "@/lib/hooks/useNetworkState";

export default function SignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  WhoAmI();
  const { toast } = useToast();

  const network = useNetworkState();
  const Client = useIsClient();

  const pathname = usePathname();

  useEffect(() => {
    if (Client) {
      if (!network.isOnline) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "No internet connection .Try again later.",
        });
      }
      if (network.effectiveType !== "4g" && network.effectiveType !== "3g") {
        toast({
          title: "Uh oh! unstable internet connection.",
          description: "Please wait or try again later.",
        });
      }
    }
  }, [network]);
 

  return (
    <div className=" flex h-screen flex-row sm:w-full bg-mauve-100 w-screen">

      {pathname != "/onboarding" && (
        <div className=" hidden md:flex max-w-64 transition-all ">
          <SideBar sheet={false} />
        </div>
      )}
      {pathname != "/onboarding" && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className=" md:hidden aspect-square absolute top-4 left-2 z-10 group bg-mauve-200 shadow-none border-mauve-800 w-8 h-8  hover:bg-purple-300 border-[1px] hover:border-purple-800  "
              size="icon"
              variant="outline"
            >
              <ArrowsOutLineHorizontal
                color="#65636D"
                size={18}
                className=" group-hover:fill-purple-1100"
              />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 md:hidden">
            <SideBar sheet={true} />
          </SheetContent>
        </Sheet>
      )}
      <div className="flex flex-col w-full p-0 transition-all">{children}</div>
    </div>
  );
}
