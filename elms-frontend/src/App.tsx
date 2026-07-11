
import './App.css'
import axios from "axios";
import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import ManagerDashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
import AdminDashboard from './pages/admin/Dashboard.tsx'
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

    const role = user?.role;

    const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsOpenForm] = useState(false);

    const fetchLeaveBalance = async (signal?: AbortSignal) => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/leave-balance/me", {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    },
                signal: signal
            });
            setLeaveBalance(response.data.balances);
        }catch (e) {

            if(axios.isCancel(e)) {
                console.log("First duplicate request was cancelled successfully.");
                return;
            }

            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message || "Failed to fetch balances");
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    useEffect(() => {

        if(!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLeaveBalance([]);
            setError(null);
            return;
        }

        const controller = new AbortController();

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveBalance(controller.signal);

        return () => {
            controller.abort();
        }
    }, [user]);

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
                                    <ProtectedRoute allowedRoles={[role]}>
                                        <EmployeeDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/employee/leave-request"
                                element={
                                    <ProtectedRoute allowedRoles={[role]}>
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

        {error && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">{error}</div>
        )}
    </>
  )
}

export default App
