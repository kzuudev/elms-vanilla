import { createContext } from "react";
import type { TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, RecentActivity} from "@/types/dashboard.ts";

type LeaveSummaryContext = {
    totalRemainingBalance: TotalRemainingBalance[] | null;
    totalPendingRequest: TotalPendingRequest[] | null;
    totalUsedDays: TotalUsedDays[] | null;
    recentActivity: RecentActivity[] | null;

}

export const LeaveSummaryContext = createContext<LeaveSummaryContext | undefined>(undefined);