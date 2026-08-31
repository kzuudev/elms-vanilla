"use client";
import { useContext } from "react";
import { AuthContext } from "@/features/context/auth/AuthContext.tsx";

import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DepartmentOptions } from "@/types/department.ts";

interface UserFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  departmentOptions: DepartmentOptions[];
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

export default function UserFilterBar(props: UserFilterBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    departmentFilter,
    setDepartmentFilter,
    onSearchSubmit,
    onClearFilters,
  } = props;

  const { user } = useContext(AuthContext);

  const isSuperAdmin = user?.role === "super-admin";
  const isAdmin = user?.role === "admin";

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "manager", label: "Manager" },
    { value: "it support", label: "IT Support" },
    { value: "accountant", label: "Accounting" },
    { value: "marketing", label: "Marketing" },
    { value: "software engineer", label: "Software Engineer" },
    { value: "ai engineer", label: "AI Engineer" },
    { value: "ui/ux", label: "UI/UX" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
    { value: "2", label: "Away" },
  ];

  return (
    <>
      <form
        method="GET"
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-4"
      >
        {/* Search Bar Input*/}
        <div className="flex items-center gap-2">
          <Input
            id="search"
            type="text"
            placeholder="Search by name, email, or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Dropdown*/}
        <div>
          <Select
            name="status"
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter Dropdown*/}
        <div>
          <Select
            name="role"
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter Dropdown*/}
        <div>
          {isSuperAdmin && (
            <Select
              name="department"
              value={departmentFilter}
              onValueChange={(value) => setDepartmentFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {props?.departmentOptions?.map((option) => (
                  <SelectItem key={option?.id} value={option?.name}>
                    {option?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-3 py-2 rounded-md"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </>
  );
}
