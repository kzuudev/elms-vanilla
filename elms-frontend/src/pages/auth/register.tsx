"use client";

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

interface RegisterFormProps {
    closeDialog: () => void;
}

export default function Register({closeDialog}: RegisterFormProps) {

    // rules for registration form
    const schema = z.object({
        first_name: z.string().min(1, {message: "First Name is required"}),
        last_name: z.string().min(1, {message: "Last Name is required"}),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(1, {message: "Phone number is required"}),
        password: z.string().min(1, {message: "Password is required"}),
        password_confirmation: z.string().min(1, {message: "Confirm Password is required"}),
        remember: z.boolean().optional(),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    })

    type LoginFormData = z.infer<typeof schema>;

    // Set up the form with zod
    const form = useForm<LoginFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: undefined,
            password: "",
            password_confirmation: "",
        }
    })

    const {setError, formState: {errors}} = form;

    const onSubmit = async (data: LoginFormData) => {

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
                        <div className="flex gap-2">
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
                                        id="password"
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
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="phone">
                                            Contact No.
                                        </FieldLabel>

                                        {/*<Input*/}
                                        {/*    {...field}*/}
                                        {/*    id="phone"*/}
                                        {/*    type="tel"*/}
                                        {/*    placeholder="e.g., +63 917 123 4567"*/}
                                        {/*    aria-invalid={fieldState.invalid}*/}
                                        {/*    autoComplete="tel"*/}
                                        {/*/>*/}

                                        <PhoneInput
                                            id="phone"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
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

                        <div className="flex flex-col gap-2">
                            <Controller name="password" control={form.control}
                                        render={({field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="password">
                                                    Password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
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
                            <Controller name="password_confirmation" control={form.control}
                                        render={({field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="password_confirmation">
                                                    Confirm Password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="confirm-password"
                                                    type="password"
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