import { createContext, useContext } from "react";
import type { DepartmentEmployee } from "@/types/department";

export interface DepartmentEmployeesContextType {
    departmentEmployees: DepartmentEmployee | undefined;
    fetchDepartmentEmployees: () => Promise<void>;
}

export const DepartmentEmployeesContext = createContext<DepartmentEmployeesContextType | undefined>(undefined);

export function useDepartmentEmployeesContext(): DepartmentEmployeesContextType {
    const context = useContext(DepartmentEmployeesContext);

    if (!context) {
        throw new Error("useDepartmentEmployeesContext must be used within a DepartmentEmployeesContext.Provider");
    }

    return context;
}