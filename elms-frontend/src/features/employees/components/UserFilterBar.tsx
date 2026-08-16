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
    onClearFilters: () => void;
}

export default function UserFilterBar(props: UserFilterBarProps) {

    const {searchQuery, setSearchQuery, statusFilter, setStatusFilter, roleFilter, setRoleFilter, departmentFilter, setDepartmentFilter, onSearchSubmit, onClearFilters} = props;

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchSubmit();
    }

    const handleClearFilters = () => {
        onClearFilters();
    }

    const roleOptions = [
        { value: '', label: 'All Roles' },
        { value: 'manager', label: 'Manager' },
        { value: 'it support', label: 'IT Support' },
        { value: 'accountant', label: 'Accounting' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'software engineer', label: 'Software Engineer' },
        { value: 'ai engineer', label: 'AI Engineer' },
        { value: 'ui/ux', label: 'UI/UX' },

    ]

    const departmentOptions = [
        { value: '', label: 'All Departments' },
        { value: 'it', label: 'IT' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'finance', label: 'Finance' },
        { value: 'accounting', label: 'Accounting' },
    ]


    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' },
        { value: '2', label: 'Away' },

    ]

    return (
        <>
            <form method="GET" onSubmit={handleSearchSubmit} className="flex items-center gap-4" >

                {/* Search Bar Input*/}
                <div className="flex items-center gap-2">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by name, email, or role"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-xs w-full"
                    />
                </div>

                {/* Status Filter Dropdown*/}
                <div>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-xs"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Role Filter Dropdown*/}
                <div>
                    <select
                        id="role"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-xs"
                    >
                        {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Department Filter Dropdown*/}
                <div>
                    <select
                        id="department"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-xs"
                    >
                        {departmentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">Search</Button>
                    <Button type="button" variant="outline" className="px-3 py-2 rounded-md" onClick={handleClearFilters}>Clear Filters</Button>
                </div>
            </form>
        </>
    )


}
