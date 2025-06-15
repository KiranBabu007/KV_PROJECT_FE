import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./pages/admin";
import Employee from "./pages/employee";
import Candidate from "./pages/candidate";

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
    element: <Admin />,
  },
  {
    path: "employees",
    element: <Employee />,
  },
  {
    path: "candidate",
    element: <Candidate />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
