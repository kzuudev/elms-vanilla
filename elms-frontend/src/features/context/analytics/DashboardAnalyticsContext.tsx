import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, RecentActivity, MonthlyLeaveConsumption, LeaveOverlap, TeamAvailability} from "@/types/dashboard.ts";

type DashboardAnalyticsContext = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingRequest: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyLeaveConsumption[] | null;
    recentActivity: RecentActivity[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
}

export const DashboardAnalyticsContext = createContext<DashboardAnalyticsContext | undefined>(undefined);