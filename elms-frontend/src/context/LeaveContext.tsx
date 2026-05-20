import { createContext } from 'react';
import {LeaveType, type TableData} from "@/types/leave.ts";

type LeaveContextType = {
    fetchLeaveRequests: () => void,
    leaveRequests: TableData[];
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
