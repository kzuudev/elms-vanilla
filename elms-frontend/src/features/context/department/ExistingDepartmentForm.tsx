"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useDepartmentContext } from "@/features/context/department/DepartmentContext";
import { useDepartmentEmployeesContext } from "@/features/context/department/DepartmentEmployeesContext";

import { Button } from "@/components/ui/button.tsx";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";

import { Pencil, Trash } from "lucide-react";

const schema = z.object({
  department_name: z
    .string()
    .min(1, { message: "Department Name is required" })
    .max(50, { message: "Department Name must be less than 50 characters." }),
});

type ExistingDepartmentFormData = z.infer<typeof schema>;

interface ExistingDepartmentFormProps {
  handleSubmit: (data: ExistingDepartmentFormData) => Promise<void>;
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
}

export default function ExistingDepartmentForm({
  handleSubmit,
  isViewMode,
  setIsViewMode,
}: ExistingDepartmentFormProps) {
  const form = useForm<ExistingDepartmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      department_name: "",
    },
  });

  const { departmentDetails } = useDepartmentContext();
  const { departmentEmployees } = useDepartmentEmployeesContext();

  const totalEmployees =
    departmentEmployees?.total_employees_by_department?.find(
      (row) => row.department_id === departmentDetails?.id,
    )?.total_employees ?? 0;

  const {
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ExistingDepartmentFormData) => {
    try {
      await handleSubmit(data);
    } catch (error) {
      setError("root.serverError", { message: "Failed to create department" });
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
          {/* <form
            className="w-full mx-auto"
            onSubmit={form.handleSubmit(onSubmit)}
            id="existing-department-form"
          >
            <div className="flex flex-col gap-4">
              <Controller
                name="department_name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Department Name</FieldLabel>
                    <FieldGroup>
                      <Input {...field} name="department_name" />
                    </FieldGroup>
                  </Field>
                )}
              />

              {errors.department_name && (
                <p className="text-red-500">{errors.department_name.message}</p>
              )}
            </div>
          </form> */}

          <div>
            <div className="flex flex-col gap-3 mb-4">
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
            <div className="w-full flex justify-between gap-2">
              <Button
                type="button"
                className="min-w-4"
                variant="destructive"
                onClick={() => setIsViewMode(false)}
              >
                <Trash className="w-4 h-4" />
              </Button>

              <Button type="submit" className="min-w-4" variant="default">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {errors.root?.serverError && (
        <p className="text-red-500">{errors.root.serverError.message}</p>
      )}
    </>
  );
}
