"use client";
import { useIsClient, useLocalStorage } from "usehooks-ts";

import React, { useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../../components/ui/card";
import { CaretUpDown, SignOut } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Separator } from "../../../components/ui/separator";
import { Account } from "./Account";
import { Library } from "./Library";
import { Billing } from "./Billing";
import { BasicUserInfo } from "./BasicUserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface User {
  id: string;
  email: String;
  name?: string;
  dateOfBirth?: Date;
  image?: string;
  fieldOfStudy?: String;
  university?: string;
  createdAt: Date;
}

export const Profile: React.FC = () => {
  const router = useRouter();

  const isClient = useIsClient();

  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    "user",
    null
  );

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/signIn");
  }

  if (isClient) {
    return (
      <>
        <Select>
          <SelectTrigger className="bg-white h-[55px] rounded-lg ">
            <SelectValue
              placeholder={
                <div className="flex place-items-center items ">
                  <UserAvatar user={user} />

                  <div className="pl-2 flex flex-col items-start gap-0 ">
                    <div className=" font-medium text-xs text-mauve-1100">
                      {user?.name}
                    </div>
                    {/* <div className="text-[10px] text-mauve-1100">
                      {user?.email}
                    </div> */}
                  </div>
                </div>
              }
            />
          </SelectTrigger>

          <SelectContent align="center">
            <BasicUserInfo user={user} />
            <Separator
              orientation="horizontal"
              className="bg-mauve-400 my-2.5"
            />

            <Account user={user} />
            <Library user={user} />
            <Billing user={user} />

            <Separator
              orientation="horizontal"
              className="bg-mauve-400 my-2.5"
            />

            <Button
              variant="ghost"
              className="rounded-sm group/account cursor-pointer hover:bg-slate-100 flex items-center justify-start py-2 gap-1 w-full"
              onClick={logout}
            >
              <SignOut size={18} color="#65636D" />
              <span className="font-medium text-[12px] text-mauve-1100">
                Logout
              </span>
            </Button>
          </SelectContent>
        </Select>
      </>
    );
  } else return null;
};
