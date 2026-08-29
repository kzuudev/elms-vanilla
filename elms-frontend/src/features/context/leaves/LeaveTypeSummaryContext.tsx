import { createContext, useContext } from "react";
import type { LeaveTypeSummary } from "@/types/leave-type";

interface LeaveTypeSummaryContextType {
    leaveTypeSummary: LeaveTypeSummary | undefined;
    fetchLeaveTypeSummary: () => Promise<void>;
}

export const LeaveTypeSummaryContext = createContext<LeaveTypeSummaryContextType | undefined>(undefined);

export function useLeaveTypeSummaryContext(): LeaveTypeSummaryContextType {
    const context = useContext(LeaveTypeSummaryContext);

    if (!context) {
        throw new Error("useLeaveTypeSummaryContext must be used within a LeaveTypeSummaryContext.Provider");
    }

    return context;
}
