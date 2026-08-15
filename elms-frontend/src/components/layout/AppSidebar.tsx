
import { useState } from "react";
import { api } from "@/lib/api.ts";
import {Link, useNavigate} from "react-router-dom";

import {useContext} from "react";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

import type { Profile } from "@/types/leave";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar.tsx";
import {
    CalendarOff,
    LayoutDashboard,
    LogOut,
    Search,
    Settings,
    Users,
    CircleUserRound
} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function AppSidebar({ children } : DashboardLayoutProps) {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext) as { user: Profile, setUser: (user: Profile | null) => void };

    const [error, setError] = useState<string | null>(null);

    const role = user?.role;

    const handleLogout = async () => {

        setError(null);

        try{
            const response = await api.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(response.data.success === true) {
                localStorage.clear();
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                setUser(null);
                navigate("/");
            }
        }catch(error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');

        }
    }

    return (
        <>
            <SidebarProvider>
                  <Sidebar>
                      <SidebarHeader>
                          <div>
                              <div className="flex items-center gap-2">
                                  <img src="/elms-logo.jpg" alt="ELMS Logo" className="w-16 h-16 rounded-full" />
                                  <h1 className="font-bold text-lg">ZurcaledWorks</h1>
                              </div>
                              <div className="px-4 mt-6">
                                  <div className="relative">
                                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <Input
                                          placeholder="Search here..."
                                          className="pl-8 bg-gray-100 border-0"
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘/</span>
                                  </div>
                              </div>
                          </div>
                      </SidebarHeader>

                      <SidebarGroup>
                          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 px-4 mb-2">MENU</SidebarGroupLabel>
                      </SidebarGroup>
                      {role === "manager" ? (
                          <SidebarContent>
                              <SidebarMenu>
                                  <SidebarMenuItem>
                                      <SidebarMenuButton asChild className="hover:bg-gray-100">
                                          <Link to="/manager/dashboard" className="flex items-center gap-2">
                                              <LayoutDashboard />
                                              <span>Dashboard</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/manager/employees" className="flex items-center gap-2">
                                              <Users />
                                              <span>Total Employees</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/manager/leaves" className="flex items-center gap-2">
                                              <CalendarOff />
                                              <span>Leaves</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/manager/" className="flex items-center gap-2">
                                              <CircleUserRound />
                                              <span>Profile</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </SidebarMenu>
                          </SidebarContent>
                      ) : role !== 'admin' && role !== 'manager' ? (
                          <SidebarContent>
                              <SidebarMenu>
                                  <SidebarMenuItem>
                                      <SidebarMenuButton asChild className="hover:bg-gray-100">
                                          <Link to="/employee/dashboard" className="flex items-center gap-2">
                                              <LayoutDashboard />
                                              <span>Dashboard</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/employee/leave-request" className="flex items-center gap-2">
                                              <CalendarOff />
                                              <span>Leave Request</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </SidebarMenu>
                          </SidebarContent>
                      ) : role === "admin" ? (
                          <SidebarContent>
                              <SidebarMenu>
                                  <SidebarMenuItem>
                                      <SidebarMenuButton asChild className="hover:bg-gray-100">
                                          <Link to="/admin/dashboard" className="flex items-center gap-2">
                                              <LayoutDashboard />
                                              <span>Dashboard</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/admin/employees" className="flex items-center gap-2">
                                              <Users />
                                              <span>Total Employees</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton
                                          onClick={() => setOpen(!open)}
                                          className="hover:bg-gray-100 flex items-center justify-between w-full"
                                      >
                                          <Link to="/admin/leaves" className="flex items-center gap-2">
                                              <CalendarOff />
                                              <span>Leaves</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </SidebarMenu>
                          </SidebarContent>
                        ) : role === "super-admin" ? (
                            <SidebarContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild className="hover:bg-gray-100">
                                          <Link to="/super-admin/dashboard" className="flex items-center gap-2">
                                              <LayoutDashboard />
                                              <span>Dashboard</span>
                                          </Link>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </SidebarMenu>
                          </SidebarContent>
                      ) : null}

                      <SidebarFooter>       
                          <SidebarContent>
                              <SidebarMenu>
                                  <SidebarMenuItem>
                                      <SidebarMenuButton asChild className="hover:bg-gray-100">
                                          <div className="flex items-center gap-2 px-4 py-2">
                                              <Settings />
                                              <span>Settings</span>
                                          </div>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>

                                  <SidebarMenuItem>
                                      <SidebarMenuButton asChild onClick={handleLogout} className="hover:bg-gray-100">
                                          <div className="flex items-center gap-2 px-4 py-2">
                                              <LogOut className="text-red-600" />
                                              <span className="text-red-600">Log Out</span>
                                          </div>
                                      </SidebarMenuButton>
                                  </SidebarMenuItem>
                              </SidebarMenu>
                          </SidebarContent>
                      </SidebarFooter>
                  </Sidebar>

                <main className="w-full h-screen overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>

                {error && <div className="text-red-500 text-sm">{error}</div>}
            </SidebarProvider>
        </>
    )
}
