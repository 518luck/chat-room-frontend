import { presignedUrl } from "@/interfaces";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import axios from "axios";

const { Dragger } = Upload;

interface HeadPicUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

// 执行顺序 action (异步函数)：调用接口获取临时上传地址（如 S3/MinIO 的 URL）
// -> customRequest (拦截器)：接管浏览器行为，用 axios.put 把文件推送到上一步拿到的 URL
// -> onSuccess (触发信号)：在 customRequest 内部手动调用，告诉组件“我传完了”
// -> onChange (状态回调)：监听到 status === 'done'，触发业务逻辑（如通知 Form 表单）
export function HeadPicUpload(props: HeadPicUploadProps) {
  const UploadProps: UploadProps = {
    //发送到后台的文件参数名。后端通过 req.file 或 file 字段接收。
    name: "file",
    //后端上传接口的地址。
    action: async (file) => {
      const res = await presignedUrl(file.name);
      return res.data;
    },

    //customRequest 是 Ant Design 提供的一个 “后门”，允许你接管所有的上传逻辑。
    async customRequest(options) {
      const { onSuccess, file, action } = options;

      const res = await axios.put(action, file);
      //反馈阶段 (onChange)：一旦你执行了 onSuccess，onChange 就会捕捉到 status === "done"。
      onSuccess!(res.data);
    },
    //这是 Antd Upload 内部的生命周期回调，当上传状态改变（开始、进度、成功、失败）时都会触发。
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

  //在 React 中，组件本质上是对象（由 React.createElement 生成），因此你可以像处理字符串或数字一样，把一段 UI 结构存入变量。
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
      <img src={props.value} alt="头像" width="100" height="100" />
      {/* react中可以直接用一个{}渲染出来一个组件实例,但是不能渲染函数 */}
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  );
}
