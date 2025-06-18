import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import {
  useGetReferralNotificationsQuery,
  useSetAsReadMutation,
} from "@/api-service/candidate/candidate.api";
import { skipToken } from "@reduxjs/toolkit/query";

type NotificationType = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string
  read: boolean;
};

export default function Notifications({ id }: { id: string }) {
  const { data } = useGetReferralNotificationsQuery(id ? id : skipToken);
  const [setAsRead] = useSetAsReadMutation();

  const [localReadIds, setLocalReadIds] = useState<Set<number>>(new Set());

  const notifications: NotificationType[] = useMemo(() => {
    if (!data) return [];

    const mapped = data.map((n: any) => ({
      id: n.id,
      title: n.title,
      description: n.content,
      date: n.createdAt,
      read: n.status === "READ" || localReadIds.has(n.id),
    }));

    // Unread notifications first
    return mapped.sort((a, b) => Number(a.read) - Number(b.read));
  }, [data, localReadIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    if (!localReadIds.has(id)) {
      setLocalReadIds((prev) => new Set(prev).add(id));
      try {
        await setAsRead({ id });
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setLocalReadIds(new Set(notifications.map((n) => n.id)));
    try {
      await Promise.all(unreadIds.map((id) => setAsRead({ id })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
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
                <div
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
                    <span className="font-medium text-blue-800 text-xl">
                      {n.title}
                    </span>
                  </div>
                  <span className="text-base text-gray-500 mt-0.5">
                    {new Date(n.date).toLocaleString()}
                  </span>
                  <span className="text-base text-gray-700 mt-1">
                    {n.description}
                  </span>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
