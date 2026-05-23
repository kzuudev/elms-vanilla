
import { useState } from 'react';
import AppSidebar from "@/components/layout/AppSidebar.tsx";



export default function AdminDashboard() {


    const [open, setOpen] = useState(false);

    return (
        <>
            <AppSidebar children={""} />
        </>
    )
}