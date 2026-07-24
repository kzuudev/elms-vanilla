"use client"

import {useContext, useEffect, useState} from "react";
import {api} from "@/lib/api.ts";
import type {TotalRemainingBalance, TotalPendingRequest, TotalUsedDays, LeaveActivityRecord, TeamAvailability, MonthlyLeaveConsumption} from "@/types/dashboard.ts";

import {EmployeeAnalyticsContext} from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";
import MonthlyLeavesConsumption from "@/features/dashboard/components/MonthlyLeavesConsumption.tsx";
import BalanceBreakDownChart from "@/features/dashboard/components/BalanceBreakDownChart.tsx";
import TeamCoverageWidget from "@/features/dashboard/components/TeamCoverageWidget.tsx";
import RecentActivityTable from "@/features/dashboard/components/RecentActivityTable.tsx";
import Search from "@/components/ui/search.tsx";


export default function EmployeeDashboard() {

    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext)

    const [totalRemainingBalance, setTotalRemainingBalance] = useState<TotalRemainingBalance[]>();
    const [totalPendingRequest, setTotalPendingRequest] = useState<TotalPendingRequest[]>();
    const [totalUsedDays, setTotalUsedDays] = useState<TotalUsedDays[]>();
    const [monthlyLeaveConsumption, setMonthlyLeaveConsumption] = useState<MonthlyLeaveConsumption  []>();
    const [recentActivity, setRecentActivity] = useState<LeaveActivityRecord[]>();
    const [teamAvailability, setTeamAvailability] = useState<TeamAvailability[]>([]);
    const fetchEmployeeDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/employee-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setTotalRemainingBalance(response.data.total_remaining_balance);
            setTotalPendingRequest(response.data.total_pending_request);
            setTotalUsedDays(response.data.total_used_days);
            setMonthlyLeaveConsumption(response.data.monthly_leave_consumption);
            setRecentActivity(response.data.recent_activity);
            setTeamAvailability(response.data.team_availability);
        }catch (e) {
            setError(e.response.data.message);

        }
    }


    useEffect(() => {

        fetchEmployeeDashboard();
    }, [user]);


    return (
        <>
            <AppSidebar>
                <EmployeeAnalyticsContext.Provider value={{totalRemainingBalance, totalPendingRequest, totalUsedDays, recentActivity, teamAvailability, monthlyLeaveConsumption}}>
                   <div className="flex flex-col gap-4">
                       <div className="flex justify-between items-center">
                           <h1 className="text-lg text-black">Dashboard</h1>
                           <Search />
                       </div>

                       <LeaveSummaryGrid/>

                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           <BalanceBreakDownChart />
                           <MonthlyLeavesConsumption />
                           <TeamCoverageWidget />
                       </div>

                       <div>
                            <RecentActivityTable/>
                       </div>
                   </div>
                </EmployeeAnalyticsContext.Provider>

                {error && (
                    <div className="text-red-600">{error}</div>
                )}
            </AppSidebar>
        </>
    )
}