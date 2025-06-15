import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";
import type { User, Notification } from "@/types";

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'admin-all',
    title: 'New Referral Submitted',
    message: 'John Doe referred Jane Smith for Senior Software Engineer position',
    type: 'referral',
    read: false,
    createdAt: new Date('2024-01-18T10:30:00'),
    relatedId: '1'
  },
  {
    id: '2',
    userId: '1',
    title: 'Referral Status Updated',
    message: 'Your referral for Jane Smith is now under review',
    type: 'status_update',
    read: false,
    createdAt: new Date('2024-01-17T14:20:00'),
    relatedId: '1'
  }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    const storedUser = {
      id: '1' ,
  name: 'Kiran',
  email: 'abc@Mail.com',
  role: 'admin' ,
  avatar: 'K',
    };
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'admin',
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const switchRole = (role: 'admin' | 'employee' | 'candidate') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/admin",
      element: (
        <Index
          user={user}
          login={login}
          logout={logout}
          switchRole={switchRole}
          notifications={notifications}
          markNotificationRead={markNotificationRead}
        />
      ),
    },
    {
      path: "/employees",
      element: (
        <Index
          user={user}
          login={login}
          logout={logout}
          switchRole={switchRole}
          notifications={notifications}
          markNotificationRead={markNotificationRead}
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
