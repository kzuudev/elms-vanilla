
import './App.css'
import axios from "axios";
import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import ManagerDashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
import AdminDashboard from './pages/admin/Admin'
import {UserContext} from "@/features/context/UserContext.tsx";
import {LeaveBalanceContext} from "@/features/context/LeaveBalanceContext.tsx";
import { type Profile} from "@/types/leave.ts";
import { type LeaveBalance} from "@/types/leave-balance.ts";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute.tsx";
import LeaveRequestDashboard from "@/pages/employee/LeaveRequestDashboard.tsx";
import ManagerLeaveDashboard from "@/pages/manager/ManagerLeaveDashboard.tsx";
import EmployeeListDashboard from "@/pages/manager/EmployeeListDashboard.tsx";
import UsersDashboard from "@/pages/admin/UsersDashboard.tsx";
import AdminLeavesDashboard from "@/pages/admin/AdminLeavesDashboard.tsx";

function App() {

    // get the current user logged-in and parse it into object (Profile).
    const [user, setUser] = useState<Profile | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as Profile: null;
    });

    const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
    const [error, setError] = useState<string | null>(null);


    const fetchLeaveBalance = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/leave-balance/me", {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
            })
            setLeaveBalance(response.data.balances);
            console.log(response.data.balances);
        }catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message || "Failed to fetch balances");
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    const [isFormOpen, setIsOpenForm] = useState(false);

    useEffect(() => {
        fetchLeaveBalance();
    }, []);

  return (
    <>
    <BrowserRouter>
        <UserContext.Provider value={{user, setUser}}>
            <LeaveBalanceContext.Provider value={{leaveBalance, setLeaveBalance, fetchLeaveBalance}}>
                <Routes>
                    <Route path="/" element={<Login />}/>

                    <Route
                        path="/employee/dashboard"
                        element={
                            // allowed 3 roles here because Managers and Admins are also employees!
                            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employee/leave-request"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
                                <LeaveRequestDashboard />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/manager/dashboard"
                        element={
                            // allowed 2 roles here because Managers and Admins are also employees!
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/leaves"
                        element={
                            // allowed 2 roles here because Managers and Admins are also employees!
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <ManagerLeaveDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/employees-list"
                        element={
                            // allowed 2 roles here because Managers and Admins are also employees!
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <EmployeeListDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Register closeDialog={() => setIsOpenForm(false)} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <UsersDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/leaves"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminLeavesDashboard />
                            </ProtectedRoute>
                        }
                    />


                </Routes>
            </LeaveBalanceContext.Provider>
        </UserContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
