import {useState} from "react";

import AppSidebar from "@/components/employee/AppSidebar.tsx";
import Header from "@/components/employee/Header";
import LeaveRequestForm from "@/components/employee/LeaveRequestForm.tsx";
import LeaveBalanceSection from "@/components/LeaveBalanceSection.tsx";
import LeaveRequestTable from "@/components/LeaveRequestTable.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function LeaveRequestDashboard() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <AppSidebar>
                <div className="flex justify-between items-center">
                    <Header/>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="text-sm rounded-md bg-black text-white px-4 py-2">
                            Apply Leave
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

            </AppSidebar>
        </>
    )
}