import { createContext } from "react";
import { type LeaveBalance} from "@/types/leave-balance.ts";


type LeaveBalanceContext = {
    leaveBalance: LeaveBalance[] | null;
    setLeaveBalance: (leaveBalance: LeaveBalance[]) => void;
    fetchLeaveBalance: () => void;
}


export const LeaveBalanceContext = createContext<LeaveBalanceContext | undefined>(undefined);