import { createContext } from 'react';
import {LeaveType, type TableData, type ManagerTableData} from "@/types/leave.ts";

type LeaveContextType = {
    fetchLeaveRequests: () => void,
    leaveRequests: TableData[],
    managerLeaveList: ManagerTableData[];
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
