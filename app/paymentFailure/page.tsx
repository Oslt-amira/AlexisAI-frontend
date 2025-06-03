"use client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function PaymentFailure() {
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
            fill="#FFD1D9"
          />
          <rect
            x="0.4"
            y="0.65"
            width="48.2"
            height="47.2"
            rx="23.6"
            stroke="#FFD1D9"
            strokeWidth="0.8"
          />
          <rect
            x="7"
            y="6.75"
            width="35"
            height="35"
            rx="17.5"
            fill="#E5484D"
          />
          <path
            d="M29.8388 28.8106C29.8899 28.8617 29.9305 28.9224 29.9581 28.9891C29.9858 29.0559 30 29.1275 30 29.1997C30 29.272 29.9858 29.3435 29.9581 29.4103C29.9305 29.4771 29.8899 29.5377 29.8388 29.5888C29.7877 29.6399 29.7271 29.6805 29.6603 29.7081C29.5935 29.7358 29.522 29.75 29.4497 29.75C29.3775 29.75 29.3059 29.7358 29.2391 29.7081C29.1724 29.6805 29.1117 29.6399 29.0606 29.5888L24.5 25.0275L19.9394 29.5888C19.8362 29.692 19.6962 29.75 19.5503 29.75C19.4043 29.75 19.2644 29.692 19.1612 29.5888C19.058 29.4856 19 29.3457 19 29.1997C19 29.0538 19.058 28.9138 19.1612 28.8106L23.7225 24.25L19.1612 19.6894C19.058 19.5862 19 19.4462 19 19.3003C19 19.1543 19.058 19.0144 19.1612 18.9112C19.2644 18.808 19.4043 18.75 19.5503 18.75C19.6962 18.75 19.8362 18.808 19.9394 18.9112L24.5 23.4725L29.0606 18.9112C29.1638 18.808 29.3038 18.75 29.4497 18.75C29.5957 18.75 29.7356 18.808 29.8388 18.9112C29.942 19.0144 30 19.1543 30 19.3003C30 19.4462 29.942 19.5862 29.8388 19.6894L25.2775 24.25L29.8388 28.8106Z"
            fill="white"
          />
        </svg>

        <Label className="text-xl font-semibold text-mauve-1200 mt-3">
          Something went wrong
        </Label>
        <p className="text-sm text-mauve-1100 mt-1">
          An error occurred while processing your payment. You will be
          redirected to the dashboard in a few seconds.
        </p>
        <Button disabled className="bg-purple-900 hover:bg-purple-900/90 mt-8">
          {<ReloadIcon className="mr-2 h-4 w-4 animate-spin" color="white" />}
          Redirecting...
        </Button>
      </div>
    </div>
  );
}
