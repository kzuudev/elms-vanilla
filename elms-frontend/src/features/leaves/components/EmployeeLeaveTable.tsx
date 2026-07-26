'use client'

import { useState, useEffect } from "react";
import { format } from 'date-fns';
import {api} from "@/lib/api.ts";

import { useLeaveContext } from "@/features/context/leaves/LeaveContext.tsx";
import { useLeaveBalanceContext } from "@/features/context/leaves/LeaveBalanceContext.tsx";

import {Eye, Pencil, Trash} from 'lucide-react';

import LeaveRequestDetailsModal from "./LeaveRequestDetailsModal";
import LeaveRequestForm from "./LeaveRequestForm";
import type { LeaveRequestFormData } from "@/types/leave.ts";

import { Alert } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";


const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']


export default function EmployeeLeaveTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // capture the leave request list directly from the Leave Context
    const { leaveRequests, fetchLeaveRequests, fetchLeaveRequestDetails, leaveRequestDetails } = useLeaveContext();
    const { fetchLeaveBalance } = useLeaveBalanceContext();

    const [error, setError] = useState<string | null>(null);


    const fetchLeaveRequestEdit = async (id: number, data: LeaveRequestFormData) => {

        setError("Server error");

        try {
            const holder = localStorage.getItem("token");
            const response = await api.patch(`/leave-request/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            return response;
        }catch (e) {
            setError(e.response.data.message as string);
            throw e;
        }
    }


    const fetchLeaveRequestDelete = async (id: number) => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.delete(`/leave-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            console.log(response.data.message);
            return response;
        }catch (e: any) {
            setError(e.response?.data?.message ?? "Failed to delete leave request");
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
        await fetchLeaveRequestEdit(leaveRequestDetails?.id ?? 0, data);
        setIsEditMode(false);
        fetchLeaveRequests();
        setError(null);
    }


    // handle delete of leave request
    const handleDeleteLeaveRequests = async (id: number) => {
        if(window.confirm("Are you sure you want to delete this leave request?")){
            await fetchLeaveRequestDelete(id);
            fetchLeaveRequests();
        }
    }

    useEffect(() => {

        const handleFocus = () => {
            fetchLeaveRequests();
            fetchLeaveBalance();
        }

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        }

    }, [leaveRequestDetails, fetchLeaveRequests, fetchLeaveBalance, isEditMode]);



    return (
        <>
            {/** view request details modal **/}
            <LeaveRequestDetailsModal isViewMode={isDialogOpen} setIsViewMode={setIsDialogOpen} />

            {/** edit modal **/}
            <Dialog open={isEditMode} onOpenChange={(open) => setIsEditMode(open)}>
                <DialogContent className="sm:max-w-[430px]">
                    <DialogHeader className="text-lg font-bold">
                        <DialogTitle>Edit Leave Request</DialogTitle>
                    </DialogHeader>
                    <LeaveRequestForm
                        closeDialog={() => setIsEditMode(false)}
                        handleSubmit={handleLeaveRequestEditSubmit}
                    />
                </DialogContent>
            </Dialog>

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
                        {(leaveRequests ?? []).map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.leave_type}</TableCell>
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
                                <TableCell>{leave.assigned_name}</TableCell>
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

            {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        </>
    )
}