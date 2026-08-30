"use client";

import { type Department } from "@/types/department.ts";

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
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  mode: "create" | "edit" | null;
  setMode: (mode: "create" | "edit" | null) => void;
  totalEmployees: number;
  departmentDetails: Department;
}

export default function DepartmentDetailsModal({
  isViewMode,
  setIsViewMode,
  mode,
  setMode,
  totalEmployees,
  departmentDetails,
}: DepartmentDetailsModalProps) {


  const [error, setError] = useState<string | null>(null);

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

            <div className="w-full flex justify-between">
              <Button
                type="button"
                className="min-w-4"
                variant="destructive"
                onClick={() => {
                  setIsViewMode(false);
                  setMode("edit");
                }}
                disabled={mode !== "edit"}
              >
                <Trash className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                className="min-w-4"
                variant="default"
                onClick={() => {
                  setIsViewMode(false);
                  setMode("edit");
                }}
                disabled={mode === "edit"}
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
