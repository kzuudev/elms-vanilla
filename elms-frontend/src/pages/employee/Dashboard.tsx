
import {useState} from "react";

import AppSidebar from "@/components/employee/AppSidebar.tsx";


export default function EmployeeDashboard() {


    const [open, setOpen] = useState(false);

    return (
        <>
            <AppSidebar>
                <h1>Employee Dashboard</h1>
            </AppSidebar>
        </>
    )
}