"use client"

import SearchInput from "@/components/ui/search.tsx";
import AppSidebar from "@/components/manager/AppSidebar.tsx";
import LeaveStats from "@/components/LeaveStats.tsx";
import LeaveRequestTable from "@/components/LeaveRequestTable.tsx";
export default function LeavesDashboard() {

    return (
        <>
            <AppSidebar>
                <h1 className="text-gray-600">Dashboard</h1>
                <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>

                <div>
                    <SearchInput/>
                </div>

                <div>
                    <LeaveStats/>
                </div>

                <div>

                </div>
            </AppSidebar>
        </>
    )
}