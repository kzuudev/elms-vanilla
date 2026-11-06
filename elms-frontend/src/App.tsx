import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { api, getApiErrorMessage } from "@/lib/api.ts";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import ManagerDashboard from "./pages/manager/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import { AuthContext } from "@/features/context/auth/AuthContext.tsx";
import { LeaveBalanceContext } from "@/features/context/leaves/LeaveBalanceContext.tsx";

import { type Profile } from "@/types/leave.ts";
import { type LeaveBalance } from "@/types/leave-balance.ts";
import type { DepartmentOptions } from "@/types/department.ts";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute.tsx";
import LeaveRequestDashboard from "@/pages/employee/LeaveRequestDashboard.tsx";

import EmployeesDashboard from "@/features/employees/components/EmployeesDashboard.tsx";
import ManagerLeavesDashboard from "@/pages/manager/ManagerLeavesDashboard.tsx";
import AdminLeavesDashboard from "@/pages/admin/AdminLeavesDashboard.tsx";
import SuperAdminDashboard from "@/pages/super-admin/Dashboard.tsx";

import DepartmentDashboard from "@/features/department/DepartmentDashboard.tsx";

import VerifyEmail from "@/pages/auth/verify-email.tsx";
import SuperAdminLeavesDashboard from "@/pages/super-admin/SuperAdminLeavesDashboard.tsx";
import SuperAdminLeaveTypeDashboard from "@/pages/super-admin/SuperAdminLeaveTypeDashboard.tsx";
import AuditReportDashboard from "@/features/audit-report/AuditReportDashboard.tsx";
import { DepartmentContext } from "./features/context/department/DepartmentContext.tsx";

function App() {
  // get the current user logged-in and parse it into object (Profile).
  const [user, setUser] = useState<Profile | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as Profile) : null;
  });

  // Real DB role (e.g. "IT", "Marketing", "manager", "admin") — for props only
  const role = user?.role ?? "";

  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsOpenForm] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState<
    DepartmentOptions[]
  >([]);

  const fetchLeaveBalance = async () => {
    try {
      const response = await api.get("/leave-balance/me", {
        headers: {},
      });
      setLeaveBalance(response.data.data.balances);
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("First duplicate request was cancelled successfully.");
        return;
      }

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || "Failed to fetch balances");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartmentOptions(response.data.data.departments);
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to load departments");
      if (!message) {
        return;
      }
      setError(message);
    }
  };

  useEffect(() => {
    // if there's no user currently logged-in, reset the state
    if (
      !user ||
      !localStorage.getItem("token") ||
      !localStorage.getItem("role")
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLeaveBalance([]);
      setError(null);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaveBalance();
    fetchDepartments();
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <AuthContext.Provider value={{ user, setUser }}>
          <DepartmentContext.Provider value={{ departments: [], departmentOptions, fetchDepartments, departmentDetails: null, fetchDepartmentDetails: () => Promise.resolve() }}>
            <LeaveBalanceContext.Provider
              value={{ leaveBalance, setLeaveBalance, fetchLeaveBalance }}
            >
              <Routes>
                <Route path="/" element={<Login />} />

                <Route
                  path="/employee/dashboard"
                  element={
                    // Token only — staff roles are IT/Marketing/etc.
                    <ProtectedRoute>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/employee/leave-request"
                  element={
                    <ProtectedRoute>
                      <LeaveRequestDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/manager/dashboard"
                  element={
                    // allowed 2 roles here because Managers and Admins are also employees!
                    <ProtectedRoute allowedRoles={["manager", "admin"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/manager/leaves"
                  element={
                    // allowed 2 roles here because Managers and Admins are also employees!
                    <ProtectedRoute allowedRoles={["manager", "admin"]}>
                      <ManagerLeavesDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/manager/employees"
                  element={
                    // allowed 2 roles here because Managers and Admins are also employees!
                    <ProtectedRoute allowedRoles={["manager", "admin"]}>
                      <EmployeesDashboard role={role} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/register"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                      <Register
                        closeDialog={() => setIsOpenForm(false)}
                        departments={departmentOptions}
                      />
                    </ProtectedRoute>
                  }
                />

                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/employees"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                      <EmployeesDashboard role={role} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/leaves"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                      <AdminLeavesDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/audit-reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
                      <AuditReportDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin"]}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/employees"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin"]}>
                      <EmployeesDashboard role={role} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/leaves"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin"]}>
                      <SuperAdminLeavesDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/leave-types"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin"]}>
                      <SuperAdminLeaveTypeDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/departments"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin"]}>
                      <DepartmentDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin/audit-reports"
                  element={
                    <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                      <AuditReportDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </LeaveBalanceContext.Provider>
          </DepartmentContext.Provider>
        </AuthContext.Provider>

        {error && <div className="text-red-500">{error}</div>}
      </BrowserRouter>
    </>
  );
}

export default App;
