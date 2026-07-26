import { Navigate } from "react-router-dom";
import Unauthorized from "@/pages/unauthorized/Unauthorized.tsx";
import { AuthContext } from "@/features/context/auth/AuthContext.tsx";
import { useContext } from "react";
import { type Profile } from "@/types/leave.ts";

/**
 * Auth gate:
 * - Always requires a token.
 * - If allowedRoles is passed, role must be in that list (manager/admin pages).
 * - If allowedRoles is omitted, any logged-in user can enter (staff pages).
 */
export const ProtectedRoute = ({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles?: string[];
}) => {
    const { user } = useContext(AuthContext) as { user: Profile | null };

    const token = localStorage.getItem("token");
    const currentRole = user?.role || localStorage.getItem("role") || "";

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
        return <Unauthorized />;
    }

    return children;
};
