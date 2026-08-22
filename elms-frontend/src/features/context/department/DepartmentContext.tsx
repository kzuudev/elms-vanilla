import { createContext } from "react";

import type { Department } from "@/types/department";

interface DepartmentContextType {
    departments: Department[];
    setDepartments: (departments: Department[]) => void;
    fetchDepartments: () => void;
    departmentDetails: Department | null;
    setDepartmentDetails: (department: Department) => void;
    fetchDepartmentDetails: (id: number) => void;
}

export const DepartmentContext = createContext<DepartmentContextType>({} as DepartmentContextType);