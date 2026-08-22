"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import axios from "axios";

import { DepartmentContext } from "@/features/context/department/DepartmentContext";
import type { Department } from "@/types/department";

import AppSidebar from "@/components/layout/AppSidebar";

import DepartmentListTable from "./DepartmentListTable";
import Notifications from "@/components/layout/Notifications";
import UserProfile from "@/components/layout/UserProfile";

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentDetails, setDepartmentDetails] = useState<Department | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.departments);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartmentDetails = async (id: number) => {
    try {
      const response = await api.get(`/departments/${id}`);
      setDepartmentDetails(response.data.department);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <DepartmentContext.Provider
        value={{
          departments,
          setDepartments,
          fetchDepartments,
          departmentDetails,
          setDepartmentDetails,
          fetchDepartmentDetails,
        }}
      >
        <AppSidebar>
          <div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-blue-400">
                  Department Dashboard
                </h1>
                <p className="text-gray-500 text-xs">Manage your departments</p>
              </div>

              <div className="flex items-center gap-2">
                <Notifications />
                <UserProfile />
              </div>
            </div>
          </div>
        </AppSidebar>
      </DepartmentContext.Provider>
    </>
  );
}
