"use client";


import LeavesDashboard from "@/features/leaves/components/LeavesDashboard";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile";



export default function AdminLeavesDashboard() {
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
                    </div>
                </div>

                <main>
                    <LeavesDashboard role="admin"/>
                </main>
            </AppSidebar>
        </>
    );
}