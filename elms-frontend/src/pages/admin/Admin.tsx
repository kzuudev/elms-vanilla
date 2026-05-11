
import { useState } from 'react';
import AppSidebar from "@/components/employee/AppSidebar.tsx";



export default function AdminDashboard() {


    const [open, setOpen] = useState(false);

    return (
        <>
            <AppSidebar children={""} />
        </>
    )
}