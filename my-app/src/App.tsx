import { Button } from "@/components/ui/button"
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./pages/admin";
import EmployeeDashboard from "./pages/employee";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element:  <Login />,
  },
  {
     path:"/admin",
     element:<Admin/>
  },
  {
      path:"employees",
      element:<EmployeeDashboard/>
  }
  
]);

function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  );
  
}

export default App