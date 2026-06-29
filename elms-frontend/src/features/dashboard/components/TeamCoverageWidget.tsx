"use client"

import { useContext } from "react";
import { LeaveSummaryContext } from "@/features/context/LeaveSummaryContext.tsx";
import { MoreHorizontal } from 'lucide-react'; // Swapped to the 3-dots icon from your design
import { Card } from '@/components/ui/card.tsx';

export default function TeamCoverageWidget() {
    const { teamStatus } = useContext(LeaveSummaryContext);

    return (
        <Card className="w-full p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header matching your design */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-900">Team Coverage</h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Team List Container */}
            <div className="flex flex-col gap-3">
                {/* .slice(0, 3) guarantees we only loop through the first 3 people */}
                {teamStatus?.slice(0, 3).map((team, index) => {

                    // Generate initials (e.g., "John Doe" becomes "JD")
                    const initials = `${team?.first_name?.charAt(0) || ''}${team?.last_name?.charAt(0) || ''}`.toUpperCase();

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
                                        {team?.first_name} {team?.last_name}
                                    </span>

                                    {/* Subtitle combining their active status and queue count */}
                                    <span className="text-xs font-medium text-gray-500 mt-0.5">
                                        {team.is_active ? 'Active' : 'Inactive'}
                                        <span className="mx-1.5">•</span>
                                        {team.queued_leave_count} in queue
                                        <span className="mx-1.5">•</span>
                                        Status: {team?.leave_request_status === null ? 'None' : team?.leave_request_status === 'approved' ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Right Side: The tiny status dot */}
                            <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                        </div>
                    );
                })}

                {/* Empty State Guard */}
                {(!teamStatus || teamStatus.length === 0) && (
                    <div className="text-center text-sm text-gray-500 py-6">
                        No team members found.
                    </div>
                )}
            </div>
        </Card>
    )
}