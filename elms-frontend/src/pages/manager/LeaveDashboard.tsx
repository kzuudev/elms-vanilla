"use client"

import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { LeaveContext } from "@/features/context/LeaveContext.tsx";

import ManagerLeaveTable from "@/features/leaves/components/ManagerLeaveTable.tsx";


export default function  LeaveDashboard() {

    const [managerLeaveList, setManagerLeaveList] = useState([]);

    const fetchLeaveRequests = async () => {

        const holder = localStorage.getItem("token");

        const  response = await api.get("/leaves", {
            headers: {
                Authorization: `Bearer ${holder}`,
            }
        });
        setManagerLeaveList(response.data.employee_leaves.data);
        console.log(response.data.employee_leaves.data);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeaveRequests();
    }, []);

    return (
        <>
            <LeaveContext.Provider value={{ fetchLeaveRequests, managerLeaveList, leaveRequests: [] }}>
                <div className="flex flex-col gap-4 mt-8">
                    <h2 className="text-xl font-semibold">Manager Leave Request History</h2>
                    <ManagerLeaveTable />
                </div>
            </LeaveContext.Provider>
        </>
    )
}