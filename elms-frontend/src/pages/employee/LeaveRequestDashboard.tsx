import {useState, useEffect} from "react";

import AppSidebar from "@/components/employee/AppSidebar.tsx";
import Header from "@/components/employee/Header";
import LeaveRequestForm from "@/components/employee/LeaveRequestForm.tsx";
import LeaveBalanceSection from "@/components/LeaveBalanceSection.tsx";
import LeaveRequestTable from "@/components/LeaveRequestTable.tsx";
import { LeaveContext } from "@/context/LeaveContext.tsx";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {api} from "@/lib/api.ts";

export default function LeaveRequestDashboard() {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [open, setOpen] = useState(false);

        const fetchLeaveRequests = async () => {

            localStorage.getItem("token");
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
    }, []);


    return (
        <>
            <AppSidebar>
                    <LeaveContext.Provider value={{ fetchLeaveRequests, leaveRequests }}>
                    <div className="flex justify-between items-center">
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

                    <div className="mt-8">
                        <LeaveBalanceSection/>

                        <div className="mt-8">
                            <h1>Leave Request History</h1>

                            <div className="mt-4">
                                <LeaveRequestTable/>
                            </div>
                        </div>
                    </div>
                </LeaveContext.Provider>
            </AppSidebar>
        </>
    )
}