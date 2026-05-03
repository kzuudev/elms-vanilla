
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import Dashboard from './pages/manager/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'

import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
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
                    // allowed 3 roles here because Managers and Admins are also employees!
                    <ProtectedRoute allowedRoles={['manager', 'admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
