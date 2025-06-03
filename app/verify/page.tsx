"use client";
import React, { Suspense, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { callback } from "@/lib/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "usehooks-ts";
import Loading from "../loading";

export default function Verify() {
  return (
    <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
      <div className="w-screen h-screen flex items-center justify-center">
        <Verfication />
      </div>
    </Suspense>
  );
}

function Verfication() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    "user",
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await callback(token ?? "");
      if (response && response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        response.data.user.name
          ? router.push("/discussion")
          : router.push("/onboarding");
      } else {
        router.push("/signIn");
      }
    };
    fetchData();
  });
  return <Loading />;
}
