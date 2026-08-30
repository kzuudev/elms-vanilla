"use client";

import { useLeaveTypeContext } from "@/features/context/leaves/LeaveTypeContext";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function LeaveTypeListTable({
    handleViewLeaveTypeDetails,
    handleEditLeaveTypeDetails,
    handleDeleteLeaveType,
}: {
    handleViewLeaveTypeDetails: (id: number) => void;
    handleEditLeaveTypeDetails: (id: number) => void;
    handleDeleteLeaveType: (id: number) => void;
}) {
    const { leaveTypes } = useLeaveTypeContext();

    return (
        <div className="border border-border rounded-lg bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow className="border-b border-border hover:bg-gray-50">
                        <TableHead className="text-foreground font-semibold">
                            Leave Type
                        </TableHead>
                        <TableHead className="text-foreground font-semibold">
                            Allocated Days
                        </TableHead>
                        <TableHead className="text-foreground font-semibold">
                            Paid
                        </TableHead>
                        <TableHead className="text-foreground font-semibold">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaveTypes.map((leaveType) => (
                        <TableRow key={leaveType.id}>
                            <TableCell>{leaveType.name}</TableCell>
                            <TableCell>{leaveType.allocated_days}</TableCell>
                            <TableCell>{Number(leaveType.is_paid) === 1 ? "Paid" : "Unpaid"}</TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                                    onClick={() => handleViewLeaveTypeDetails(leaveType.id)}
                                >
                                    <Eye className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                                    onClick={() => handleEditLeaveTypeDetails(leaveType.id)}
                                >
                                    <Pencil className="w-4 h-4 text-black" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                                    onClick={() => handleDeleteLeaveType(leaveType.id)}
                                >
                                    <Trash className="w-4 h-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
