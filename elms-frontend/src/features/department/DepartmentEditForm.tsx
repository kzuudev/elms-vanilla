"use client";

import { useEffect } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { type Department } from "@/types/department.ts";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

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

const schema = z.object({
  department_name: z
    .string()
    .min(1, { message: "Department Name is required" })
    .max(50, { message: "Department Name must be less than 50 characters." }),
});

type DepartmentDetailsModalFormData = z.infer<typeof schema>;

interface DepartmentEditFormProps {
  handleEditSubmit: (data: { department_name: string | null }) => Promise<void>;
  isEditMode: boolean;
  setIsEditMode: (open: boolean) => void;
  departmentDetails: Department;
}

export default function DepartmentEditForm({
  handleEditSubmit,
  isEditMode,
  setIsEditMode,
  departmentDetails,
}: DepartmentEditFormProps) {
  const form = useForm<DepartmentDetailsModalFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      department_name: departmentDetails.name,
    },
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const onEditSubmit = async (data: DepartmentDetailsModalFormData) => {
    try {
      await handleEditSubmit(data);
    } catch (error) {
      setError("root.serverError", { message: "Failed to update department" });
    }
  };

  useEffect(() => {
    form.reset({
      department_name: departmentDetails?.name ?? "",
    });
  }, [departmentDetails]);

  return (
    <>
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Edit the details of the department
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onEditSubmit)}
            id="edit-department-form"
          >
            <div className="flex flex-col gap-4">
              <Controller
                name="department_name"
                defaultValue={departmentDetails.name}
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
                <FieldError>{errors.department_name.message}</FieldError>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" form="edit-department-form">
                Save
              </Button>
              <Button type="button" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
