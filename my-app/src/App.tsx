import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import type { JWTUser, User } from "@/types";
import Layout from "./pages/Layout";
import Admin from "./pages/Admin";
import Candidate from "./pages/Candidate";

import EmployeeDashboard from "./pages/employee/Employee";
import JobDetails from "./pages/JobDetails";
import {
  useMarkasReadMutation,
} from "./api-service/notifications/notifications.api";


// Helper to decode token

function App() {


  const [setAsRead] = useMarkasReadMutation();

  const markNotificationRead = async (notificationId: string) => {
    try {
      await setAsRead({ id: Number(notificationId) });
      refetch(); // Refresh list
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }; // Adjust path

  const mapJWTToUser = (jwt: JWTUser): User => {
    return {
      id: jwt.personId.toString(), // Convert number to string
      name: jwt.personName,
      email: jwt.email,
      role: jwt.role.toLowerCase(), // Optional: normalize to lowercase
      avatar: jwt.personName.charAt(0), // Optional: first letter as avatar
    };
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
      path: "/candidate",
      children: [
        {
          path: ":id",
          element: <Candidate />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <Layout markNotificationRead={markNotificationRead}>
          <Admin />
        </Layout>
      ),
    },
    {
      path: "/employee",
      element: (
        <Layout markNotificationRead={markNotificationRead}>
          <EmployeeDashboard />
        </Layout>
      ),
    },
    {
      path: "/job/:jobId",
      element: (
        
          <JobDetails />
      
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
