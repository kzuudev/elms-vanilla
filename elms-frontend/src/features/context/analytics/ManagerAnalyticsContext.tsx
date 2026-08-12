import { createContext } from "react";
import type {
    TotalRemainingBalance,
    TotalPendingRequest,
    TotalUsedDays,
    MonthlyConsumption,
    LeaveActivityRecord,
    TeamAvailability,
    TotalUsers,
    LeaveOverlap
} from "@/types/dashboard.ts";

type ManagerAnalyticsContext = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingRequest: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyConsumption[] | null;
    recentActivity: LeaveActivityRecord[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
    totalUsers: TotalUsers[] | null;
}

export const ManagerAnalyticsContext = createContext<ManagerAnalyticsContext | undefined>(undefined);
