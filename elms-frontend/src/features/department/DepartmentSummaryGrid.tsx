"use client";

import { useContext } from 'react';

import { DepartmentSummaryContext } from "@/features/context/department/DepartmentSummaryContext";

import StatCard from "@/features/dashboard/components/StatCard";

import { BuildingIcon, UsersIcon, UserX, ChartNoAxesColumn } from "lucide-react";

export default function DepartmentSummaryGrid() {

    const { departmentSummary } = useContext(DepartmentSummaryContext);

    const totalDepartments =
        departmentSummary?.total_departments?.total_department ?? 0;

    const totalAssigned =
        departmentSummary?.total_employees_assigned_to_department?.reduce(
            (sum, department) => sum + department.total_employees_assigned_to_department,
            0,
        ) ?? 0;

    const largest = departmentSummary?.largest_department;

    const totalUnassigned =
        departmentSummary?.total_employees_not_assigned_to_department?.reduce(
            (sum, department) => sum + department.total_employees_not_assigned_to_department,
            0,
        ) ?? 0;

    return (
        <>
            <StatCard
                icon={<BuildingIcon className="w-6 h-6 text-yellow-500" />}
                title="Total Departments"
                value={totalDepartments}
            />
            <StatCard
                icon={<UsersIcon className="w-6 h-6 text-green-500" />}
                title="Total Employees Assigned"
                value={totalAssigned}
            />
            <StatCard
                icon={<ChartNoAxesColumn className="w-6 h-6 text-blue-500" />}
                title="Largest Department"
                value={largest?.department_name ?? "—"}
                hint={largest ? `(${largest.total_employees_in_department})` : undefined}
            />
            <StatCard
                icon={<UserX className="w-6 h-6 text-red-500" />}
                title="Total Employees Not Assigned"
                value={totalUnassigned}
            />
        </>
    )
}



