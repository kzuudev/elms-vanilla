"use client"

import {useEffect, useState} from "react";
import * as z from 'zod';
import {api} from "@/lib/api.ts";
import {type UserData, type UserProfile, type UserDetails} from "@/types/users.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.tsx";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import {Eye, Pencil, Trash} from "lucide-react";
import {format} from "date-fns";


export default function UsersListTable() {

    const tableHeaders = ["First Name", "Last Name", "Email", "Phone", "Role", "Department", "Status", "Actions"];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({} as UserProfile);
    const [userDetails, setUserDetails] = useState<UserDetails>({} as UserDetails);
    const [error, setError] = useState<string | null>(null);

    // Define the validation rules for editing a user profile
    const schema = z.object({
        first_name: z.string().min(1, {message: "First Name is required"}),
        last_name: z.string().min(1, {message: "Last Name is required"}),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(1, {message: "Phone number is required"}),
        role: z.string().min(1, {message: "Role is required"}),
        department: z.string().min(1, {message: "Department is required"}),
        hired_date: z.string().min(1, {message: "Hired date is required"}),
        salary: z.string().min(1, {message: "Salary is required"}),

        // manager_id can be empty/null if they don't have a manager assigned
        manager_id: z.string().optional().nullable(),

        // accepts string or number since dropdown selects return values as strings ("1" or "0")
        is_active: z.union([z.string(), z.number()]),
    });

    // Infer the type from our Zod schema
    type EditUserDetailsFormData = z.infer<typeof schema>;

    // Initialize the form hook with proper default values
    const form = useForm<EditUserDetailsFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            role: '',
            department: '',
            hired_date: '',
            salary: '',
            manager_id: '',
            is_active: 1,
        }
    });


    const {setError: setFormError, formState: {errors}} = form;

    const fetchUsers = async () => {
        const holder = localStorage.getItem("token");

        try {
            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            })
            setUsers(response.data.users);
        } catch (e) {
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


    useEffect(() => {

        if(userDetails) {
            form.reset({
                first_name: userDetails.first_name || '',
                last_name: userDetails.last_name || '',
                email: userDetails.email || '',
                phone: userDetails.phone || '',
                role: userDetails.role || 'employee',
                department: userDetails.department || '',
                hired_date: userDetails.hired_date ? userDetails.hired_date.split(' ')[0] : '',
                salary: userDetails.salary ? String(userDetails.salary) : '',
                manager_id: userDetails.manager_id ? String(userDetails.manager_id) : '',
                is_active: userDetails.is_active,
            });
        }
    }, [userDetails, form])


    const fetchUserProfile = async (id: number) => {
        try {
            const holder = localStorage.getItem("token");
            const response = await api.get(`/users/${id}/profile`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setUserProfile(response.data.user);
            setIsDialogOpen(true);
        } catch (e) {
            setError(e.response.data.message || "A network error occurred.");

        }

    }
        const fetchUserDetails = async (id: number) => {

            try {
                const holder = localStorage.getItem("token");
                const response = await api.get(`/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
                });
                setUserDetails(response.data.user);
                console.log(response.data.user);
            } catch (e) {
                setError(e.response.data.message || "A network error occurred.");
            }
        }

        const handleEditUserForm = async (id: number) => {
        setIsFormOpen(true);
        setActiveUserId(id);
        await fetchUserDetails(id);
    }

        const fetchUpdateUser = async (id: number, data: EditUserDetailsFormData) => {

        form.setError("root", null);

        try {
            const holder = localStorage.getItem("token");
            const response = await api.patch(`/users/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            await fetchUsers();
            return response;
        } catch (e) {
            form.setError("root",
                {
                    type: "server",
                    message: e.response.data.message || "A network error occurred.",
                });
            throw e;
        }
    }

        const fetchDeleteUser = async (id: number) => {
            const holder = localStorage.getItem("token");
            try {
                const response = await api.delete(`/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
                });
                await fetchUsers();
                return response;
            } catch (e) {
                setError(e.response.data.message || "A network error occurred.");
            }
        }


        const handleEditSubmit = async (data: EditUserDetailsFormData) => {


            const id = activeUserId;

            if (!id) {
                console.error("No active user ID found.");
                return;
            }
            await fetchUpdateUser(id, data)
            setIsFormOpen(false);
        }



        const handleDeleteUser = async (id: number) => {
            form.setError("root", null);

            if (window.confirm("Are you sure you want to delete this user?")) {
                await fetchDeleteUser(id);
            }
        }


        return (

            <>
                {/* view user details */}
                <div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className="mb-2">
                                <DialogTitle>Employee Details</DialogTitle>
                            </DialogHeader>
                            <div className="w-full flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Name:</span>
                                        <span>{`${userProfile.first_name} ${userProfile.last_name}`}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Role:</span>
                                        <span>{userProfile.role}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Email Address:</span>
                                        <span>{userProfile.email}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Contact No:</span>
                                        <span>{userProfile.phone}</span>
                                    </div>

                                    {userProfile?.leave_balance && userProfile.leave_balance.length > 0 ? (
                                        <div
                                            className="space-y-2 mt-2 bg-muted/30 p-3 rounded-lg border border-muted-foreground/10">
                                            <p className="text-sm text-muted-foreground">
                                                Leave Balances
                                            </p>

                                            {userProfile.leave_balance.map((leave, index) => (
                                                <div key={index}
                                                     className="flex justify-between items-center py-1 border-b border-muted last:border-0">
                                                <span className="text-sm text-muted-foreground">
                                                    {leave.leave_type_name}
                                                </span>
                                                    <span
                                                        className="text-sm font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-muted/60">
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
                                        <span>{userProfile.salary}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Date Hired:</span>
                                        {userProfile?.hired_date
                                            ? format(new Date(userProfile.hired_date), 'MMMM dd, yyyy')
                                            : 'N/A'}
                                    </div>


                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Status:</span>
                                        {userProfile.is_active === 1 ? (
                                            <span
                                                className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                        ) : userProfile.is_active === 0 ? (
                                            <span
                                                className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">inactive</span>
                                        ) : null}
                                    </div>

                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* edit user details */}
                <div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                    Make changes to the user here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="">
                                <form onSubmit={form.handleSubmit(handleEditSubmit)}>
                                    <FieldGroup className="mb-8">
                                        {/* First & Last Name */}
                                        <div className="flex gap-2">
                                            <Controller name="first_name" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="first_name" className="m-0">First
                                                                    Name</FieldLabel>
                                                                <Input {...field} id="first_name"
                                                                       aria-invalid={fieldState.invalid}
                                                                       autoComplete="off"/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                            <Controller name="last_name" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="last_name" className="m-0">Last
                                                                    Name</FieldLabel>
                                                                <Input {...field} id="last_name"
                                                                       aria-invalid={fieldState.invalid}
                                                                       autoComplete="off"/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                        </div>
                                        {/* Email & Phone */}
                                        <div className="flex gap-2">
                                            <Controller name="email" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                                                <Input {...field} id="email" type="email"
                                                                       aria-invalid={fieldState.invalid}
                                                                       autoComplete="off"/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                            <Controller name="phone" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="phone">Contact No.</FieldLabel>
                                                                <Input {...field} id="phone" type="tel"
                                                                       aria-invalid={fieldState.invalid}
                                                                       autoComplete="off"/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                        </div>

                                        {/* Role & Department */}
                                        <div className="flex gap-2">
                                            <Controller name="role" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="role"
                                                                            className="m-0">Role</FieldLabel>
                                                                <select {...field} id="role"
                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                                    <option value="employee">Employee</option>
                                                                    <option value="manager">Manager</option>
                                                                    <option value="admin">Admin</option>
                                                                </select>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                            <Controller name="department" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="department"
                                                                            className="m-0">Department</FieldLabel>
                                                                <Input {...field} id="department"
                                                                       aria-invalid={fieldState.invalid}
                                                                       autoComplete="off"/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                        </div>

                                        {/* Hired Date & Salary */}
                                        <div className="flex gap-2">
                                            <Controller name="hired_date" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="hired_date">Hired Date</FieldLabel>
                                                                <Input {...field} id="hired_date" type="date"
                                                                       aria-invalid={fieldState.invalid}/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                            <Controller name="salary" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="salary">Salary</FieldLabel>
                                                                <Input {...field} id="salary" type="number" step="0.01"
                                                                       aria-invalid={fieldState.invalid}/>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                        </div>

                                        {/* Manager ID & Status */}
                                        <div className="flex gap-2">
                                            <Controller
                                                name="manager_id"
                                                control={form.control}
                                                render={({field, fieldState}) => (
                                                    <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                        <FieldLabel htmlFor="manager_id">Manager (Optional)</FieldLabel>
                                                        <select
                                                            {...field}
                                                            id="manager_id"
                                                            value={field.value || ''}
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            aria-invalid={fieldState.invalid}
                                                        >
                                                            <option value="">No Manager Assigned</option>

                                                            {userDetails?.managers?.map((manager) => (
                                                                <option key={manager.id} value={manager.id}>
                                                                    {manager.name}
                                                                </option>
                                                            ))}

                                                        </select>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                    </Field>
                                                )}
                                            />
                                            <Controller name="is_active" control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                <FieldLabel htmlFor="is_active" className="m-0">Account
                                                                    Status</FieldLabel>
                                                                <select
                                                                    {...field}
                                                                    id="is_active"
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                >
                                                                    <option value={1}>Active</option>
                                                                    <option value={0}>Inactive</option>
                                                                </select>
                                                                {fieldState.invalid &&
                                                                    <FieldError errors={[fieldState.error]}/>}
                                                            </Field>
                                                        )}/>
                                        </div>

                                    </FieldGroup>

                                    {errors.root && (
                                        <div className="text-red-500 text-sm mb-4 text-center">
                                            {errors.root.message}
                                        </div>
                                    )}

                                    <DialogFooter>
                                        <Button type="button" variant="outline">Cancel</Button>
                                        <Button type="submit" className="rounded-md bg-black text-white text-center">
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </form>
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
                                        <span
                                            className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                    ) : user.is_active === 0 ? (
                                        <span
                                            className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">inactive</span>
                                    ) : null}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => fetchUserProfile(user.id)} variant="outline"
                                                className="p-2 mr-1"><Eye/></Button>
                                        <Button onClick={() => handleEditUserForm(user.id)} variant="outline"
                                                className="p-2 mr-1"><Pencil/></Button>
                                        <Button onClick={() => handleDeleteUser(user.id)} variant="outline"
                                                className="p-2 text-red-500"><Trash/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        );

}