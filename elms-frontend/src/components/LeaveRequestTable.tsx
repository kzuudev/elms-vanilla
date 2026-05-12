'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {MoreVertical} from "lucide-react";

const tableHeaders = ['Leave Type', 'Start Date', 'End Date', 'Status', 'Actions']

const leaveRequests = [
    {
        leaveType: 'Vacation Leave',
        startDate: '2026-05-10',
        endDate: '2026-05-12',
        status: 'Pending',
    },
]
export default function LeaveRequestTable() {

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
                    {leaveRequests.map((leave, index) => (
                        <TableRow key={index}>
                            <TableCell>{leave.leaveType}</TableCell>
                            <TableCell>{leave.startDate}</TableCell>
                            <TableCell>{leave.endDate}</TableCell>
                            <TableCell>{leave.status}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}