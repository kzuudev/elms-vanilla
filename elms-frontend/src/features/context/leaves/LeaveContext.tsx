import { createContext } from 'react';
import { type TableData, type LeaveRequest, type ReviewerLeaveData, type PersonalLeaveRequest} from "@/types/leave.ts";

type LeaveContextType = {
    fetchLeaveRequests: () => void,
    fetchLeaveRequestDetails: (id: number) => void,
    reviewerLeaveRequests: ReviewerLeaveData[] | null,
    leaveRequests: TableData[] | null,
    leaveRequestDetails: LeaveRequest | null,
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
