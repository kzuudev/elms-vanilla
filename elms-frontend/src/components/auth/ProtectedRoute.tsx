import { Navigate } from "react-router-dom";
import Unauthorized from "@/pages/unauthorized/Unauthorized.tsx";
import { AuthContext } from "@/features/context/auth/AuthContext.tsx";
import { useContext } from "react";

/**
 * Auth gate:
 * - Always requires a token (every company user gets one on login).
 * - If allowedRoles is passed (manager/admin pages), role must be in that list.
 * - If allowedRoles is omitted (employee pages), any logged-in user can enter
 *   (IT, Marketing, Accounting, manager, admin, etc.).
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    const token = localStorage.getItem("token");
    const currentRole = user?.role || localStorage.getItem("role") || "";

    // No token → not logged in (this is what blocks guests, not role)
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Manager/admin-only routes
    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        return <Unauthorized />;
    }

    return children;
};
