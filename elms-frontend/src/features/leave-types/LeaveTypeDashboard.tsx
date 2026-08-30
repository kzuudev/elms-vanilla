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
import LeaveTypeDialog from "@/features/leave-types/LeaveTypeDialog";
import LeaveTypeForm, {
  type LeaveTypeFormData,
} from "@/features/leave-types/LeaveTypeForm";
import AppSidebar from "@/components/layout/AppSidebar";
import Notifications from "@/components/layout/Notifications";
import UserProfile from "@/components/layout/UserProfile";
import { Button } from "@/components/ui/button";

export default function LeaveTypeDashboard() {
  const [error, setError] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveTypeDetails, setLeaveTypeDetails] = useState<LeaveType | null>(
    null,
  );
  const [leaveTypeSummary, setLeaveTypeSummary] = useState<
    LeaveTypeSummary | undefined
  >(undefined);
  const [leaveTypeNameQuery, setLeaveTypeNameQuery] = useState("");
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

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
        setError(
          e.response?.data?.message ?? "Failed to fetch leave type details",
        );
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchCreateLeaveType = async (data: {
    name: string;
    allocated_days: number;
    is_paid: boolean;
  }) => {
    try {
      const response = await api.post("/leave-types", data);
      setError(null);
      return response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message ?? "Failed to create leave type");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchUpdateLeaveType = async (
    id: number,
    data: {
      name: string;
      allocated_days: number;
      is_paid: boolean;
    },
  ) => {
    try {
      const response = await api.patch(`/leave-types/${id}`, data);
      setError(null);
      return response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message ?? "Failed to update leave type");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fetchDeleteLeaveType = async (id: number) => {
    try {
      const response = await api.delete(`/leave-types/${id}`);
      setError(null);
      return response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message ?? "Failed to delete leave type");
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
        setError(
          e.response?.data?.message ?? "Failed to fetch leave type summary",
        );
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  const handleViewLeaveTypeDetails = async (id: number) => {
    await fetchLeaveTypeDetails(id);
    setIsViewModalOpen(true);
    setMode(null);
  };

  const handleEditLeaveTypeDetails = async (id: number) => {
    await fetchLeaveTypeDetails(id);
    setMode("edit");
  };

  const handleSubmit = async (data: LeaveTypeFormData) => {

    const payload = {
      name: data.leave_type_name,
      allocated_days: Number(data.allocated_days),
      is_paid: data.is_paid === "paid",
    };

    if (mode === "create") {
      await fetchCreateLeaveType(payload);
    } else if (mode === "edit") {
      await fetchUpdateLeaveType(leaveTypeDetails?.id ?? 0, payload);
    }

    setMode(null);
    setIsViewModalOpen(false);
    fetchLeaveTypes("");
    fetchLeaveTypeSummary();
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this leave type?",
    );
    if (confirmation) {
      await fetchDeleteLeaveType(id);
      fetchLeaveTypes("");
      fetchLeaveTypeSummary();
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
                <p className="text-gray-500 text-xs">Manage your leave types</p>
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

          <div className="flex justify-between items-center mt-8">
            <LeaveTypeFilterBar
              leaveTypeNameQuery={leaveTypeNameQuery}
              setLeaveTypeNameQuery={setLeaveTypeNameQuery}
              onSearchSubmit={onSearchSubmit}
              onClearFilters={onClearFilters}
            />

            <div className="mt-4">
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  setMode("create");
                }}
              >
                Add Leave Type
              </Button>
              <LeaveTypeForm
                handleSubmit={handleSubmit}
                mode={mode}
                setMode={setMode}
                leaveTypeDetails={leaveTypeDetails ?? undefined}
              />
            </div>
          </div>

          <div className="mt-8">
            <LeaveTypeDialog
              handleSubmit={handleSubmit}
              isViewMode={isViewModalOpen}
              setIsViewMode={setIsViewModalOpen}
              mode={mode}
              setMode={setMode}
            />
            {leaveTypes.length > 0 ? (
              <LeaveTypeListTable
                handleEditLeaveTypeDetails={handleEditLeaveTypeDetails}
                handleViewLeaveTypeDetails={handleViewLeaveTypeDetails}
                handleDeleteLeaveType={handleDelete}
              />
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
