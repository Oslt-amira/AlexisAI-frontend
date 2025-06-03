import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@phosphor-icons/react";
import AccountSection from "./accountSection";
import LibrarySection from "./librarySection";
import BillingSection from "./billingSection";

export default function SettingsDialog({
  children,
  section,
  setSection,
}: {
  children: React.ReactNode;
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-fit">
        <div className="flex gap-2 items-center">
          <User size={24} />
          <h3 className="text-base text-mauve-1200 font-semibold">
            Account settings
          </h3>
        </div>
        <Tabs
          value={section}
          className="w-full mb-1"
          onValueChange={(e) => setSection(e)}
        >
          <TabsList className="bg-purple-400 w-full">
            <TabsTrigger
              value="account"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            >
              Library
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="hover:text-purple-1000 text-purple-800 data-[state=active]:text-purple-1100 w-1/3"
            >
              Billing
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {section === "account" && <AccountSection />}
        {section === "library" && <LibrarySection />}
        {section === "billing" && <BillingSection />}
      </DialogContent>
    </Dialog>
  );
}
