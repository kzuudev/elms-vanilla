export interface LeaveType {
    id: number;
    name: string;
    allocated_days: number;
    is_paid: boolean;
}


export interface LeaveTypeSummary {
    total_leave_types: {
        total_leave_types: number;
    };
    total_paid_leave_types: {
        total_paid_leave_types: number;
    };
    total_unpaid_leave_types: {
        total_unpaid_leave_types: number;
    };
    total_allocated_leave_types: {
        total_allocated_leave_types: number;
    };
}

export interface LeaveTypeOptions {
    id: number;
    value: string;
    label: string;
}