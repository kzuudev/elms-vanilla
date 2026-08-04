"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import { api } from "@/lib/api";
import axios from "axios";

import NotificationList from "@/features/notifications/NotificationList.tsx";
import type { Notification } from "@/types/notification";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import { Bell } from "lucide-react";


export default function Notifications() {

    const controllerRef = useRef<AbortController | null>(null);
    const markAsReadRef = useRef<AbortController | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {

        const controller = new AbortController();
        controllerRef.current?.abort();
        controllerRef.current = controller;

        const holder = localStorage.getItem("token");
        try {   
            const response = await api.get("/notifications", {
                headers: {
                    Authorization: `Bearer ${holder}`
                },
                signal: controller.signal
            });
            setIsLoading(false);
            setNotifications(response.data.notifications);
            console.log(response.data.notifications);
        }catch (error: any) {
            if(axios.isCancel(error)) {
                return;
            }
            setError(error.response?.data?.message || "An error occurred while fetching notifications");
        }
    }

    const fetchMarkAsRead = async (id: number) => {
        const controller = new AbortController();

        markAsReadRef.current?.abort();
        markAsReadRef.current = controller;

        const holder = localStorage.getItem("token");

       try{
            const response = await api.patch(
                `/notifications/${id}`, {notifications: {read_at: new Date().toISOString()}},
                {
                    headers: {
                        Authorization: `Bearer ${holder}`
                    },
                    signal: controller.signal
                }
            );
            return response.data.mark_as_read;
       }catch (error: any) {
            if(axios.isCancel(error)) {
                return;
            }
            setError(error.response?.data?.message || "An error occurred while marking as read");
            return false;
       }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const totalNotifications = useMemo(() => {
        if(notifications.length > 0) {
            return notifications.filter((n) => !n.read_at).length;
        }

        return 0;
    }, [notifications])

    return (
        <div>
            <Dialog>
                <DialogTrigger> 
                    <Button className="relative" variant="ghost" size="icon">
                        <Bell className="w-4 h-4" />

                        <Badge className="absolute w-4 h-4 flex items-center justify-center text-white bg-red-500 border-none text-xs rounded-full -top-1 -right-1" variant="destructive">
                            {totalNotifications}
                        </Badge>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-4 pt-4 pb-2">
                        <DialogTitle className="text-xl">Notifications</DialogTitle>
                    </DialogHeader>
                    <div className="px-3 pb-3 flex flex-col gap-2">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                        ) : (
                            <NotificationList notifications={notifications} markAsRead={fetchMarkAsRead} />
                        )}
                        {error && <p className="text-red-500 text-sm px-1 pt-2">{error}</p>}
                    </div>
                </DialogContent>

                {error && <p className="text-red-500">{error}</p>}
            </Dialog>
        </div>
    )
}