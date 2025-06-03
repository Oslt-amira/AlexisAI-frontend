"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // redirect after 3 seconds
    setTimeout(() => {
      router.push("/discussion");
    }, 3000);
  });

  return (
    <div className="w-screen h-screen flex justify-center pt-">
      <div className="flex flex-col items-center mt-40">
        <svg
          width="64"
          height="64"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.4"
            y="0.65"
            width="48.2"
            height="47.2"
            rx="23.6"
            fill="#C2F0C2"
          />
          <rect
            x="0.4"
            y="0.65"
            width="48.2"
            height="47.2"
            rx="23.6"
            stroke="#C2F0C2"
            strokeWidth="0.8"
          />
          <rect
            x="7"
            y="6.75"
            width="35"
            height="35"
            rx="17.5"
            fill="#71D083"
          />
          <path
            d="M31.3359 20.1663L22.3763 29.1259C22.3243 29.178 22.2625 29.2193 22.1945 29.2475C22.1266 29.2757 22.0537 29.2902 21.9801 29.2902C21.9065 29.2902 21.8337 29.2757 21.7657 29.2475C21.6977 29.2193 21.6359 29.178 21.5839 29.1259L17.6641 25.2061C17.559 25.101 17.5 24.9585 17.5 24.8099C17.5 24.6613 17.559 24.5188 17.6641 24.4137C17.7692 24.3087 17.9117 24.2496 18.0603 24.2496C18.2089 24.2496 18.3514 24.3087 18.4565 24.4137L21.9801 27.9381L30.5435 19.374C30.6486 19.2689 30.7911 19.2099 30.9397 19.2099C31.0883 19.2099 31.2308 19.2689 31.3359 19.374C31.441 19.479 31.5 19.6215 31.5 19.7701C31.5 19.9187 31.441 20.0612 31.3359 20.1663Z"
            fill="white"
          />
        </svg>
        <Label className="text-xl font-semibold text-mauve-1200 mt-3">
          Subscription confirmed !
        </Label>
        <p className="text-sm text-mauve-1100 mt-1">
          Congrats! You can now explore everything Alexis has to offer
        </p>
        <Button disabled className="bg-purple-900 hover:bg-purple-900/90 mt-8">
          {<ReloadIcon className="mr-2 h-4 w-4 animate-spin" color="white" />}
          Redirecting...
        </Button>
      </div>
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          preset: "confetti",
        }}
      /> */}
    </div>
  );
}
