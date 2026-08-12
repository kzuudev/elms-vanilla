"use client"

import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { api } from "@/lib/api.ts";
import type { EmployeeSummary, EmployeeData } from "@/types/employees.ts";

import UserFilterBar from "@/features/employees/components/UserFilterBar.tsx";
import { buildQueryString } from "@/utils/query-string.ts";
import { SummaryEmployeeContext } from "@/features/context/employees/SummaryEmployeesContext.tsx";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

import EmployeesListTable from "@/features/employees/components/EmployeesListTable.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Register from "@/pages/auth/register.tsx";
import EmployeeSummaryGrid from "@/features/dashboard/components/EmployeeSummaryGrid.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";
import Notifications from "@/components/layout/Notifications.tsx";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function EmployeesDashboard({role} : {role: string}) {

    const { user } = useContext(AuthContext);

    const [isFormOpen, setIsOpenForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [employees, setEmployees] = useState<EmployeeData[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);

    const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary>({
        total_employees: 0,
        total_active_employees: 0,
        total_inactive_employees: 0,
        total_on_leave_employees: 0,
    });

    role = user.role;
    const isAdmin = role === 'admin';

    const fetchEmployees = async () => {
        try {
            const holder = localStorage.getItem("token");
            const queryString = buildQueryString({ search: searchQuery, status: statusFilter, department: departmentFilter, role: roleFilter });
            const response = await api.get(`/employees${queryString}`, {
                headers: { Authorization: `Bearer ${holder}` },
            });
            setEmployees(response.data.data.employees);
            setError(null);
        } catch (e) {
            if (axios.isCancel(e)) return;
            setError((e as AxiosError)?.response?.data?.message || "A network error occurred.");
        }
    };

    const fetchEmployeeSummary = async () => {
        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/employees/summary", {
                headers: { Authorization: `Bearer ${holder}` },
            });

            if (response.data?.data?.employee_summary) {
                setEmployeeSummary(response.data.data.employee_summary);
            }
        } catch (e) {
            if (axios.isCancel(e)) return;
            if (axios.isAxiosError(e)) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchEmployeeSummary();
    }, []);


    return (
        <AppSidebar>
            <SummaryEmployeeContext.Provider value={{ employeeSummary, setEmployeeSummary }}>
                <div className="flex justify-between">
                    <div className="w-full flex flex-col gap-8 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-semibold text-blue-400">Employees</h1>
                                <p className="text-gray-500 text-xs">Manage all employees</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Notifications />
                                <UserProfile />
                            </div>
                        </div>

                        <div className="w-full">
                            <EmployeeSummaryGrid />
                        </div>

                        <div className="flex justify-between items-center">
                            <UserFilterBar
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

                            {isAdmin && (
                                <Dialog open={isFormOpen} onOpenChange={setIsOpenForm}>
                                    <DialogTrigger asChild>
                                        <Button className="text-sm rounded-md bg-blue-500 text-white px-4 py-2">
                                            Register New User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-full sm:max-w-[425px] py-6 px-2 bg-white border-0 outline-none shadow-xl">
                                        <Register closeDialog={() => setIsOpenForm(false)} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    {employees?.some(employee => employee.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                        <EmployeesListTable employees={employees} onUserMutated={fetchEmployees} />
                    ) : (
                        <div className="text-center text-gray-500">
                            0 users found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </SummaryEmployeeContext.Provider>

            {error && <div className="text-red-500">{error}</div>}
        </AppSidebar>
    );
}