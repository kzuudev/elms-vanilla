"use client"

import * as z from "zod";
import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";
import type {LeaveRequest} from "@/types/leave.ts";

import ManagerLeaveTable from "@/features/leaves/components/ManagerLeaveTable.tsx";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export default function  LeaveDashboard() {

    const [managerLeaveList, setManagerLeaveList] = useState([]);
    const [leaveRequestDetails, setLeaveRequestDetails] = useState<LeaveRequest>({} as LeaveRequest);

    const schema = z.object({
        leave_type: z.string().min(1, {message: "Leave Type is required"}),
        start_date: z.string().min(1, {message: "Start Date is required"}),
        end_date: z.string().min(1, {message: "End Date is required"}),
        reason: z.string().min(1, {message: "Reason is required"}),
    })

    type LeaveRequestFormData = z.infer<typeof schema>;

    const form = useForm<LeaveRequestFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            leave_type: "",
            start_date: "",
            end_date: "",
            reason: "",
        }
    });

    const { formState: {errors}} = form;

    const holder = localStorage.getItem("token");
    const fetchLeaveRequests = async () => {

        const  response = await api.get("/leaves", {
            headers: {
                Authorization: `Bearer ${holder}`,
            }
        });
        setManagerLeaveList(response.data.employee_leaves.data);
        console.log(response.data.employee_leaves.data);
    }


    const fetchLeaveRequestDetails = async (id: number) => {
        try{
            const response = await api.get(`/leave-request/${id}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setLeaveRequestDetails(response.data.leave_request);
            console.log(response.data.leave_request);
        }catch (e) {
            form.setError("root", {
                type: "server",
                message: e.response.data.message
            })
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();
    }, []);

    return (
        <>
            <LeaveContext.Provider value={{ fetchLeaveRequests, fetchLeaveRequestDetails, managerLeaveList, leaveRequests: [], leaveRequestDetails }}>
                <div className="flex flex-col gap-4 mt-8">
                    <h2 className="text-xl font-semibold">Manager Leave Request History</h2>
                    <ManagerLeaveTable />
                </div>
            </LeaveContext.Provider>
        </>
    )
}