
import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";


import AppSidebar from "@/components/layout/AppSidebar.tsx";

export default function AdminDashboard() {


    const [error, setError] = useState<string | null>(null);

    const fetchAdminDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/admin-dashboard", {
                headers: {
                    Authorization: `Bearer ${holder}`,
                }
            });
            console.log(response.data);

        }catch (e) {
            setError(e.response.data.message);
        }
    }


    useEffect(() => {

        fetchAdminDashboard();
    }, []);

    return (
        <>
            <AppSidebar>
                <h1>Admin Dashboard</h1>
            </AppSidebar>
        </>
    )
}