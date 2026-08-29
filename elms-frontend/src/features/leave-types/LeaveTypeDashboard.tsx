"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { buildQueryString } from "@/utils/query-string.ts";

import type { LeaveType, LeaveTypeSummary } from "@/types/leave-type";
import { LeaveTypeContext } from "../context/leaves/LeaveTypeContext";
import { LeaveTypeSummaryContext } from "../context/leaves/LeaveTypeSummaryContext";

import LeaveTypeSummaryGrid from "@/features/leave-types/LeaveTypeSummaryGrid";
import LeaveTypeFilterBar from "@/features/leave-types/LeaveTypeFilterBar";
import LeaveTypeListTable from "@/features/leave-types/LeaveTypeListTable";
import AppSidebar from "@/components/layout/AppSidebar";
import Notifications from "@/components/layout/Notifications";
import UserProfile from "@/components/layout/UserProfile";

export default function LeaveTypeDashboard() {
    const [error, setError] = useState<string | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [leaveTypeDetails, setLeaveTypeDetails] = useState<LeaveType | null>(null);
    const [leaveTypeSummary, setLeaveTypeSummary] = useState<LeaveTypeSummary | undefined>(undefined);
    const [leaveTypeNameQuery, setLeaveTypeNameQuery] = useState("");

    const fetchLeaveTypes = async (search_leave_type = leaveTypeNameQuery) => {
        try {
            const queryString = buildQueryString({
                search_leave_type,
            });
            const response = await api.get(`/leave-types${queryString}`);
            if (response.data.success === true) {
                setLeaveTypes(response.data.data.leave_types ?? []);
                setError(null);
            } else {
                setError(response.data.message);
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch leave types");
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchLeaveTypeDetails = async (id: number) => {
        try {
            const response = await api.get(`/leave-types/${id}`);
            if (response.data.success === true) {
                setLeaveTypeDetails(response.data.data.leave_type ?? null);
                setError(null);
            } else {
                setError(response.data.message);
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch leave type details");
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchLeaveTypeSummary = async () => {
        try {
            const response = await api.get("/leave-types/summary");
            if (response.data.success === true) {
                setLeaveTypeSummary(response.data.data.leave_type_summary);
                setError(null);
            } else {
                setError(response.data.message);
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message ?? "Failed to fetch leave type summary");
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const onSearchSubmit = () => {
        fetchLeaveTypes(leaveTypeNameQuery);
    };

    const onClearFilters = () => {
        setLeaveTypeNameQuery("");
        fetchLeaveTypes("");
    };

    useEffect(() => {
        fetchLeaveTypes("");
        fetchLeaveTypeSummary();
    }, []);

    return (
        <LeaveTypeContext.Provider
            value={{
                leaveTypes,
                leaveTypeDetails,
                fetchLeaveTypes: () => fetchLeaveTypes(),
                fetchLeaveTypeDetails,
            }}
        >
            <LeaveTypeSummaryContext.Provider
                value={{
                    leaveTypeSummary,
                    fetchLeaveTypeSummary,
                }}
            >
                <AppSidebar>
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex flex-col">
                                <h1 className="text-xl font-semibold text-blue-400">
                                    Leave Types
                                </h1>
                                <p className="text-gray-500 text-xs">
                                    Manage your leave types
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Notifications />
                                <UserProfile />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <LeaveTypeSummaryGrid />
                        </div>
                    </div>

                    <div className="mt-8">
                        <LeaveTypeFilterBar
                            leaveTypeNameQuery={leaveTypeNameQuery}
                            setLeaveTypeNameQuery={setLeaveTypeNameQuery}
                            onSearchSubmit={onSearchSubmit}
                            onClearFilters={onClearFilters}
                        />
                    </div>

                    <div className="mt-8">
                        {leaveTypes.length > 0 ? (
                            <LeaveTypeListTable />
                        ) : (
                            <div className="text-center text-gray-500">
                                {leaveTypeNameQuery
                                    ? `No leave types found for "${leaveTypeNameQuery}"`
                                    : "No leave types found"}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-center mt-4">{error}</div>
                    )}
                </AppSidebar>
            </LeaveTypeSummaryContext.Provider>
        </LeaveTypeContext.Provider>
    );
}
