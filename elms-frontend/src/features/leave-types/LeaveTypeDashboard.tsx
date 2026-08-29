"use client";

import axios from "axios";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

import type { LeaveType } from "@/types/leave-type";
import { LeaveTypeContext } from "../context/leaves/LeaveTypeContext";

export default function LeaveTypeDashboard() {

  const [error, setError] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  const fetchLeaveTypes = async () => {

    try {
        const response = await api.get('/leave-types');
        if (response.data.success === true) {
            setLeaveTypes(response.data.data);
        } else {
            setError(response.data.message);
        }
    }catch (e) {
        if (axios.isAxiosError(e)) {
            setError(e.response?.data.message);
        } else {
            setError("An unknown error occurred");
        }
    }
   }

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

  return (
    <>
        <LeaveTypeContext.Provider value={{ leaveTypes, fetchLeaveTypes: () => fetchLeaveTypes(), leaveTypeDetails: null, fetchLeaveTypeDetails: () => {} }}>
           
        </LeaveTypeContext.Provider>
     
    </>
  );
}
