"use client";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Search, X } from "lucide-react";

interface AuditLogFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionQuery: string;
  setActionQuery: (query: string) => void;
  subjectTypeQuery: string;
  setSubjectTypeQuery: (query: string) => void;
  startDateQuery: string;
  setStartDateQuery: (query: string) => void;
  endDateQuery: string;
  setEndDateQuery: (query: string) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

export default function AuditLogFilterBar(props: AuditLogFilterBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    actionQuery,
    setActionQuery,
    subjectTypeQuery,
    setSubjectTypeQuery,
    startDateQuery,
    setStartDateQuery,
    endDateQuery,
    setEndDateQuery,
    onSearchSubmit,
    onClearFilters,
  } = props;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "create_user", label: "Create User" },
    { value: "update_user", label: "Update User" },
    { value: "delete_user", label: "Delete User" },
  ];

  const subjectTypeOptions = [
    { value: "all", label: "All Subjects" },
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
    { value: "leave_request", label: "Leave Request" },
  ];

  return (
    <>
      <form
        method="GET"
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Input
            id="search"
            type="text"
            placeholder="Search by actor, subject, or owner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <Select
            name="action"
            value={actionQuery}
            onValueChange={(value) => setActionQuery(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            name="subject_type"
            value={subjectTypeQuery}
            onValueChange={(value) => setSubjectTypeQuery(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subject type" />
            </SelectTrigger>
            <SelectContent>
              {subjectTypeOptions.map((subjectType) => (
                <SelectItem key={subjectType.value} value={subjectType.value}>
                  {subjectType.label}
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

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
            onClick={() => handleClearFilters()}
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </form>
    </>
  );
}
