import type {ColumnConfig} from "@/types/table.ts";
import type {LeaveActivityRecord} from "@/types/dashboard.ts";
import buildActivityNarrative from "@/utils/activity.tsx";
import { formatDate, formatDateRange } from "@/utils/date";

export const employeeColumns: ColumnConfig<LeaveActivityRecord>[] = [

    {header: "Date", render: row => formatDateRange(row.start_date, row.end_date)},
    {header: "Leave Type", render: row => row.leave_type},
    {header: "Duration", render: row => `${row.total_days} ${row.total_days > 1 ? "Days" : "Day"}` },
    {header: "Status", render: row => row.status},
];


export const managerColumns: ColumnConfig<LeaveActivityRecord>[] = [
    { header: "Date", render: row => formatDate(row.created_at) },
    { header: "Team Member", render: row => row.employee_name},
    { header: "Recent Activity", render: row => buildActivityNarrative(row) },
];


export const adminColumns: ColumnConfig<LeaveActivityRecord>[] = [
    { header: "Date Requested", render: row => formatDate(row.created_at) },
    { header: "Team Member", render: row => row.employee_name},
    { header: "Leave Type", render: row => row.leave_type },
    {
        header: "Status",
        render: row => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                row.leave_status === 'approved' ? 'bg-green-100 text-green-700' :
                    row.leave_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
            }`}>
                {row.leave_status.charAt(0).toUpperCase() + row.leave_status.slice(1)}
            </span>
        )
    },
    { header: "Duration", render: row => `${row.total_days} ${row.total_days > 1 ? "Days" : "Day"}` },
];