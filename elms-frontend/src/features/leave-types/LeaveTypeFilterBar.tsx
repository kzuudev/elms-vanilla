"use client";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Search, X } from "lucide-react";

interface LeaveTypeFilterBarProps {
    leaveTypeNameQuery: string;
    setLeaveTypeNameQuery: (query: string) => void;
    onSearchSubmit: () => void;
    onClearFilters: () => void;
}

export default function LeaveTypeFilterBar(props: LeaveTypeFilterBarProps) {
    const {
        leaveTypeNameQuery,
        setLeaveTypeNameQuery,
        onSearchSubmit,
        onClearFilters,
    } = props;

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchSubmit();
    };

    return (
        <form
            method="GET"
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-4"
        >
            <div className="flex items-center gap-2">
                <Input
                    id="search_leave_type"
                    type="text"
                    placeholder="Search by leave type name"
                    value={leaveTypeNameQuery}
                    onChange={(e) => setLeaveTypeNameQuery(e.target.value)}
                />

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
                    onClick={onClearFilters}
                >
                    <X className="w-4 h-4" />
                    Clear
                </Button>
            </div>
        </form>
    );
}
