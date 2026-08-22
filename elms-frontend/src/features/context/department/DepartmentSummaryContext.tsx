import { createContext } from "react";

import type { DepartmentSummary } from "@/types/department";

interface DepartmentSummaryContextType {
    departmentSummary: DepartmentSummary | undefined;
    setDepartmentSummary: (departmentSummary: DepartmentSummary) => void;
    fetchDepartmentSummary: () => void;
}

export const DepartmentSummaryContext = createContext<DepartmentSummaryContextType>({
    departmentSummary: undefined,
    setDepartmentSummary: () => {},
    fetchDepartmentSummary: () => {}
});

