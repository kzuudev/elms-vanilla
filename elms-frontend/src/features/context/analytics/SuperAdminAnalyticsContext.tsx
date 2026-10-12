import { createContext } from "react";
import type { AdminAnalyticsContextType } from "./AdminAnalyticsContext";

export type UpcomingLeave = {
    start_date: string;
    end_date: string;
    leave_type: string;
};

export type SuperAdminAnalyticsContextType = AdminAnalyticsContextType & {
    nextUpcomingLeave: UpcomingLeave | null;
};

export const SuperAdminAnalyticsContext = createContext<SuperAdminAnalyticsContextType | undefined>(undefined);
