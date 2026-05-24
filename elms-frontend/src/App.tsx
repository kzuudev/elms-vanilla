
import './App.css'
import {useState} from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import ManagerDashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
import AdminDashboard from './pages/admin/Admin'
import {UserContext} from "@/features/context/UserContext.tsx";
import { type Profile} from "@/types/leave.ts";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute.tsx";
import LeaveRequestDashboard from "@/pages/employee/LeaveRequestDashboard.tsx";
import ManagerLeaveDashboard from "@/pages/manager/ManagerLeaveDashboard.tsx";
function App() {

    const [user, setUser] = useState<Profile | null>(null);

  return (
    <>
    <BrowserRouter>
        <UserContext.Provider value={{user, setUser}}>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/register" element={<Register />}/>

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
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


            </Routes>
        </UserContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
