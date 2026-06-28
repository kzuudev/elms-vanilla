"use client"

import {useContext} from "react";
import {LeaveSummaryContext} from "@/features/context/LeaveSummaryContext.tsx";
import { CircleUserRound } from 'lucide-react';
import { Card } from '@/components/ui/card.tsx';


export default function TeamCoverageWidget() {

    const {teamStatus} = useContext(LeaveSummaryContext);

    return (
        <>
            <Card className="p-4">
                <h2 className="text-lg font-semibold">Team Coverage</h2>

                <div>
                    {teamStatus?.map((team, index) => (
                        <div key={index} className="flex flex-col justify-between mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CircleUserRound className="text-gray-500 w-8 h-8 mr-2" />

                                    <span className="text-sm text-gray-500 mr-3">
                                    {team?.first_name} {team?.last_name}
                                    </span>
                                </div>

                                {team.is_active ? (
                                    <span className="text-sm text-green-500">Active</span>
                                ) : (
                                    <span className="text-sm text-red-600">Inactive</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-gray-500 mt-3">
                                <span>
                                    {team?.queued_leave_count} {' '} Request(s) in queue
                                </span>

                                <div className="flex gap-1">
                                    <p className="text-black font-bold">
                                        Leave Request Status:
                                    </p>
                                    <span>{team?.leave_request_status === null ? 'None' : team?.leave_request_status === 'approved' ? 'Approved' : 'Pending'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    )
}