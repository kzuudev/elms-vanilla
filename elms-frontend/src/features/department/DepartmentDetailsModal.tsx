"use client";

import { type Department } from "@/types/department.ts";

import DepartmentEditForm from "@/features/department/DepartmentEditForm";

import { Button } from "@/components/ui/button.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";

import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

interface DepartmentDetailsModalProps {
  handleEditSubmit: (data: { department_name: string | null }) => Promise<void>;
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (open: boolean) => void;
  totalEmployees: number;
  departmentDetails: Department;
}

export default function DepartmentDetailsModal({
  handleEditSubmit,
  isViewMode,
  setIsViewMode,
  isEditMode,
  setIsEditMode,
  totalEmployees,
  departmentDetails,
}: DepartmentDetailsModalProps) {


  const [error, setError] = useState<string | null>(null);

  const onEditSubmit = async (data: { department_name: string | null }) => {
    try {
      await handleEditSubmit(data);
    } catch (error) {
      setError("Failed to update department");
    }
  };

  return (
    <>
      <Dialog open={isViewMode} onOpenChange={setIsViewMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
            <DialogDescription>
              View the details of the department
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">
                  Department Name:{" "}
                </h2>
                <p className="text-sm">{departmentDetails?.name}</p>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">
                  Total Employees:{" "}
                </h2>
                <p className="text-sm">{totalEmployees}</p>
              </div>
            </div>

            <div className="mb-4">
              {isEditMode && (
                <DepartmentEditForm
                  handleEditSubmit={(data: {
                    department_name: string | null;
                  }) => onEditSubmit(data)}
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                  departmentDetails={departmentDetails}
                />
              )}
            </div>

            <div className="w-full flex justify-between">
              <Button
                type="button"
                className="min-w-4"
                variant="destructive"
                onClick={() => setIsViewMode(false)}
                disabled={isEditMode}
              >
                <Trash className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                className="min-w-4"
                variant="default"
                onClick={() => setIsEditMode(true)}
                disabled={isEditMode}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>

        {error && <p className="text-red-500">{error}</p>}
      </Dialog>
    </>
  );
}
