import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import clsx from "clsx";
import { useGetReferralNotificationsQuery } from "@/api-service/candidate/candidate.api";
import { skipToken } from "@reduxjs/toolkit/query";

type NotificationType = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string
  read: boolean;
  type: "application" | "interview" | "decision";
};

const initialNotifications: NotificationType[] = [
  {
    id: 1,
    title: "Application Update",
    description: "Your application has progressed to the next stage.",
    date: "2024-01-20T15:43:00",
    read: false,
    type: "application",
  },
  {
    id: 2,
    title: "Interview Scheduled",
    description:
      "Your technical interview is scheduled for Feb 1, 2024 at 10:00 AM.",
    date: "2024-01-18T10:00:00",
    read: false,
    type: "interview",
  },
  {
    id: 3,
    title: "Decision Available",
    description: "A decision has been made on your application.",
    date: "2024-02-10T16:00:00",
    read: true,
    type: "decision",
  },
];

export default function Notifications({ id }: { id: string }) {
  const { data } = useGetReferralNotificationsQuery(id ? id : skipToken);
  console.log("🚀 ~ Notifications ~ data:", data);

  const [notifications, setNotifications] =
    useState<NotificationType[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

  const addNotification = (notif: Omit<NotificationType, "id" | "read">) => {
    setNotifications((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((n) => n.id)) + 1 : 1,
        read: false,
        ...notif,
      },
      ...prev,
    ]);
    toast(notif.title, {
      description: notif.description,
    });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative outline-none">
            <Bell className="h-6 w-6 text-blue-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white px-1 border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        {/* Set width and padding using Tailwind default classes, no config */}
        <PopoverContent className="w-[420px] p-4">
          <div className="px-3 pt-3 pb-3 flex items-center justify-between">
            <span className="font-semibold text-lg">Notifications</span>
            {unreadCount > 0 && (
              <button
                className="text-xs text-blue-600 underline"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          <Separator />
          <div className="max-h-80 overflow-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="p-6 text-gray-500 text-base">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={clsx(
                    "w-full text-left px-6 py-5 flex flex-col rounded-lg border-b last:border-b-0 transition-all",
                    !n.read
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                  )}
                  onClick={() => markAsRead(n.id)}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-1" />
                    )}
                    <span className={clsx("font-medium text-blue-800 text-xl")}>
                      {n.title}
                    </span>
                  </div>
                  <span className="text-base text-gray-500 mt-0.5">
                    {new Date(n.date).toLocaleString()}
                  </span>
                  <span className="text-base text-gray-700 mt-1">
                    {n.description}
                  </span>
                </button>
              ))
            )}
          </div>
          <Separator />
          <div className="flex gap-2 p-4 justify-end">
            <button
              className="text-xs px-3 py-2 rounded bg-gray-100 hover:bg-blue-100 border"
              onClick={() =>
                addNotification({
                  title: "Application Update",
                  description:
                    "Your application has progressed to the next stage.",
                  date: new Date().toISOString(),
                  type: "application",
                })
              }
            >
              Simulate App Update
            </button>
            <button
              className="text-xs px-3 py-2 rounded bg-gray-100 hover:bg-blue-100 border"
              onClick={() =>
                addNotification({
                  title: "Interview Scheduled",
                  description: "Your technical interview is scheduled.",
                  date: new Date().toISOString(),
                  type: "interview",
                })
              }
            >
              Simulate Interview
            </button>
            <button
              className="text-xs px-3 py-2 rounded bg-gray-100 hover:bg-blue-100 border"
              onClick={() =>
                addNotification({
                  title: "Decision Available",
                  description: "A decision has been made on your application.",
                  date: new Date().toISOString(),
                  type: "decision",
                })
              }
            >
              Simulate Decision
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
