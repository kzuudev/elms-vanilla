"use client";


import LeavesDashboard from "@/pages/admin/LeavesDashboard.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";


export default function AdminLeavesDashboard() {


    return (
        <>
            <AppSidebar>
                <LeavesDashboard/>
            </AppSidebar>
        </>
    )
}