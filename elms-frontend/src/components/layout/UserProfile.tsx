"use client"


import {useContext} from "react";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

export default function UserProfile() {


    const {user} = useContext(AuthContext);

    if (!user) return null;

    return (
        <>
            <div>
                <p className="text-sm text-black">{user?.name || "Manager"}</p>
                <p className="text-sm text-gray-500">{user?.email} </p>
            </div>
        </>
    )
}
