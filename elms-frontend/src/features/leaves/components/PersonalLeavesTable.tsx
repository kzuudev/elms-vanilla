"use client";


import {useEffect, useState} from "react";

import {useLeaveContext} from "@/features/context/leaves/LeaveContext.tsx";
import LeaveRequestDetailsModal from "@/features/leaves/components/LeaveRequestDetailsModal.tsx";
import LeaveBalanceSection from "@/features/leaves/components/LeaveBalanceSection.tsx";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";


import {format} from "date-fns";
import {Eye} from "lucide-react";




export default function PersonalLeavesTable() {

    const { fetchLeaveRequestDetails, fetchLeaveRequests, personalLeaveRequests } = useLeaveContext();

    const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Assigned To', 'Status','Actions']
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  

    const handleViewLeaveRequest = async (id: number) => {
        await fetchLeaveRequestDetails(id);
        setIsViewModalOpen(true);

    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();
    }, []);

    return (
        <>

            <div className="my-7">
                <LeaveBalanceSection />
            </div>

            <LeaveRequestDetailsModal isViewMode={isViewModalOpen} setIsViewMode={setIsViewModalOpen} />

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
                        ) : personalLeaveRequests?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            personalLeaveRequests?.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell>{leave.leave_type}</TableCell>
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
