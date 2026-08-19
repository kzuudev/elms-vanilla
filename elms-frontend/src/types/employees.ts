

export type EmployeeData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    is_active: number;
}


export type EmployeeDetails = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    assigned_to: {
        id: number | null;
        name: string | null;
    } | null;
    department: string;
    salary: string;
    leave_balance:  [
        {
            leave_type_name: string,
            remaining_balance: number,
        },
    ]
    hired_date: string;
    is_active: number;
}

export type EmployeeSummary = {
    total_employees: number;
    total_active_employees: number;
    total_inactive_employees: number;
    total_on_leave_employees: number;
}

export type Manager = {
    id: number;
    first_name: string;
    last_name: string;
}

export type Admin = {
    id: number;
    first_name: string;
    last_name: string;
}