import type {LeaveActivityRecord} from "@/types/dashboard.ts";


export default function buildActivityNarrative(row: LeaveActivityRecord) {

    if (row.status === "approved") return `${row.employee_name} ${row.leave_type} was approved.`;
    if (row.status === "pending") return `${row.employee_name}  requested ${row.leave_type}.`;
    if (row.status === "rejected") return `${row.employee_name} ${row.leave_type} request was denied.`;

    return "";
}

