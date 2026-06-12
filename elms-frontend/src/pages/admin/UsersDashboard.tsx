"use client"


import {useState} from "react";


import UsersListTable from "@/features/users/components/UsersListTable.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import Register from "@/pages/auth/register.tsx";


import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function UsersDashboard() {

    const [isFormOpen, setIsOpenForm] = useState(false);

    return (
        <>
           <AppSidebar>
               <div className="flex justify-between">
                   <h1 className="mb-8">Users Dashboard</h1>

                   <Dialog open={isFormOpen} onOpenChange={setIsOpenForm}>
                       <DialogTrigger asChild>
                           <Button className="text-sm rounded-md bg-black text-white px-4 py-2">
                               Register New User
                           </Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[425px]">
                           <Register/>
                       </DialogContent>
                   </Dialog>
               </div>

               <div>
                   <UsersListTable />
               </div>
           </AppSidebar>
        </>
    )
}