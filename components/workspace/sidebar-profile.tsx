"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HelpCircle, LogOut, MoreVertical, Palette, Settings2, Sparkles } from "lucide-react";

export default function SidebarProfile({
  name, email, onPlus, onPersonalize, onSettings, onHelp, onLogout,
}: {
  name: string;
  email: string;
  onPlus: () => void;
  onPersonalize: () => void;
  onSettings: () => void;
  onHelp: () => void;
  onLogout: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pendingDialog = useRef<(() => void) | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContainer(root.current?.closest<HTMLElement>(".alexis-app") ?? null);
  }, []);

  function openDialog(action: () => void) {
    pendingDialog.current = action;
  }

  return (
    <div className="profile-compact" ref={root}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="profile-account profile-dropdown-trigger" aria-label="Open account options" title={name || "Your account"}>
            <span className="member-avatar">
              <Image src="/brand/randomprofile.jpg" width={32} height={32} alt={`${name || "User"}'s profile`} />
            </span>
            <span className="profile-copy"><b>{name || "Your account"}</b><small>Free plan</small></span>
            <span className="profile-menu-trigger" aria-hidden="true"><MoreVertical size={17} /></span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal container={container}>
          <DropdownMenu.Content
            className="account-dropdown"
            side="top" align="start" sideOffset={10} collisionPadding={12}
            aria-label="Account options"
            onCloseAutoFocus={(event) => {
              const action = pendingDialog.current;
              pendingDialog.current = null;
              if (action) {
                event.preventDefault();
                requestAnimationFrame(() => {
                  root.current?.querySelector<HTMLButtonElement>(".profile-dropdown-trigger")?.focus();
                  action();
                });
              }
            }}
          >
            <DropdownMenu.Label className="account-dropdown-label">{email || name || "Your account"}</DropdownMenu.Label>
            <DropdownMenu.Item className="account-dropdown-item" onSelect={() => openDialog(onPlus)}>
              <Sparkles size={17} /><span>Try Plus</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="account-dropdown-item" onSelect={() => openDialog(onPersonalize)}><Palette size={17} /><span>Personalization</span></DropdownMenu.Item>
            <DropdownMenu.Item className="account-dropdown-item" onSelect={onSettings}><Settings2 size={17} /><span>Settings</span></DropdownMenu.Item>
            <DropdownMenu.Item className="account-dropdown-item" onSelect={() => openDialog(onHelp)}><HelpCircle size={17} /><span>Help</span></DropdownMenu.Item>
            <DropdownMenu.Separator className="account-dropdown-separator" />
            <DropdownMenu.Item className="account-dropdown-item" onSelect={onLogout}><LogOut size={17} /><span>Log out</span></DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
