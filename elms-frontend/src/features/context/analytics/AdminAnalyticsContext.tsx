import { createContext} from "react";

import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, AdminRecentActivityData, MonthlyConsumption, LeaveOverlap, TeamAvailability, TotalUsers} from "@/types/dashboard.ts";

type AdminAnalyticsContextType = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingRequest: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyConsumption[] | null;
    recentActivity: AdminRecentActivityData[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
    totalUsers: TotalUsers[] | null;
}

export const AdminAnalyticsContext = createContext<AdminAnalyticsContextType | undefined>(undefined);