import { createContext } from "react";
import type { DepartmentEmployee } from "@/types/department";

export interface DepartmentEmployeesContextType {
    departmentEmployees: DepartmentEmployee | undefined;
    setDepartmentEmployees: (departmentEmployees: DepartmentEmployee) => void;
    fetchDepartmentEmployees: () => void;
}

export const DepartmentEmployeesContext = createContext<DepartmentEmployeesContextType>({} as DepartmentEmployeesContextType);