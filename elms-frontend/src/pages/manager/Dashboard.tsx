"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";
import LeaveOverlapTimeline from "@/features/dashboard/components/LeaveOverlapTimeline.tsx";

import {DashboardAnalyticsContext} from "@/features/context/analytics/DashboardAnalyticsContext.tsx";

import type {TotalPendingRequest, TotalRemainingBalance, TotalUsedDays, LeaveOverlap} from "@/types/dashboard.ts";

export default function ManagerDashboard() {


    const [error, setError] = useState<string | null>(null);

    const [remainingBalance, setRemainingBalance] = useState<TotalRemainingBalance[]>();
    const [pendingRequest, setPendingRequest] = useState<TotalPendingRequest[]>();
    const [usedDays, setUsedDays] = useState<TotalUsedDays[]>();
    const [overlap, setOverlap] = useState<LeaveOverlap[]>([]);


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

        }catch (e) {
            setError(e.response.data.message);
        }
    }

    console.log(overlap);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchManagerDashboard();
    }, []);

   return (
      <>
          <AppSidebar>
              <DashboardAnalyticsContext.Provider value={{remainingBalance, pendingRequest, usedDays, overlap, recentActivity: [], monthlyLeaveConsumption: []}}>
                  <div className="w-full flex justify-between">
                      <div>
                          <h1 className="text-gray-600">Dashboard</h1>
                          <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                      </div>

                      <UserProfile />
                  </div>

                  <div>
                      <LeaveSummaryGrid/>
                  </div>

                  <div>
                    <LeaveOverlapTimeline/>
                  </div>
              </DashboardAnalyticsContext.Provider>
          </AppSidebar>

          {error && (
              <div className="text-red-600">{error}</div>
          )}
      </>


   );
}

