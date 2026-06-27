"use client";


"use client";

import { useContext } from "react";
import { format } from "date-fns";
import { LeaveSummaryContext } from "@/features/context/LeaveSummaryContext.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"; // Adjust this import path to match your project

export default function RecentActivityTable() {
    const { recentActivity } = useContext(LeaveSummaryContext);

    const tableHeaders = ["Date", "Type", "Duration", "Status"];

    return (
        <Card className="w-full flex flex-col shadow-sm border border-gray-100">
            {/* Header Section matching your design */}
            <div className="flex justify-between items-center px-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm font-semibold text-blue-800 hover:text-blue-900">
                    View All
                </button>
            </div>

            {/* Your EXACT Table Format */}
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-border hover:bg-transparent">
                        {tableHeaders.map((header, index) => (
                            <TableHead key={index} className="text-gray-600 font-semibold py-3 h-auto">
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {/* Guard against null with a ternary operator or loading check */}
                    {!recentActivity ? (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                Loading recent activity...
                            </TableCell>
                        </TableRow>
                    ) : recentActivity.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                No recent leave requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        recentActivity.slice(0, 5).map((leave) => ( // .slice(0,5) limits it to 5 rows so the card doesn't get too long!
                            <TableRow key={leave.id} className="border-b border-gray-100">

                                {/* Date formatting matching "Oct 15 - Oct 20" */}
                                <TableCell className="text-gray-900">
                                    {leave.request_date === leave.return_date
                                        ? format(new Date(leave.request_date), 'MMM dd')
                                        : `${format(new Date(leave.request_date), 'MMM dd')} - ${format(new Date(leave.return_date), 'MMM dd')}`
                                    }
                                </TableCell>

                                <TableCell className="text-gray-900">{leave.leave_type_name}</TableCell>

                                {/* Dynamically adding "Day" or "Days" */}
                                <TableCell className="text-gray-900">
                                    {leave.total_days} {leave.total_days > 1 ? 'Days' : 'Day'}
                                </TableCell>

                                {/* Your exact status badges */}
                                {leave.request_status === "pending" ? (
                                    <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                ) : leave.request_status === "approved" ? (
                                    <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                ) : (
                                    <TableCell><span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}