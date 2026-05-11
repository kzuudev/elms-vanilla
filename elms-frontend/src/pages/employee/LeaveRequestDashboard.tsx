import {useState} from "react";

import AppSidebar from "@/components/employee/AppSidebar.tsx";
import Header from "@/components/employee/Header";
import LeaveRequestForm from "@/components/employee/LeaveRequestForm.tsx";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
                            <LeaveRequestForm/>
                        </DialogContent>
                    </Dialog>
                </div>
            </AppSidebar>ph
        </>
    )
}