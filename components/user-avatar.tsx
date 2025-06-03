"use client";

import { useIsClient } from "usehooks-ts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

export default function UserAvatar({
  user,
  className,
  textSize,
}: {
  user: any;
  className?: string;
  textSize?: "xs" | "sm" | "base" | "lg";
}) {
  const isClient = useIsClient();
  if (!isClient) return null;
  if (!user?.name) {
    return <></>;
  } else {
    return (
      <Avatar className={cn("h-7 w-7", className)}>
        <AvatarImage src={user?.image} alt="avatar" />
        <AvatarFallback
          className={cn(
            "bg-mauve-300",
            textSize ? `text-${textSize}` : "text-xs"
          )}
        >
          {user?.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }
}
