import { createContext, type Dispatch, type SetStateAction } from "react";
import type { EmployeeSummary } from "@/types/employees.ts";

export type SummaryEmployeeContextType = {
    employeeSummary: EmployeeSummary;
    setEmployeeSummary: Dispatch<SetStateAction<EmployeeSummary>>;
};

export const SummaryEmployeeContext = createContext<SummaryEmployeeContextType | undefined>(undefined);