"use client";

import { useIsClient } from "usehooks-ts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [user?.image]);
  if (!isClient) return null;
  return (
    <Avatar className={cn("h-7 w-7", className)}>
      <AvatarImage
        src={!imageFailed && user?.image ? user.image : "/brand/randomprofile.jpg"}
        alt={user?.name ? `${user.name}'s profile` : "Your profile"}
        className="object-cover"
        onLoadingStatusChange={(status) => {
          if (status === "error") setImageFailed(true);
        }}
      />
      <AvatarFallback
        className={cn(
          "bg-mauve-300",
          textSize ? `text-${textSize}` : "text-xs"
        )}
      >
        {(user?.name || "User").substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
