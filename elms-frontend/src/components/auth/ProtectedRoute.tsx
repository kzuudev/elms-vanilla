import {  Navigate } from "react-router-dom";
import Unauthorized from "@/pages/unauthorized/Unauthorized.tsx";
import { UserContext } from "@/features/context/UserContext";
import {useContext} from "react";

export const ProtectedRoute = ({ children, allowedRoles}) => {

    const { user } = useContext(UserContext);

    const token = localStorage.getItem('token');
    const currentRole = user?.role || localStorage.getItem("role");

    // if they're not logged in at all
    if(!token && !currentRole) {
        return <Navigate to="/" replace />;
    }

    // if user logged in but don't have the right role
    if(allowedRoles && !allowedRoles.includes(currentRole)) {
        return <Unauthorized />
    }


    // if they have a token and right user role, return the dashboard component
    return children

}