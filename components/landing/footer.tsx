"use client";
import Link from "next/link";
import { AlexisLogo } from "@/components/icons/AlexisLogo";
import { Leaf } from "lucide-react";
export default function Footer() {
  return (
    <footer className="lp-container lp-footer flex flex-col items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
      <span>
        {" "}
        © 2024. All rights reserved. 
      </span>
    </footer>
  );
}
