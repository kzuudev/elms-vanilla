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

interface DepartmentFilterBarProps {
  departmentNameQuery: string;
  setDepartmentNameQuery: (query: string) => void;
  sortByQuery: string;
  setSortByQuery: (query: string) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

export default function DepartmentFilterBar(props: DepartmentFilterBarProps) {

  const {
    departmentNameQuery,
    setDepartmentNameQuery,
    sortByQuery,
    setSortByQuery,
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

  return (
    <form
      method="GET"
      onSubmit={handleSearchSubmit}
      className="flex items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <div>
          <Input
            id="department_name"
            type="text"
            placeholder="Search by department name"
            value={departmentNameQuery}
            onChange={(e) => setDepartmentNameQuery(e.target.value)}
          />
        </div>
        <div>
          <Select
            name="sort_by"
            value={sortByQuery}
            onValueChange={(value) => setSortByQuery(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by A-Z" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
    </form>
  );
}
