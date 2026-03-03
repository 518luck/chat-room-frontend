import { Button, Form, Input, Table, message, type TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { chatroomList } from "@/interfaces";
import axios from "axios";
import { MembersModal } from "./MembersModal";
import { useNavigate } from "react-router-dom";
import { AddMemberModal } from "./AddMemberModal";
import { CreateGroupModal } from "./CreateGroupModal";

interface SearchGroup {
  name: string;
}

interface GroupSearchResult {
  id: number;
  name: string;
  type: boolean;
  userCount: number;
  createTime: Date;
}

export function Group() {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);
  const [chatroomId, setChatroomId] = useState<number>(-1);
  const [isMemberAddModalOpen, setMemberAddModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const navigate = useNavigate();

  const columns: TableProps<GroupSearchResult>["columns"] = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "人数",
        dataIndex: "userCount",
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
            <a
              href=""
              onClick={() => {
                navigate("/chat", {
                  state: {
                    chatroomId: record.id,
                  },
                });
              }}
            >
              聊天
            </a>

            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id);
                setMembersModalOpen(true);
              }}
            >
              详情
            </a>
            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id);
                setMemberAddModalOpen(true);
              }}
            >
              添加成员
            </a>
          </div>
        ),
      },
    ],
    [navigate],
  );

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || ""); // 1. 调用接口获取所有房间

      setGroupResult(
        res.data
          .filter((item: GroupSearchResult) => {
            return item.type === true; // 2. 【核心】只保留类型为“群聊”的房间
          })
          .map((item: GroupSearchResult) => {
            return {
              ...item,
              key: item.id, // 3. 为 AntD 表格增加必要的 key
            };
          }),
      );

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
  const [queryKey, setQueryKey] = useState("");
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

          <Form.Item label=" ">
            <Button
              type="primary"
              style={{ background: "green" }}
              onClick={() => setCreateGroupModalOpen(true)}
            >
              创建群聊
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
      <MembersModal
        isOpen={isMembersModalOpen}
        handleClose={() => {
          setMembersModalOpen(false);
        }}
        chatroomId={chatroomId}
        queryKey={queryKey}
      />
      <AddMemberModal
        isOpen={isMemberAddModalOpen}
        handleClose={() => {
          setMemberAddModalOpen(false);
          setQueryKey(Math.random().toString().slice(2, 10));
        }}
        chatroomId={chatroomId}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        handleClose={() => {
          setCreateGroupModalOpen(false);
          setQueryKey(Math.random().toString().slice(2, 10));
          searchGroup({
            name: form.getFieldValue("name"),
          });
        }}
      />
    </div>
  );
}
