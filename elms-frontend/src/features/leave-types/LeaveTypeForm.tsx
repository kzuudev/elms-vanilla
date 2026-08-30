"use client";

import { useEffect } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { type LeaveType } from "@/types/leave-type.ts";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.tsx";

const schema = z.object({
  leave_type_name: z
    .string()
    .min(1, { message: "Leave Type Name is required" })
    .max(50, { message: "Leave Type Name must be less than 50 characters." }),
  allocated_days: z.number().min(1, { message: "Allocated days must be greater than 0" }),
  is_paid: z.enum(["paid", "unpaid"], {
    message: "Paid or unpaid is required",
  }),
});

export type LeaveTypeFormData = z.infer<typeof schema>;

interface LeaveTypeFormProps {
  handleSubmit: (data: LeaveTypeFormData) => Promise<void>;
  mode: "create" | "edit" | null;
  setMode: (mode: "create" | "edit" | null) => void;
  leaveTypeDetails: LeaveType | undefined;
}

function paidSelectValue(is_paid: LeaveType["is_paid"] | undefined) {
  return Number(is_paid) === 1 ? "paid" : "unpaid";
}

function toAllocatedDays(value: unknown) {
  const allocatedDays = Number(value);
  return Number.isFinite(allocatedDays) ? allocatedDays : 0;
}

export default function LeaveTypeForm({
  handleSubmit,
  mode,
  setMode,
  leaveTypeDetails,
}: LeaveTypeFormProps) {

  const form = useForm<LeaveTypeFormData>({
    resolver: async (values, context, options) => {
      return zodResolver(schema)(
        {
          ...values,
          allocated_days: toAllocatedDays(values.allocated_days),
        },
        context,
        options,
      );
    },
    defaultValues: {
      leave_type_name: leaveTypeDetails?.name ?? undefined,
      allocated_days: toAllocatedDays(leaveTypeDetails?.allocated_days),
      is_paid: paidSelectValue(leaveTypeDetails?.is_paid),
    },
  });

  const {
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LeaveTypeFormData) => {
    try {
      await handleSubmit({
        ...data,
        allocated_days: toAllocatedDays(data.allocated_days),
      });
    } catch (error) {
      setError("root.serverError", {
        message: "Failed to update/create leave type",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (mode === null) {
      return;
    }

    if (mode === "edit") {
      form.reset({
        leave_type_name: leaveTypeDetails?.name ?? "",
        allocated_days: toAllocatedDays(leaveTypeDetails?.allocated_days),
        is_paid: paidSelectValue(leaveTypeDetails?.is_paid),
      });
    } else {
      form.reset({
        leave_type_name: "",
        allocated_days: 0,
        is_paid: "unpaid",
      });
    }
  }, [leaveTypeDetails, mode]);

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
              {mode === "edit" ? "Edit Leave Type" : "Create Leave Type"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Edit the details of the leave type"
                : "Create a new leave type"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} id="leave-type-form">
            <div className="flex flex-col gap-4">
              <Controller
                name="leave_type_name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Leave Type Name</FieldLabel>
                    <FieldGroup>
                      <Input {...field} name="leave_type_name" />
                    </FieldGroup>
                  </Field>
                )}
              />
              {errors.leave_type_name && (
                <FieldError>{errors.leave_type_name.message}</FieldError>
              )}

              <Controller
                name="allocated_days"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Allocated Days</FieldLabel>
                    <FieldGroup>
                      <Input
                        name={field.name}
                        ref={field.ref}
                        type="number"
                        value={toAllocatedDays(field.value)}
                        onBlur={field.onBlur}
                        onChange={(e) =>
                          field.onChange(toAllocatedDays(e.target.value))
                        }
                      />
                    </FieldGroup>
                  </Field>
                )}
              />
              {errors.allocated_days && (
                <FieldError>{errors.allocated_days.message}</FieldError>
              )}

              <Controller
                name="is_paid"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Paid or Unpaid</FieldLabel>
                    <FieldGroup>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select paid or unpaid" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                  </Field>
                )}
              />
              {errors.is_paid && (
                <FieldError>{errors.is_paid.message}</FieldError>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" form="leave-type-form">
                Save
              </Button>
              <Button
                type="button"
                onClick={() => {
                  form.reset();
                  setMode(null);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
