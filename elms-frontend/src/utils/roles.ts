export type UserRole = 'admin' | 'manager' | 'employee' | 'super-admin';

export const normalizeRole = (role: string | null | undefined): UserRole => {

    const userRole = role?.toLowerCase() || "";

   if(userRole === 'admin') {
    return "admin";
   }

   if(userRole === 'manager') {
    return "manager";
   }

   if(userRole === 'super-admin') {
    return "super-admin";
   }

    return "employee";  
}


export const redirectPathByRole = (role: string | null | undefined) => {
    const userRole = normalizeRole(role);

    if(userRole === 'admin') {
        return "/admin/dashboard";
    }

    if(userRole === 'manager') {
        return "/manager/dashboard";
    }

    if(userRole === 'super-admin') {
        return "/super-admin/dashboard";
    }

    return "/employee/dashboard";
}


