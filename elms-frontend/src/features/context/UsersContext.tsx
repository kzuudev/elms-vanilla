
import { createContext } from "react";
import { type Employee} from "@/types/leave.ts";

type UserContextEmployee = {
    users: Employee[];
    fetchUsers: () => void;
    setUsers: (users: Employee[]) => void;
}

export const UsersContext = createContext<UserContextEmployee | undefined>(undefined);