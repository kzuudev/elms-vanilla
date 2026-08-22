"use client";

import { DepartmentContext } from "@/features/context/department/DepartmentContext";


import { useContext } from 'react';

import StatCard from "@/features/dashboard/components/StatCard";

import { BuildingIcon, UsersIcon } from "lucide-react";

export default function DepartmentSummaryGrid() {

    const { departments, departmentDetails} = useContext(DepartmentContext);

    return (
        <>
        </>
    )
}



