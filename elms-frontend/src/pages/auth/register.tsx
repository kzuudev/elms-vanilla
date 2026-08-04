"use client";

import { useEffect, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/lib/api.ts";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import {Button} from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select"



interface RegisterFormProps {
    closeDialog: () => void;
}

export default function Register({closeDialog}: RegisterFormProps) {

    const roleOptions: {value: string, label: string}[] = [
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Accounting', label: 'Accounting' },
        { value: 'IT Support', label: 'IT Support' },
        { value: 'manager', label: 'Manager' },
        { value: 'admin', label: 'Admin' },
    ];

    const [managers, setManagers] = useState<{value: string, label: string}[]>([]);
    const [managersError, setManagersError] = useState<string | null>(null);

    // rules for registration form
    const schema = z.object({
        first_name: z.string().min(1, {message: "First Name is required"}),
        last_name: z.string().min(1, {message: "Last Name is required"}),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(1, {message: "Phone number is required"}),
        role: z.string().min(1, {message: "Role is required"}),
        assigned_to: z.string().min(1, {message: "Assigned manager is required"}),
    })

    type RegisterFormData = z.infer<typeof schema>;

    // Set up the form with zod
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            role: "",
            assigned_to: "",
        }
    })

    const {setError, formState: {errors}} = form;

    // Fetch managers — EmployeesController@managers
    useEffect(() => {
        const controller = new AbortController();

        const fetchManagers = async () => {
            try {
                const holder = localStorage.getItem("token");
                const response = await api.get("/employees/managers", {
                    headers: { Authorization: `Bearer ${holder}` },
                    signal: controller.signal,
                });

                setManagers(
                    (response.data.managers ?? []).map(
                        (manager: { id: number; first_name: string; last_name: string }) => ({
                            value: String(manager.id),
                            label: `${manager.first_name} ${manager.last_name}`,
                        })
                    )
                );
                setManagersError(null);
            } catch (e) {
                if (axios.isCancel(e)) return;
                setManagers([]);
                if (axios.isAxiosError(e)) {
                    setManagersError(
                        e.response?.data?.error ||
                        e.response?.data?.message ||
                        "Failed to load managers from the server"
                    );
                } else {
                    setManagersError("Failed to load managers from the server");
                    setManagers([]);
                }
            }
        };

        fetchManagers();

        return () => controller.abort();
    }, []);

    const onSubmit = async (data: RegisterFormData) => {

        const token = localStorage.getItem("token");

        try {
            const response = await api.post("/register", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            window.dispatchEvent(new Event('user-mutated'));
            closeDialog();
        } catch (e) {
            let errorMessage = "An error occurred during registration";

            if (axios.isAxiosError(e)) {
                errorMessage = e.response?.data?.message || errorMessage;
            }

            setError("root", {
                type: "server",
                message: errorMessage,
            });
        }
    }

    return (
        <>
            <div className="px-4">
                <div className="mb-4">
                    <h1 className="text-lg font-bold">Register</h1>
                    <h2 className="text-sm text-gray-500">Fill up the form to register a new user</h2>
                </div>
                <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
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

                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
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

                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]}/>
                                                )}
                                            </Field>
                                        )}
                            />
                        </div>


                        <div className="flex flex-col gap-2">
                            <Controller name="email" control={form.control} render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">
                                        Email Address
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"

                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                            />
                        </div>

                        <div className="">
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phone">
                                            Contact No.
                                        </FieldLabel>

                                        <PhoneInput
                                            className="w-full border-gray-300 rounded-md p-2"
                                            {...field}
                                            id="phone"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="tel"
                                            placeholder="e.g., +63 917 123 4567"
                                            defaultCountry="PH"
                                        />

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>

                            <Controller name="role" control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="role">
                                            Role
                                        </FieldLabel>

                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
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

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                                />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Controller name="assigned_to" control={form.control} render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="assigned_to">
                                                Assigned Manager
                                            </FieldLabel>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={managers.length === 0}
                                            >
                                                <SelectTrigger id="assigned_to" aria-invalid={fieldState.invalid}>
                                                    <SelectValue placeholder={
                                                        managers.length === 0
                                                            ? "No managers found"
                                                            : "Select a manager"
                                                    } />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {managers.map((manager) => (
                                                        <SelectItem key={manager.value} value={manager.value}>
                                                            {manager.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {managersError && (
                                                <p className="text-red-500 text-sm">{managersError}</p>
                                            )}

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
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
                        <Button type="button" onClick={closeDialog} className="rounded-md bg-black text-white text-center"  variant="outline">
                            Cancel
                        </Button>

                        <Button type="submit" className="rounded-md bg-black text-white text-center"
                                variant="outline">
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
