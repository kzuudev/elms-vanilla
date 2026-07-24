import { createContext } from "react";
import { type Profile } from "@/types/leave.ts";

type EmployeeContextProfile = {
    user: Profile | null;
    setUser: (user: Profile | null) => void;
}


export const AuthContext = createContext<EmployeeContextProfile | undefined>(undefined);