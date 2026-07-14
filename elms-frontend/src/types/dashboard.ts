



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
    total_used_days: string,
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


export type TeamAvailability = {
    user_id: number;
    employee_first_name: string;
    employee_last_name: string;
    user_position: string;
    user_status: boolean;
    department: string;
    leave_type_id: number;
    leave_type_name: string;
    leave_request_status: string; // e.g., "approved"
    start_date: string;           // e.g., "2026-07-05"
    end_date: string;
}

export type MonthlyConsumption = MonthlyLeaveConsumption[]

export type BacklogRequest = {
    total_request: number,
    total_days: number,
    average_days: number,
}


// Represents request that already approve
export type ConflictingLeave = {
    id: number,
    employee_first_name: string;
    employee_last_name: string;
    employee_role: string,
    leave_type_name: string,
    leave_request_status: string,
    start_date: string,
    end_date: string,
}

// Represents the pending request
export type RecentLeaveRequest = {
    id: number,
    employee_first_name: string;
    employee_last_name: string;
    employee_role: string,
    leave_type_name: string,
    leave_request_status: string,
    start_date: string,
    end_date: string,
    has_overlap: boolean,
    conflict_requests: ConflictingLeave[],

}

export type TotalUsers = {
    total_users: number,
    total_active_users: number,
    total_inactive_users: number,
    total_departs_users: number,
}


// Pending Leave Request possible to overlap
export type OverlappingLeave = {
    id: number;
    employee_first_name: string;
    employee_last_name: string;
    start_date: string;
    total_days: number;
    end_date: string;
    leave_type_id: number;
    leave_request_status: string;
    leave_type_name: string;
}

export type LeaveOverlap = {
    user_id: number;
    first_name: string;
    last_name: string;
    leave_type: string;
    leave_status: string;
    total_days: number;
    department: string;
    start_date: string;
    end_date: string;
    overlap: OverlappingLeave[];
}
