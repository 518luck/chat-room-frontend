import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, type UploadProps } from "antd";
import axios from "axios";
import { presignedUrl } from "@/interfaces";

const { Dragger } = Upload;

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ImageUpload(props: ImageUploadProps) {
  const UploadProps: UploadProps = {
    // 发送到后台的文件参数名,后端通过 req.file 或者file接收
    name: "file",
    // 后端上传的接口地址
    action: async (file) => {
      const res = await presignedUrl(file.name);
      return res.data;
    },
    // 自定义上传请求
    async customRequest(options) {
      const { onSuccess, file, action } = options;

      const res = await axios.put(action, file);

      //反馈阶段 (onChange)：一旦你执行了 onSuccess，onChange 就会捕捉到 status === "done"。
      onSuccess!(res.data);
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        props.onChange?.("http://localhost:9000/chat-room/" + info.file.name);
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === "error") {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const dragger = (
    <Dragger {...UploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>

      <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
    </Dragger>
  );

  return props?.value ? (
    <div>
      <img src={props.value} alt="图片" width="100" height="100" />
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  );
}
