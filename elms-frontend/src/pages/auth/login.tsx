"use client";

import * as z from "zod";
import {useContext} from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api.ts";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

import type { Profile } from "@/types/leave";

import {AuthContext} from "@/features/context/auth/AuthContext.tsx";
import {LeaveBalanceContext} from "@/features/context/leaves/LeaveBalanceContext.tsx";
import { redirectPathByRole } from "@/utils/roles.ts";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


export default function Login() {

    const { setError, formState: { errors } } = useForm<LoginFormData>();

    const navigate = useNavigate();
    
    const { setUser } = useContext(AuthContext) as { user: Profile | null, setUser: (user: Profile | null) => void };
    const { fetchLeaveBalance } = useContext(LeaveBalanceContext) as { fetchLeaveBalance: () => void };

    // Schema for a login form
    const schema = z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, { message: "Password is required" }),
        remember: z.boolean().optional(),
    })

    // infer types using the Zod Schema
    type LoginFormData = z.infer<typeof schema>;

    // Set up the form with Zod with types
    const form = useForm<LoginFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: LoginFormData) => {

        let userRole = '';

        try {
            const response = await api.post('/', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(response.data.success === true) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("role", response.data.data.user.role);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                userRole = response.data.data.user.role;
                setUser(response.data.data.user);
                fetchLeaveBalance();
            } else {
                setError("root", {
                    type: "server",
                    message: response.data.message,
                });
                return; 
            }

            const redirectPath = redirectPathByRole(userRole);
            navigate(redirectPath);
            return;
           
        }catch (e) {
            setError("root", {
                type: "server",
                message: axios.isAxiosError(e)
                    ? (e.response?.data?.message as string) || e.message
                    : 'An unknown error occurred',
            });
        }
    }



    return (
        <>
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
                <Card className="w-full flex sm:max-w-md py-6 px-2 bg-white border-0 shadow-none outline-none shadow-xl">
                    <CardHeader className="mb-3">
                        <CardTitle className="text-black text-lg">Login</CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="login" onSubmit={form.handleSubmit(onSubmit)} className="">
                            <FieldGroup className="mb-5">
                                <div className="flex flex-col gap-1">
                                    <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title" className="m-0">
                                                Email Address
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                            />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title" >
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
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                    />
                                </div>

                                <div>
                                    {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p> }
                                </div>
                            </FieldGroup>

                            <div className="flex flex-col items-center justify-between gap-3">
                                <Button type="submit" className="w-full rounded-md bg-black text-white  text-center" variant="outline">
                                    Log In
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </>
    )


}
