"use client"


import { useState } from "react";
import { UsersContext } from "@/features/context/UsersContext.tsx";
import { useContext } from "react";

import {
    Table,
    TableBody, TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, Calendar} from "lucide-react";
import {format} from "date-fns";

export default function EmployeeListTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const tableHeaders = ['First Name', 'Last Name', 'Email', 'Contact Number', 'Role', 'Actions']

    const {employees, fetchEmployeeDetails, employeeDetails} = useContext(UsersContext);

    const handleViewEmployeeDetails = async (id: number) => {
        await fetchEmployeeDetails(id);
        setIsDialogOpen(true);
    }

    return (
        <>

            <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Employee Details</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Name:</span>
                                    <span>{`${employeeDetails.employee_first_name} ${employeeDetails?.employee_last_name}`}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Role:</span>
                                    <span>{employeeDetails.employee_role}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Email Address:</span>
                                    <span>{employeeDetails.employee_email}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Contact No:</span>
                                    <span>{employeeDetails.employee_phone}</span>
                                </div>

                                {employeeDetails?.employee_leave_balance && employeeDetails.employee_leave_balance.length > 0 ? (
                                    <div className="space-y-2 mt-2 bg-muted/30 p-3 rounded-lg border border-muted-foreground/10">
                                        <p className="text-sm text-muted-foreground">
                                            Leave Balances
                                        </p>

                                        {employeeDetails.employee_leave_balance.map((leave, index) => (
                                            <div key={index} className="flex justify-between items-center py-1 border-b border-muted last:border-0">
                                                <span className="text-sm text-muted-foreground">
                                                    {leave.leave_type_name}
                                                </span>
                                                <span className="text-sm font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-muted/60">
                                                    {leave.remaining_balance} Days
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-between py-2 text-sm text-muted-foreground">
                                        <span>Leave Balances:</span>
                                        <span>No balances assigned</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Salary:</span>
                                    <span>{employeeDetails.employee_salary}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Date Hired:</span>
                                    {employeeDetails?.employee_hired_date
                                        ? format(new Date(employeeDetails.employee_hired_date), 'MMMM dd, yyyy')
                                        : 'N/A'}
                                </div>


                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    {employeeDetails.employee_is_active === 1 ? (
                                        <span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                    ) : employeeDetails.employee_is_active === 0 ? (
                                        <span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">inactive</span>
                                    ) : null}
                                </div>

                            </div>
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
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.employee_first_name}</TableCell>
                                <TableCell>{employee.employee_last_name}</TableCell>
                                <TableCell>{employee.employee_email}</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{employee.employee_role}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleViewEmployeeDetails(employee.id)} variant="outline" className="p-2 mr-1"><Eye /></Button>
                                    <Button variant="outline" className="p-2 mr-1"><Calendar /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )





}