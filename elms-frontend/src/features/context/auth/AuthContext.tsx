import { createContext, useContext } from "react";
import { type Profile } from "@/types/leave.ts";

type EmployeeContextProfile = {
    user: Profile | null;
    setUser: (user: Profile | null) => void;
}


export const AuthContext = createContext<EmployeeContextProfile | undefined>(undefined);

export function useAuthContext(): EmployeeContextProfile {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within a AuthContext.Provider");
    }

    return context;
}