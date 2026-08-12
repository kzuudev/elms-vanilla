"use client"

import {useEffect, useState} from "react";
import axios from "axios";

import {api} from "@/lib/api.ts";
import { buildQueryString } from "@/utils/query-string.ts";
import type {LeaveRequest, ReviewerLeaveData} from "@/types/leave.ts";

import AdminLeaveTable from "@/features/leaves/components/AdminLeaveTable.tsx";
import { LeaveContext } from "@/features/context/leaves/LeaveContext.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";
import LeavesFilterBar from "@/features/leaves/components/LeavesFilterBar.tsx";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";



export default function LeavesDashboard({role}: {role: string}) {

    const [reviewerLeaveRequests, setReviewerLeaveRequests] = useState<ReviewerLeaveData[] | null>(null);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [leaveTypeQuery, setLeaveTypeQuery] = useState<string>("");
    const [startDateQuery, setStartDateQuery] = useState<string>("");
    const [endDateQuery, setEndDateQuery] = useState<string>("");
    const [statusQuery, setStatusQuery] = useState<string>("");

    const fetchLeaveRequests = async () => {

            try {
                const holder = localStorage.getItem("token");
                const queryString = buildQueryString({
                    leaveType: leaveTypeQuery,
                    startDate: startDateQuery,
                    endDate: endDateQuery,
                    status: statusQuery,
                });
                const  response = await api.get(`/leave-requests${queryString}`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    },
                });
                setReviewerLeaveRequests(response.data.data.leaves.data);
            }catch (e) {

                // Ignore the error if it was intentionally canceled by React
                if (axios.isCancel(e)) {
                    console.log("First duplicate request was cancelled successfully.");
                    return;
                }

                if (axios.isAxiosError(e)) {
                    setError(e.response?.data?.message || "Failed to fetch leave requests");
                } else {
                    setError("Failed to fetch leave requests");
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
            setLeaveRequestDetails(response.data.data.leave_request);
        }catch (e) {
            if (axios.isCancel?.(e) || (e as any)?.code === "ERR_CANCELED") {
              return; // ignore abort
            }
            if (axios.isAxiosError(e)) {
              setError(e.response?.data?.message ?? "Failed to fetch leave request details");
              return;
            }
            setError("An unexpected error occurred");

        }

    }


    const onSearchSubmit = () => {
        fetchLeaveRequests();
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
                      {role === "admin" ? (
                        <h2 className="text-xl font-semibold">Admin Leave Request History</h2>
                      ) : (
                        <h2 className="text-xl font-semibold">Manager Leave Request History</h2>
                      )}
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

                  <div>
                    <LeavesFilterBar
                        leaveTypeQuery={leaveTypeQuery}
                        setLeaveTypeQuery={setLeaveTypeQuery}
                        startDateQuery={startDateQuery}
                        setStartDateQuery={setStartDateQuery}
                        endDateQuery={endDateQuery}
                        setEndDateQuery={setEndDateQuery}
                        statusQuery={statusQuery}
                        setStatusQuery={setStatusQuery}
                        onSearchSubmit={onSearchSubmit}
                    />
                  </div>
                    
                  <AdminLeaveTable/>
              </div>

          {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
                    {error}
                </div>
            )}
          </LeaveContext.Provider>
        </>
    )
}
