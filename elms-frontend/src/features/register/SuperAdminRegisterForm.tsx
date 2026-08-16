"use client";

import { useState } from "react";
import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";


import { roleOptions } from "@/config/role-options";
import { departmentOptions } from "@/config/department-options";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select"
import {Button} from "@/components/ui/button";


export default function SuperAdminRegisterForm({managers, admins, onSubmit, onCancel}: {
    managers: {value: string, label: string}[], 
    admins: {value: string, label: string}[],
    onSubmit: () => void,
    onCancel: () => void
}) {

    // rules for registration form
    const schema = z.object({
        first_name: z.string().min(1, {message: "First Name is required"}),
        last_name: z.string().min(1, {message: "Last Name is required"}),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(1, {message: "Phone number is required"}),
        role: z.string().min(1, {message: "Role is required"}),
        department: z.string().min(1, {message: "Department is required"}),
        salary: z.number().min(1, {message: "Salary is required"}),
        assigned_to: z.string().optional().nullable(),
    });

    type SuperAdminRegisterFormData = z.infer<typeof schema>;

    const form = useForm<SuperAdminRegisterFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            role: "",
            department: "",
            salary: 0,
            assigned_to: null,
        }
    })

    const {setError, formState: {errors}} = form;


    return (
        <>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="mb-8">
                <div className="flex flex-col gap-2">
                    <Controller name="first_name" control={form.control}
                        render={({field, fieldState}) => (
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

                    <Controller name="last_name" control={form.control}
                        render={({field, fieldState}) => (
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
                    <Controller name="email" control={form.control}
                        render={({field, fieldState}) => (
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
                    <Controller name="phone" control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="phone" className="m-0">
                                    Phone
                                </FieldLabel>
                                <PhoneInput
                                    {...field}
                                    id="phone"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    placeholder="Enter your phone number"
                                />
                                {fieldState.error && (
                                    <FieldError>{fieldState.error.message}</FieldError>
                                )}
                            </Field>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Controller name="role" control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="role" className="m-0">
                                    Role
                                </FieldLabel>
                                <Select>
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
                            </Field>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Controller name="department" control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="department" className="m-0">
                                    Department
                                </FieldLabel>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentOptions.map((department) => (
                                            <SelectItem key={department.value} value={department.value}>
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Controller name="salary" control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="salary" className="m-0">
                                    Salary
                                </FieldLabel>
                                <Input
                                    {...field}
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
                    <Controller name="assigned_to" control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="assigned_to" className="m-0">
                                    Assigned To
                                </FieldLabel>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a manager or admin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((manager) => (
                                            <SelectItem key={manager.value} value={manager.value}>
                                                {manager.label}
                                            </SelectItem>
                                        ))}
                                        {admins.map((admin) => (
                                            <SelectItem key={admin.value} value={admin.value}>
                                                {admin.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                <Button type="button" onClick={onCancel} className="rounded-md bg-black text-white text-center"  variant="outline">
                    Cancel
                </Button>
                <Button type="submit" className="rounded-md bg-black text-white text-center"  variant="default">
                    Register
                </Button>
            </div>
         </form>
        </>
    )

}