"use client";

import {useContext, useEffect, useState} from "react";
import * as z from 'zod';
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {api} from "@/lib/api.ts";
import {LeaveContext} from "@/features/context/leaves/LeaveContext.tsx";
import {LeaveBalanceContext} from "@/features/context/leaves/LeaveBalanceContext.tsx";
import LeaveRequestDetailsModal from "@/features/leaves/components/LeaveRequestDetailsModal.tsx";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {format} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {CircleCheck, Eye, X} from "lucide-react";


import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

export default function ReviewerLeaveTable() {

    const { reviewerLeaveRequests, fetchLeaveRequestDetails, fetchLeaveRequests} = useContext(LeaveContext);


    const tableHeaders = ['Name', 'Role', 'Leave Type', 'Reason', 'Start Date', 'End Date', 'Days', 'Status','Actions']

    const [activeLeaveId, setActiveLeaveId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [overlaps, setOverlaps] = useState<string[]>([]);

    const schema = z.object({
        rejection_reason: z.string().min(1, {message: "Rejection Reason is required"}),
    })

    type RejectionReasonFormData = z.infer<typeof schema>;

    const form = useForm<RejectionReasonFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            rejection_reason: '',

        }
    });

    const {setError: setFormError, formState: {errors}} = form;


    // Handles both approvals and rejections on the database level (communicate with the server)
    const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', rejection_reason: string) => {

        setError(null);

        try {
            const holder = localStorage.getItem("token");
            const response = await api.patch(`/leave-requests/${id}/review`, {
                status: status,
                rejection_reason: rejection_reason,
            }, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            })

            if(response.data.success) {
                fetchLeaveRequests();
            }
        }catch (e) {
            // error message based on review controller
            setError(e.response.data.message);
        }

    }

    const validateOverlaps = async (id: number) => {
        setError(null);


        try {
            const holder = localStorage.getItem("token");
            const response = await api.get(`/leave-requests/${id}/overlaps`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            if(response.data.success) {
                setOverlaps(response.data.overlapping_employees || []);
                console.log(overlaps);
                return response.data
            }
        }catch (e) {
            setError(e.response.data.message);
        }

        return null;
    }

    /**
     * Handles triggered when the manager clicks "Reject" on a table row.
     * It opens the form and records which leave ID currently dealing with.
     */
    const handleRejectionReasonForm = async (id: number) => {
        setError(null);
        setActiveLeaveId(id);
        setIsDialogOpen(true);
    }

    const handleApproveSubmit = async (id: number) => {
        setError(null);

        const data = await validateOverlaps(id);

        if(!data) return;

        let confirmationMessage = "Are you sure you want to approve this leave?";

        if(data.has_critical_overlap) {
            confirmationMessage = `This leaves ${data.department} with ${data.remaining_staff} active staff member(s).\n\nAre you absolutely sure you want to approve this?`;
        }else if (data.overlapping_employees.length > 0 && data.overlapping_employees.length < data.total_active_staff) {
            confirmationMessage = `Notice: ${data.overlapping_employees.length} coworker(s) are already off during this window. Proceed with approval?`;
        }


        if(window.confirm(confirmationMessage)) {
            await handleUpdateStatus(id, "approved", "");
            setActiveLeaveId(null);
            setIsDialogOpen(false);
        }

    }

    // Handles submission when the manager clicks "Confirm Rejection" inside the modal form
    const handleRejectSubmit = async () => {
        setError(null);

        // destructure rejection reason from form
        const {rejection_reason} = form.getValues();
        const id = activeLeaveId;

        // check if there's a specific selected id and a rejection reason is not null
        if(!id  || rejection_reason.trim() === "") {
            console.error(form.formState.errors);
            return;
        }

        await handleUpdateStatus(id, "rejected", rejection_reason);
        setActiveLeaveId(null);
        setIsDialogOpen(    false);
        form.reset();

    }

    const handleViewLeaveRequest = async (id: number) => {
        await fetchLeaveRequestDetails(id);
        setIsViewModalOpen(true);
    }

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    return (
        <>

            <LeaveRequestDetailsModal isViewMode={isViewModalOpen} setIsViewMode={setIsViewModalOpen} />

            <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Rejection Reason</DialogTitle>
                        </DialogHeader>
                        <form id="rejection-form" onSubmit={form.handleSubmit(handleRejectSubmit)} >
                            <FieldGroup className="mb-8">
                                <div className="flex flex-col w-full gap-2">
                                    <Controller name="rejection_reason" control={form.control} render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="rejection-reason-title" className="m-0">
                                                Reason
                                            </FieldLabel>

                                            <Textarea
                                                {...field}
                                                id="rejection_reason"
                                                placeholder="Please provide a reason for rejecting this leave request..."
                                            />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                    />
                                </div>
                            </FieldGroup>

                            <DialogFooter>
                                <Button type="submit" className="w-full">
                                    Confirm Rejection
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

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
                    {/* Guard against null with a ternary operator or loading check */}
                    {!reviewerLeaveRequests ? (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                Loading leave requests...
                            </TableCell>
                        </TableRow>
                    ) : reviewerLeaveRequests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                No leave requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reviewerLeaveRequests.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.employee_name}</TableCell>
                                <TableCell>{leave.employee_role}</TableCell>
                                <TableCell>{leave.leave_type_name}</TableCell>
                                <TableCell>{leave.reason}</TableCell>
                                <TableCell>{format(new Date(leave.start_date), 'MMMM dd, yyyy')}</TableCell>
                                <TableCell>{format(new Date(leave.end_date), 'MMMM dd, yyyy')}</TableCell>
                                <TableCell>{leave.total_days}</TableCell>
                                {leave.status === "pending" ? (
                                    <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : leave.status === "approved" ? (
                                    <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : (
                                    <TableCell><span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                )}
                                <TableCell>
                                    <Button onClick={() => handleViewLeaveRequest(leave.id)} variant="outline" className="p-2 mr-1"><Eye /></Button>
                                    <Button onClick={() => handleApproveSubmit(leave.id)} variant="outline" className="p-2 mr-1"><CircleCheck /></Button>
                                    <Button onClick={() => handleRejectionReasonForm(leave.id)}  variant="outline" className="p-2 text-red-500"><X /></Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
                    {error}
                </div>
            )}
        </>
    )

}