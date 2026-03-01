import { Chat } from "@/pages/Chat";
import { Collection } from "@/pages/Collection";
import { Friendship } from "@/pages/Friendship";
import { Group } from "@/pages/Group";
import { Index } from "@/pages/index";
import { Login } from "@/pages/Login";
import { Menu } from "@/pages/Menu";
import { Notification } from "@/pages/Notification";
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
        path: "/",
        element: <Menu />,
        children: [
          {
            path: "/",
            element: <Friendship />,
          },
          {
            path: "/group",
            element: <Group />,
          },
          {
            path: "chat",
            element: <Chat />,
          },
          {
            path: "collection",
            element: <Collection />,
          },
          {
            path: "notification",
            element: <Notification />,
          },
        ],
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
