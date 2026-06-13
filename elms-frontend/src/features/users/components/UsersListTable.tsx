"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";
import {type UserData} from "@/types/users.ts";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, Pencil, Trash} from "lucide-react";






export default function UsersListTable() {

    const tableHeaders = ["First Name", "Last Name", "Email", "Phone", "Role", "Department", "Status", "Actions"];


    const [users, setUsers] = useState<UserData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        const holder = localStorage.getItem("token");

        try {
            const response = await api.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            })
            setUsers(response.data.users);
        }catch (e) {
            setError(e.response.data.message || "A network error occurred.");
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();

        window.addEventListener("user-mutated", () => {
            fetchUsers();
        })

        // clean up to prevent memory leaks when navigating from this page
        return () => {
            window.removeEventListener("user-mutated", fetchUsers);
        };
    }, [])

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
                                <TableCell>{user.first_name}</TableCell>
                                <TableCell>{user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell> {user.is_active === 1 ? (
                                    <span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                ) : user.is_active === 0 ? (
                                    <span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">inactive</span>
                                ) : null}</TableCell>
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
    );
}