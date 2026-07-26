"use client"

import {useContext } from "react";

import {LeaveContext} from "@/features/context/leaves/LeaveContext.tsx";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import type { LeaveContextType } from "@/features/context/leaves/LeaveContext.tsx";

interface Props {
    isViewMode: boolean;
    setIsViewMode: (open: boolean) => void;
}
export default function LeaveRequestDetailsModal({isViewMode, setIsViewMode} : Props) {

    const { leaveRequestDetails } = useContext(LeaveContext) as LeaveContextType;

    return(
        <>
            <div>
                <Dialog open={isViewMode} onOpenChange={setIsViewMode} >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle>Leave Request Details</DialogTitle>
                        </DialogHeader>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Leave Type:</span>
                                    <span>{leaveRequestDetails?.leave_type}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Start Date:</span>
                                    <span>{leaveRequestDetails?.start_date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">End Date:</span>
                                    <span>{leaveRequestDetails?.end_date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Days:</span>
                                    <span>{leaveRequestDetails?.total_days}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Leave Reason:</span>
                                    <span>{leaveRequestDetails?.reason}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                                    <span>{leaveRequestDetails?.assigned_name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Created At:</span>
                                    <span>{leaveRequestDetails?.created_at}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    {leaveRequestDetails?.status === "pending" ? (
                                        <span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-md">{leaveRequestDetails.status}</span>
                                    ) : leaveRequestDetails?.status === "approved" ? (
                                        <span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-md">{leaveRequestDetails?.status}</span>
                                    ) : (
                                        <span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-md">{leaveRequestDetails?.status}</span>
                                    )}
                                </div>

                            </div>

                            <DialogFooter className="p-2">
                                <div className="w-full flex justify-between items-center">
                                    <Button variant="outline" className="p-2 text-red-500"><Trash/></Button>
                                    <div className="flex gap-2 items-center">
                                        <Button variant="outline" className="text-sm p-2 mr-1">Cancel</Button>
                                        <Button variant="outline" className="p-2 mr-1"><Pencil /></Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>

    )
}