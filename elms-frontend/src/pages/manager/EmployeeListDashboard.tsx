"use client";

import { useState, useEffect } from "react";
import {api} from "@/lib/api.ts";
import { UsersContext } from "@/features/context/UsersContext.tsx";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import EmployeeListTable from "@/features/employee/components/EmployeeListTable.tsx";

export default function EmployeeListDashboard() {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

        const holder = localStorage.getItem("token");

        const response = await api.get("/employees-list", {
            headers: {
                Authorization: `Bearer ${holder}`,
            }
        });
        console.log(response.data.employee_list);
        setUsers(response.data.employee_list);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [])

    return (
        <>
            <AppSidebar>
                <UsersContext.Provider value={{users, setUsers, fetchUsers}}>
                    <p>Hello</p>

                    <div className="mt-5">
                        <EmployeeListTable />
                    </div>
                </UsersContext.Provider>
            </AppSidebar>
        </>
    )

}
