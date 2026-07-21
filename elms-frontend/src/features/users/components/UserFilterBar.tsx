"use client"


import {Button} from "@/components/ui/button.tsx";
interface UserFilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;
    departmentFilter: string;
    setDepartmentFilter: (department: string) => void;
    onSearchSubmit: () => void;

}

export default function UserFilterBar(props: UserFilterBarProps) {

    const {searchQuery, setSearchQuery, statusFilter, setStatusFilter, roleFilter, setRoleFilter, departmentFilter, setDepartmentFilter, onSearchSubmit} = props;

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchSubmit();
    }

    return (
        <>
            <form method="GET" onSubmit={handleSearchSubmit} className="flex items-center gap-2" >

                {/* Search Bar Input*/}
                <div className="flex items-center gap-2">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by name, email, or role"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Status Filter Dropdown*/}
                <div>
                    <label htmlFor="status" className="mr-2">Status:</label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>


                {/* Role Filter Dropdown*/}
                <div>
                    <label htmlFor="role" className="mr-2">Role:</label>
                    <select
                        id="role"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>


                {/* Department Filter Dropdown*/}
                <div>
                    <label htmlFor="department" className="mr-2">Department:</label>
                    <select
                        id="department"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>

                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Search</Button>

            </form>
        </>
    )


}
