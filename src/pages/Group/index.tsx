import { Button, Form, Input, Table, message, type TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { chatroomList } from "@/interfaces";
import axios from "axios";

interface SearchGroup {
  name: string;
}

interface GroupSearchResult {
  id: number;
  name: string;
  createTime: Date;
}

export function Group() {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);

  const columns: TableProps<GroupSearchResult>["columns"] = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
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

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || "");

      if (res.status === 201 || res.status === 200) {
        setGroupResult(
          res.data.map((item: GroupSearchResult) => {
            return {
              ...item,
              key: item.id,
            };
          }),
        );
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorMsg = e.response?.data?.message || "查询群聊失败，请重试";
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
    const initData = async () => {
      await searchGroup(initialValues);
    };
    initData();
  }, [form]);

  return (
    <div id="group-container">
      <div className="group-form">
        <Form
          form={form}
          onFinish={searchGroup}
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

      <div className="group-table">
        <Table
          columns={columns}
          dataSource={groupResult}
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}
