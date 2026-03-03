import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { addMember } from "@/interfaces";
import axios from "axios";

interface AddMemberModalProps {
  chatroomId: number;
  isOpen: boolean;
  handleClose: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface AddMember {
  username: string;
}

export function AddMemberModal(props: AddMemberModalProps) {
  const [form] = useForm<AddMember>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await addMember(values.username);

      if (res.status === 201 || res.status === 200) {
        message.success("成员添加成功");
        form.resetFields();
        props.handleClose();
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

  return (
    <Modal
      title="添加成员"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={"添加"}
      cancelText={"取消"}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
