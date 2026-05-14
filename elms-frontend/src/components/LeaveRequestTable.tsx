'use client'

import {api} from "@/lib/api.ts";
import {useEffect, useState} from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Eye, Pencil, Trash } from 'lucide-react';
import { Button } from './ui/button';
import type {TableData} from "@/types/leave.ts";


const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']

export default function LeaveRequestTable() {

    const [error, setError] = useState<string | null>(null);
    const [leaveRequests, setLeaveRequests] = useState<TableData[]>([]);
    const [manager, setManager] = useState<string | null>(null);

   useEffect(() => {
       const getLeaveRequests = async () => {
           try {

               localStorage.getItem("token");
               const holder = localStorage.getItem("token");

               const response = await api.get("/leave-request", {
                   // this is a verification for the bearer (holder) of the token has permission to access this account and do action
                   headers: {
                       Authorization: `Bearer ${holder}`,
                   },
               });
               setLeaveRequests(response.data.leave_requests.data);
               setManager(response.data.leave_requests.assigned_to.manager_name);
           }catch (e) {
               setError(e.response.data.message);
           }
       };

       getLeaveRequests();
   }, [])

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
                            <TableCell>{leave.leave_type}</TableCell>
                            <TableCell>{leave.start_date}</TableCell>
                            <TableCell>{leave.end_date}</TableCell>
                            <TableCell>{leave.reason}</TableCell>
                            <TableCell>{leave.status}</TableCell>
                            <TableCell>{manager}</TableCell>
                            <TableCell>
                                <Button>
                                    <Eye />
                                </Button>
                                <Button>
                                    <Pencil />
                                </Button>
                                <Button>
                                    <Trash/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}