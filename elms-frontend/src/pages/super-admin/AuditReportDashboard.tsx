"use client";

import { api, getApiErrorMessage } from "@/lib/api";
import { useEffect, useState } from "react";
import axios from "axios";

import AppSidebar from "@/components/layout/AppSidebar";
import AuditLogTable from "@/features/audit-report/AuditLogTable";
import AuditLogFilterBar from "@/features/audit-report/AuditLogFilterBar";
import { buildQueryString } from "@/utils/query-string.ts";

import type { AuditLogRecord } from "@/types/dashboard";

export default function AuditReportDashboard() {

  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogRecord | null>(null);
  const [isViewingAuditLog, setIsViewingAuditLog] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionQuery, setActionQuery] = useState("");
  const [subjectTypeQuery, setSubjectTypeQuery] = useState("");
  const [startDateQuery, setStartDateQuery] = useState("");
  const [endDateQuery, setEndDateQuery] = useState("");

  const fetchAuditLogs = async ({
    searchQuery,
    actionQuery,
    subjectTypeQuery,
    startDateQuery,
    endDateQuery,
  }: {
    searchQuery: string;
    actionQuery: string;
    subjectTypeQuery: string;
    startDateQuery: string;
    endDateQuery: string;
  }) => {
    try {
      const holder = localStorage.getItem("token");
      const queryString = buildQueryString({
        search: searchQuery ?? "",
        action: actionQuery ?? "",
        subject_type: subjectTypeQuery ?? "",
        start_date: startDateQuery ?? "",
        end_date: endDateQuery ?? "",
      });
      const response = await api.get(`/audit-logs${queryString}`, {
        headers: { Authorization: `Bearer ${holder}` },
      });
      setAuditLogs(response.data.data.audit_logs);
      setError(null);
    } catch (e) {
      if (axios.isCancel(e)) return;
      const message = getApiErrorMessage(e, "Failed to fetch audit logs");
      if (!message) {
        return;
      }
      setError(message);
      setAuditLogs([]);
    }
  };

  const fetchAuditLog = async (id: number) => {
    try {
      const response = await api.get(`/audit-logs/${id}`);
      return response.data.data.audit_log;
    } catch (e) {
      const message = getApiErrorMessage(e, "Failed to fetch audit logs");
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

  const filters = {
    searchQuery: searchQuery ?? "",
    actionQuery: actionQuery ?? "",
    subjectTypeQuery: subjectTypeQuery ?? "",
    startDateQuery: startDateQuery ?? "",
    endDateQuery: endDateQuery ?? "",
  };

  const emptyFilters = {
    searchQuery: "",
    actionQuery: "",
    subjectTypeQuery: "",
    startDateQuery: "",
    endDateQuery: "",
  };

  const onSearchSubmit = () => {
    fetchAuditLogs(filters);
  };

  const onClearFilters = () => {
    setSearchQuery("");
    setActionQuery("");
    setSubjectTypeQuery("");
    setStartDateQuery("");
    setEndDateQuery("");
    fetchAuditLogs(emptyFilters);
  };

  useEffect(() => {
    fetchAuditLogs(filters);
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

        <div className="mt-4 px-4">
          <AuditLogFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            actionQuery={actionQuery}
            setActionQuery={setActionQuery}
            subjectTypeQuery={subjectTypeQuery}
            setSubjectTypeQuery={setSubjectTypeQuery}
            startDateQuery={startDateQuery}
            setStartDateQuery={setStartDateQuery}
            endDateQuery={endDateQuery}
            setEndDateQuery={setEndDateQuery}
            onSearchSubmit={onSearchSubmit}
            onClearFilters={onClearFilters}
          />
        </div>

        <div className="mt-8 px-4">
          {auditLogs?.length > 0 ? (
            <AuditLogTable
              auditLogs={auditLogs}
              onViewAuditLog={handleViewAuditLog}
            />
          ) : (
            <div className="text-center text-gray-500">
              {searchQuery || actionQuery || subjectTypeQuery || startDateQuery || endDateQuery
                ? "No audit logs found for the selected filters"
                : "No audit logs found"}
            </div>
          )}
        </div>

        {error && <div className="text-red-500 px-4 mt-2">{error}</div>}
      </AppSidebar>
    </>
  );
}
