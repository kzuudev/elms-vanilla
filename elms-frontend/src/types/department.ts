
export interface Department {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface DepartmentOptions {
    id: number;
    value: string;
    label: string;
}

export interface DepartmentSummary {
    total_departments: number;
    total_employees_by_department: number;
    largest_department: number;
    total_employees_assigned_to_department: number;
    total_employees_not_assigned_to_department: number;
}