import {useState, useEffect} from "react";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Header from "@/components/layout/Header.tsx";
import LeaveRequestForm from "@/features/leaves/components/LeaveRequestForm.tsx";
import LeaveBalanceSection from "@/features/leaves/components/LeaveBalanceSection.tsx";
import EmployeeLeaveTable from "@/features/leaves/components/EmployeeLeaveTable.tsx";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import {api} from "@/lib/api.ts";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";


export default function LeaveRequestDashboard() {

    const [leaveRequests, setLeaveRequests] = useState([]);
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
    }, []);


    return (
        <>
            <AppSidebar>
                    <LeaveContext.Provider value={{ fetchLeaveRequests, leaveRequests, managerLeaveList: [] }}>
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
                                <EmployeeLeaveTable/>
                            </div>
                        </div>
                    </div>
                </LeaveContext.Provider>
            </AppSidebar>
        </>
    )
}