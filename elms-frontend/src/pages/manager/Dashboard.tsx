"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";
import {LeaveSummaryContext} from "@/features/context/analytics/LeaveSummaryContext.tsx";

import type {TotalPendingRequest, TotalRemainingBalance, TotalUsedDays} from "@/types/dashboard.ts";

export default function ManagerDashboard() {


    const [error, setError] = useState<string | null>(null);

    const [totalRemainingBalance, setTotalRemainingBalance] = useState<TotalRemainingBalance[]>();
    const [totalPendingRequest, setTotalPendingRequest] = useState<TotalPendingRequest[]>();
    const [totalUsedDays, setTotalUsedDays] = useState<TotalUsedDays[]>();


    const fetchManagerDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/manager-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setTotalRemainingBalance(response.data.remaining_balance);
            setTotalPendingRequest(response.data.pending_request);
            setTotalUsedDays(response.data.used_days);
        }catch (e) {
            setError(e.response.data.message);
        }
    }

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchManagerDashboard();
    }, []);

   return (
      <>
          <AppSidebar>
              <LeaveSummaryContext value={{totalRemainingBalance, totalPendingRequest, totalUsedDays, recentActivity: [], teamStatus: [], monthlyLeaveConsumption: []}}>
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
              </LeaveSummaryContext>
          </AppSidebar>

          {error && (
              <div className="text-red-600">{error}</div>
          )}
      </>


   );
}

