"use client"

import { useContext } from "react";
import { LeaveSummaryContext } from "@/features/context/analytics/LeaveSummaryContext.tsx";
import { Card } from '@/components/ui/card.tsx';
import { Wallet, Hourglass, ClockCheck, Plane } from 'lucide-react';

export default function LeaveSummaryGrid() {
    const { totalRemainingBalance, totalPendingRequest, totalUsedDays } = useContext(LeaveSummaryContext);

    return (
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
                            {totalRemainingBalance?.[0]?.grand_total ?? 0}
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
                            {totalPendingRequest?.[0]?.total_days ?? 0}
                        </span>
                        <span className="text-sm font-medium text-gray-500">Days</span>
                    </div>
                    <span className="text-sm text-gray-400">
                        {totalPendingRequest?.[0]?.queued_leave_count ?? 0} Request(s) in queue
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
                            {totalUsedDays?.[0]?.total_used_days ?? 0}
                        </span>
                        <span className="text-sm font-medium text-gray-500">Days</span>
                    </div>
                    <span className="text-sm text-gray-400">
                        Out of {totalUsedDays?.[0]?.total_allocated_days ?? 0} total allocation
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
    )
}