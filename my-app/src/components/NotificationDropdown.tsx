
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';
import type { User, Notification, JWTUser } from '@/types';

interface NotificationDropdownProps {
  user: JWTUser;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  user, 
  notifications, 
  markNotificationRead 
}) => {

  const sortdeNotifications = [...notifications].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "UNREAD" ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
   

  const unreadCount = sortdeNotifications.filter(n => n.status==="UNREAD").length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'referral': return { emoji: '👥', icon: CheckCircle2, color: 'text-blue-600' };
      case 'bonus': return { emoji: '💰', icon: CheckCircle2, color: 'text-green-600' };
      case 'interview': return { emoji: '📅', icon: Clock, color: 'text-purple-600' };
      case 'status_update': return { emoji: '📋', icon: AlertCircle, color: 'text-orange-600' };
      case 'job_update': return { emoji: '💼', icon: CheckCircle2, color: 'text-indigo-600' };
      default: return { emoji: '📢', icon: Bell, color: 'text-gray-600' };
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const markAllAsRead = () => {
    sortdeNotifications.forEach(notification => {
      if (notification.status==="UNREAD") {
        markNotificationRead(notification.id);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-white/80 transition-all duration-300 rounded-xl"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600 animate-pulse" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-bounce border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-96 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-2xl rounded-2xl p-0 animate-scale-in" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-2xl border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 shadow-sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="mt-2 text-xs text-blue-600 hover:bg-blue-50 p-1 h-auto"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {sortdeNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No notifications yet</p>
            <p className="text-xs text-gray-400">We'll notify you when something happens</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80 overflow-scroll ">
            <div className="p-2 ">
              {sortdeNotifications.map((notification, index) => {
                const iconData = getNotificationIcon("");
                const IconComponent = iconData.icon;
                
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start space-x-3 p-4 cursor-pointer rounded-xl transition-all duration-300 mb-2 border ${
                      (notification.status==="UNREAD") 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 shadow-sm' 
                        : 'bg-white hover:bg-gray-50 border-transparent hover:border-gray-200'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex-shrink-0 relative">
                      <div className={`p-2 rounded-lg ${(notification.status==="UNREAD") ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-4 w-4 ${iconData.color}`} />
                      </div>
                      {(notification.status==="UNREAD") && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium leading-tight ${(notification.status==="UNREAD") ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {(notification.status==="UNREAD") && (
                          <div className="flex-shrink-0 ml-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{format(notification.createdAt, 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                );
              })}
            </div>
            {unreadCount > 0 && (
          <>
            <DropdownMenuSeparator className="my-0" />
            <div className="p-3 bg-gray-50/50 rounded-b-2xl">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-lg"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
          </ScrollArea>
        )}
        
        {/* Footer */}
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;