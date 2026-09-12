import type {LeaveActivityRecord, AuditLogRecord} from "@/types/dashboard.ts";


export default function buildActivityNarrative(row: LeaveActivityRecord): string {

    if (row.leave_status === "approved") return `${row.employee_name} ${row.leave_type} was approved.`;
    if (row.leave_status === "pending") return `${row.employee_name}  requested ${row.leave_type}.`;
    if (row.leave_status === "rejected") return `${row.employee_name} ${row.leave_type} request was denied.`;

    return "";
}

export function buildAuditLogNarrative(row: AuditLogRecord) {

    const {actor_name, actor_role, action, subject_name, occurred_at, owner_name, changes, details} = row;

    const specificActor = `${actor_name} (${actor_role})`;


}