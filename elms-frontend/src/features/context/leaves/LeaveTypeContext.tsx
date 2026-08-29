import { createContext, useContext } from "react";
import type { LeaveType } from "@/types/leave-type";

interface LeaveTypeContextType {
    leaveTypes: LeaveType[];
    leaveTypeDetails: LeaveType | null;
    fetchLeaveTypes: () => Promise<void>;
    fetchLeaveTypeDetails: (id: number) => Promise<void>;
}

export const LeaveTypeContext = createContext<LeaveTypeContextType | undefined>(undefined);

export function useLeaveTypeContext(): LeaveTypeContextType {
    const context = useContext(LeaveTypeContext);

    if (!context) {
        throw new Error("useLeaveTypeContext must be used within a LeaveTypeContext.Provider");
    }

    return context;
}
