"use client"


import {useState} from "react";

import UserFilterBar from "@/features/users/components/UserFilterBar.tsx";
import {buildQueryString} from "@/utils/query-string.ts";
import UsersListTable from "@/features/users/components/UsersListTable.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Register from "@/pages/auth/register.tsx";


import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {api} from "@/lib/api.ts";
import type {UserData} from "@/types/users.ts";


export default function UsersDashboard() {

    const [isFormOpen, setIsOpenForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [users, setUsers] = useState<UserData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);

    const fetchFilteredUsers = async () => {

        try {
            const holder = localStorage.getItem("token");
            const queryString = buildQueryString({ search: searchQuery, status: statusFilter, department: departmentFilter, role: roleFilter})
            const response = await api.get(`/users${queryString}`, {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            setUsers(response.data.filtered_users);
        }catch (e) {
            setError(e.response.data.message || "A network error occurred.");
        }
    }


    return (
        <>
           <AppSidebar>
               <div className="flex justify-between">
                   <div className="flex flex-col gap-8 mb-8">
                       <h1>Users List</h1>
                       <UserFilterBar
                           searchQuery={searchQuery}
                           setSearchQuery={setSearchQuery}
                           statusFilter={statusFilter}
                           setStatusFilter={setStatusFilter}
                           roleFilter={roleFilter}
                           setRoleFilter={setRoleFilter}
                           departmentFilter={departmentFilter}
                           setDepartmentFilter={setDepartmentFilter}
                           onSearchSubmit={fetchFilteredUsers}
                       />
                   </div>

                   <Dialog open={isFormOpen} onOpenChange={setIsOpenForm}>
                       <DialogTrigger asChild>
                           <Button className="text-sm rounded-md bg-black text-white px-4 py-2">
                               Register New User
                           </Button>
                       </DialogTrigger>
                       <DialogContent className="w-full sm:max-w-[425px] py-6 px-2 bg-white border-0 outline-none shadow-xl">
                           <Register closeDialog={() => setIsOpenForm(false)}/>
                       </DialogContent>
                   </Dialog>
               </div>

               <div>
                   <UsersListTable />
               </div>

               {error && (
                   <div className="text-red-600">{error}</div>
               )}
           </AppSidebar>
        </>
    )
}