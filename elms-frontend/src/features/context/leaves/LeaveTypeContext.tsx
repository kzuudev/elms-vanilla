import { createContext } from "react";
import type { LeaveType } from "@/types/leave-type";

interface LeaveTypeContextType {
    leaveTypes: LeaveType[];
    setLeaveTypes: (leaveTypes: LeaveType[]) => void;
    fetchLeaveTypes: () => void;
    leaveTypeDetails: LeaveType | null;
    setLeaveTypeDetails: (leaveTypeDetails: LeaveType) => void;
    fetchLeaveTypeDetails: (id: number) => void;
}

export const LeaveTypeContext = createContext<LeaveTypeContextType | undefined>(undefined);

