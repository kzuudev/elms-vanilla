"use client"


import { useContext} from "react";

import {LeaveSummaryContext} from "@/features/context/LeaveSummaryContext.tsx";

import { Card } from '@/components/ui/card.tsx';

export default function LeaveSummaryGrid() {

    const {totalRemainingBalance, totalPendingRequest, totalUsedDays} = useContext(LeaveSummaryContext);


    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Remaining Balance</span>
                        <span className="text-sm text-gray-500">{totalRemainingBalance?.[0]?.grand_total ?? 0} Days</span>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Pending Approval</span>
                        <span className="text-sm text-gray-500">{totalPendingRequest?.[0].total_days ?? 0} Days</span>
                        <span className="text-sm text-gray-500">{totalPendingRequest?.[0].queued_leave_count ?? 0} Request in queue</span>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Used This Year</span>
                        <span className="text-sm text-gray-500">{totalUsedDays?.[0].total_used_days ?? 0} Days</span>
                        <span className="text-sm text-gray-500">Out of {totalUsedDays?.[0].total_allowed_days ?? 0} total allocation</span>
                    </div>
                </Card>
            </div>
        </>
    )
}