"use client";


import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api.ts";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

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


    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormData>();
    console.log(errors);


    const navigate = useNavigate();

    // Schema for login form
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
        console.log("Form submitted:", data);

        try {
            const response = await api.post('/', data);
            console.log(response);
            setError("root", {
                type: "server",
                message: "",
            });
        }catch (e) {
            setError("root", {
                type: "server",
                message: e.response.data.message,
            });
            console.log(e.response.data.message);
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
                            <FieldGroup className="mb-8">
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


                                <Button asChild>
                                    <a href="/register" className="w-full">
                                        Register
                                    </a>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </>
    )


}
