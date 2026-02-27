import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { UpdatePassword } from "@/pages/UpdatePassword";
import { createBrowserRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <div>index</div>,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
];

export const router = createBrowserRouter(routes);
