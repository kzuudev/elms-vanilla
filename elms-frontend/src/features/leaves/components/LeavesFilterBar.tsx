"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import axios from "axios";

import type { LeaveType } from "@/types/leave";

import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import { Search } from "lucide-react";


interface LeavesFilterBarProps {
    leaveTypeQuery: string;
    setLeaveTypeQuery: (query: string) => void;
    startDateQuery: string;
    setStartDateQuery: (query: string) => void;
    endDateQuery: string;
    setEndDateQuery: (query: string) => void;
    statusQuery: string;
    setStatusQuery: (query: string) => void;
    onSearchSubmit: () => void;
}

export default function LeavesFilterBar(props: LeavesFilterBarProps) {

    const {leaveTypeQuery, setLeaveTypeQuery, startDateQuery, setStartDateQuery, endDateQuery, setEndDateQuery, statusQuery, setStatusQuery, onSearchSubmit} = props;
    const [error, setError] = useState<string | null>(null);

    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

    const fetchLeaveTypes = async() => {
        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/leave-types", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                },
            })
            setLeaveTypes(response.data.data.leave_types);
            setError(null);
        }catch (e: any) {
            if (axios.isCancel(e) || e.code === "ERR_CANCELED") {
                return;
            }
            setError(e.response?.data?.message ?? "Failed to fetch leave types");
            setLeaveTypes([]);
        }
    }

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ]
    

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchSubmit();
    }


    return (
        <>
         <form method="GET" onSubmit={handleSearchSubmit} className="flex items-center gap-4" >
            <div>
                <Select name="leave_type" value={leaveTypeQuery} onValueChange={(value) => setLeaveTypeQuery(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                    <SelectContent>
                        {leaveTypes.map((leave) => (
                            <SelectItem key={leave.id} value={leave.name}>
                                {leave.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Input 
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={startDateQuery}
                    onChange={(e) => setStartDateQuery(e.target.value)}
                    placeholder="Start Date"
                />
            </div>

            <div>
                <Input 
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={endDateQuery}
                    onChange={(e) => setEndDateQuery(e.target.value)}
                    placeholder="End Date"
                />
            </div>

            <div>
                <Select name="status" value={statusQuery} onValueChange={(value) => setStatusQuery(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((status) => {
                            return (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    <Search className="w-4 h-4" />
                    Search
                </Button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         </form>
         </>
    )

}