import { Table, Tabs, message, type TabsProps, type TableProps } from "antd";
import "./index.css";
import { useEffect, useState } from "react";
import {
  agreeFriendRequest,
  friendRequestList,
  rejectFriendRequest,
} from "@/interfaces";
import axios from "axios";

interface User {
  id: number;
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

interface FriendRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  reason: string;
  createTime: Date;
  fromUser: User;
  toUser: User;
  status: number;
}

export function Notification() {
  const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
  const [toMe, setToMe] = useState<Array<FriendRequest>>([]);

  async function queryFriendRequestList() {
    try {
      const res = await friendRequestList();

      if (res.status === 201 || res.status === 200) {
        setFromMe(
          res.data.fromMe.map((item: FriendRequest) => {
            return {
              ...item,
              key: item.id,
            };
          }),
        );
        setToMe(
          res.data.toMe.map((item: FriendRequest) => {
            return {
              ...item,
              key: item.id,
            };
          }),
        );
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMsg =
          e.response?.data?.message || "查询好友请求失败，请重试";
        message.error(errorMsg);
      } else {
        // 处理非网络请求错误
        message.error("系统繁忙，请稍后再试");
      }
    }
  }

  async function agree(id: number) {
    try {
      const res = await agreeFriendRequest(id);

      if (res.status === 201 || res.status === 200) {
        message.success("操作成功");
        queryFriendRequestList();
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMsg =
          e.response?.data?.message || "同意好友请求失败，请重试";
        message.error(errorMsg);
      } else {
        // 处理非网络请求错误
        message.error("系统繁忙，请稍后再试");
      }
    }
  }

  async function reject(id: number) {
    try {
      const res = await rejectFriendRequest(id);

      if (res.status === 201 || res.status === 200) {
        message.success("操作成功");
        queryFriendRequestList();
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMsg =
          e.response?.data?.message || "同意好友请求失败，请重试";
        message.error(errorMsg);
      } else {
        // 处理非网络请求错误
        message.error("系统繁忙，请稍后再试");
      }
    }
  }

  useEffect(() => {
    const res = () => queryFriendRequestList();
    res();
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  const toMeColumns: TableProps<FriendRequest>["columns"] = [
    {
      title: "用户",
      render: (_, record) => {
        return (
          <div>
            <img src={record.fromUser.headPic} width={30} height={30} />
            {" " + record.fromUser.nickName + " 请求加你为好友"}
          </div>
        );
      },
    },
    {
      title: "理由",
      dataIndex: "reason",
    },
    {
      title: "请求时间",
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: "操作",
      render: (_, record) => {
        if (record.status === 0) {
          return (
            <div>
              <a href="#" onClick={() => agree(record.fromUserId)}>
                同意
              </a>
              <br />
              <a href="#" onClick={() => reject(record.fromUserId)}>
                拒绝
              </a>
            </div>
          );
        } else {
          const map: Record<string, string> = {
            1: "已通过",
            2: "已拒绝",
          };
          return <div>{map[record.status]}</div>;
        }
      },
    },
  ];

  const fromMeColumns: TableProps<FriendRequest>["columns"] = [
    {
      title: "用户",
      render: (_, record) => {
        return (
          <div>
            {" 请求添加好友 " + record.toUser.nickName}
            <img src={record.toUser.headPic} width={30} height={30} />
          </div>
        );
      },
    },
    {
      title: "理由",
      dataIndex: "reason",
    },
    {
      title: "请求时间",
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: "状态",
      render: (_, record) => {
        const map: Record<string, string> = {
          0: "申请中",
          1: "已通过",
          2: "已拒绝",
        };
        return <div>{map[record.status]}</div>;
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "发给我的",
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={toMeColumns}
            dataSource={toMe}
            style={{ width: "1000px" }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "我发出的",
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={fromMeColumns}
            dataSource={fromMe}
            style={{ width: "1000px" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div id="notification-container">
      <div className="notification-list">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
