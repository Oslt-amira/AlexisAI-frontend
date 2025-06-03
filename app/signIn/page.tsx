"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { AuthToast, ErrorToast } from "@/components/authToast";
import { auth } from "@/lib/api";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const response = await auth(email);
    setLoading(false);
    toast(AuthToast);
  }


  return (
    <div className="w-screen h-screen bg-mauve-100 flex justify-center items-center">
      <div className="flex flex-col items-center w-3/4 sm:w-2/5 md:w-1/4">
        <svg
          width="42"
          height="47"
          viewBox="0 0 42 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.4961 6.81088C33.8643 2.29026 28.0357 0 20.1755 0C14.2127 0 9.4429 1.52843 5.99794 4.53979C3.0345 7.1295 1.68574 10.2558 0.928708 12.3832C-0.0199759 15.052 -0.247564 17.8741 0.272295 20.5452C0.818507 23.3482 2.16487 25.8564 4.17004 27.8017C5.90451 29.4859 7.70605 30.3387 9.52675 30.3387H13.6042C14.8475 30.3387 15.8537 31.3449 15.8537 32.5882V43.1651C15.8537 44.7654 17.1498 46.0615 18.7501 46.0639H20.1779C32.2113 46.0639 42 35.5517 42 22.6295C42 15.7563 40.5267 10.5817 37.4961 6.81327V6.81088ZM19.9407 41.0042V32.5882C19.9407 29.0882 17.1042 26.2517 13.6042 26.2517H9.52675C8.63077 26.2517 7.66772 25.4995 7.01609 24.8694C5.53557 23.432 4.59408 21.5873 4.23952 19.5678C4.1365 18.9785 4.59647 18.4394 5.19299 18.4394H20.4462C25.3741 18.4394 29.3677 22.433 29.3677 27.3609V36.5938C29.3677 38.357 28.316 39.9501 26.6941 40.6473C24.3439 41.6558 22.1711 41.9122 20.9541 41.9721C20.4007 41.9984 19.9407 41.56 19.9407 41.0066V41.0042ZM32.7743 33.4219V27.3609C32.7743 20.5524 27.2547 15.0328 20.4462 15.0328H5.68171C5.0205 15.0328 4.55814 14.3788 4.77854 13.7535C6.25667 9.60422 9.45967 4.08701 20.1755 4.08701C26.8282 4.08701 31.4519 5.81428 34.3099 9.37184C36.7343 12.3856 37.9106 16.7217 37.9106 22.6295C37.9106 26.8554 36.6625 30.7675 34.5471 33.9538C34.0152 34.7539 32.7719 34.3802 32.7719 33.4219H32.7743Z"
            fill="#65636D"
          />
        </svg>

        <div className="flex flex-col items-center mt-6 mb-5 gap-1">
          <h2 className="font-semibold text-xl text-mauve-1200">
            Welcome back
          </h2>
          <p className="font-normal text-mauve-1100 text-sm">
            Enter your email to sign in to your account
          </p>
        </div>
        <form
          className="flex flex-col items-center w-full gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="name@example.com"
            className="w-full font-base"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {loading ? (
            <Button disabled className="w-full bg-purple-900  font-medium">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              className="w-full bg-purple-900 hover:bg-purple-900/90 font-medium"
              type="submit"
              id="sign-in-button"
            >
              Sign In with Email
            </Button>
          )}
        </form>
        <Separator orientation="horizontal" className="mt-6 bg-mauve-700" />

        <p className="mt-8 font-normal text-mauve-1100 text-sm">
          A magic link will be sent to your email
        </p>
      </div>
    </div>
  );
}
