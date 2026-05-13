
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import ManagerDashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
import AdminDashboard from './pages/admin/Admin'

import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import LeaveRequestDashboard from "@/pages/employee/LeaveRequestDashboard.tsx";

function App() {


  return (
    <>
    <BrowserRouter>
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
                path="/manager/dashboard"
                element={
                    // allowed 2 roles here because Managers and Admins are also employees!
                    <ProtectedRoute allowedRoles={['manager', 'admin']}>
                        <ManagerDashboard />
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
                path="/employee/leave-request"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
                        <LeaveRequestDashboard />
                    </ProtectedRoute>
                }
            />


        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
