"use client";

import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/lib/api.ts";
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {LeaveType} from "@/types/leave.ts";
import {LeaveContext} from "@/features/context/LeaveContext.tsx";

import {Button} from "@/components/ui/button.tsx";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx"
import {Textarea} from "@/components/ui/textarea.tsx";

interface LeaveRequestFormProps {
    closeDialog: () => void;
}



export default function LeaveRequestForm({closeDialog}: LeaveRequestFormProps ) {

    const leaveContext = useContext(LeaveContext);
    const navigate = useNavigate();

    const schema = z.object({
        leave_type: z.string().min(1, {message: "Leave Type is required"}),
        start_date: z.string().min(1, {message: "Start Date is required"}),
        end_date: z.string().min(1, {message: "End Date is required"}),
        reason: z.string().min(1, {message: "Reason is required"}),
    })

    type LeaveRequestFormData = z.infer<typeof schema>;

    const form = useForm<LeaveRequestFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: ''
        }
    });
    const {register, handleSubmit, setError, formState: {errors}} = form;

    const leaveOptions: { label: string; value: LeaveType }[] = [
        {label: "Annual Leave", value: LeaveType.Annual},
        {label: "Maternity Leave", value: LeaveType.Maternity},
        {label: "Sick Leave", value: LeaveType.Sick},
        {label: "Paternity Leave", value: LeaveType.Paternity},
        {label: "Bereavement Leave", value: LeaveType.Beareavement},
        {label: "Public Holidays", value: LeaveType.Public},
        {label: "Court Leave", value: LeaveType.Court},
        {label: "Compensatory Off Leave", value: LeaveType.Compoff},
        {label: "Sabbatical Leave", value: LeaveType.Sabbatical},
        {label: "Extended Medical Leave", value: LeaveType.Extended},
    ];

    const { fetchLeaveRequests } = leaveContext;

    const onSubmit = async (data: LeaveRequestFormData) => {
        console.log("Form Submitted: ", data);

        const holder = localStorage.getItem("token");
        closeDialog();

        try {
            const response = await api.post("/leave-request", data, {
                // this is a verification for the bearer (holder) of the token has permission to access this account and do action
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            if(response.data.success) {
                setError("root", {
                    type: "server",
                    message: "",
                });
                fetchLeaveRequests();
                navigate("/employee/leave-request");
            }
        } catch (e) {
            setError("root", {
                type: "server",
                message: e.response.data.message,
            });
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
                                                <SelectItem key={opt.value} value={opt.label}>
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