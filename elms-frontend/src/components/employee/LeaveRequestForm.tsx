"use client";

import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/lib/api.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { LeaveType } from "@/types/leave.ts";


import {Button} from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea.tsx";


export default function LeaveRequestForm() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const schema = z.object({
        leave_type: z.string().min(1, {message: "Leave Type is required"}),
        start_date: z.string().min(1, {message: "Start Date is required"}),
        end_date: z.string().min(1, {message: "End Date is required"}),
        reason: z.string().min(1, {message: "Reason is required"}),
    })

    type LeaveRequestFormData = z.infer<typeof schema>;

    const {register, handleSubmit, setError, formState: {errors}} = useForm<LeaveRequestFormData>();

    const form = useForm<LeaveRequestFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: ''
        }
    })

    const leaveOptions: { label: string; value: LeaveType }[] = [
        {label: "Annual Leave", value: LeaveType.Annual},
        {label: "Maternity Leave", value: LeaveType.Maternity},
        {label: "Sick Leave", value: LeaveType.Sick},
        {label: "Paternity Leave", value: LeaveType.Paternity},
    ];


    const onSubmit = async (data: LeaveRequestFormData) => {
        console.log("Form Submitted: ", data);

        const holder = localStorage.getItem("token");

        try {
            const response = await api.post("/leave-request", data, {
                // this is a verification for the bearer (holder) of the token has permission to access this account and do action
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            console.log(response.data);
            setError("root", {
                type: "server",
                message: "",
            });
            navigate("/employee/leave-request");
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
            <div className="flex w-full items-center">
                <form id="leave-request" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FieldGroup className="mb-8">
                        <div className="flex flex-col w-full">
                            <Controller name="leave_type" control={form.control} render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-title" className="m-0">
                                        Leave Type
                                    </FieldLabel>

                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder="Select Leave Type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {leaveOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Controller name="start_date" control={form.control} render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-title">
                                        Start date
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="start-date"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"

                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                            />

                            <Controller name="end_date" control={form.control} render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-title">
                                        End date
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="end-date"
                                        type="date"
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
                            <Controller name="reason" control={form.control}
                                        render={({field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="login-form-title">
                                                    Leave Reason
                                                </FieldLabel>

                                                <Textarea
                                                    {...field}
                                                    className="h-[140px]"
                                                    id="leave-reson"
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

                    <div className="flex w-full">
                        <Button type="submit" className="w-full p-4 rounded-md text-sm bg-black text-white text-center"
                                variant="outline">
                            Submit Leave
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}