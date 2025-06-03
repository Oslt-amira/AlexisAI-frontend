import { useContext, useEffect, useState } from "react";
import { getUser } from "../api";
import { useLocalStorage } from "usehooks-ts";

// returns the user from the database
export function WhoAmI() {
  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    "user",
    null
  );
  useEffect(() => {
    const getUserFromApi = async () => {
      if (user?.email) {
        const response = await getUser(user?.email);
        if (response) {
          setUser(response.data);
        }
      }
    };
    getUserFromApi();
  }, []);

  return;
}
