
import { createContext } from "react";
import { type EmployeeDataTable, type EmployeeDetails} from "@/types/leave.ts";

type EmployeeContext = {
    employees: EmployeeDataTable[];
    setEmployees: (users: EmployeeDataTable[]) => void;
    fetchEmployees: () => void;
    employeeDetails: EmployeeDetails | null;
    fetchEmployeeDetails: (id: number) => void;
}

export const EmployeesContext = createContext<EmployeeContext | undefined>(undefined);