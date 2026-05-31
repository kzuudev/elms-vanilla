"use client"

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveDashboard from "@/pages/manager/LeaveDashboard.tsx";
import SearchInput from "@/components/ui/search.tsx";
import LeaveStats from "@/features/leaves/components/LeaveStats.tsx";

export default function ManagerLeaveDashboard() {
    return (
        <>
            <AppSidebar>
                    <div>
                        <div className="w-full">
                            <div className="w-full flex justify-between">
                                <div>
                                    <h1 className="text-gray-600">Dashboard</h1>
                                    <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                                </div>


                                <UserProfile />
                            </div>

                            <div>
                                <SearchInput />
                            </div>
                        </div>

                        <LeaveStats/>
                    </div>

                <main>
                    <LeaveDashboard/>
                </main>
            </AppSidebar>
        </>
    )
}