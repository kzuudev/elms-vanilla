"use client"

import {useEffect, useState} from "react";
import axios from "axios";

import {api} from "@/lib/api.ts";
import { buildQueryString } from "@/utils/query-string.ts";
import type {LeaveRequest, ReviewerLeaveData} from "@/types/leave.ts";
import type {TableData} from "@/types/leave.ts";

import { LeaveContext } from "@/features/context/leaves/LeaveContext.tsx";

import ReviewerLeaveTab from "@/features/leaves/components/ReviewerLeaveTab";
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

    const [personalLeaveRequests, setPersonalLeaveRequests] = useState<TableData[]>([]);

    const [reviewerLeaveRequests, setReviewerLeaveRequests] = useState<ReviewerLeaveData[] | null>(null);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [leaveTypeQuery, setLeaveTypeQuery] = useState<string>("");
    const [startDateQuery, setStartDateQuery] = useState<string>("");
    const [endDateQuery, setEndDateQuery] = useState<string>("");
    const [statusQuery, setStatusQuery] = useState<string>("");

    const fetchLeaveRequests = async ({leave_type, start_date, end_date, status}: {leave_type: string, start_date: string, end_date: string, status: string}) => {

            try {
                const holder = localStorage.getItem("token");
                const queryString = buildQueryString({
                    leave_type,
                    start_date,
                    end_date,
                    status,
                });
                const  response = await api.get(`/leave-requests${queryString}`, {
                    headers: {
                        Authorization: `Bearer ${holder}`,
                    },
                });
                setReviewerLeaveRequests(response.data.data.leave_requests);

            }catch (e) {

                // Ignore the error if it was intentionally canceled by React
                if (axios.isCancel?.(e) || (e as any)?.code === "ERR_CANCELED") {
                    return; // ignore abort
                }

                if (axios.isAxiosError(e)) {
                    setError(e.response?.data?.message ?? "Failed to fetch personal leave requests");
                    return;
                }
            }
    }

    const fetchPersonalLeaveRequests = async ({leave_type, start_date, end_date, status}: {leave_type: string, start_date: string, end_date: string, status: string}) => {
        try {
            const holder = localStorage.getItem("token");
            const queryString = buildQueryString({
                leave_type,
                start_date,
                end_date,
                status,
            });
            const response = await api.get(`/leave-requests/me${queryString}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            setPersonalLeaveRequests(response.data.data.leave_requests);
        }catch (e) {
            if (axios.isCancel?.(e) || (e as any)?.code === "ERR_CANCELED") {
                return; // ignore abort
            }
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch personal leave requests");
                return;
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

    const filters = {
        leave_type: leaveTypeQuery,
        start_date: startDateQuery,
        end_date: endDateQuery,
        status: statusQuery,
    }

    const emptyFilters = {
        leave_type: '',
        start_date: '',
        end_date: '',
        status: '',
    }
    
    const onSearchSubmit = () => {
        fetchLeaveRequests(filters);
        fetchPersonalLeaveRequests(filters);
    }

    const onClearFilters = () => {
        setLeaveTypeQuery('');
        setStartDateQuery('');
        setEndDateQuery('');
        setStatusQuery('All Status');
        fetchLeaveRequests(emptyFilters);
        fetchPersonalLeaveRequests(emptyFilters);
    }



    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests(filters);
        fetchPersonalLeaveRequests(filters);
    }, []);
    


    return (
        <>
        <LeaveContext.Provider value={{ fetchLeaveRequests: () => fetchLeaveRequests(filters), fetchLeaveRequestDetails, leaveRequests: [], personalLeaveRequests, leaveRequestDetails, reviewerLeaveRequests}}>
              <div className="flex flex-col gap-4 mt-8">
                  <div className="flex justify-between items-center">
                      {role === "admin" ? (
                        <h2 className="text-xl font-semibold">Department Leave Requests</h2>
                      ) : role === "super-admin" ? (
                        <h2 className="text-xl font-semibold">Company Leave Requests</h2>
                      ) : (
                        <h2 className="text-xl font-semibold">Team Leave Requests</h2>
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
                        onClearFilters={onClearFilters}
                    />
                  </div>
                
                  <ReviewerLeaveTab />

                  {error && (
                    <div className="text-red-500 text-sm mt-2">
                        {error}
                    </div>
                  )}
              </div>
          </LeaveContext.Provider>
        </>
    )
}
