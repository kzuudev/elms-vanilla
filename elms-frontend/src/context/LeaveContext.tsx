import { createContext } from 'react';
import {LeaveType} from "@/types/leave.ts";

type LeaveContextType = {
    fetchLeaveRequests: () => void,
    leaveRequests: LeaveType[];
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
