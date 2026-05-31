

export enum LeaveType {
    Sick = "Sick Leave",
    Annual = "Annual Leave",
    Paternity = "Paternity Leave",
    Maternity = "Maternity Leave",
    Beareavement = "Bereavement Leave",
    Public = "Public Holidays",
    Court = "Court Leave",
    Compoff = "Compensatory Off Leave",
    Sabbatical = "Sabbatical Leave",
    Extended = "Extended Medical Leave",

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
    leave_type_name: string;
    id: number;
    user_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    manager_name: string;

};

export type Employee = {
    id: number;
    employee_first_name: string;
    employee_last_name: string;
    employee_email: string;
    employee_phone: string;
    employee_role: string;

}

export type ManagerTableData = {
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
    manager_name: string;
};

export type Profile = {
    id: number;
    name: string;
    email: string;
    role: string;
}