"use client"

import { useContext } from "react";
import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import {ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import { UserContext } from "@/features/context/UserContext.tsx";

import {isOnLeave} from "@/utils/on-leave.ts";

import { MoreHorizontal } from 'lucide-react';

import { Card } from '@/components/ui/card.tsx';
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export default function TeamCoverageWidget() {


    const { user } = useContext(UserContext);
    const role = user.role || null;

    const employeeAnalytics = useContext(EmployeeAnalyticsContext);
    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);

    const managementAnalytics = role.includes('manager') ? managerAnalytics : role.includes('admin') ? adminAnalytics : null;


    const isManagement= role === 'manager' || role === 'admin';

    return (
        <>
            {isManagement ? (
                <Card className="w-full p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex flex-col">
                            <h2 className="text-base font-semibold text-gray-900">Team Coverage</h2>
                            <p className="text-gray-400 text-xs">Manage Team Availability</p>
                        </div>

                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Team List Container */}
                    <ScrollArea className="h-[350px]  w-full">
                        <div className="h-full flex flex-col gap-3">
                            {/* .slice(0, 3) guarantees we only loop through the first 3 people */}
                            {managementAnalytics?.teamAvailability?.slice(0, 10).map((team, index) => {

                                // Generate initials (e.g., "John Doe" becomes "JD")
                                const initials = `${team?.name.charAt(0) || ''} ${team.name?.charAt(team.name.length - 1) || ''}`.toUpperCase();
                                const dotColor = !team.is_active ? "bg-red-500" : team.is_active ? "bg-green-500" : "bg-amber-500";

                                isOnLeave({
                                    start_date: team.start_date,
                                    end_date: team.end_date,
                                    leave_status: team.leave_status,
                                });

                                const whoIsOnLeave = isOnLeave({
                                    start_date: team.start_date,
                                    end_date: team.end_date,
                                    leave_status: team.leave_status,
                                });

                                return (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">

                                        {/* Left Side: Avatar and Text */}
                                        <div className="flex items-center gap-4">

                                            {/* Initials Avatar (Replacing your generic CircleUserRound) */}
                                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                                {initials}
                                            </div>

                                            {/* Text Info */}
                                            <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">
                                                {team?.name}
                                            </span>
                                                {/* Subtitle combining their active status and queue count */}
                                                <div className="w-full flex justify-between">
                                                    <div className="flex flex-col">
                                                    <span className={whoIsOnLeave ? "text-amber-600 text-xs" : team.is_active ? "text-emerald-600 text-xs" : "text-gray-400"}>
                                                        Status: {whoIsOnLeave ? 'On Leave' : team.is_active ? 'Active' : 'Inactive'}
                                                    </span>


                                                        <span className="text-xs font-medium text-gray-500 mt-0.5">
                                                        Leave Request Status: {""}
                                                            <span className="text-gray-700 font-semibold">{!team?.leave_status ? 'None' : team?.leave_status === 'approved' ? 'Approved' : 'Pending'}</span>
                                                    </span>
                                                    </div>

                                                    {/* Right Side: The tiny status dot */}
                                                    <div className={`w-2 h-2 rounded-full ${dotColor} `}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty State Guard */}
                            {(!managementAnalytics.teamAvailability || managementAnalytics.teamAvailability.length === 0) && (
                                <div className="text-center text-sm text-gray-500 py-6">
                                    No team members found.
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                </Card>
            ) : <Card className="w-full p-6 shadow-sm border border-gray-100 flex flex-col h-full">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-900">Team Coverage</h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {/* .slice(0, 3) guarantees we only loop through the first 3 people */}
                    {employeeAnalytics?.teamAvailability?.slice(0, 3).map((team, index) => {

                        // Generate initials (e.g., "John Doe" becomes "JD"
                        const initials = `${team?.name?.charAt(0) || ''} ${team.name?.charAt(team?.name?.length - 1) || ''}`.toUpperCase();
                        // Determine the color of the right-side dot based on their status/queue
                        const dotColor = !team.is_active
                            ? "bg-red-500" // Inactive
                            : team.queued_leave_count > 0
                                ? "bg-amber-500" // Has pending leaves in the queue
                                : "bg-emerald-500"; // Active, no pending leaves

                        return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">

                                {/* Left Side: Avatar and Text */}
                                <div className="flex items-center gap-4">

                                    {/* Initials Avatar (Replacing your generic CircleUserRound) */}
                                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                        {initials}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">
                                        {team?.name}
                                    </span>

                                        {/* Subtitle combining their active status and queue count */}
                                        <span className="text-xs font-medium text-gray-500 mt-0.5">
                                        {team.is_active ? 'Active' : 'Inactive'}
                                            <span className="mx-1.5">•</span>
                                            {team.queued_leave_count} in queue
                                        <span className="mx-1.5">•</span>
                                        Status: {team?.leave_status === null ? 'None' : team?.leave_status === 'approved' ? 'Approved' : 'Pending'}
                                    </span>
                                    </div>
                                </div>

                                {/* Right Side: The tiny status dot */}
                                <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                            </div>
                        );
                    })}

                    {/* Empty State Guard */}
                    {(!employeeAnalytics || employeeAnalytics?.teamAvailability?.length === 0) && (
                        <div className="text-center text-sm text-gray-500 py-6">
                            No team members found.
                        </div>
                    )}
                </div>
            </Card>}
        </>
    )
}