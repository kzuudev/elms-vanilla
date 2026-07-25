import { createContext, useContext } from 'react';
import { type TableData, type LeaveRequest, type ReviewerLeaveData } from "@/types/leave.ts";

export type LeaveContextType = {
    fetchLeaveRequests: () => void;
    fetchLeaveRequestDetails: (id: number) => void;
    reviewerLeaveRequests: ReviewerLeaveData[] | null;
    leaveRequests: TableData[] | null;
    leaveRequestDetails: LeaveRequest | null;
};

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export function useLeaveContext(): LeaveContextType {
    const context = useContext(LeaveContext);

    if (!context) {
        throw new Error('useLeaveContext must be used within a LeaveContext.Provider');
    }

    return context;
}
