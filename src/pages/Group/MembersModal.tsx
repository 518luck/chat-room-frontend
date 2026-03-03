import { message, Modal, Table } from "antd";
import { type TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { groupMembers } from "@/interfaces";
import axios from "axios";

export interface MembersModalProps {
  isOpen: boolean;
  chatroomId: number;
  handleClose: () => void;
}

interface User {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
}

export function MembersModal({
  isOpen,
  chatroomId,
  handleClose,
}: MembersModalProps) {
  const [members, setMembers] = useState<Array<User>>();

  // 查询群聊成员
  const queryMembers = async () => {
    try {
      const res = await groupMembers(chatroomId);

      if (res.status === 201 || res.status === 200) {
        setMembers(
          res.data.map((item: User) => {
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
          e.response?.data?.message || "创建聊天房间失败，请重试";
        message.error(errorMsg);
      } else {
        // 处理非网络请求错误
        message.error("系统繁忙，请稍后再试");
      }
    }
  };

  useEffect(() => {
    console.log("触发");

    const res = () => queryMembers();
    res();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  const columns: TableProps<User>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickName",
    },
    {
      title: "头像",
      dataIndex: "headPic",
      render: (_, record) => (
        <div>
          <img src={record.headPic} width={50} height={50} />
        </div>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
  ];

  return (
    <Modal
      title="群聊成员"
      open={isOpen}
      onCancel={() => handleClose()}
      onOk={() => handleClose()}
      width={1000}
    >
      <Table columns={columns} dataSource={members} pagination={false} />
    </Modal>
  );
}
