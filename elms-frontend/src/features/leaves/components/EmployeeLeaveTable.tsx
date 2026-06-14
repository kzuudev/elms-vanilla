'use client'

import {useState, useContext, useEffect} from "react";
import * as z from 'zod';
import {format} from 'date-fns';
import {Controller, useForm} from "react-hook-form";
import {api} from "@/lib/api.ts";

import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import {leaveOptions} from "@/types/leave.ts";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog.tsx";

import {AlertCircle, Eye, Pencil, Trash} from 'lucide-react';
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {zodResolver} from "@hookform/resolvers/zod";


const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']


export default function EmployeeLeaveTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // get the leave request list directly from the Leave Context
    const { leaveRequests, fetchLeaveRequests, fetchLeaveRequestDetails, leaveRequestDetails } = useContext(LeaveContext);


    const holder = localStorage.getItem("token");

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
            leave_type: "",
            start_date: "",
            end_date: "",
            reason: "",
        }
    });

    const { formState: {errors}} = form;

    // const fetchLeaveRequestDetails = async (id: number) => {
    //
    //     try{
    //         const response = await api.get(`/leave-request/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${holder}`,
    //             }
    //         });
    //         setLeaveRequestDetails(response.data.leave_request);
    //         console.log(response.data.leave_request);
    //     }catch (e) {
    //         form.setError("root", {
    //             type: "server",
    //             message: e.response.data.message
    //         })
    //     }
    // }

    const fetchLeaveRequestEdit = async (id: number, data: LeaveRequestFormData) => {

        form.setError("root", null);
        try {
            const response = await api.patch(`/leave-request/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });

            console.log(response.data.leave_request);
            return response;
        }catch (e) {
            form.setError("root",
                {
                    type: "server",
                    message: e.response.data.message
                });
            throw e;
        }
    }


    const fetchLeaveRequestDelete = async (id: number) => {

        try {
            const response = await api.delete(`/leave-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            console.log(response.data.message);
            return response;
        }catch (e) {
            form.setError("root", {
                type: "server",
                message: e.response.data.message
            })
        }
    }

    // handle view leave request
    const handleViewLeaveRequest = async (id: number) => {
        setIsDialogOpen(true);
        await fetchLeaveRequestDetails(id);
    }

    // navigation for open the edit form
    const handleOpenEditForm = async (id: number) => {
        setIsEditMode(true);
        await fetchLeaveRequestDetails(id);
    }

    // handle for the leave request edit form submission
    const handleLeaveRequestEditSubmit = async (data: LeaveRequestFormData) => {
        form.setError("root", null);
        await fetchLeaveRequestEdit(leaveRequestDetails.id, data);
        setIsEditMode(false);
        form.reset(data)
        fetchLeaveRequests();
    }


    // handle delete of leave request
    const handleDeleteLeaveRequests = async (id: number) => {
        form.setError("root", null);

        if(window.confirm("Are you sure you want to delete this leave request?")){
            await fetchLeaveRequestDelete(id);
        }
        form.reset(
            {
                leave_type: "",
                start_date: "",
                end_date: "",
                reason: "",
            }
        )
        fetchLeaveRequests();

    }

    useEffect(() => {
        if (leaveRequestDetails && leaveRequestDetails.id) {
            form.reset({
                leave_type: leaveRequestDetails.leave_type,
                start_date: leaveRequestDetails.start_date,
                end_date: leaveRequestDetails.end_date,
                reason: leaveRequestDetails.reason,
            });
        }

    }, [leaveRequestDetails, form]);

    return (
        <>
            <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Leave Request Details</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Leave Type:</span>
                                    <span>{leaveRequestDetails.leave_type}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Start Date:</span>
                                    <span>{leaveRequestDetails.start_date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">End Date:</span>
                                    <span>{leaveRequestDetails.end_date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Days:</span>
                                    <span>{leaveRequestDetails.total_days}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Leave Reason:</span>
                                    <span>{leaveRequestDetails.reason}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                                    <span>{leaveRequestDetails.manager_name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Created At:</span>
                                    <span>{leaveRequestDetails.created_at}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    {leaveRequestDetails.status === "pending" ? (
                                        <span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leaveRequestDetails.status}</span>
                                    ) : leaveRequestDetails.status === "approved" ? (
                                        <span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leaveRequestDetails.status}</span>
                                    ) : (
                                        <span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">{leaveRequestDetails.status}</span>
                                    )}
                                </div>

                            </div>

                            <DialogFooter className="p-2">
                                <div className="w-full flex justify-between items-center">
                                    <Button variant="outline" className="p-2 text-red-500"><Trash/></Button>
                                    <div className="flex gap-2 items-center">
                                        <Button variant="outline" className="text-sm p-2 mr-1">Cancel</Button>
                                        <Button variant="outline" className="p-2 mr-1"><Pencil /></Button>
                                    </div>
                                </div>
                            </DialogFooter>

                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <Dialog open={isEditMode} onOpenChange={setIsEditMode} >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Leave Request Details</DialogTitle>
                        </DialogHeader>
                        <form id="leave-request-edit" onSubmit={form.handleSubmit(handleLeaveRequestEditSubmit)} className="w-full">
                            <FieldGroup className="mb-8">
                                <div className="flex flex-col w-full">
                                    <Controller name="leave_type" control={form.control} render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title" className="m-0">
                                                Leave Type
                                            </FieldLabel>

                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                                <Button type="submit" className="w-full p-4 rounded-md text-sm bg-black text-white text-center"
                                        variant="outline">
                                    Submit Leave
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>


            <div className="border border-border rounded-lg bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-border hover:bg-gray-50">
                            {tableHeaders.map((header, index) => (
                                <TableHead key={index} className="text-foreground font-semibold">
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {leaveRequests.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.leave_type_name}</TableCell>
                                <TableCell>{format(leave.start_date, 'MMMM dd, yyyy')}</TableCell>
                                <TableCell>{format(leave.end_date, 'MMMM dd, yyyy')}</TableCell>
                                <TableCell>{leave.reason}</TableCell>
                                {leave.status === "pending" ? (
                                    <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : leave.status === "approved" ? (
                                    <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : (
                                    <TableCell><span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                )}
                                <TableCell>{leave.manager_name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleViewLeaveRequest(leave.id)} variant="outline" className="p-2 mr-1"><Eye /></Button>
                                    <Button onClick={() => handleOpenEditForm(leave.id)} variant="outline" className="p-2 mr-1"><Pencil /></Button>
                                    <Button onClick={() => handleDeleteLeaveRequests(leave.id)} variant="outline" className="p-2 text-red-500"><Trash/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}