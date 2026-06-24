"use client";


import {useContext, useEffect, useState} from "react";
import {LeaveContext} from "@/features/context/LeaveContext.tsx";

import LeaveRequestDetailsModal from "@/features/leaves/components/LeaveRequestDetailsModal.tsx";
import LeaveBalanceSection from "@/features/leaves/components/LeaveBalanceSection.tsx";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {format} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {Eye} from "lucide-react";
import {api} from "@/lib/api.ts";
import type {PersonalLeaveRequest} from "@/types/leave.ts";

export default function PersonalLeavesTable() {

    const { fetchLeaveRequestDetails, fetchLeaveRequests } = useContext(LeaveContext);

    const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Assigned To', 'Status','Actions']

    const [personalLeaveRequests, setPersonalLeaveRequests] = useState<PersonalLeaveRequest[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPersonalLeaveRequests = async (signal?: AbortSignal) => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get(`/leave-requests/me`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
                signal: signal
            });

            if(response.data.success) {
                setPersonalLeaveRequests(response.data.leave_requests.data);
            }
        }catch (e) {
            setError(e.response.data.message);
        }
    }

    const handleViewLeaveRequest = async (id: number) => {
        await fetchLeaveRequestDetails(id);
        setIsViewModalOpen(true);

    }


    useEffect(() => {

        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPersonalLeaveRequests(controller.signal);
        fetchLeaveRequests()

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <LeaveRequestDetailsModal isViewMode={isViewModalOpen} setIsViewMode={setIsViewModalOpen} />

            <div className="my-7">
                <LeaveBalanceSection />
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
                        {/* Guard against null with a ternary operator or loading check */}
                        {!personalLeaveRequests ? (
                            <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                    Loading leave requests...
                                </TableCell>
                            </TableRow>
                        ) : personalLeaveRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            personalLeaveRequests.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell>{leave.leave_type_name}</TableCell>
                                    <TableCell>{format(new Date(leave.start_date), 'MMMM dd, yyyy')}</TableCell>
                                    <TableCell>{format(new Date(leave.end_date), 'MMMM dd, yyyy')}</TableCell>
                                    <TableCell>{leave.reason}</TableCell>
                                    <TableCell>{leave.assigned_name}</TableCell>
                                    {leave.status === "pending" ? (
                                        <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                    ) : leave.status === "approved" ? (
                                        <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                    ) : (
                                        <TableCell><span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                    )}
                                    <TableCell>
                                        <Button onClick={() => handleViewLeaveRequest(leave.id)} variant="outline" className="p-2 mr-1"><Eye /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}