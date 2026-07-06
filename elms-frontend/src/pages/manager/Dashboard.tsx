"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api.ts";

import AppSidebar from "@/components/layout/AppSidebar.tsx";
import UserProfile from "@/components/layout/UserProfile.tsx";

export default function ManagerDashboard() {


    const [error, setError] = useState<string | null>(null);

    const fetchManagerDashboard = async () => {

        try {
            const holder = localStorage.getItem("token");
            const response = await api.get("/manager-dashboard", {
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

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchManagerDashboard();
    }, []);

   return (
      <>
          <AppSidebar>
              <div className="w-full flex justify-between">
                  <div>
                      <h1 className="text-gray-600">Dashboard</h1>
                      <h2 className="text-sm text-gray-500">Track employee activities, stats, and updates</h2>
                  </div>

                  <UserProfile />
              </div>
          </AppSidebar>
      </>


   );
}

