"use client";

import { useContext } from "react";
import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import { ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import {UserContext} from "@/features/context/UserContext.tsx";

import { Card } from '@/components/ui/card.tsx';
import { Wallet, Hourglass, ClockCheck, Plane } from 'lucide-react';

export default function LeaveSummaryGrid() {

    const { user } = useContext(UserContext);


    const role = user.role || null;
    const isManager = role === 'manager';
    const isAdmin = role === 'admin';

    const leaveSummary = useContext(EmployeeAnalyticsContext);
    const managerDashboardAnalytics = useContext(ManagerAnalyticsContext);
    const adminDashboardAnalytics = useContext(AdminAnalyticsContext);

    const remainingBalance = isManager ? managerDashboardAnalytics?.remainingBalance?.[0].grand_total ?? 0
        : isAdmin ? adminDashboardAnalytics?.remainingBalance?.[0].grand_total ?? 0 : leaveSummary?.totalRemainingBalance?.[0]?.grand_total ?? 0;


    const pendingRequest = isManager ? managerDashboardAnalytics?.pendingRequest?.[0]?.total_days ?? 0
        : isAdmin ? adminDashboardAnalytics?.pendingRequest?.[0]?.total_days ?? 0 : leaveSummary?.totalPendingRequest?.[0]?.total_days ?? 0;

    const pendingQueue = isManager ? managerDashboardAnalytics?.pendingRequest?.[0]?.queued_leave_count ?? 0
        : isAdmin ? adminDashboardAnalytics?.pendingRequest?.[0]?.queued_leave_count ?? 0 : leaveSummary?.totalPendingRequest?.[0]?.queued_leave_count ?? 0;

    const usedDays = isManager ? managerDashboardAnalytics?.usedDays?.[0]?.total_used_days ?? 0
        : isAdmin ? adminDashboardAnalytics?.usedDays?.[0]?.total_used_days ?? 0 : leaveSummary?.totalUsedDays?.[0]?.total_used_days ?? 0;

    const allocatedDays = isManager ? managerDashboardAnalytics?.usedDays?.[0]?.total_allocated_days ?? 0
        : isAdmin ? adminDashboardAnalytics?.usedDays?.[0]?.total_allocated_days ?? 0 : leaveSummary?.totalUsedDays?.[0]?.total_allocated_days ?? 0;


    return (

        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">

                {/* 1. Remaining Balance */}
                <Card className="p-5 border-gray-200 shadow-sm rounded-xl flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-900">Remaining Balance</span>
                        {/* Blue tinted icon background */}
                        <div className="bg-blue-50 p-2 rounded-full border border-blue-100/50">
                            <Wallet className="text-blue-600 w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-gray-900">
                            {remainingBalance}
                        </span>
                            <span className="text-sm font-medium text-gray-500">Days</span>
                        </div>
                        <span className="text-sm text-gray-400">Refreshes Jan 1st</span>
                    </div>
                </Card>

                {/* 2. Pending Approval */}
                <Card className="p-5 border-gray-200 shadow-sm rounded-xl flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-900">Pending Approval</span>
                        {/* Amber tinted icon background for 'pending' state */}
                        <div className="bg-amber-50 p-2 rounded-full border border-amber-100/50">
                            <Hourglass className="text-amber-600 w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-gray-900">
                            {pendingRequest}
                        </span>
                            <span className="text-sm font-medium text-gray-500">Days</span>
                        </div>
                        <span className="text-sm text-gray-400">
                        {pendingQueue} Request(s) in queue
                    </span>
                    </div>
                </Card>

                {/* 3. Used This Year */}
                <Card className="p-5 border-gray-200 shadow-sm rounded-xl flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-900">Used This Year</span>
                        {/* Neutral gray tinted icon background */}
                        <div className="bg-gray-100 p-2 rounded-full border border-gray-200/50">
                            <ClockCheck className="text-gray-600 w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-gray-900">
                            {usedDays}
                        </span>
                            <span className="text-sm font-medium text-gray-500">Days</span>
                        </div>
                        <span className="text-sm text-gray-400">
                        Out of {allocatedDays} total allocation
                    </span>
                    </div>
                </Card>

                {/* 4. Next Upcoming Leave (Hardcoded Custom Blue Card) */}
                <Card className="p-5 border-transparent shadow-sm rounded-xl flex flex-col justify-between bg-[#0a3977] text-white">
                    <div className="flex items-start justify-between opacity-90">
                        <span className="text-sm font-medium">Next Upcoming Leave</span>
                        <Plane className="w-5 h-5" />
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">Oct 15th</span>
                            <span className="text-sm font-medium opacity-90">Vacation</span>
                        </div>

                        {/* Small white pill badge */}
                        <div className="bg-white text-[#0a3977] text-xs font-bold px-3 py-1.5 rounded-full w-max shadow-sm mt-1">
                            In 14 Days
                        </div>
                    </div>
                </Card>

            </div>
        </>
    )
}