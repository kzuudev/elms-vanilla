"use client";


import LeavesDashboard from "@/features/leaves/components/LeavesDashboard";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile";
import Notifications from "@/components/layout/Notifications.tsx";



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

                            <div className="flex items-center gap-4">
                                <Notifications />
                                <UserProfile />
                            </div>
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