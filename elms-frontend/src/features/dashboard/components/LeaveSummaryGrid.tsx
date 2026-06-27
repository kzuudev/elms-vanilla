"use client"


import { useContext} from "react";

import {LeaveSummaryContext} from "@/features/context/LeaveSummaryContext.tsx";

import { Card } from '@/components/ui/card.tsx';

import { Wallet, Hourglass, ClockCheck } from 'lucide-react';
export default function LeaveSummaryGrid() {

    const {totalRemainingBalance, totalPendingRequest, totalUsedDays} = useContext(LeaveSummaryContext);


    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
                <Card className="p-4">
                    <div className="flex flex-col justify-between gap-1">
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-sm text-black">Remaining Balance</span>
                            <Wallet className="text-gray-500 w-5 h-5" />
                        </div>

                        <div className="flex flex-col mt-10">
                            <p className="text-gray-500"><span className="text-sm text-black mt-8">{totalRemainingBalance?.[0]?.grand_total ?? 0} </span>Days</p>
                            <span className="text-sm text-gray-500">Refreshes Jan 1st</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-sm text-black">Pending Approval</span>
                            <Hourglass className="text-gray-500 w-5 h-5" />
                        </div>

                        <div className="flex flex-col mt-10 gap-1">
                            <p className="text-gray-500"><span className="text-sm text-black">{totalPendingRequest?.[0].total_days ?? 0}</span> Days</p>
                            <span className="text-sm text-gray-500">{totalPendingRequest?.[0].queued_leave_count ?? 0} Request in queue</span>
                        </div>

                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-sm text-black">Used This Year</span>
                            <ClockCheck className="text-gray-500 w-5 h-5" />
                        </div>

                        <div className="flex flex-col mt-10 gap-1">
                            <span className="text-sm text-black">{totalUsedDays?.[0].total_used_days ?? 0} Days</span>
                            <span className="text-sm text-gray-500">Out of {totalUsedDays?.[0].total_allocated_days ?? 0} total allocation</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-sm text-black">Upcoming Vacation</span>
                            <ClockCheck className="w-8 h-8 text-gray-500 border border-gray-300 rounded-full p-1 bg-gray-100" />
                        </div>

                        <div className="flex flex-col mt-8 gap-1">
                            <span className="text-sm text-gray-500">{totalUsedDays?.[0].total_used_days ?? 0} Days</span>
                            <span className="text-sm text-gray-500">Out of {totalUsedDays?.[0].total_allocated_days ?? 0} total allocation</span>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}