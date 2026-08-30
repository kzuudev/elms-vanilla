"use client";

import { useState } from "react";

import { useDepartmentContext } from "@/features/context/department/DepartmentContext";
import { useDepartmentEmployeesContext } from "@/features/context/department/DepartmentEmployeesContext";

import DepartmentDetailsModal from "@/features/department/DepartmentDetailsModal";
import DepartmentEditForm from "@/features/department/DepartmentEditForm";

interface ExistingDepartmentFormProps {
  handleEditSubmit: (data: { department_name: string | null }) => Promise<void>;
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (open: boolean) => void;
}

export default function ExistingDepartmentForm({
  handleEditSubmit,
  isViewMode,
  setIsViewMode,
  isEditMode,
  setIsEditMode,
}: ExistingDepartmentFormProps) {
  const { departmentDetails } = useDepartmentContext();
  const { departmentEmployees } = useDepartmentEmployeesContext();

  const [error, setError] = useState<string | null>(null);

  const totalEmployees =
    departmentEmployees?.total_employees_by_department?.find(
      (row) => row.department_id === departmentDetails?.id,
    )?.total_employees ?? 0;

  const onEditSubmit = async (data: { department_name: string | null }) => {
    try {
      await handleEditSubmit(data);
    } catch (error) {
      setError("Failed to update department");
    }
  };

  if (!departmentDetails) {
    return null;
  }

  return (
    <>
      <DepartmentDetailsModal
        handleEditSubmit={onEditSubmit}
        isViewMode={isViewMode}
        setIsViewMode={setIsViewMode}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        totalEmployees={totalEmployees}
        departmentDetails={departmentDetails}
      />

      <DepartmentEditForm
        handleEditSubmit={onEditSubmit}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        departmentDetails={departmentDetails}
      />

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
