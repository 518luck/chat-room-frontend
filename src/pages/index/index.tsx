import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./index.css";
import { useState } from "react";

export function Index() {
  //eslint-disable-next-line
  const [headPic, _] = useState<string | undefined>(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const info = JSON.parse(userInfo);
        return info.headPic;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  return (
    <div id="index-container">
      <div className="header">
        <Link to={"/"}>
          <h1>聊天室</h1>
        </Link>
        <Link to={"/update_info"}>
          {headPic ? (
            <img src={headPic} width={40} height={40} className="icon" />
          ) : (
            <UserOutlined className="icon" />
          )}
        </Link>
      </div>

      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
