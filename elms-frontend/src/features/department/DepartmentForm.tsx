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

type DepartmentFormData = z.infer<typeof schema>;

interface DepartmentFormProps {
  handleSubmit: (data: DepartmentFormData) => Promise<void>;
  mode: "create" | "edit" | null; 
  setMode: (mode: "create" | "edit" | null) => void;
  departmentDetails: Department | undefined;
}

export default function DepartmentForm({
  handleSubmit,
  mode,
  setMode,
  departmentDetails,
}: DepartmentFormProps) {
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      department_name: departmentDetails?.name ?? undefined,
    },
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      await handleSubmit(data);
    } catch (error) {
      setError("root.serverError", {
        message: "Failed to update/create department",
      });
      console.error(error);
    }
  };

  useEffect(() => {

    if (mode === null) {
      return;
    }

    if(mode === "edit") {
      form.reset({
        department_name: departmentDetails?.name ?? "",
      });
    } else {
      form.reset({
        department_name: "",
      });
    }
  }, [departmentDetails, mode]);

  return (
    <>
      <Dialog
        open={mode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMode(null);  
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit Department" : "Create Department"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Edit the details of the department"
                : "Create a new department"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} id="department-form">
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
                <FieldError>{errors.department_name.message}</FieldError>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" form="department-form">
                Save
              </Button>
              <Button type="button" onClick={() => {
                form.reset();
                setMode(null);
              }}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
