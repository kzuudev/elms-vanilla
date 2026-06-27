"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";
import type {TotalRemainingBalance} from "@/types/dashboard.ts";


import AppSidebar from "@/components/layout/AppSidebar.tsx";




export default function EmployeeDashboard() {

    const [error, setError] = useState<string | null>(null);
    const [remainingLeaves, setRemainingLeaves] = useState<TotalRemainingBalance>();

    const fetchEmployeeDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/employee-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setRemainingLeaves(response.data.total_remaining_leaves);
        }catch (e) {
            setError(e.response.data.message);

        }
    }


    useEffect(() => {

        fetchEmployeeDashboard();
    }, []);


    return (
        <>
            <AppSidebar>
                <h1>Employee Dashboard</h1>
            </AppSidebar>
        </>
    )
}