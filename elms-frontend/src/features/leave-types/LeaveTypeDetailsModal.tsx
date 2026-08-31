"use client";

import { type LeaveType } from "@/types/leave-type.ts";

import { Button } from "@/components/ui/button.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";

import { Pencil } from "lucide-react";
import { useState } from "react";

interface LeaveTypeDetailsModalProps {
  isViewMode: boolean;
  setIsViewMode: (open: boolean) => void;
  mode: "create" | "edit" | null;
  setMode: (mode: "create" | "edit" | null) => void;
  leaveTypeDetails: LeaveType;
}

export default function LeaveTypeDetailsModal({
  isViewMode,
  setIsViewMode,
  mode,
  setMode,
  leaveTypeDetails,
}: LeaveTypeDetailsModalProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Dialog open={isViewMode} onOpenChange={setIsViewMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Type Details</DialogTitle>
            <DialogDescription>
              View the details of the leave type
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">
                  Leave Type Name:{" "}
                </h2>
                <p className="text-sm">{leaveTypeDetails?.name}</p>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">
                  Allocated Days:{" "}
                </h2>
                <p className="text-sm">{leaveTypeDetails?.allocated_days}</p>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm text-muted-foreground">Paid: </h2>
                <p className="text-sm">
                  {Number(leaveTypeDetails?.is_paid) === 1 ? "Paid" : "Unpaid"}
                </p>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button
                type="button"
                className="min-w-4"
                variant="default"
                onClick={() => {
                  setIsViewMode(false);
                  setMode("edit");
                }}
                disabled={mode === "edit"}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>

        {error && <p className="text-red-500">{error}</p>}
      </Dialog>
    </>
  );
}
