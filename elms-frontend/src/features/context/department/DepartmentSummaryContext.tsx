import { createContext, useContext } from "react";

import type { DepartmentSummary } from "@/types/department";

interface DepartmentSummaryContextType {
    departmentSummary: DepartmentSummary | undefined;
    fetchDepartmentSummary: () => Promise<void>;    
}

export const DepartmentSummaryContext = createContext<DepartmentSummaryContextType | undefined>(undefined);

export function useDepartmentSummaryContext(): DepartmentSummaryContextType {
    const context = useContext(DepartmentSummaryContext);

    if (!context) {
        throw new Error("useDepartmentSummaryContext must be used within a DepartmentSummaryContext.Provider");
    }

    return context;
}
