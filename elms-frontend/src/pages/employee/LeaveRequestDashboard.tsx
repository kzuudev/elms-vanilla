import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import { LeaveContext } from "@/features/context/leaves/LeaveContext.tsx";
import {api} from "@/lib/api.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Header from "@/components/layout/Header.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";
import LeaveBalanceSection from "@/features/leaves/components/LeaveBalanceSection.tsx";
import EmployeeLeaveTable from "@/features/leaves/components/EmployeeLeaveTable.tsx";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {Button} from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import type {LeaveRequest, TableData} from "@/types/leave.ts";

export default function LeaveRequestDashboard() {

    const location = useLocation();
    const navigate = useNavigate();

    const isSuccessfullySubmitted = location.state?.successfullySubmitted;
    const [successAlert, setSuccessAlert] = useState(false);

    const [leaveRequests, setLeaveRequests] = useState<TableData[]>([]);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);


    const fetchLeaveRequests = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/leave-request", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            setLeaveRequests(
                Array.isArray(response.data.leave_requests)
                    ? response.data.leave_requests
                    : response.data.leave_requests?.data ?? []
            );
        }catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch leave requests");
            } else {
                setError("Failed to fetch leave requests");
            }
        }
    }

    const fetchLeaveRequestDetails = async (id: number) => {

        try{
            const holder = localStorage.getItem("token");
            const response = await api.get(`/leave-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            // Support flat leave_request OR legacy { data: leave_request }
            const payload = response.data.leave_request;
            setLeaveRequestDetails(payload?.data ?? payload ?? null);
            console.log(payload);
        }catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch leave request details");
            } else {
                setError("Failed to fetch leave request details");
            }
        }
    }



    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();

        if (isSuccessfullySubmitted) {
            setSuccessAlert(true);

            const timer = setTimeout(() => {
                setSuccessAlert(false);
            }, 3000);

            navigate(location.pathname, { replace: true, state: {} });

            return () => clearTimeout(timer);
        }
    }, [isSuccessfullySubmitted, navigate, location.pathname], );

    useEffect(() => {
        if (!successAlert) return;

        const timer = setTimeout(() => {
            setSuccessAlert(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [successAlert]);


    return (
        <>
            <AppSidebar>
                    <LeaveContext.Provider value={{ fetchLeaveRequests, fetchLeaveRequestDetails, leaveRequests, leaveRequestDetails, reviewerLeaveRequests: [] }}>
                    <div className="flex flex-col justify-between items-center">

                        <div>
                            {successAlert && (
                                <Alert className=" bg-green-100 border-green-400 text-green-700 mb-6 animate-in fade-in duration-300">
                                    <CheckCircle2Icon className="w-4 h-4 text-green-700" />
                                    <AlertTitle className="text-green-700">Success</AlertTitle>
                                    <AlertDescription>
                                        Your leave has been applied. We'll review your application and get back to you.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {error && (
                                <Alert className="bg-red-100 border-red-400 text-red-700 mb-6">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <Header/>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="text-sm rounded-md bg-black text-white px-4 py-2">
                                        Apply for Leave
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[430px]">
                                    <DialogHeader className="text-lg font-bold">
                                        <DialogTitle>Apply for Leave</DialogTitle>
                                    </DialogHeader>
                                    <LeaveRequestForm closeDialog={() => setOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="mt-8">
                        <LeaveBalanceSection/>

                        <div className="mt-8">
                            <h1>Leave Request History</h1>

                            <div className="mt-4">
                                <EmployeeLeaveTable/>
                            </div>
                        </div>
                    </div>
                </LeaveContext.Provider>
            </AppSidebar>
        </>
    )
}
