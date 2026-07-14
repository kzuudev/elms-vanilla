"use client"


import {useContext} from "react";
import {UserContext} from "@/features/context/UserContext.tsx";
import {DashboardAnalyticsContext} from "@/features/context/analytics/DashboardAnalyticsContext.tsx";

import { ClipboardList, Users } from 'lucide-react';


export default function TeamInsights() {

    const {user} = useContext(UserContext);
    const managementAnalytics = useContext(DashboardAnalyticsContext);

    const isManager = user?.role === 'manager';
    const isAdmin = user?.role === 'admin';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const teamSize = managementAnalytics?.teamAvailability?.length || 0;

    const activeWorkingCount = managementAnalytics?.teamAvailability.filter(team => {

        const startDay = new Date(team.start_date) || null;
        const endDay = new Date(team.end_date) || null;
        startDay.setHours(0, 0, 0, 0);
        endDay.setHours(0, 0, 0, 0);


        const isApproved = managementAnalytics?.teamAvailability.filter(team => team.leave_request_status === 'approved');
        const isTodayWithinLeave = startDay && endDay
            ? (today >= startDay && today <= endDay)
            : false;

        const isOnLeave = isApproved && isTodayWithinLeave;

        return team.user_status && !isOnLeave;
    }).length || 0;

    const activeWorkingPercentage = teamSize > 0 ? Math.round((activeWorkingCount / teamSize)) * 100 : 0;


    const backlogCount = managementAnalytics?.teamAvailability.filter(request => request.leave_request_status === 'pending').length || 0;


    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-900">Team Insights</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className=" border border-gray-200 p-4 rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Availability</span>
                                    <span className="text-2xl font-bold text-gray-900 mt-1">{activeWorkingPercentage.toFixed(0)}%</span>
                                    <span className="text-xs text-gray-400 mt-0.5">({activeWorkingCount} active)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 font-medium">Approval Backlog</span>
                                    <span className="text-2xl font-bold text-gray-900 mt-1">{backlogCount}</span>
                                </div>

                                <div className="w-12 h-12 rounded-full bg-gray-55 flex items-center justify-center text-gray-500 bg-gray-100">
                                    <ClipboardList size={22} className="text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h2 className="text-sm font-medium text-gray-900">Total Users</h2>
                                    <span className="text-2xl font-bold text-gray-900 mt-1">{teamSize}</span>
                                </div>
                                
                                <div className="w-12 h-12 rounded-full bg-gray-55 flex items-center justify-center text-gray-500 bg-gray-100">
                                    <Users size={22} className="text-gray-600" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}