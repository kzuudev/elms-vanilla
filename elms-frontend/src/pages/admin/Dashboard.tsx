
import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";


import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";
import LeaveOverlapTimeline from "@/features/dashboard/components/LeaveOverlapTimeline.tsx";
import MonthlyLeavesConsumption from "@/features/dashboard/components/MonthlyLeavesConsumption.tsx";
import TeamInsights from "@/features/dashboard/components/TeamInsights.tsx";
import TeamCoverageWidget from "@/features/dashboard/components/TeamCoverageWidget.tsx";
import RecentActivityTable from "@/features/dashboard/components/RecentActivityTable.tsx";
import Notifications from "@/components/layout/Notifications";

import type {
    LeaveActivityRecord,
    LeaveOverlap,
    MonthlyConsumption, TeamAvailability,
    TotalPendingRequest,
    TotalRemainingBalance,
    TotalUsedDays, TotalUsers
} from "@/types/dashboard.ts";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import Search from "@/components/ui/search.tsx";


export default function AdminDashboard() {


    const [error, setError] = useState<string | null>(null);

    const [remainingBalance, setRemainingBalance] = useState<TotalRemainingBalance[]>([]);
    const [pendingRequest, setPendingRequest] = useState<TotalPendingRequest[]>([]);
    const [usedDays, setUsedDays] = useState<TotalUsedDays[]>([]);
    const [overlap, setOverlap] = useState<LeaveOverlap[]>([]);
    const [monthlyLeaveConsumption, setMonthlyLeaveConsumption] = useState<MonthlyConsumption[]>([]);
    const [teamAvailability, setTeamAvailability] = useState<TeamAvailability[]>([]);
    const [totalUsers, setTotalUsers] = useState<TotalUsers[]>([]);
    const [recentActivity, setRecentActivity] = useState<LeaveActivityRecord[]>([]);

    const fetchAdminDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/admin-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setRemainingBalance(response.data.data.remaining_balance);
            setPendingRequest(response.data.data.pending_request);
            setUsedDays(response.data.data.used_days);
            setOverlap(response.data.data.leave_overlap);
            setMonthlyLeaveConsumption(response.data.data.monthly_leave_consumption);
            setTeamAvailability(response.data.data.team_availability);
            setTotalUsers(response.data.data.total_users);
            setRecentActivity(response.data.data.recent_activity);
        }catch (e) {
            setError(e.response.data.message);
        }
    }


    useEffect(() => {

        fetchAdminDashboard();
    }, []);

    return (
        <>
            <AppSidebar>
                <AdminAnalyticsContext.Provider value={{remainingBalance, pendingRequest, usedDays, overlap, teamAvailability, recentActivity, monthlyLeaveConsumption, totalUsers}}>
                    <div className="flex flex-col gap-4">
                        <div  className="w-full flex justify-between">
                            <div className="">
                                <h1 className="text-gray-600">Dashboard</h1>
                                <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>

                                <div>
                                    <Search />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Notifications />
                                <UserProfile />
                            </div>
                        </div>

                        <LeaveSummaryGrid/>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <LeaveOverlapTimeline role="admin" />
                            <MonthlyLeavesConsumption />
                            <TeamInsights />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <div className="lg:col-span-1">
                                <TeamCoverageWidget />
                            </div>

                            <div className="lg:col-span-2">
                                <RecentActivityTable />
                            </div>
                        </div>

                    </div>
                </AdminAnalyticsContext.Provider>
            </AppSidebar>

            {error && (
                <div className="text-red-600">{error}</div>
            )}
        </>
    )
}