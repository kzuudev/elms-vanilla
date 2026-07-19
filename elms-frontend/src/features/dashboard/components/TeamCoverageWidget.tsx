"use client"

import { useContext } from "react";
import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import { UserContext } from "@/features/context/UserContext.tsx";

import type {RowConfig} from "@/types/card.ts";
import CoverageWidget from "@/features/dashboard/components/CoverageWidget.tsx";
import {employeeRow, managerRow, adminRow} from "@/utils/team-coverage-row.tsx";

import {currentUserRole, type UserRole} from "@/utils/current-user-role.ts";
import {isOnLeave} from "@/utils/on-leave.ts";
import type { TeamAvailability} from "@/types/dashboard.ts";


export default function TeamCoverageWidget() {


    const { user } = useContext(UserContext);
    const role = user.role || null;

    const employeeAnalytics = useContext(EmployeeAnalyticsContext);
    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);

    const currentRole = currentUserRole(role);

    const titleByRole : Record<UserRole, RowConfig<TeamAvailability>[]> = {
        employee: employeeRow,
        manager: managerRow,
        admin: adminRow,
    }

    const dataByRole: Record<UserRole, TeamAvailability[] | undefined> = {
       employee: employeeAnalytics?.teamAvailability,
       manager: managerAnalytics?.teamAvailability,
       admin: adminAnalytics?.teamAvailability,
    }


    const rows = dataByRole[currentRole]  ?? [];
    const title = titleByRole[currentRole];
    const isLoading = rows === undefined;


    return (
        <>
            <CoverageWidget
                column={title}
                rows={rows}
                isLoading={isLoading}
                emptyMessage="No team coverage data available."
            />
        </>

    )
}