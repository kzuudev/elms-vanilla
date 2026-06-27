"use client";

import { useState, useEffect } from "react";
import {api} from "@/lib/api.ts";
import { UsersContext } from "@/features/context/UsersContext.tsx";


import AppSidebar from "@/components/layout/AppSidebar.tsx";
import EmployeeListTable from "@/features/employee/components/EmployeeListTable.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import LeaveStats from "@/features/leaves/components/LeaveStats.tsx";
import { type EmployeeDetails} from "@/types/leave.ts";

export default function EmployeeListDashboard() {

    const [employees, setEmployees] = useState([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({} as EmployeeDetails);

    const [error, setError] = useState<string | null>(null);

    const holder = localStorage.getItem("token");

    const fetchEmployees = async () => {


        const holder = localStorage.getItem("token");

        const response = await api.get("/employees-list", {
            headers: {
                Authorization: `Bearer ${holder}`,
            }
        });
        setEmployees(response.data.employee_list);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmployees();
    }, [])

    const fetchEmployeeDetails = async (id: number) => {

        try {

            const response = await api.get(`/employees-list/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setEmployeeDetails(response.data.employee_details);
            console.log(response.data.employee_details);
        }catch (e) {
            setError(e.response.data.message);
        }
    }



    return (
        <>
            <AppSidebar>
                <UsersContext.Provider value={{employees, setEmployees, fetchEmployees, employeeDetails, fetchEmployeeDetails}}>
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

                    {error && <div className="text-red-600">{error}</div>}
                </UsersContext.Provider>
            </AppSidebar>
        </>
    )

}
