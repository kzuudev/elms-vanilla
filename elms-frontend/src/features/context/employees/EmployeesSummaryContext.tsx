import { createContext  } from "react";
import type { EmployeeSummary } from "@/types/employees.ts";

export type EmployeesSummaryContextType = {
    employeeSummary: EmployeeSummary;
    fetchEmployeeSummary: () => Promise<void>;
};

export const EmployeesSummaryContext = createContext<EmployeesSummaryContextType | undefined>(undefined);