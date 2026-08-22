"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import axios from "axios";

import { buildQueryString } from "@/utils/query-string.ts";

import { DepartmentContext } from "@/features/context/department/DepartmentContext";
import { DepartmentEmployeesContext } from "@/features/context/department/DepartmentEmployeesContext";
import { DepartmentSummaryContext } from "../context/department/DepartmentSummaryContext";

import type {
  Department,
  DepartmentSummary,
  DepartmentEmployee,
} from "@/types/department";

import AppSidebar from "@/components/layout/AppSidebar";

import Notifications from "@/components/layout/Notifications";
import UserProfile from "@/components/layout/UserProfile";
import DepartmentSummaryGrid from "./DepartmentSummaryGrid";
import DepartmentListTable from "./DepartmentListTable";
import DepartmentFilterBar from "./DepartmentFilterBar";

export default function DepartmentDashboard() {
  const [departmentSummary, setDepartmentSummary] = useState<
    DepartmentSummary | undefined
  >(undefined);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentDetails, setDepartmentDetails] = useState<Department | null>(
    null,
  );
  const [departmentEmployees, setDepartmentEmployees] = useState<
    DepartmentEmployee | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);

  const [departmentNameQuery, setDepartmentNameQuery] = useState<string>("");
  const [sortByQuery, setSortByQuery] = useState<string>("");

  const fetchDepartments = async () => {
    try {
      const queryString = buildQueryString({
        department_name: departmentNameQuery,
        sort_by: sortByQuery,
      });
      const response = await api.get(`/departments${queryString}`);
      setDepartments(response.data.data.departments);
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

  const fetchDepartmentSummary = async () => {
    try {
      const response = await api.get("departments/summary");
      setDepartmentSummary(response.data.data.department_summary);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchDepartmentEmployees = async () => {
    try {
      const response = await api.get("departments/employees");
      setDepartmentEmployees(response.data.data.department_employees);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const onSearchSubmit = () => {
    fetchDepartments();
  };

  const onClearFilters = () => {
    setDepartmentNameQuery("");
    setSortByQuery("");
  };
  
  useEffect(() => {
    fetchDepartmentSummary();
    fetchDepartmentEmployees();
  }, []);

  return (
    <>
      <DepartmentEmployeesContext.Provider
        value={{
          departmentEmployees,
          setDepartmentEmployees,
          fetchDepartmentEmployees,
        }}
      >
        <DepartmentSummaryContext.Provider
          value={{
            departmentSummary,
            setDepartmentSummary,
            fetchDepartmentSummary,
          }}
        >
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
                <div className="flex justify-between items-center mb-8">
                  <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-blue-400">
                      Department Dashboard
                    </h1>
                    <p className="text-gray-500 text-xs">
                      Manage your departments
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Notifications />
                    <UserProfile />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DepartmentSummaryGrid />
                </div>
              </div>

              <div className="mt-8">
                <DepartmentFilterBar
                  departmentNameQuery={departmentNameQuery}
                  setDepartmentNameQuery={setDepartmentNameQuery}
                  sortByQuery={sortByQuery}
                  setSortByQuery={setSortByQuery}
                  onSearchSubmit={onSearchSubmit}
                  onClearFilters={onClearFilters}
                />
              </div>

              <div className="mt-8">
                <DepartmentListTable />
              </div>

              {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
              )}
            </AppSidebar>
          </DepartmentContext.Provider>
        </DepartmentSummaryContext.Provider>
      </DepartmentEmployeesContext.Provider>
    </>
  );
}
