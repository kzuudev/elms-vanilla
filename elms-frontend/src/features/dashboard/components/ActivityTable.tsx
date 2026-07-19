"use client";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";

import type {ActivityTableProps} from "@/types/table";

export function ActivityTable<T extends {id: number}>({columns, rows, isLoading, emptyMessage}: ActivityTableProps<T>) {

    return (
        <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-border hover:bg-transparent">
                    {columns.map((col) => (
                        <TableHead key={col.header} className="text-gray-600 font-semibold py-2 h-auto">
                            {col.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                            Loading recent activity...
                        </TableCell>
                    </TableRow>
                ) : !rows || rows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                            {emptyMessage}
                        </TableCell>
                    </TableRow>
                ) : (
                    rows.map((row) => (
                        <TableRow key={row.id} className="border-b border-gray-100">
                            {columns.map((col) => (
                                <TableCell key={col.header} className="py-4 px-4 text-gray-900">
                                    {col.render(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}