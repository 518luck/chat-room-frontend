import { Index } from "@/pages/index";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { UpdateInfo } from "@/pages/UpdateInfo";
import { UpdatePassword } from "@/pages/UpdatePassword";
import { createBrowserRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <Index></Index>,
    children: [
      {
        path: "update_info",
        element: <UpdateInfo />,
      },
      {
        path: "bbb",
        element: <div>bbb</div>,
      },
    ],
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
