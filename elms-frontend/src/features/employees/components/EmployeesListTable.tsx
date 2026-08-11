    "use client"

    import {useEffect, useState, useContext} from "react";

    import * as z from 'zod';
    import {api} from "@/lib/api.ts";
    import {type EmployeeData, type EmployeeDetails} from "@/types/employees.ts";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { Controller, useForm } from "react-hook-form";
    import {formatE164} from "@/lib/utils.ts";

    import {AuthContext} from "@/features/context/auth/AuthContext.tsx";
    import { type Manager } from "@/types/employees.ts";

    import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.tsx";
    import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field.tsx";
    import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
    import {Button} from "@/components/ui/button.tsx";
    import { Input } from "@/components/ui/input";

    import {Eye, Pencil, Trash, Calendar} from "lucide-react";
    import {format} from "date-fns";


    interface EmployeeListTableProps {
        employees: EmployeeData[];
        onUserMutated: () => void;
    }

    export default function EmployeesListTable({ employees, onUserMutated }: EmployeeListTableProps) {

        const { user } = useContext(AuthContext);

        const isManager = user?.role === 'manager';
        const isAdmin = user?.role === 'admin';

        const tableHeaders = ["First Name", "Last Name", "Email", "Phone", "Role", "Department", "Status", "Actions"];

        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [isFormOpen, setIsFormOpen] = useState(false);
        const [activeUserId, setActiveUserId] = useState<number | null>(null);

        const [managers, setManagers] = useState<Manager[]>([]);

        const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({} as EmployeeDetails);

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
            assigned_to: z.string().optional().nullable(),

            // accepts string or number since dropdown selects return values as strings ("1" or "0")
            is_active: z.union([z.string(), z.number()]),
        });

        // Infer the type from our Zod schema
        type EditEmployeeDetailsFormData = z.infer<typeof schema>;

        // Initialize the form hook with proper default values
        const form = useForm<EditEmployeeDetailsFormData>({
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
                assigned_to: '',
                is_active: 1,
            }
        });


        const {formState: {errors}} = form;



        useEffect(() => {

            if(employeeDetails) {
                form.reset({
                    first_name: employeeDetails.first_name || '',
                    last_name: employeeDetails.last_name || '',
                    email: employeeDetails.email || '',
                    phone: employeeDetails.phone || '',
                    role: employeeDetails.role || '',
                    department: employeeDetails.department || '',
                    hired_date: employeeDetails.hired_date ? employeeDetails.hired_date.split(' ')[0] : '',
                    salary: employeeDetails.salary ? String(employeeDetails.salary) : '',
                    assigned_to: employeeDetails.assigned_to?.id != null
                        ? String(employeeDetails.assigned_to.id)
                        : '',
                    is_active: employeeDetails.is_active,
                });
            }
        }, [employeeDetails, form])

        const fetchEmployeeDetails = async (id: number) => {
            try {
                const holder = localStorage.getItem("token");
                const response = await api.get(`/employees/${id}/profile`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
                });
                const data = response.data.data.employee;
                setEmployeeDetails(data);
                return data
            } catch (e) {
                setError(e.response.data.message || "A network error occurred.");

            }

        }

        const handleViewEmployeeDetails = async (id: number) => {
            setEmployeeDetails(null); // Clear old state so previous user data doesn't flash
            const data = await fetchEmployeeDetails(id);

            if (data) {
                setIsDialogOpen(true);
            }

        }

        const handleEditEmployeeForm = async (id: number) => {
            setActiveUserId(id);
            setEmployeeDetails(null); // Clear old state

            // Fetch fresh data
            const data = await fetchEmployeeDetails(id);

            // Reset form IMMEDIATELY with returned data
            if (data) {
                form.reset({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: data.role || '',
                    department: data.department || '',
                    hired_date: data.hired_date ? data.hired_date.split(' ')[0] : '',
                    salary: data.salary ? String(data.salary) : '',
                    assigned_to: data.assigned_to?.id != null
                        ? String(data.assigned_to.id)
                        : '',
                    is_active: data.is_active,
                });

                // Open modal ONLY after form is fully populated!
                setIsFormOpen(true);
            }
        }

        const fetchUpdateEmployee = async (id: number, data: EditEmployeeDetailsFormData) => {

            form.setError("root", null);

            try {
                const holder = localStorage.getItem("token");
                const response = await api.patch(`/employees/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
                });
                onUserMutated();
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

        const fetchDeleteEmployee = async (id: number) => {
                const holder = localStorage.getItem("token");
                try {
                    const response = await api.delete(`/employees/${id}`, {
                        headers: {
                            Authorization: `Bearer ${holder}`,
                        }
                    });
                    onUserMutated();
                    return response;
                } catch (e) {
                    setError(e.response.data.message || "A network error occurred.");
                }
            }

        const handleEditSubmit = async (data: EditEmployeeDetailsFormData) => {

                const id = activeUserId;

                if (!id) {
                    console.error("No active user ID found.");
                    return;
                }
                await fetchUpdateEmployee(id, data)
                setIsFormOpen(false);
            }

        const handleDeleteEmployee = async (id: number) => {
            form.setError("root", {
                type: "server",
                message: "A network error occurred.",
            });

            if (window.confirm("Are you sure you want to delete this user?")) {
                await fetchDeleteEmployee(id);
            }
        }

        const fetchManagers = async () => {

            try {
                const holder = localStorage.getItem("token");
                const response = await api.get(`/employees/managers`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    }
                });
                setManagers(response.data.data.managers);
            } catch (e: any) {
                setError(e.response.data.message || "A network error occurred.");
                return [];
            }
        }

        useEffect(() => {
            if(isAdmin) {
                fetchManagers();
            }
        }, []);

        const options = [
                {value: 'IT Support', label: 'IT Support'},
                {value: 'UI/UX', label: 'UI/UX'},
                {value: 'Marketing', label: 'Marketing'},
                {value: 'Software Engineer', label: 'Software Engineer'},
                {value: 'AI Engineer', label: 'AI Engineer'},
                {value: 'Accountant', label: 'Accountant'}
        ]



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
                                            <span>{`${employeeDetails?.first_name} ${employeeDetails?.last_name}`}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Role:</span>
                                            <span>{employeeDetails?.role}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Email Address:</span>
                                            <span>{employeeDetails?.email}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Contact No:</span>
                                            <span>{employeeDetails?.phone}</span>
                                        </div>

                                        {employeeDetails?.leave_balance && employeeDetails?.leave_balance.length > 0 ? (
                                            <div
                                                className="space-y-2 mt-2 bg-muted/30 p-3 rounded-lg border border-muted-foreground/10">
                                                <p className="text-sm text-muted-foreground">
                                                    Leave Balances
                                                </p>

                                                {employeeDetails?.leave_balance.map((leave, index) => (
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
                                            <span>{employeeDetails?.salary}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Date Hired:</span>
                                            {employeeDetails?.hired_date
                                                ? format(new Date(employeeDetails.hired_date), 'MMMM dd, yyyy')
                                                : 'N/A'}
                                        </div>


                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Status:</span>
                                            {employeeDetails?.is_active === 1 ? (
                                                <span
                                                    className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                            ) : employeeDetails?.is_active === 0 ? (
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
                                                                            {options.map((opt) => (
                                                                                <option key={opt.value} value={opt.value}>
                                                                                    {opt.label}
                                                                                </option>
                                                                            ))}
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
                                                    name="assigned_to"
                                                    control={form.control}
                                                    render={({field, fieldState}) => (
                                                        <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                            <FieldLabel htmlFor="assigned_to">Manager (Optional)</FieldLabel>
                                                            <Select
                                                                value={field.value ? String(field.value) : 'none'}
                                                                onValueChange={(value) =>
                                                                    field.onChange(value === 'none' ? '' : value)
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a manager" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="none">No Manager Assigned</SelectItem>
                                                                    {managers.map((manager) => (
                                                                        <SelectItem key={manager.id} value={String(manager.id)}>
                                                                            {manager.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                                        </Field>
                                                    )}
                                                />
                                                <Controller name="is_active" control={form.control}
                                                            render={({field, fieldState}) => (
                                                                <Field data-invalid={fieldState.invalid} className="w-1/2">
                                                                    <FieldLabel htmlFor="is_active" className="m-0">Account
                                                                        Status</FieldLabel>
                                                                    <Select {...field} value={field.value ? String(field.value) : ''}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">Active</SelectItem>
                                                                            <SelectItem value="0">Inactive</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
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

                    {/* Employee Table */}
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
                                {
                                    employees?.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell>{employee.first_name}</TableCell>
                                            <TableCell>{employee.last_name}</TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{formatE164(employee.phone)}</TableCell>
                                            <TableCell>{employee.role}</TableCell>
                                            <TableCell>{employee.department}</TableCell>
                                            <TableCell> {employee.is_active === 1 ? (
                                                <span
                                                    className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">active</span>
                                            ) : employee.is_active === 0 ? (
                                                <span
                                                    className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">inactive</span>
                                            ) : null}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {/* SHARED ACTION: Both Admin and Manager can view Employee details */}
                                                    <Button
                                                        onClick={() => handleViewEmployeeDetails(employee.id)}
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>

                                                    {/* Manager Actions */}
                                                    {isManager && (
                                                        <Button variant="outline" className="p-2 mr-1"><Calendar /></Button>
                                                    )}

                                                    {/* Admin Actions */}
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                onClick={() => handleEditEmployeeForm(employee.id)}
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>

                                                            <Button
                                                                onClick={() => handleDeleteEmployee(employee.id)}
                                                                variant="outline"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                    )}
                </>
            );

    }