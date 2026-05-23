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
} from '@/components/ui/table';
import {Button} from "@/components/ui/button";
import {Eye, Pencil, Trash} from "lucide-react";

const tableHeaders = ['Name', 'Role', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Assigned to','Actions']
export default function ManagerLeaveTable() {

    const { managerLeaveList } = useContext(LeaveContext);
    const [error, setError] = useState<string | null>(null);

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
                    {managerLeaveList.map((leave) => (
                        <TableRow key={leave.id}>
                            <TableCell>{leave.employee_name}</TableCell>
                            <TableCell>{leave.employee_role}</TableCell>
                            <TableCell>{leave.leave_type_name}</TableCell>
                            <TableCell>{leave.start_date}</TableCell>
                            <TableCell>{leave.end_date}</TableCell>
                            <TableCell>{leave.reason}</TableCell>
                            {leave.status === "pending" ? (
                                <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                            ) : leave.status === "approved" ? (
                                <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                            ) : (
                                <TableCell className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-lg">{leave.status}</TableCell>
                            )}
                            <TableCell>{leave.manager_name}</TableCell>
                            <TableCell>
                                <Button variant="outline" className="p-2 mr-1"><Eye /></Button>
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