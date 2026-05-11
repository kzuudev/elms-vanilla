"use client";

import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/api.ts";
import { useNavigate } from "react-router-dom";


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



export default function Register() {

    const navigate = useNavigate();

    // rules for registration form
    const schema = z.object({
        name: z.string().min(1, {message: "Name is required"}),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, {message: "Password is required"}),
        password_confirmation: z.string().min(1, {message: "Confirm Password is required"}),
        remember: z.boolean().optional(),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    })

    type LoginFormData = z.infer<typeof schema>;

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormData>();

    // Set up the form with zod
    const form = useForm<LoginFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        }
    })

    const onSubmit = async (data: LoginFormData) => {
        console.log("Form Submitted: ", data);

        try {
            const response = await api.post("/register", data);
            console.log(response);
            navigate("/");
        }catch (e) {
            setError("root", {
                type: "server",
                message: e.response.data.message,
            });
        }
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
                <Card className="w-full flex sm:max-w-md py-6 px-2 bg-white border-0 outline-none shadow-xl">
                    <CardHeader className="mb-3">
                        <CardTitle className="text-black text-lg">Register</CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
                            Fill up the form below to register
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="login" onSubmit={form.handleSubmit(onSubmit)} className="">
                            <FieldGroup className="mb-8">
                                <div className="flex flex-col ">
                                    <Controller name="name" control={form.control} render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title" className="m-0">
                                                Name
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"

                                            />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}

                                            {/*<div>*/}
                                            {/*    {errors.root && <p className="text-red-500 text-sm">errors.root.message</p>}*/}
                                            {/*</div>*/}
                                        </Field>
                                    )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Controller name="email" control={form.control} render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title">
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
                                    <Controller name="password" control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="login-form-title">
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
                                                        <FieldLabel htmlFor="login-form-title">
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

                            <div className="flex items-center gap-3 justify-end">

                                <Button asChild>
                                    <a href="/">
                                        Already registered?
                                    </a>
                                </Button>

                                <Button type="submit" className=" rounded-md bg-black text-white text-center"
                                        variant="outline">
                                    Register
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}