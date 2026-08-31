import { type LeaveType } from "@/types/leave-type.ts";

export const paidSelectedValue = (is_paid: LeaveType["is_paid"] | undefined) => {
    return Number(is_paid) === 1 ? "paid" : "unpaid";
}

export const toAllocatedDays = (value: unknown) => {
    const allocatedDays = Number(value);
    return Number.isFinite(allocatedDays) ? allocatedDays : 0;
}