



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
    month_name: string,
    total_used_days: number,
}


// Manager and Admin Dashboard Types

export type TeamAvailability = {
    id: number;
    name: string;
    role: string;
    department: string;
    leave_type_id: number;
    leave_type: string;
    leave_status: string;
    start_date: string;
    end_date: string;
    is_active: boolean,
    queued_leave_count: number,
}

export type MonthlyConsumption = {
    month_num: number,
    month_name: string,
    total_used_days: number,
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

export type EmployeeRecentActivity = {
    id: number;
    date: string;
    member_name: string;
    recent_activity: string;
}

export type LeaveActivityRecord = {
    id: number;
    employee_name?: string;
    employee_role?: string;       // admin-only
    employee_department?: string; // admin-only
    manager_name?: string | null; // employee-only (who approved it)
    leave_type: string;
    leave_status: 'pending' | 'approved' | 'rejected';
    reason: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: boolean;
    created_at: string;
};