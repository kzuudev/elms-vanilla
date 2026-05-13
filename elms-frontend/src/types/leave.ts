

export enum LeaveType {
    Annual = "annual_leave",
    Maternity = "maternity_leave",
    Sick = "sick_leave",
    Paternity = "paternity_leave",
}


export enum LeaveStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

export type LeaveBalance = {
    type: string,
    icon: React.ReactNode
    balance: number,
    used: number,
    total: number
}
export type TableData = {
    id: number;
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
};