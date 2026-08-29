import { createContext, useContext } from "react";

import type { Department } from "@/types/department";

interface DepartmentContextType {
    departments: Department[];
    fetchDepartments: () => Promise<void>;
    departmentDetails: Department | null;
    fetchDepartmentDetails: (id: number) => Promise<void>;
}

export const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function useDepartmentContext(): DepartmentContextType {
    const context = useContext(DepartmentContext);

    if (!context) {
        throw new Error("useDepartmentContext must be used within a DepartmentContext.Provider");
    }

    return context;
}