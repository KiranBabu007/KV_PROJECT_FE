import React from 'react'
import Login from './Login'
import Layout from './Layout'
import Admin from './Admin'
import EmployeeDashboard from './Employee'
import type { Notification, User } from '@/types'

interface IndexProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'admin' | 'employee' | 'candidate') => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const Index: React.FC<IndexProps> = ({
  user,
  login,
  logout,
  switchRole,
  notifications,
  markNotificationRead
}) => {

    const role = localStorage.getItem("token")
    
    if(!role){
        return <Login/>
    }
  return (
     <Layout 
      user={user}
      logout={logout}
      switchRole={switchRole}
      notifications={notifications}
      markNotificationRead={markNotificationRead}
    >
        {role==='admin' && <Admin/>}
        {role==='employees' && <EmployeeDashboard/>}
    </Layout>
  )
}

export default Index