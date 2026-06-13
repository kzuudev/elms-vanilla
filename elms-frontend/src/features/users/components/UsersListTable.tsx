"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";
import {type UserData, type User} from "@/types/users.ts";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, Pencil, Trash} from "lucide-react";
import {format} from "date-fns";



export default function UsersListTable() {

    const tableHeaders = ["First Name", "Last Name", "Email", "Phone", "Role", "Department", "Status", "Actions"];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [userDetails, setUserDetails] = useState<User>({} as User);
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


    const fetchUserDetails = async (id: number) => {
        const holder = localStorage.getItem("token");

        try {
            const response = await api.get(`/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setUserDetails(response.data.user);
            console.log(response.data.user);
            setIsDialogOpen(true);
            console.log(response.data.user);
        }catch (e) {
            setError(e.response.data.message || "A network error occurred.");
        }
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
                                    <span>{`${userDetails.first_name} ${userDetails.last_name}`}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Role:</span>
                                    <span>{userDetails.role}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Email Address:</span>
                                    <span>{userDetails.email}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Contact No:</span>
                                    <span>{userDetails.phone}</span>
                                </div>

                                {userDetails?.leave_balance && userDetails.leave_balance.length > 0 ? (
                                    <div className="space-y-2 mt-2 bg-muted/30 p-3 rounded-lg border border-muted-foreground/10">
                                        <p className="text-sm text-muted-foreground">
                                            Leave Balances
                                        </p>

                                        {userDetails.leave_balance.map((leave, index) => (
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
                                    <span>{userDetails.salary}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Date Hired:</span>
                                    {userDetails?.hired_date
                                        ? format(new Date(userDetails.hired_date), 'MMMM dd, yyyy')
                                        : 'N/A'}
                                </div>


                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    {userDetails.is_active === 1 ? (
                                        <span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                    ) : userDetails.is_active === 0 ? (
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
                                    <Button onClick={() => fetchUserDetails(user.id)} variant="outline" className="p-2 mr-1"><Eye /></Button>
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