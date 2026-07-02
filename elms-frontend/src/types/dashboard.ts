



export type TotalRemainingBalance = {
    grand_total: string,
}


export type TotalPendingRequest = {
    total_days: string,
    queued_leave_count: number,
}

export type TotalUsedDays = {
    total_used_days: string,
    total_allocated_days: string,
}

export type MonthlyLeaveConsumption = {
    month_num: number,
    total_used_days: number,
}

export type TeamStatus = {
    first_name: string,
    last_name: string,
    role: string,
    is_active: boolean,
    leave_request_status: string,
    queued_leave_count: number,
}

export type RecentActivity = {
    id: number;
    leave_type_name: string;
    manager_name: string | null;ß
    request_date: string;
    return_date: string;
    total_days: number;
    request_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}


// Manager Dashboard Types

export type PendingLeaveRequest = {
    pending_count: number,
    average_days_in_queue: number,
    oldest_request_days: number,
}