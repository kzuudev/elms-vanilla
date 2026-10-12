import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { SuperAdminAnalyticsContextType, UpcomingLeave } from "@/features/context/analytics/SuperAdminAnalyticsContext";
import { SuperAdminAnalyticsContext } from "@/features/context/analytics/SuperAdminAnalyticsContext";
import AppSidebar from "@/components/layout/AppSidebar";
import UserProfile from "@/components/layout/UserProfile";
import Notifications from "@/components/layout/Notifications";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid";
import LeaveOverlapTimeline from "@/features/dashboard/components/LeaveOverlapTimeline";
import MonthlyLeavesConsumption from "@/features/dashboard/components/MonthlyLeavesConsumption";
import TeamInsights from "@/features/dashboard/components/TeamInsights";
import TeamCoverageWidget from "@/features/dashboard/components/TeamCoverageWidget";
import RecentActivityTable from "@/features/dashboard/components/RecentActivityTable";

type DashboardResponse = {
    remaining_balance: SuperAdminAnalyticsContextType["remainingBalance"];
    pending_request: SuperAdminAnalyticsContextType["pendingApprovalMetrics"];
    total_used_days: SuperAdminAnalyticsContextType["usedDays"];
    next_upcoming_leave: UpcomingLeave | null;
    team_availability: SuperAdminAnalyticsContextType["teamAvailability"];
    leave_overlap: SuperAdminAnalyticsContextType["overlap"];
    monthly_leave_consumption: SuperAdminAnalyticsContextType["monthlyLeaveConsumption"];
    approval_backlogs: SuperAdminAnalyticsContextType["approvalBacklogs"];
    total_users: SuperAdminAnalyticsContextType["totalUsers"];
    recent_activity: SuperAdminAnalyticsContextType["recentActivity"];
};

export default function SuperAdminDashboard() {
    const [analytics, setAnalytics] = useState<SuperAdminAnalyticsContextType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const fetchSuperAdminDashboard = async () => {
            try {
                const response = await api.get<ApiResponse<DashboardResponse>>("/super-admin-dashboard", {
                    signal: controller.signal,
                });
                if (controller.signal.aborted) return;
                const data = response.data.data;
                setAnalytics({
                    remainingBalance: data.remaining_balance,
                    pendingApprovalMetrics: data.pending_request,
                    usedDays: data.total_used_days,
                    nextUpcomingLeave: data.next_upcoming_leave,
                    overlap: data.leave_overlap,
                    monthlyLeaveConsumption: data.monthly_leave_consumption,
                    teamAvailability: data.team_availability,
                    totalUsers: data.total_users,
                    recentActivity: data.recent_activity,
                    approvalBacklogs: data.approval_backlogs,
                });
            } catch (e: unknown) {
                if (controller.signal.aborted) return;
                const message = getApiErrorMessage(e, "Failed to fetch super admin dashboard");
                if (message) setError(message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        void fetchSuperAdminDashboard();
        return () => controller.abort();
    }, [attempt]);

    return (
        <AppSidebar>
            <div className="flex flex-col gap-4">
                <div className="w-full flex justify-between">
                    <div>
                        <h1 className="text-gray-600">Dashboard</h1>
                        <h2 className="text-sm text-gray-500">Track leave activity, availability, and approvals across all departments</h2>
                    </div>
                    <div className="flex items-center gap-4"><Notifications /><UserProfile /></div>
                </div>
                {loading && <p role="status" className="text-sm text-gray-500">Loading dashboard...</p>}
                {error && <div role="alert" className="text-sm text-red-600">
                    <p>{error}</p>
                    <button className="mt-2 underline" onClick={() => {
                        setError(null);
                        setLoading(true);
                        setAttempt(value => value + 1);
                    }}>Try again</button>
                </div>}
                {!loading && !error && analytics && <SuperAdminAnalyticsContext.Provider value={analytics}>
                    <LeaveSummaryGrid />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <LeaveOverlapTimeline role="super-admin" />
                        <MonthlyLeavesConsumption />
                        <TeamInsights />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1"><TeamCoverageWidget /></div>
                        <div className="lg:col-span-2"><RecentActivityTable /></div>
                    </div>
                </SuperAdminAnalyticsContext.Provider>}
            </div>
        </AppSidebar>
    );
}
