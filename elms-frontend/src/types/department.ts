
export interface Department {
    id: number;
    name: string;
    total_employees: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface DepartmentOptions {
    id: number;
    value: string;
    label: string;
}

export interface DepartmentSummary {
    total_departments: {
        total_department: number;
    };
    largest_department: {
        id: number;
        department_name: string;
        total_employees_in_department: number;
    };
    total_employees_assigned_to_department: {
        department_id: number;
        total_employees_assigned_to_department: number;
    }[];
    total_employees_not_assigned_to_department: {
        department_id: number;
        total_employees_not_assigned_to_department: number;
    }[];
}

export interface DepartmentEmployee {
    active_employees_by_department: {
        department_id: number;
        department_name: string;
        total_active_employees: number; 
    }[];
    on_leave_employees_by_department: {
        department_id: number;
        department_name: string;
        total_on_leave_employees: number;
    }[];
    total_employees_by_department: {
        department_id: number;
        department_name: string
        total_employees: number;
    }[];
}