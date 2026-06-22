"use client"

import * as z from "zod";
import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import type {LeaveRequest} from "@/types/leave.ts";

import ManagerLeaveTable from "@/features/leaves/components/ManagerLeaveTable.tsx";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";

export default function  LeavesDashboard() {

    const [reviewerLeaveRequests, setReviewerLeaveRequests] = useState([]);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const schema = z.object({
        leave_type: z.string().min(1, {message: "Leave Type is required"}),
        start_date: z.string().min(1, {message: "Start Date is required"}),
        end_date: z.string().min(1, {message: "End Date is required"}),
        reason: z.string().min(1, {message: "Reason is required"}),
    })

    type LeaveRequestFormData = z.infer<typeof schema>;

    const form = useForm<LeaveRequestFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            leave_type: "",
            start_date: "",
            end_date: "",
            reason: "",
        }
    });

    const { formState: {errors}} = form;

    const fetchLeaveRequests = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/leave-requests", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setReviewerLeaveRequests(response.data.leaves.data);
            console.log(response.data.leave_requests.data);
        }catch (e) {
            setError(e.response.data.message);
        }
    }


    const fetchLeaveRequestDetails = async (id: number) => {
        try{
            const holder = localStorage.getItem("token");
            const response = await api.get(`leave-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setLeaveRequestDetails(response.data.leave_request);
            console.log(response.data.leave_request);
        }catch (e) {
            form.setError("root", {
                type: "server",
                message: e.response.data.message
            })
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();
    }, []);

    return (
        <>
            <LeaveContext.Provider value={{ fetchLeaveRequests, fetchLeaveRequestDetails, leaveRequests: [], leaveRequestDetails, reviewerLeaveRequests}}>
                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Manager Leave Request History</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="text-sm rounded-md bg-black text-white px-4 py-2">
                                    Apply for Leave
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Apply for Leave</DialogTitle>
                                    <DialogDescription>
                                        Please fill out the form below to apply for a leave.
                                    </DialogDescription>
                                </DialogHeader>
                                <LeaveRequestForm closeDialog={() => setIsDialogOpen(false)}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <ManagerLeaveTable />
                </div>
            </LeaveContext.Provider>
        </>
    )
}