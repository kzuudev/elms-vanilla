'use client'

import {useState, useContext} from "react";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import type {LeaveRequest} from "@/types/leave.ts";
import {api} from "@/lib/api.ts";

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

import { Eye, Pencil, Trash } from 'lucide-react';





const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']


export default function EmployeeLeaveTable() {

    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);

    // get the leave request list directly from the Leave Context
    const { leaveRequests } = useContext(LeaveContext);
    const holder = localStorage.getItem("token");
    const fetchLeaveRequestDetails = async (id: number) => {

        try{
            const response = await api.get(`/leave-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setLeaveRequestDetails(response.data.leave_request);
            console.log(response.data.leave_request);
        }catch (e) {
            setError(e.response.data.message);
        }
    }

    const handleViewLeaveRequest = async (id: number) => {
        await fetchLeaveRequestDetails(id);
        setIsDialogOpen(true);
    }



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
                                <TableCell>{leave.start_date}</TableCell>
                                <TableCell>{leave.end_date}</TableCell>
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
                                    <Button variant="outline" className="p-2 mr-1"><Pencil /></Button>
                                    <Button variant="outline" className="p-2 text-red-500"><Trash/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}