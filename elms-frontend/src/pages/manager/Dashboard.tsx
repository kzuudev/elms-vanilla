"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";

import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";
import LeaveOverlapTimeline from "@/features/dashboard/components/LeaveOverlapTimeline.tsx";
import MonthlyLeavesConsumption from "@/features/dashboard/components/MonthlyLeavesConsumption.tsx";
import TeamCoverageWidget from "@/features/dashboard/components/TeamCoverageWidget.tsx";
import TeamInsights from "@/features/dashboard/components/TeamInsights.tsx";
import RecentActivityTable from "@/features/dashboard/components/RecentActivityTable.tsx";
import Notifications from "@/components/layout/Notifications.tsx";


import type {
    TotalPendingRequest,
    TotalRemainingBalance,
    TotalUsedDays,
    LeaveOverlap,
    MonthlyConsumption,
    TeamAvailability,
    TotalUsers,
    LeaveActivityRecord
} from "@/types/dashboard.ts";
import Search from "@/components/ui/search.tsx";




export default function ManagerDashboard() {


    const [error, setError] = useState<string | null>(null);

    const [remainingBalance, setRemainingBalance] = useState<TotalRemainingBalance[]>();
    const [pendingRequest, setPendingRequest] = useState<TotalPendingRequest[]>();
    const [usedDays, setUsedDays] = useState<TotalUsedDays[]>();
    const [overlap, setOverlap] = useState<LeaveOverlap[]>([]);
    const [monthlyLeaveConsumption, setMonthlyLeaveConsumption] = useState<MonthlyConsumption[]>([]);
    const [teamAvailability, setTeamAvailability] = useState<TeamAvailability[]>([]);
    const [totalUsers, setTotalUsers] = useState<TotalUsers[]>([]);
    const [recentActivity, setRecentActivity] = useState<LeaveActivityRecord[]>([]);


    const fetchManagerDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/manager-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setRemainingBalance(response.data.remaining_balance);
            setPendingRequest(response.data.pending_request);
            setUsedDays(response.data.used_days);
            setOverlap(response.data.leave_overlap);
            setMonthlyLeaveConsumption(response.data.monthly_leave_consumption);
            setTeamAvailability(response.data.team_availability);
            setTotalUsers(response.data.total_users);
            setRecentActivity(response.data.recent_activity);
        }catch (e: any) {
            setError(e.response?.data?.message || "An error occurred while fetching manager dashboard");
        }
    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchManagerDashboard();
    }, []);

   return (
      <>
          <AppSidebar>
              <ManagerAnalyticsContext.Provider value={{remainingBalance, pendingRequest, usedDays, overlap, teamAvailability, recentActivity, monthlyLeaveConsumption, totalUsers}}>
                  <div className="flex flex-col gap-4">
                      <div  className="w-full flex justify-between">
                          <div className="">
                              <h1 className="text-gray-600">Dashboard</h1>
                              <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                          </div>

                          <div className="flex items-center gap-2">
                            <Notifications />
                            <UserProfile />
                          </div>
                      </div>

                      <LeaveSummaryGrid/>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <LeaveOverlapTimeline />
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
              </ManagerAnalyticsContext.Provider>
          </AppSidebar>

          {error && (
              <div className="text-red-600">{error}</div>
          )}
      </>


   );
}

