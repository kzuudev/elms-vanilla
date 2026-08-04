"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";

import type { Notification } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationListProps = {
    notifications: Notification[];
    markAsRead: (id: number) => Promise<boolean>;
};

export default function NotificationList({ notifications, markAsRead }: NotificationListProps) {
    const [selectedTab, setSelectedTab] = useState<"all" | "unread">("all");

    // filter the notifications based on the selected tab
    const filtered = useMemo(() => {
        if (selectedTab === "unread") {
            // filter the notifications to only show the unread ones
            return notifications.filter((n) => !n.read_at);
        }
        return notifications;
    }, [notifications, selectedTab]);

    return (
        <div className="flex flex-col">
            {/* Tabs — Facebook-style filters */}
            <div className="flex gap-2 px-1 pb-3">
                <Button
                    type="button"
                    size="sm"
                    variant={selectedTab === "all" ? "default" : "ghost"}
                    className="rounded-full h-8 px-3"
                    onClick={() => setSelectedTab("all")}
                >
                    All
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={selectedTab === "unread" ? "default" : "ghost"}
                    className="rounded-full h-8 px-3"
                    onClick={() => setSelectedTab("unread")}
                >
                    Unread
                </Button>
            </div>

            {/* Scrollable feed */}
            <div className="max-h-[360px] overflow-y-auto -mx-1">
                {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No notifications
                    </p>
                ) : (
                    <ul className="flex flex-col">
                        {filtered.map((notification) => {
                            const isUnread = !notification.read_at;

                            return (
                                <li key={notification.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isUnread) {
                                                void markAsRead(notification.id);
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex items-start gap-3 px-3 py-3 text-left rounded-lg transition-colors",
                                            "hover:bg-muted/80",
                                            isUnread && "bg-blue-50/80"
                                        )}
                                    >
                                        {/* Icon avatar */}
                                        <div
                                            className={cn(
                                                "shrink-0 size-10 rounded-full flex items-center justify-center",
                                                isUnread ? "bg-blue-100 text-blue-600" : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <Bell className="size-4" />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <p className={cn("text-sm leading-snug", isUnread && "font-semibold")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p
                                                className={cn(
                                                    "text-xs mt-1",
                                                    isUnread ? "text-blue-600 font-medium" : "text-muted-foreground"
                                                )}
                                            >
                                                {formatDistanceToNow(new Date(notification.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {isUnread && (
                                            <span className="shrink-0 mt-2 size-2.5 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
