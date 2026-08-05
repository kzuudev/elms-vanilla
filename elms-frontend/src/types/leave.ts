

export type LeaveType = {
    id: number;
    name: string;
}


export type TableData = {
    id: number;
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    assigned_name: string;
    assigned_to: number | null;
};

export type EmployeeDataTable = {
    id: number;
    employee_first_name: string;
    employee_last_name: string;
    employee_email: string;
    employee_phone: string;
    employee_role: string;
}

export type EmployeeDetails = {
    id: number;
    employee_first_name: string;
    employee_last_name: string;
    employee_email: string;
    employee_phone: string;
    employee_role: string;
    employee_leave_balance: [
        {
            leave_type_name: string,
            remaining_balance: number,
        },
    ]
    employee_department: string;
    employee_salary: string;
    employee_hired_date: string;
    employee_is_active: number;
}


export type LeaveRequestFormData = {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
}

export type LeaveRequest = {
    id: number;
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string | null;
    status: string;
    assigned_to: number | null;
    assigned_name: string;
    created_at: string;
    updated_at: string;
}

export type ReviewerLeaveData = {
    employee_name: string;
    employee_role: string;
    leave_type_name: string;
    id: number;
    user_id: number;
    leave_type: string;
    reason: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    assigned_to: string;
};


export type PersonalLeaveRequest = {
    id: number;
    user_id: number;
    leave_type: string;
    reason: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    assigned_name: string;
};


export type Profile = {
    id: number;
    name: string;
    email: string;
    role: string;
}
