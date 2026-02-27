import { Aaa } from "@/views/Aaa";
import { Bbb } from "@/views/Bbb";
import { Layout } from "@/views/Layout";
import { createBrowserRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "aaa",
        element: <Aaa />,
      },
      {
        path: "bbb",
        element: <Bbb />,
      },
    ],
  },
];
export const router = createBrowserRouter(routes);
