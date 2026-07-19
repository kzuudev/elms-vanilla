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
    { header: "Duration", render: row => `${row.total_days} ${row.total_days > 1 ? "Days" : "Day"}` },
];