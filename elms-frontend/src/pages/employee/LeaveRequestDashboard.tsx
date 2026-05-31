import {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import {api} from "@/lib/api.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Header from "@/components/layout/Header.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";
import LeaveBalanceSection from "@/features/leaves/components/LeaveBalanceSection.tsx";
import EmployeeLeaveTable from "@/features/leaves/components/EmployeeLeaveTable.tsx";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";

export default function LeaveRequestDashboard() {

    const location = useLocation();

    const isSuccessfullySubmitted = location.state?.successfullySubmitted;

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [visibleAlert, setVisibleAlert] = useState(
        !!isSuccessfullySubmitted
    );
    const [open, setOpen] = useState(false);

        const fetchLeaveRequests = async () => {

            const holder = localStorage.getItem("token");

            const response = await api.get("/leave-request", {
                // this is a verification for the bearer (holder) of the token has permission to access this account and do action
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            });
            setLeaveRequests(response.data.leave_requests.data);
        }


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();
        
        if(visibleAlert) {
            const timer = setTimeout(() => {
                setVisibleAlert(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visibleAlert]);




    return (
        <>
            <AppSidebar>
                    <LeaveContext.Provider value={{ fetchLeaveRequests, leaveRequests, managerLeaveList: [] }}>
                    <div className="flex flex-col justify-between items-center">

                        <div>
                            {visibleAlert && (
                                <Alert className=" bg-green-100 border-green-400 text-green-700 mb-6 animate-in fade-in duration-300">
                                    <CheckCircle2Icon className="w-4 h-4 text-green-700" />
                                    <AlertTitle className="text-green-700">Success</AlertTitle>
                                    <AlertDescription>
                                        Your leave has been applied. We'll review your application and get back to you.
                                    </AlertDescription>
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