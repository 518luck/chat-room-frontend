import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu } from "antd";
import type { MenuProps } from "antd";
import "./menu.css";
import { router } from "@/routers";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "好友",
  },
  {
    key: "2",
    label: "群聊",
  },
  {
    key: "3",
    label: "聊天",
  },
  {
    key: "4",
    label: "收藏",
  },
  {
    key: "5",
    label: "通知",
  },
];

// 点击菜单项时的回调函数
// function({ key, keyPath, domEvent })
const handleMenuItemClick: MenuProps["onClick"] = (info) => {
  let path = "";
  switch (info.key) {
    case "1":
      path = "/";
      break;
    case "2":
      path = "/group";
      break;
    case "3":
      path = "/chat";
      break;
    case "4":
      path = "/collection";
      break;
    case "5":
      path = "/notification";
      break;
  }
  router.navigate(path);
};

export function Menu() {
  const { pathname } = useLocation();

  // 定义路径与 Key 的映射表
  const pathKeyMap: Record<string, string> = {
    "/": "1",
    "/group": "2",
    "/chat": "3",
    "/collection": "4",
    "/notification": "5",
  };

  // 根据当前路径获取 Key，匹配不到则默认回退到 "1"
  const selectedKey = pathKeyMap[pathname] || "1";

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          //初始选中的菜单项 key 数组
          selectedKeys={[selectedKey]}
          //菜单内容
          items={items}
          //点击 MenuItem 调用此函数 function({ key, keyPath, domEvent })
          onClick={handleMenuItemClick}
        />
      </div>

      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
