"use client";


import { useContext } from "react";

import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

import { employeeColumns, managerColumns, adminColumns } from "@/config/activity-columns.tsx";

import { Card } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import type {ColumnConfig} from "@/types/table.ts";
import type {LeaveActivityRecord} from "@/types/dashboard.ts";
import {ActivityTable} from "@/features/dashboard/components/ActivityTable.tsx";
import {currentUserRole} from "@/utils/current-user-role.ts";
import type {UserRole} from "@/utils/current-user-role.ts";

export default function RecentActivityTable() {

    const {user} = useContext(AuthContext);
    const role = user.role || "";

    const currentRole = currentUserRole(role);

    const employeeAnalytics = useContext(EmployeeAnalyticsContext);
    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);

    const columnsByRole: Record<UserRole, ColumnConfig<LeaveActivityRecord>[]> = {
        employee: employeeColumns,
        manager: managerColumns,
        admin: adminColumns,
    };

    const dataByRole: Record<UserRole, LeaveActivityRecord[] | undefined> = {
        employee: employeeAnalytics?.recentActivity ?? [],
        manager: managerAnalytics?.recentActivity ?? [],
        admin: adminAnalytics?.recentActivity ?? [],
    };

    const columns = columnsByRole[currentRole] ?? employeeColumns;
    const rows = dataByRole[currentRole]
    const isLoading = rows === undefined;


    return (
        <Card className="w-full flex flex-col shadow-sm border border-gray-100">
            <div className="flex justify-between items-center px-3 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Recent Activity</h2>
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