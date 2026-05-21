"use client"
import {useState, useEffect} from "react";
import AppSidebar from "@/components/manager/AppSidebar.tsx";
import { LeaveContext } from "@/context/LeaveContext.tsx";
import {api} from "@/lib/api.ts";

import { Button } from "@/components/ui/button.tsx";


export default function  EmployeeLeavesListDashboard() {

    const [employeeLeaves, setEmployeeLeaves] = useState([]);
    const [error, setError] = useState(null);

    const fetchEmployeeLeaves = async () => {

        const holder = localStorage.getItem("token");

       try {
           const  response = await api.get("/leaves", {
               headers: {
                   Authorization: `Bearer ${holder}`,
               }
           });
           setEmployeeLeaves(response.data.leave_requests.data);
       }catch (e) {
            setError(e);
       }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmployeeLeaves();
    }, []);
}