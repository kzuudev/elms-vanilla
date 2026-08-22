"use client";

import { useContext, useState, useEffect } from "react";
import axios from "axios";

import type { Department } from "@/types/department";

import { DepartmentContext } from "@/features/context/department/DepartmentContext";
import { DepartmentEmployeesContext } from "@/features/context/department/DepartmentEmployeesContext";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Eye, Pencil, Trash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function DepartmentListTable() {
  const { departments } = useContext(DepartmentContext);
  const { departmentEmployees } = useContext(DepartmentEmployeesContext);

  return (
    <>
      <div className="border border-border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-border hover:bg-gray-50">
              <TableHead className="text-foreground font-semibold">
                Department
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Total Employees
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Active Employees
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                On Leave Employees
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => {
                  const totalEmployees =
                  departmentEmployees?.total_employees_by_department?.find(
                    (row) => row.department_id === department.id,
                  )?.total_employees ?? 0;

                const activeEmployees =
                  departmentEmployees?.active_employees_by_department?.find(
                    (row) => row.department_id === department.id,
                  )?.total_active_employees ?? 0;
                  
                const onLeaveEmployees =
                  departmentEmployees?.on_leave_employees_by_department?.find(
                    (row) => row.department_id === department.id,
                  )?.total_on_leave_employees ?? 0;
                return (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{totalEmployees}</TableCell>
                    <TableCell>{activeEmployees}</TableCell>
                    <TableCell>{onLeaveEmployees}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                            <Eye className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                            <Pencil className="w-4 h-4 text-black" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                            <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
