import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, LeaveActivityRecord, TeamAvailability, MonthlyLeaveConsumption} from "@/types/dashboard.ts";

type EmployeeAnalyticsContext = {
    totalRemainingBalance: TotalRemainingBalance[] | null;
    totalPendingRequest: TotalPendingRequest[] | null;
    totalUsedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyLeaveConsumption[] | null;
    recentActivity: LeaveActivityRecord[] | null;
    teamAvailability: TeamAvailability[] | null;
}

export const EmployeeAnalyticsContext  = createContext<EmployeeAnalyticsContext | undefined>(undefined);