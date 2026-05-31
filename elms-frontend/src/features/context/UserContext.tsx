import { createContext } from "react";
import { type Profile } from "@/types/leave.ts";

type UserContextProfile = {
    user: Profile | null;
    setUser: (user: Profile | null) => void;
}


export const UserContext = createContext<UserContextProfile | undefined>(undefined);