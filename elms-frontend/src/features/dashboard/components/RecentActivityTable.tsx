"use client";


import { useContext } from "react";
import { format } from "date-fns";

import { LeaveSummaryContext } from "@/features/context/analytics/LeaveSummaryContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import {UserContext} from "@/features/context/UserContext.tsx";

import { employeeColumns, managerColumns, adminColumns } from "@/config/activityColumns";


import { Card } from "@/components/ui/card.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type {ColumnConfig} from "@/types/table.ts";
import type {LeaveActivityRecord} from "@/types/dashboard.ts";
import {ActivityTable} from "@/features/dashboard/components/ActivityTable.tsx";

type Role = "employee" | "manager" | "admin";

export default function RecentActivityTable() {

    const {user} = useContext(UserContext);
    const role = user.role || "";

    const employeeAnalytics = useContext(LeaveSummaryContext);
    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);

    const columnsByRole: Record<Role, ColumnConfig<LeaveActivityRecord>[]> = {
        employee: employeeColumns,
        manager: managerColumns,
        admin: adminColumns,
    };

    const dataByRole: Record<Role, LeaveActivityRecord[] | undefined> = {
        employee: employeeAnalytics?.recentActivity,
        manager: managerAnalytics?.recentActivity,
        admin: adminAnalytics?.recentActivity,
    };

    const columns = columnsByRole[role] ?? employeeColumns;
    const rows = dataByRole[role];
    const isLoading = rows === undefined;



    return (
        <Card className="w-full flex flex-col shadow-sm border border-gray-100">
            <div className="flex justify-between items-center px-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <ScrollArea className="h-[400px] w-full">
                <ActivityTable
                    columns={columns}
                    rows={rows}
                    isLoading={isLoading}
                    emptyMessage="No recent activity found."
                />
            </ScrollArea>
        </Card>
    );
}