import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, ManagerRecentActivityData, MonthlyConsumption, LeaveOverlap, TeamAvailability, TotalUsers} from "@/types/dashboard.ts";

type ManagerAnalyticsContext = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingRequest: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyConsumption[] | null;
    recentActivity: ManagerRecentActivityData[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
    totalUsers: TotalUsers[] | null;
}

export const ManagerAnalyticsContext = createContext<ManagerAnalyticsContext | undefined>(undefined);