"use client";

import * as z from "zod";
import { useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AuthContext } from "@/features/context/auth/AuthContext";

import { roleOptions } from "@/config/role-options";
import type { DepartmentOptions } from "@/types/department";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// rules for registration form
const schema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, { message: "Phone number is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  salary: z.string().min(1, { message: "Salary is required" }),
  assigned_to: z.string().nullable(),
});

type SuperAdminRegisterFormData = z.infer<typeof schema>;

export default function SuperAdminRegisterForm({
  managers,
  admins,
  departments,
  onSubmit,
  onCancel,
}: {
  managers: { value: string; label: string }[];
  admins: { id: number; name: string; role: string; department: string }[];
  departments: DepartmentOptions[];
  onSubmit: (data: SuperAdminRegisterFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<SuperAdminRegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      salary: "",
      assigned_to: null,
    },
  });

  const { user } = useContext(AuthContext);
  const watchRoleInputValue = form.watch("role");
  const watchDepartmentInputValue = form.watch("department");

  const adminWithinSameDepartment = admins?.filter((admin) => admin.department === watchDepartmentInputValue);

  const {
    setError,
    formState: { errors },
  } = form;

  return (
    <>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <FieldGroup className="mb-8">
          <div className="flex flex-col gap-2">
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="first_name" className="m-0">
                    First Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="first_name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="Enter your first name"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="last_name" className="m-0">
                    Last Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="last_name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="Enter your last name"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="m-0">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="Enter your email"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone" className="m-0">
                    Phone
                  </FieldLabel>
                  <PhoneNumberInput
                    id="phone"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={fieldState.invalid}
                    placeholder="917 123 4567"
                  />
                  <FieldDescription className="text-xs">
                    Philippines (+63) is selected by default. Enter the number
                    without the leading 0.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="role" className="m-0">
                    Role
                  </FieldLabel>
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="department"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="department" className="m-0">
                    Department
                  </FieldLabel>
                  <Select
                    name="department"
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((department) => (
                        <SelectItem key={department.id} value={department.name}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="salary" className="m-0">
                    Salary
                  </FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    id="salary"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="Enter your salary"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="assigned_to"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="assigned_to" className="m-0">
                    Assigned To
                  </FieldLabel>
                  {watchRoleInputValue === "admin" ? (
                    <Select
                      disabled
                      value={user?.id != null ? String(user.id) : undefined}
                    >
                      <SelectTrigger disabled>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.id != null && (
                          <SelectItem value={String(user.id)}>
                            {user.name}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : watchRoleInputValue === "manager" ? (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a admin" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminWithinSameDepartment.map((admin) => (
                          <SelectItem key={admin.id} value={String(admin.id)}>
                            {admin.name} ({admin.role}) - {admin.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager or admin" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.value} value={manager.value}>
                            {manager.label} (Manager)
                          </SelectItem>
                        ))}
                        {admins.map((admin) => (
                          <SelectItem key={admin.id} value={String(admin.id)}>
                            {admin.name} ({admin.role}) - {admin.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        {errors.root && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {errors.root.message}
          </div>
        )}

        <div className="flex items-center gap-3 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-black text-white text-center"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-md bg-black text-white text-center"
            variant="default"
          >
            Register
          </Button>
        </div>
      </form>
    </>
  );
}
