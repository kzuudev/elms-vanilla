import { createContext, useContext } from "react";
import { type LeaveBalance } from "@/types/leave-balance.ts";

export type LeaveBalanceContextType = {
    leaveBalance: LeaveBalance[] | null;
    setLeaveBalance: (leaveBalance: LeaveBalance[]) => void;
    fetchLeaveBalance: () => void;
};

export const LeaveBalanceContext = createContext<LeaveBalanceContextType | undefined>(undefined);

export function useLeaveBalanceContext(): LeaveBalanceContextType {
    const context = useContext(LeaveBalanceContext);

    if (!context) {
        throw new Error("useLeaveBalanceContext must be used within a LeaveBalanceContext.Provider");
    }

    return context;
}
