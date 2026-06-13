

export type UserData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    is_active: number;
}


export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    leave_balance:  [
        {
            leave_type_name: string,
            remaining_balance: number,
        },
    ]
    salary: string;
    hired_date: string;
    is_active: number;
}
