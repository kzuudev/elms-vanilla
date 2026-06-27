"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";
import type {TotalRemainingBalance, TotalPendingRequest, TotalUsedDays} from "@/types/dashboard.ts";


import AppSidebar from "@/components/layout/AppSidebar.tsx";
import {LeaveSummaryContext} from "@/features/context/LeaveSummaryContext.tsx";

import LeaveSummaryGrid from "@/features/dashboard/components/LeaveSummaryGrid.tsx";



export default function EmployeeDashboard() {

    const [error, setError] = useState<string | null>(null);
    const [totalRemainingBalance, setTotalRemainingBalance] = useState<TotalRemainingBalance[]>();
    const [totalPendingRequest, setTotalPendingRequest] = useState<TotalPendingRequest[]>();
    const [totalUsedDays, setTotalUsedDays] = useState<TotalUsedDays[]>();
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>();
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
            setRecentActivity(response.data.recent_activity);
        }catch (e) {
            setError(e.response.data.message);

        }
    }


    useEffect(() => {

        fetchEmployeeDashboard();
    }, []);


    return (
        <>
            <AppSidebar>
                <LeaveSummaryContext.Provider value={{totalRemainingBalance, totalPendingRequest, totalUsedDays}}>
                    <h1>Employee Dashboard</h1>
                    <LeaveSummaryGrid/>
                </LeaveSummaryContext.Provider>
            </AppSidebar>
        </>
    )
}