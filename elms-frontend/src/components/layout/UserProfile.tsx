"use client"


import {useContext} from "react";
import {UserContext} from "@/features/context/UserContext.tsx";

export default function UserProfile() {


    const {user} = useContext(UserContext);

    return (
        <>
            <div>
                <p className="text-sm text-black">
                    {user?.name || "Manager"}
                </p>
                <p className="text-sm text-gray-500">{user?.email} </p>
            </div>
        </>
    )
}
