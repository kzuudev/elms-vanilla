"use client";

import { useState, useEffect } from "react";
import {api} from "@/lib/api.ts";
import { UsersContext } from "@/features/context/UsersContext.tsx";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import EmployeeListTable from "@/features/employee/components/EmployeeListTable.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveStats from "@/features/leaves/components/LeaveStats.tsx";

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
                  <div>
                      <div className="w-full flex justify-between">
                          <div>
                              <h1 className="text-gray-600">Dashboard</h1>
                              <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                          </div>

                          <UserProfile />
                      </div>

                      <div>
                        <LeaveStats/>
                      </div>

                      <div className="flex flex-col gap-4 mt-8">
                          <h2 className="text-xl font-semibold">Employee List</h2>
                          <EmployeeListTable />
                      </div>
                  </div>
                </UsersContext.Provider>
            </AppSidebar>
        </>
    )

}
