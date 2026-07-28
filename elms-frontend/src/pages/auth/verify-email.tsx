"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api.ts";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function VerifyEmail() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [tokenMissing, setTokenMissing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // rules for verify email form (same pattern as register)
    const schema = z.object({
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirm_password: z.string().min(1, { message: "Confirm Password is required" }),
    }).refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

    type VerifyEmailFormData = z.infer<typeof schema>;

    const form = useForm<VerifyEmailFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            confirm_password: "",
        },
    });

    const { setError, formState: { errors } } = form;

    
    // get the verification token from the url
    const verificationToken = searchParams.get("token") ?? "";

    // if the verification token is found, set the token missing state to false
    useEffect(() => {
        // if the verification token is not found, set the token missing state to true
        if (!verificationToken) {
            setTokenMissing(true);
        }
    }, [verificationToken]);

    const onSubmit = async (data: VerifyEmailFormData) => {

        if (!verificationToken) {
            setError("root", {
                type: "server",
                message: "Verification token is missing from the link",
            });
            return;
        }

        try {
            // verify the email
            const response = await api.post("/verify-email", {
                token: verificationToken,
                password: data.password,
                confirm_password: data.confirm_password,
            });

            setSuccessMessage(response.data.message ?? "Email verified successfully");
            setError("root", { type: "server", message: "" });

            // After verify, send them to login
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (e) {
            let errorMessage = "An error occurred during email verification";

            if (axios.isAxiosError(e)) {
                errorMessage =
                    e.response?.data?.error ||
                    e.response?.data?.message ||
                    errorMessage;
            }

            setError("root", {
                type: "server",
                message: errorMessage,
            });
        }
    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
                <div className="w-full sm:max-w-md bg-white py-6 px-4 rounded-md">
                    <div className="px-4">
                        <div className="mb-4">
                            <h1 className="text-lg font-bold">Verify Email</h1>
                            <h2 className="text-sm text-gray-500">
                                Set your password to activate your account
                            </h2>
                        </div>

                        {tokenMissing ? (
                            <div className="text-red-500 text-sm mb-4 text-center">
                                Invalid verification link. Ask your admin to resend the invite.
                            </div>
                        ) : (
                            <form id="verify-email" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup className="mb-8">
                                    <div className="flex flex-col gap-2">
                                        <Controller
                                            name="password"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="password" className="m-0">
                                                        Password
                                                    </FieldLabel>

                                                    <Input
                                                        {...field}
                                                        id="password"
                                                        type="password"
                                                        aria-invalid={fieldState.invalid}
                                                        autoComplete="new-password"
                                                    />

                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="confirm_password"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="confirm_password" className="m-0">
                                                        Confirm Password
                                                    </FieldLabel>

                                                    <Input
                                                        {...field}
                                                        id="confirm_password"
                                                        type="password"
                                                        aria-invalid={fieldState.invalid}
                                                        autoComplete="new-password"
                                                    />

                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </FieldGroup>

                                {errors.root?.message && (
                                    <div className="text-red-500 text-sm mb-4 text-center">
                                        {errors.root.message}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="text-green-600 text-sm mb-4 text-center">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="rounded-md bg-black text-white text-center"
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="rounded-md bg-black text-white text-center"
                                        variant="outline"
                                    >
                                        Verify Email
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
