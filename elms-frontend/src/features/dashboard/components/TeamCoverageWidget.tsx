"use client"

import { SuperAdminAnalyticsContext } from "@/features/context/analytics/SuperAdminAnalyticsContext";

import { useContext } from "react";
import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import { useAuthContext } from "@/features/context/auth/AuthContext.tsx";

import type {RowConfig} from "@/types/card.ts";
import CoverageWidget from "@/features/dashboard/components/CoverageWidget.tsx";
import {employeeRow, managerRow, adminRow} from "@/utils/team-coverage-row.tsx";

import {normalizeRole, type UserRole} from "@/utils/roles";
import type { TeamAvailability} from "@/types/dashboard.ts";


export default function TeamCoverageWidget() {


    const { user } = useAuthContext();
    const role = user?.role || null;

    const employeeAnalytics = useContext(EmployeeAnalyticsContext);
    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);
    const superAdminAnalytics = useContext(SuperAdminAnalyticsContext);

    const currentRole = normalizeRole(role);

    const titleByRole : Record<UserRole, RowConfig<TeamAvailability>[]> = {
        employee: employeeRow,
        manager: managerRow,
        admin: adminRow,
        "super-admin": adminRow,
    }

    const dataByRole: Record<UserRole, TeamAvailability[] | undefined> = {
       employee: employeeAnalytics?.teamAvailability ?? undefined,
       manager: managerAnalytics?.teamAvailability ?? undefined,
       admin: adminAnalytics?.teamAvailability ?? undefined,
       "super-admin": superAdminAnalytics?.teamAvailability ?? undefined,
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