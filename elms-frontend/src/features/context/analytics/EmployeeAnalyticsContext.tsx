import { createContext, useContext } from "react";
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

export function useEmployeeAnalyticsContext(): EmployeeAnalyticsContext {
    const context = useContext(EmployeeAnalyticsContext);

    if (!context) {
        throw new Error("useEmployeeAnalyticsContext must be used within a EmployeeAnalyticsContext.Provider");
    }

    return context;
}