import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import type { User, Notification, JWTUser, MyJwtPayload } from "@/types";
import NotificationDropdown from "@/components/NotificationDropdown";
import logo from "@/assets/logo.jpg";
import { useGetPersonNotificationsQuery } from "@/api-service/notifications/notifications.api";
import { skipToken } from "@reduxjs/toolkit/query";

interface LayoutProps {
  children: React.ReactNode;

  markNotificationRead: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,

  markNotificationRead,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getUserDetails = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode<JWTUser>(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const [user, setUser] = useState<JWTUser | null>(null);

  useEffect(() => {
    const decodedUser = getUserDetails();
    if (decodedUser) {
      setUser(decodedUser);
      navigate(`/${decodedUser.role.toLowerCase()}`)
    }
    
  }, []);
 
  // Add this function to get role from token
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token){
     
          navigate("/login")
        
    }

    try {
      const decoded = jwtDecode<JWTUser>(token);
      return decoded.role.toLowerCase();
    } catch (error) {
      console.error("Error decoding token:", error);
      return "";
    }
  };

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetPersonNotificationsQuery(
    user ? { id: Number(user.personId) } : skipToken,
    {
      skip: !user,
    }
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg";
      case "employee":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg";
      case "candidate":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user){
    navigate("/")
    return null;

  } 

  const userRole = getUserRole();

  console.log(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={logo} className="h-12 w-12 rounded-2xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    FtoC Platform
                  </h1>
                  <p className="text-xs text-gray-500">Friend to Colleague</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 animate-fade-in">
                {userRole && (
                  <Badge className={getRoleColor(userRole)}>
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-right">
              <NotificationDropdown
                user={user}
                notifications={notifications}
                markNotificationRead={markNotificationRead}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-md">
                      <AvatarImage src={user.avatar} alt={user.personName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.personName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white/95 backdrop-blur-lg border-gray-200/50 shadow-xl"
                  align="end"
                >
                  <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.personName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.personName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">
                        {user.personName}
                      </p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
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
