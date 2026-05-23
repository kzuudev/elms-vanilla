"use client"


import AppSidebar from "@/components/layout/AppSidebar.tsx";
import EmployeeLeavesListDashboard from "@/pages/manager/EmployeeLeavesListDashboard.tsx";
import SearchInput from "@/components/ui/search.tsx";
import LeaveStats from "@/features/leaves/components/LeaveStats.tsx";
export default function LeavesDashboard() {

    return (
        <>
            <AppSidebar>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-gray-600">Dashboard</h1>
                        <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>

                        <div>
                            <SearchInput />
                        </div>
                    </div>
                </div>
               <EmployeeLeavesListDashboard/>
            </AppSidebar>
        </>
    )
}