"use client";

import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/lib/api.ts";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {LeaveType} from "@/types/leave.ts";
import type { LeaveRequestFormData } from "@/types/leave.ts";
import {LeaveContext, type LeaveContextType} from "@/features/context/leaves/LeaveContext.tsx";
import {LeaveBalanceContext, type LeaveBalanceContextType} from "@/features/context/leaves/LeaveBalanceContext.tsx";

import {Button} from "@/components/ui/button.tsx";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx"
import {Textarea} from "@/components/ui/textarea.tsx";
import { AlertCircle } from "lucide-react";

interface LeaveRequestFormProps {
    closeDialog: () => void;
    /** When provided (edit flow), submit uses this. Otherwise create uses internal onSubmit. */
    handleSubmit?: (data: LeaveRequestFormData) => void | Promise<void>;
}

export default function LeaveRequestForm({closeDialog, handleSubmit}: LeaveRequestFormProps) {

    const leaveContext = useContext(LeaveContext);
    const leaveBalanceContext = useContext(LeaveBalanceContext);

    const { fetchLeaveRequests, leaveRequestDetails } = leaveContext as LeaveContextType;
    const { fetchLeaveBalance } = leaveBalanceContext as LeaveBalanceContextType;

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

    const {setError, formState: {errors}} = form;

    // after fetchLeaveRequestDetails updates context, fill THIS form
    useEffect(() => {
        if (!handleSubmit || !leaveRequestDetails?.id) {
            return;
        }

        const toDateInput = (value: string) => value.slice(0, 10); // "YYYY-MM-DD HH:mm:ss" → date input

        form.reset({
            leave_type: leaveRequestDetails.leave_type ?? '',
            start_date: leaveRequestDetails.start_date ? toDateInput(leaveRequestDetails.start_date) : '',
            end_date: leaveRequestDetails.end_date ? toDateInput(leaveRequestDetails.end_date) : '',
            reason: leaveRequestDetails.reason ?? '',
        });
    }, [leaveRequestDetails, handleSubmit, form]);

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



    const onSubmit = async (data: LeaveRequestFormData) => {

        try {
            const holder = localStorage.getItem("token");
            const role = localStorage.getItem("role");
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
                fetchLeaveBalance();
                closeDialog();
                if(role === "admin") {
                    navigate("/admin/leaves", {
                        state: {
                            successfullySubmitted: true,
                        }
                    });
                }else if (role === "manager") {
                    navigate("/manager/leaves", {
                        state: {}
                    })
                }else {
                    navigate("/employee/leave-request", {
                        state: {
                            successfullySubmitted: true,
                        }
                    });
                }
            }
        } catch (e) {
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
                <form
                    id="leave-request"
                    onSubmit={form.handleSubmit(handleSubmit ?? onSubmit)}
                    className="w-full"
                >
                    <FieldGroup className="mb-8">
                        <div className="flex flex-col w-full">
                            <Controller name="leave_type" control={form.control} render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-form-title" className="m-0">
                                        Leave Type
                                    </FieldLabel>

                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                                        id="start_date"
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
                                        id="end_date"
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
                                                    id="reason"
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
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-3 my-4">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="text-xs font-medium text-red-800">Submission Failed</h3>
                                <p className="text-xs text-red-700 mt-1">{errors.root.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex w-full">
                        <Button
                            type="submit"
                            className="w-full p-4 rounded-md text-sm bg-black text-white text-center"
                            variant="outline"
                        >
                            Submit Leave
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}