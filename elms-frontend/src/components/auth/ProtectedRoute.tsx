import {  Navigate } from "react-router-dom";
import Unauthorized from "@/pages/unauthorized/Unauthorized.tsx";

export const ProtectedRoute = ({ children, allowedRoles}) => {

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role')


    // if they're not logged in at all
    if(!token) {
        return <Navigate to="/" replace />;
    }

    // if user logged in but don't have the right role
    if(allowedRoles && !allowedRoles.includes(userRole)) {
        return <Unauthorized />
    }


    // if they have a token and right user role, return the dashboard component
    return children

}