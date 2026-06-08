import { createContext } from 'react';
import { type TableData, type ManagerTableData, type LeaveRequest} from "@/types/leave.ts";

type LeaveContextType = {
    fetchLeaveRequests: () => void,
    fetchLeaveRequestDetails: (id: number) => void,
    leaveRequests: TableData[],
    leaveRequestDetails: LeaveRequest | null,
    managerLeaveList: ManagerTableData[];
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
