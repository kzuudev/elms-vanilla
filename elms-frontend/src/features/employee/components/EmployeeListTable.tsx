"use client"

import { api } from "@/lib/api.ts";
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
import {Button} from "@/components/ui/button.tsx";
import {Eye, Pencil, Trash} from "lucide-react";

export default function EmployeeListTable() {

    const tableHeaders = ['First Name', 'Last Name', 'Email', 'Contact Number', 'Role', 'Actions']

    const {users} = useContext(UsersContext);


    return (
        <>
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.employee_first_name}</TableCell>
                                <TableCell>{user.employee_last_name}</TableCell>
                                <TableCell>{user.employee_email}</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{user.employee_role}</TableCell>
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
        </>
    )





}