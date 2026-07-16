



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

export type TeamStatus = {
    first_name: string,
    last_name: string,
    role: string,
    is_active: boolean,
    leave_request_status: string,
    queued_leave_count: number,
}

// export type RecentActivity = {
//     id: number;
//     leave_type_name: string;
//     manager_name: string | null;
//     request_date: string;
//     return_date: string;
//     total_days: number;
//     request_status: 'pending' | 'approved' | 'rejected';
//     created_at: string;
// }


// Manager and Admin Dashboard Types

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

// export type ManagerRecentActivityData = {
//     id: number;
//     employee_name: string;
//     leave_type: string;
//     start_date: string;
//     end_date: string;
//     leave_status: string;
//     created_at: string;
// }
//
// export type AdminRecentActivityData = {
//     id: number;
//     employee_name: string;
//     employee_role: string;
//     employee_department: string;
//     leave_type: string;
//     start_date: string;
//     end_date: string;
//     leave_status: string;
//     created_at: string;
// }

export type LeaveActivityRecord = {
    id: number;
    employee_name: string;
    employee_role?: string;       // admin-only
    employee_department?: string; // admin-only
    manager_name?: string | null; // employee-only (who approved it)
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
};