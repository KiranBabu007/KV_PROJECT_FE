import { Button } from "@/components/ui/button"
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element:  <Login />,
  },
  
]);

function App() {
  return (
    <>
   
        <RouterProvider router={router} />

    
    </>
  );
  
}

export default App