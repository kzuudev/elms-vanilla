
export type UserRole = 'admin' | 'manager' | 'employee';

export const currentUserRole = (role: string | null | undefined): UserRole => {

    const userRole = role?.toLowerCase() || "";

    if(userRole.includes("admin")) return "admin";
    if(userRole.includes("manager")) return "manager";

    return "employee";


}