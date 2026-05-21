"use client"

import {useState, useEffect} from "react";
import {api} from "@/lib/api.ts";
import { LeaveContext } from "@/context/LeaveContext.tsx";

import AppSidebar from "@/components/manager/AppSidebar.tsx";
import EmployeeLeavesListTable from "@/components/EmployeeLeavesListTable.tsx";




export default function  EmployeeLeavesListDashboard() {

    const [managerLeaveList, setManagerLeaveList] = useState([]);
    const [error, setError] = useState(null);

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
            <AppSidebar>
                <LeaveContext.Provider value={{ fetchLeaveRequests, managerLeaveList, leaveRequests: [] }}>
                    <div className="justify-between items-center">
                        <h1>Employee Leave Request History</h1>

                        <div className="mt-4">
                            <EmployeeLeavesListTable />
                        </div>
                    </div>
                </LeaveContext.Provider>
            </AppSidebar>
        </>
    )
}