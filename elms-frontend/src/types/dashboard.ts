



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

export type RecentActivity = {
    id: number;
    leave_type_name: string;
    manager_name: string | null;
    request_date: string;
    return_date: string;
    total_days: number;
    request_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}