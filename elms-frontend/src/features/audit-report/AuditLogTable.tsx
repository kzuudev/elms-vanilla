"use client";

import type { AuditLogRecord } from "@/types/dashboard";
import { formatDateTime } from "@/utils/date.ts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";

interface AuditLogTableProps {
  auditLogs: AuditLogRecord[];
  onViewAuditLog: (id: number) => void;
}

function formatAuditDetails(details: AuditLogRecord["details"] | string | null | undefined): string {
  if (!details) {
    return "";
  }

  const parsed =
    typeof details === "string"
      ? (() => {
          try {
            return JSON.parse(details);
          } catch {
            return null;
          }
        })()
      : details;

  if (!parsed || typeof parsed !== "object") {
    return "";
  }

  const summary = [
    parsed.role,
    parsed.department,
    parsed.leave_type,
    parsed.start_date && parsed.end_date
      ? `${parsed.start_date} - ${parsed.end_date}`
      : parsed.start_date || parsed.end_date,
    parsed.total_days != null ? `${parsed.total_days} days` : null,
    parsed.rejection_reason,
  ]
    .filter(Boolean)
    .join(" · ");

  if (summary.length > 40) {
    return `${summary.slice(0, 40)}...`;
  }

  return summary;
}

export default function AuditLogTable({
  auditLogs,
  onViewAuditLog,
}: AuditLogTableProps) {
  const tableHeaders = [
    "Actor",
    "Action",
    "Subject",
    "Occurred At",
    "Owner",
    "Changes",
    "Details",
  ];

  return (
    <>
      <div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-border hover:bg-gray-50">
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className="text-foreground font-semibold"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {auditLogs?.map((auditLog) => (
              <TableRow key={auditLog.id}>
                <TableCell>{auditLog?.actor_name}</TableCell>
                <TableCell>{auditLog?.actor_role}</TableCell>
                <TableCell>{auditLog?.subject_type}</TableCell>
                <TableCell>{formatDateTime(auditLog.occurred_at ?? auditLog.occured_at ?? "")}</TableCell>
                <TableCell>{auditLog?.owner_name}</TableCell>
                <TableCell>{Array.isArray(auditLog?.changes) ? auditLog?.changes?.map((change) => change.field).join(", ") : ""}</TableCell>
                <TableCell>{formatAuditDetails(auditLog?.details)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="p-2 mr-1"
                    onClick={() => onViewAuditLog(auditLog?.id)}
                  >
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
