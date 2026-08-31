"use client";

import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import axios from "axios";

import { EmployeesContext } from "@/features/context/employees/EmployeesContext.tsx";

import { type EmployeeDetails} from "@/types/leave.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import EmployeeListTable from "@/features/employee/components/EmployeeListTable.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";

import EmployeeSummaryGrid from "@/features/dashboard/components/EmployeeSummaryGrid.tsx";
import UserFilterBar from "@/features/employees/components/UserFilterBar.tsx";



export default function EmployeesListDashboard() {

    const [employees, setEmployees] = useState([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({} as EmployeeDetails);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);


    const [error, setError] = useState<string | null>(null);

    const holder = localStorage.getItem("token");

    const fetchEmployees = async () => {
       try{
            const holder = localStorage.getItem("token");

            const response = await api.get("/employees-list", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            setEmployees(response.data.data.employee_list);
       }catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch employees");
            } else {
                setError("Failed to fetch employees");
            }
       }
    }

    const fetchEmployeeDetails = async (id: number) => {

        try {

            const response = await api.get(`/employees-list/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setEmployeeDetails(response.data.data.employee_details);
            console.log(response.data.data.employee_details);
        }catch (e) {
            setError(e.response.data.message);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmployees();
    }, [])

    return (
        <>
            <AppSidebar>
                <EmployeesContext.Provider value={{employees, setEmployees, fetchEmployees, employeeDetails, fetchEmployeeDetails}}>
                  <div className="flex flex-col gap-8">
                      <div className="w-full flex justify-between">
                          <div>
                              <h1 className="text-gray-600">Employees</h1>
                              <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                          </div>

                          <UserProfile />
                      </div>

                      <div className="w-full">
                          <EmployeeSummaryGrid/>
                      </div>


                      <div className="flex flex-col gap-4">
                          <UserFilterBar
                              onClearFilters={() => {
                                setSearchQuery('');
                                setStatusFilter(null);
                                setRoleFilter(null);
                                setDepartmentFilter(null);
                              }}
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              statusFilter={statusFilter ?? ''}
                              setStatusFilter={setStatusFilter}
                              roleFilter={roleFilter ?? ''}
                              setRoleFilter={setRoleFilter}
                              departmentFilter={departmentFilter ?? ''}
                              setDepartmentFilter={setDepartmentFilter}
                              onSearchSubmit={fetchEmployees}
                          />
                      </div>

                      <div className="mt-4">
                          <EmployeeListTable/>
                      </div>
                  </div>

                    {error && <div className="text-red-600">{error}</div>}
                </EmployeesContext.Provider>
            </AppSidebar>
        </>
    )

}
