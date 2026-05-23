
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";


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
    User,
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

    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        localStorage.clear();
        navigate("/");
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
                      ) : (
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
                      )}

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
            </SidebarProvider>
        </>
    )
}
