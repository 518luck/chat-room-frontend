import { Button, Form, Input, Table, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import type { TableProps } from "antd";
import axios from "axios";
import { friendshipList } from "@/interfaces";

interface SearchFriend {
  name: string;
}

interface FriendshipSearchResult {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
}

export function Friendship() {
  const [friendshipResult, setFriendshipResult] = useState<
    Array<FriendshipSearchResult>
  >([]);

  const columns: TableProps<FriendshipSearchResult>["columns"] = useMemo(
    () => [
      {
        title: "昵称",
        dataIndex: "nickName",
      },
      {
        title: "头像",
        dataIndex: "headPic",
        render: (_, record) => (
          <div>
            <img src={record.headPic} />
          </div>
        ),
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "操作",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_, record) => (
          <div>
            <a href="#">聊天</a>
          </div>
        ),
      },
    ],
    [],
  );

  const searchFriend = async (values: SearchFriend) => {
    try {
      const res = await friendshipList(values.name || "");

      if (res.status === 201 || res.status === 200) {
        setFriendshipResult(
          res.data.map((item: FriendshipSearchResult) => {
            return {
              ...item,
              key: item.id,
            };
          }),
        );
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMsg = e.response?.data?.message || "查询好友失败，请重试";
        message.error(errorMsg);
      } else {
        // 处理非网络请求错误
        message.error("系统繁忙，请稍后再试");
      }
    }
  };

  const [form] = useForm();

  useEffect(() => {
    const initialValues = form.getFieldsValue();
    // 2. 创建一个异步执行逻辑，避免同步级联渲染
    const initData = async () => {
      await searchFriend(initialValues);
    };

    initData();
  }, [form]);

  return (
    <div id="friendship-container">
      <div className="friendship-form">
        <Form
          form={form}
          onFinish={searchFriend}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="friendship-table">
        <Table<FriendshipSearchResult>
          columns={columns}
          dataSource={friendshipResult}
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}
