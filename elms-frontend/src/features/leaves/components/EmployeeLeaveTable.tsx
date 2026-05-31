'use client'

import {useState, useContext} from "react";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx'

import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';
import {api} from "@/lib/api.ts";



const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']


export default function EmployeeLeaveTable() {

    const [error, setError] = useState<string | null>(null);

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
            console.log(response.data.leave_request);
        }catch (e) {
            setError(e.response.data.message);
        }
    }

    const handleViewLeaveRequest = async (id: number) => {
        await fetchLeaveRequestDetails(id);
    }


    return (
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
    )
}