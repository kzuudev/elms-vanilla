import { createContext } from "react";
import type {
    TotalRemainingBalance,
    TotalPendingRequest,
    TotalUsedDays,
    MonthlyConsumption,
    LeaveActivityRecord,
    TeamAvailability,
    TotalUsers,
    LeaveOverlap,
    ApprovalBacklogs
} from "@/types/dashboard.ts";

type ManagerAnalyticsContext = {
    remainingBalance: TotalRemainingBalance[] | null;
    pendingApprovalMetrics: TotalPendingRequest[] | null;
    usedDays: TotalUsedDays[] | null;
    monthlyLeaveConsumption: MonthlyConsumption[] | null;
    recentActivity: LeaveActivityRecord[] | null;
    overlap: LeaveOverlap[] | null;
    teamAvailability: TeamAvailability[] | null;
    totalUsers: TotalUsers[] | null;
    approvalBacklogs: ApprovalBacklogs[] | null;
}

export const ManagerAnalyticsContext = createContext<ManagerAnalyticsContext | undefined>(undefined);
