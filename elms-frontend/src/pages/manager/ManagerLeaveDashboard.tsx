"use client"

import { UserContext } from "@/features/context/UserContext.tsx";
import { useContext } from "react";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import LeaveDashboard from "@/pages/manager/LeaveDashboard.tsx";
import SearchInput from "@/components/ui/search.tsx";
import LeaveStats from "@/features/leaves/components/LeaveStats.tsx";

export default function ManagerLeaveDashboard() {

    const {user} = useContext(UserContext);

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

                                <div>
                                    <p className="text-sm text-black">
                                        {user?.name || "Manager"}
                                    </p>
                                    <p className="text-sm text-gray-500">{user?.email || "Manager"}!</p>
                                </div>
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