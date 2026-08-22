import { createContext } from "react";

import type { DepartmentSummary } from "@/types/department";

interface DepartmentSummaryContextType {
    departmentSummary: DepartmentSummary | null;
    setDepartmentSummary: (departmentSummary: DepartmentSummary) => void;
    fetchDepartmentSummary: () => void;
}

export const DepartmentSummaryContext = createContext<DepartmentSummaryContextType>({
    departmentSummary: null,
    setDepartmentSummary: () => {},
    fetchDepartmentSummary: () => {}
});

