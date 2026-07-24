"use client"

import {useContext} from "react";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";

import { ClipboardList, Users } from 'lucide-react';

import {validateDate} from "@/utils/on-leave.ts";
export default function TeamInsights() {

    const {user} = useContext(AuthContext);
    const role = user.role || "";

    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);

    const managementAnalytics = role.includes('manager') ? managerAnalytics : role.includes('admin') ? adminAnalytics : null;


    const teamSize = managementAnalytics?.teamAvailability?.length || 0;

    const activeWorkingCountFor = managementAnalytics?.teamAvailability || [];

    const activeWorkingCount = activeWorkingCountFor.filter(team => {

        // in case a team member doesn't have an active leave request
        if (!team.start_date || !team.end_date) {
            return team.is_active;
        }

        const startOfDay = new Date(team.start_date);
        const endOfDay = new Date(team.end_date);

       validateDate({
           start_date: startOfDay,
           end_date: endOfDay,
       });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(0, 0, 0, 0);


       const isApproved = team?.leave_status === 'approved';

       const isTodayWithinLeave = startOfDay && endOfDay
           ? (today >= startOfDay && today <= endOfDay)
           : false;

       const isOnLeave = isApproved && isTodayWithinLeave;

       return team.is_active && !isOnLeave;
   }).length || 0;


    const activeWorkingPercentage = teamSize > 0 ? (activeWorkingCount / teamSize) * 100 : 0;


    const backlogCount = managementAnalytics?.pendingRequest?.length || 0;



    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-base font-semibold text-gray-900">Team Insights</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className=" border border-gray-200 p-4 rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-3">Availability</span>
                                    <span className="text-3xl font-bold text-gray-900 mt-1">{activeWorkingPercentage.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 font-medium mb-3">Approval Backlog</span>
                                    <span className="text-3xl font-bold text-gray-900">{backlogCount}</span>
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
                                    <h2 className="text-sm font-medium text-gray-900 mb-3">Total Users</h2>
                                    <span className="text-3xl font-bold text-gray-900">{teamSize}</span>
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