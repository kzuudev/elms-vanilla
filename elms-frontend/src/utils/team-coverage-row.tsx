import type {RowConfig} from "@/types/card.ts";
import type {TeamAvailability} from "@/types/dashboard.ts";
import {isOnLeave} from "@/utils/on-leave.ts";
import {initials} from "@/utils/initials.ts";
import {dotColor} from "@/utils/dot-color.ts";

export const employeeRow: RowConfig<TeamAvailability>[] = [

    {title: "Team Availability", description: "Manage Your Team Availability." ,
        render: (row) => {
            const userIsOnLeave = isOnLeave(row);
            const statusColor = dotColor(row.is_active);
            const userInitials = initials(row.name);

            return (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            {userInitials}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{row.name}</span>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400">{row.role}</span>
                                <span className={userIsOnLeave ? "text-amber-600 text-xs" : !userIsOnLeave ? "text-green-600 text-xs" : "text-gray-400 text-xs"}>
                                    Status: {userIsOnLeave ? "On Leave" : "Active"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    Queued Leave Request Count: {row.queued_leave_count}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Dot / Indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColor} `}></div>
                    </div>
                </div>
            );
        }
    }

];

export const managerRow: RowConfig<TeamAvailability>[] = [
    {
        title: "Team Availability",
        description: "Monitor daily active staff and coverage in real time.",
        render: (row) => {
            const userIsOnLeave = isOnLeave(row);
            const statusColor = dotColor(row.is_active);
            const userInitials = initials(row.name);

            return (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            {userInitials}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{row.name}</span>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400">{row.role}</span>
                                <span className={userIsOnLeave ? "text-amber-600 text-xs" : !userIsOnLeave ? "text-green-600 text-xs" : "text-gray-400 text-xs"}>
                                    Status: {userIsOnLeave ? "On Leave" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Dot / Indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColor} `}></div>
                    </div>
                </div>
            );
        }
    }
];

export const adminRow: RowConfig<TeamAvailability>[] = [

    {title: "Team Availability", description: "Track real-time attendance, view active working status, and ensure optimal team coverage before approving time-off requests.",
        render: (row) => {
            const userIsOnLeave = isOnLeave(row);
            const statusColor = dotColor(row.is_active);
            const userInitials = initials(row.name);

            return (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            {userInitials}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{row.name}</span>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400">{row.role}</span>
                                <span className={userIsOnLeave ? "text-amber-600 text-xs" : !userIsOnLeave ? "text-green-600 text-xs" : "text-gray-400 text-xs"}>
                                    Status: {userIsOnLeave ? "On Leave" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Dot / Indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColor} `}></div>
                    </div>
                </div>
            );
        }

    }
];