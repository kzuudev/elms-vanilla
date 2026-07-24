"use client"

import axios from "axios";

import AdminLeaveTable from "@/features/leaves/components/AdminLeaveTable.tsx";
import {useEffect, useState} from "react";
import type {LeaveRequest, ReviewerLeaveData} from "@/types/leave.ts";
import {api} from "@/lib/api.ts";
import { LeaveContext } from "@/features/context/leaves/LeaveContext.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";


export default function LeavesDashboard() {

    const [reviewerLeaveRequests, setReviewerLeaveRequests] = useState<ReviewerLeaveData[] | null>(null);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaveRequests = async (signal?: AbortSignal) => {

            try {
                const holder = localStorage.getItem("token");
                const  response = await api.get("/leave-requests", {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    },
                    signal: signal
                });
                setReviewerLeaveRequests(response.data.leaves.data);
            }catch (e) {

                // Ignore the error if it was intentionally canceled by React
                if (axios.isCancel(e)) {
                    console.log("First duplicate request was cancelled successfully.");
                    return;
                }


                if (axios.isAxiosError(e)) {
                    setError(e.response?.data?.message || "Failed to fetch data");
                } else {
                    setError("An unexpected error occurred");
                }
            }
        }


    const fetchLeaveRequestDetails = async (id: number) => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get(`/leave-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setLeaveRequestDetails(response.data.leave_request);
        }catch (e) {
            setError(e.response.data.message);
        }

    }


    useEffect(() => {

        const controller = new AbortController();

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests(controller.signal);

        return () => {
            controller.abort();
        }
    }, []);


    return (
      <>
          <LeaveContext.Provider value={{ fetchLeaveRequests, fetchLeaveRequestDetails, leaveRequests: [], leaveRequestDetails, reviewerLeaveRequests}}>
              <div className="flex flex-col gap-4 mt-8">
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Admin Leave Request History</h2>
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
                  <AdminLeaveTable/>
              </div>
          </LeaveContext.Provider>
      </>
    )
}
