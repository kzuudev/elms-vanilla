"use client";

import StatCard from "@/features/dashboard/components/StatCard";

import { DollarSign, Shapes, Calendar, FileWarning} from "lucide-react";

import { useLeaveTypeSummaryContext } from "@/features/context/leaves/LeaveTypeSummaryContext";

export default function LeaveTypeSummaryGrid() {

    const { leaveTypeSummary } = useLeaveTypeSummaryContext();


    return (

        <>
            <StatCard
                icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
                title="Total Leave Types"
                value={leaveTypeSummary?.total_leave_types?.total_leave_types ?? 0}
            />
            <StatCard
                icon={<Shapes className="w-6 h-6 text-green-500" />}
                title="Total Paid Leave Types"
                value={leaveTypeSummary?.total_paid_leave_types?.total_paid_leave_types ?? 0}
            />
            <StatCard
                icon={<Calendar className="w-6 h-6 text-blue-500" />}
                title="Total Unpaid Leave Types"
                value={leaveTypeSummary?.total_unpaid_leave_types?.total_unpaid_leave_types ?? 0}
            />
            <StatCard
                icon={<FileWarning className="w-6 h-6 text-red-500" />}
                title="Total Allocated Leave Types"
                value={leaveTypeSummary?.total_allocated_leave_types?.total_allocated_leave_types ?? 0}
            />
        </>
    )

    
}