import React, { useContext, useState } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadSimple } from "@phosphor-icons/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { updateUser } from "@/lib/api";
import { toast } from "sonner";
import { ErrorToast } from "../authToast";
import { useLocalStorage } from "usehooks-ts";
import UserAvatar from "../user-avatar";

export default function AccountSection() {
  const [user, setUser, removeUser] = useLocalStorage<User | any | null>(
    "user",
    null
  );
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [university, setUniversity] = useState(user?.university ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(user?.id ?? "", { name, email, university });

      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, name, email, university })
      );

      setUser({ ...user, name, email, university });

      setIsSubmitting(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast(ErrorToast);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4 justify-items-end ">
          <UserAvatar user={user} className="h-12 w-12" textSize="sm" />

          <span className="col-span-1 text-xs text-mauve-1100">Max 5Mb.</span>
          <Button className="col-span-2 font-medium" variant="outline" disabled>
            <UploadSimple className="mr-2" size={18} /> Change avatar
          </Button>
        </div>
        <span className="text-xs text-mauve-1100 text-end">
          Profile images must be in either JPG or PNG format.
        </span>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="col-span-3"
            disabled
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="university" className="text-right">
            University
          </Label>
          <Input
            id="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-purple-900 hover:bg-purple-900/90"
          disabled={
            isSubmitting ||
            (name === user?.name && university === user?.university)
          }
        >
          {isSubmitting && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" color="white" />
          )}
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}
