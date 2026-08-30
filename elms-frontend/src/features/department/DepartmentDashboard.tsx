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

import DepartmentDialog from "@/features/department/DepartmentDialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DepartmentDashboard() {
  const [departmentSummary, setDepartmentSummary] = useState<
    DepartmentSummary | undefined
  >(undefined);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentDetails, setDepartmentDetails] = useState<Department | null>(
    null,
  );

  const [departmentEmployees, setDepartmentEmployees] =
    useState<DepartmentEmployee>({
      active_employees_by_department: [],
      on_leave_employees_by_department: [],
      total_employees_by_department: [],
    });

  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [departmentNameQuery, setDepartmentNameQuery] = useState<string>("");
  const [sortByQuery, setSortByQuery] = useState<string>("a-z");
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const fetchDepartments = async ({
    department_name,
    sort_by,
  }: {
    department_name: string;
    sort_by: string;
  }) => {
    try {
      const queryString = buildQueryString({
        department_name: department_name ?? "",
        sort_by: sort_by ?? "",
      });
      const response = await api.get(`/departments${queryString}`);
      setDepartments(response.data.data.departments);
      setError(null);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchDepartmentDetails = async (id: number) => {
    try {
      const response = await api.get(`/departments/${id}`);
      setDepartmentDetails(response.data.data.department);
      setError(null);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchUpdateDepartment = async (
    id: number,
    data: { department_name: string | null },
  ) => {
    try {
      const response = await api.patch(`/departments/${id}`, {
        department_name: data.department_name,
      });
      setIsEditMode(false);
      setIsViewModalOpen(true);
      return response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message as string);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchDeleteDepartment = async (id: number) => {
    try {
      const response = await api.delete(`/departments/${id}`);
      return response;
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

  const handleViewDepartmentDetails = async (id: number) => {
    await fetchDepartmentDetails(id);
    setIsViewModalOpen(true);
    setIsEditMode(false);
  };

  const handleEditDepartmentDetails = async (id: number) => {
    await fetchDepartmentDetails(id);

    setIsEditMode(true);
    setIsViewModalOpen(false);
  };

  const handleDeleteDepartment = async (id: number) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this department?",
    );

    if (confirmation) {
      await fetchDeleteDepartment(id);
      fetchDepartments({ department_name: "", sort_by: "a-z" });
      fetchDepartmentSummary();
      fetchDepartmentEmployees();
    }
  };

  const onSearchSubmit = () => {
    fetchDepartments({
      department_name: departmentNameQuery,
      sort_by: sortByQuery,
    });
  };

  const onClearFilters = () => {
    setDepartmentNameQuery("");
    setSortByQuery("a-z");
    fetchDepartments({ department_name: "", sort_by: "a-z" });
  };

  const handleEditSubmit = async (data: { department_name: string | null }) => {
    const id = departmentDetails?.id;

    if (!id) {
      console.error("No department ID found.");
      return;
    }
    await fetchUpdateDepartment(id, data);

    setIsEditMode(false);
    setIsViewModalOpen(false);
    fetchDepartments({ department_name: "", sort_by: "a-z" });
    fetchDepartmentSummary();
    fetchDepartmentEmployees();
  };

  useEffect(() => {
    fetchDepartments({ department_name: "", sort_by: "a-z" });
    fetchDepartmentSummary();
    fetchDepartmentEmployees();
  }, []);

  return (
    <>
      <DepartmentEmployeesContext.Provider
        value={{
          departmentEmployees,
          fetchDepartmentEmployees,
        }}
      >
        <DepartmentSummaryContext.Provider
          value={{
            departmentSummary,
            fetchDepartmentSummary,
          }}
        >
          <DepartmentContext.Provider
            value={{
              departments,
              fetchDepartments: () =>
                fetchDepartments({
                  department_name: departmentNameQuery,
                  sort_by: sortByQuery,
                }),
              departmentDetails,
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

              <div className="flex justify-between items-center mt-8">
                <DepartmentFilterBar
                  departmentNameQuery={departmentNameQuery}
                  setDepartmentNameQuery={setDepartmentNameQuery}
                  sortByQuery={sortByQuery}
                  setSortByQuery={setSortByQuery}
                  onSearchSubmit={onSearchSubmit}
                  onClearFilters={onClearFilters}
                />

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="">
                        Add New Department
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              <div className="mt-8">
                <DepartmentDialog
                  handleEditSubmit={handleEditSubmit}
                  isViewMode={isViewModalOpen}
                  setIsViewMode={setIsViewModalOpen}
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                />

                {departments.some((department) =>
                  department.name
                    .toLowerCase()
                    .includes(departmentNameQuery.toLowerCase()),
                ) ? (
                  <DepartmentListTable
                    departments={departments}
                    departmentEmployees={departmentEmployees}
                    handleViewDepartmentDetails={handleViewDepartmentDetails}
                    handleEditDepartmentDetails={handleEditDepartmentDetails}
                    handleDepartmentDelete={handleDeleteDepartment}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    No departments found for {`"${departmentNameQuery}"`}
                  </div>
                )}
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
