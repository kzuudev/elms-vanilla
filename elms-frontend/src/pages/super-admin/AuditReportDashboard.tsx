"use client";

import { api, getApiErrorMessage } from "@/lib/api";
import { useEffect, useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import AuditLogTable from "@/features/audit-report/AuditLogTable";

import type { AuditLogRecord } from "@/types/dashboard";

export default function AuditReportDashboard() {

  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogRecord | null>(null);
  const [isViewingAuditLog, setIsViewingAuditLog] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get("/audit-logs");
      setAuditLogs(response.data.data.audit_logs);
    } catch (e) {
      const message = getApiErrorMessage(error, "Failed to fetch audit logs");
      if (!message) {
        return;
      }
      setError(message);
    }
  };

  const fetchAuditLog = async (id: number) => {
    try {
      const response = await api.get(`/audit-logs/${id}`);
      return response.data.data.audit_log;
    } catch (e) {
      const message = getApiErrorMessage(error, "Failed to fetch audit logs");
      if (!message) {
        return;
      }
      setError(message);
    }
  };

  const handleViewAuditLog = async (id: number) => {
    const auditLog = await fetchAuditLog(id);
    setAuditLog(auditLog);
    setIsViewingAuditLog(true);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <>
      <AppSidebar>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Audit Report Dashboard</h1>
          <p className="text-gray-500">
            Manage audit logs for all users and activities.
          </p>
        </div>

        <div className="mt-8">
          <AuditLogTable
            auditLogs={auditLogs}
            onViewAuditLog={handleViewAuditLog}
          />
        </div>
      </AppSidebar>
    </>
  );
}
