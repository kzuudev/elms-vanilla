
import { createContext } from "react";
import { type EmployeeDataTable, type EmployeeDetails} from "@/types/leave.ts";

type EmployeeContextEmployee = {
    employees: EmployeeDataTable[];
    fetchEmployees: () => void;
    setEmployees: (users: EmployeeDataTable[]) => void;
    employeeDetails: EmployeeDetails | null;
    fetchEmployeeDetails: (id: number) => void;

}

export const UsersContext = createContext<EmployeeContextEmployee | undefined>(undefined);