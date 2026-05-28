'use client'

import {useState, useContext} from "react";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import {api} from "@/lib/api.ts";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field.tsx";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button";
import {Eye, CircleCheck, X} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";


const tableHeaders = ['Name', 'Role', 'Leave Type', 'Reason', 'Start Date', 'End Date', 'Days', 'Status','Actions']
export default function ManagerLeaveTable() {

    const [activeLeaveId, setActiveLeaveId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { managerLeaveList, fetchLeaveRequests } = useContext(LeaveContext);


    const schema = z.object({
        rejection_reason: z.string().min(1, {message: "Rejection Reason is required"}),
    })

    type RejectionReasonFormData = z.infer<typeof schema>;

    const form = useForm<RejectionReasonFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            rejection_reason: '',
        }
    });

    const {setError: setFormError, formState: {errors}} = form;

    // Handles both approvals and rejections on the database level
    const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected', rejection_reason: string) => {

        setError(null);

        const holder = localStorage.getItem("token");

        try {
            // add api here (patch)
            const response = await api.patch(`/leaves/${id}`, {
                status: status,
                rejection_reason: rejection_reason,
            }, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            })

            if(response.data.success) {
                console.log(response.data.message);
                fetchLeaveRequests();
            }
        }catch (e) {
            // error message based on review controller
           setError(e.response.data.message);
        }

    }

    /**
     * Handles triggered when the manager clicks "Reject" on a table row.
     * It opens the form and records which leave ID currently dealing with.
     */
    const handleRejectionReasonForm = async (id: number) => {
        setError(null);
        setActiveLeaveId(id);
        setRejectionReason(null);
    }

    // Handles submission when manager clicks "Confirm Rejection" inside the modal form
    const handleRejectSubmit = async (id: number, rejection_reason: string) => {}

    return (
        <>
            <div>
                <Dialog open={activeLeaveId} onOpenChange={setActiveLeaveId}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Rejection Reason</DialogTitle>
                        </DialogHeader>
                        <form id="rejection-form" >
                            <FieldGroup className="mb-8">
                                <div className="flex flex-col w-full gap-2">
                                    <Controller name="rejection_reason" control={form.control} render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="login-form-title" className="m-0">
                                               Rejection Reason
                                            </FieldLabel>

                                           <Textarea
                                               id="rejection-reason"
                                               placeholder="Please provide a reason for rejecting this leave request..."
                                               required
                                           />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                    />
                                </div>
                            </FieldGroup>

                          <DialogFooter>
                              <Button type="submit" className="w-full">
                                  Confirm Rejection
                              </Button>
                          </DialogFooter>
                        </form>
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
                        {managerLeaveList.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.employee_name}</TableCell>
                                <TableCell>{leave.employee_role}</TableCell>
                                <TableCell>{leave.leave_type_name}</TableCell>
                                <TableCell>{leave.reason}</TableCell>
                                <TableCell>{leave.start_date}</TableCell>
                                <TableCell>{leave.end_date}</TableCell>
                                <TableCell>{leave.total_days}</TableCell>
                                {leave.status === "pending" ? (
                                    <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : leave.status === "approved" ? (
                                    <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leave.status}</span></TableCell>
                                ) : (
                                    <TableCell className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-lg">{leave.status}</TableCell>
                                )}
                                <TableCell>
                                    <Button variant="outline" className="p-2 mr-1"><Eye /></Button>
                                    <Button variant="outline" className="p-2 mr-1"><CircleCheck /></Button>
                                    <Button onClick={() => handleRejectionReasonForm(leave.id)} variant="outline" className="p-2 text-red-500"><X /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}