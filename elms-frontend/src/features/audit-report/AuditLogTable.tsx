"use client";

import type { AuditLogRecord } from "@/types/dashboard";
import { format } from "date-fns";

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
                <TableCell>{auditLog.actor.name}</TableCell>
                <TableCell>{auditLog.action}</TableCell>
                <TableCell>{auditLog.subject.name}</TableCell>
                <TableCell>
                  {format(new Date(auditLog.occured_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>{auditLog.owner.name}</TableCell>
                <TableCell>
                  {auditLog.changes?.map((change) => change.field).join(", ")}
                </TableCell>
                <TableCell>{JSON.stringify(auditLog.details)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="p-2 mr-1"
                    onClick={() => onViewAuditLog(auditLog.id)}
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
