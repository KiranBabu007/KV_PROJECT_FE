import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type { User, Notification } from '@/types';
import NotificationDropdown from '@/components/NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  logout: () => void;
  switchRole: (role: 'admin' | 'employee' | 'candidate') => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  logout, 
  switchRole, 
  notifications, 
  markNotificationRead 
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'employee': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'candidate': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if(!user) return

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <div className="relative flex items-center">
                      <span className="text-sm font-bold text-white">F</span>
                      <svg 
                        width="12" 
                        height="8" 
                        viewBox="0 0 12 8" 
                        fill="none" 
                        className="text-yellow-400 mx-1"
                      >
                        <path 
                          d="M1 4h10m-4-3l3 3-3 3" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-bold text-white">C</span>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    FtoC Platform
                  </h1>
                  <p className="text-xs text-gray-500">Friend to Colleague</p>
                </div>
              </div>
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-right">
             

              <NotificationDropdown 
                user={user}
                notifications={notifications}
                markNotificationRead={markNotificationRead}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:shadow-lg transition-all duration-300">
                    <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-md">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-lg border-gray-200/50 shadow-xl" align="end">
                  <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
