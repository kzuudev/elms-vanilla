
import {
    LayoutDashboard,
    Briefcase,
    MessageCircle,
    Users,
    Clock,
    User,
    HelpCircle,
    Settings,
    LogOut,
    ChevronRight,
    Search,
} from 'lucide-react';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';


export default function AdminDashboard() {

    return (
        <>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div>
                        <div className="flex items-center">
                            <img src="/public/elms-logo.jpg" alt="ELMS Logo" className="w-16 h-16 mt-2rounded-full" />
                            <h1 className="font-bold text-lg">ZurcaledWorks</h1>
                        </div>
                        <div className="px-4 mb-6 mt-6">
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
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-600 px-4 mb-2">MENU</SidebarGroupLabel>
                </SidebarGroup>
                <SidebarContent>
                    <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="hover:bg-gray-100">
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="hover:bg-gray-100">
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        <User />
                                        <span>Employee</span>
                                    </div>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild className="hover:bg-gray-100">
                                            <div className="flex items-center gap-2 px-4 py-2">
                                                <Users />
                                                <span>Employees</span>
                                            </div>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>

                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild className="hover:bg-gray-100">
                                            <div className="flex items-center gap-2 px-4 py-2">
                                                <Users />
                                                <span>Leave Requests</span>
                                            </div>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>

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
                                <SidebarMenuButton asChild className="hover:bg-gray-100">
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
        </SidebarProvider>
        </>
    )
}