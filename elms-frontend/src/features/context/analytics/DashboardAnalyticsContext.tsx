import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, EmployeeRecentActivity, MonthlyConsumption, LeaveOverlap, TeamAvailability, TotalUsers} from "@/types/dashboard.ts";

type DashboardAnalyticsContext = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingRequest: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyConsumption[] | null;
    recentActivity: EmployeeRecentActivity[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
    totalUsers: TotalUsers[] | null;

}

export const DashboardAnalyticsContext = createContext<DashboardAnalyticsContext | undefined>(undefined);