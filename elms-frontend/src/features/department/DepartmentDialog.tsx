"use client";

import { useState } from "react";

import { useDepartmentContext } from "@/features/context/department/DepartmentContext";
import { useDepartmentEmployeesContext } from "@/features/context/department/DepartmentEmployeesContext";

import DepartmentDetailsModal from "@/features/department/DepartmentDetailsModal";


interface DepartmentDialogProps {
  handleSubmit: (data: { department_name: string | null }) => Promise<void>;
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  mode: "create" | "edit" | null;
  setMode: (mode: "create" | "edit" | null) => void;
}

export default function DepartmentDialog({
  handleSubmit,
  isViewMode,
  setIsViewMode,
  mode,
  setMode,
}: DepartmentDialogProps) {
  
  const { departmentDetails } = useDepartmentContext();
  const { departmentEmployees } = useDepartmentEmployeesContext();

  const [error, setError] = useState<string | null>(null);

  const totalEmployees =
    departmentEmployees?.total_employees_by_department?.find(
      (row) => row.department_id === departmentDetails?.id,
    )?.total_employees ?? 0;

  return (
    <>
      <DepartmentDetailsModal
        isViewMode={isViewMode}
        setIsViewMode={setIsViewMode}
        mode={mode as "create" | "edit"} 
        setMode={setMode}
        totalEmployees={totalEmployees}
        departmentDetails={departmentDetails ?? null}
      />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
