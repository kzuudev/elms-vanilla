"use client";

import { useState } from "react";

import { useLeaveTypeContext } from "@/features/context/leaves/LeaveTypeContext";

import LeaveTypeDetailsModal from "@/features/leave-types/LeaveTypeDetailsModal";
import type { LeaveTypeFormData } from "@/features/leave-types/LeaveTypeForm";

interface LeaveTypeDialogProps {
  handleSubmit: (data: LeaveTypeFormData) => Promise<void>;
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  mode: "create" | "edit" | null;
  setMode: (mode: "create" | "edit" | null) => void;
}

export default function LeaveTypeDialog({
  handleSubmit,
  isViewMode,
  setIsViewMode,
  mode,
  setMode,
}: LeaveTypeDialogProps) {
  const { leaveTypeDetails } = useLeaveTypeContext();

  const [error, setError] = useState<string | null>(null);

  if (!leaveTypeDetails) {
    return null;
  }

  return (
    <>
      <LeaveTypeDetailsModal
        isViewMode={isViewMode}
        setIsViewMode={setIsViewMode}
        mode={mode as "create" | "edit"}
        setMode={setMode}
        leaveTypeDetails={leaveTypeDetails}
      />
    
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
