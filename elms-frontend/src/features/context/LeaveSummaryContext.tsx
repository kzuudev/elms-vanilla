import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, RecentActivity, TeamStatus} from "@/types/dashboard.ts";

type LeaveSummaryContext = {
    totalRemainingBalance: TotalRemainingBalance[] | null;
    totalPendingRequest: TotalPendingRequest[] | null;
    totalUsedDays: TotalUsedDays[] | null;
    recentActivity: RecentActivity[] | null;
    teamStatus: TeamStatus[] | null;
}

export const LeaveSummaryContext  = createContext<LeaveSummaryContext | undefined>(undefined);