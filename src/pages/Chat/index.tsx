import { Button, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./index.scss";
import type { UserInfo } from "@/pages/UpdateInfo";
import axios from "axios";
import { chatHistoryList, chatroomList } from "@/interfaces";
import { getUserInfo } from "@/utils";
import { useLocation } from "react-router-dom";
const { TextArea } = Input;

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface Chatroom {
  id: number;
  name: string;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: Message;
}

interface Message {
  type: "text" | "image";
  content: string;
}

interface ChatHistory {
  id: number;
  content: string;
  type: number;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: UserInfo;
}

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: ChatHistory;
    }
  | {
      type: "joinRoom";
      userId: number;
    };

export function Chat() {
  const [roomList, setRoomList] = useState<Array<Chatroom>>([]); // 群聊列表
  const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>([]); // 群聊历史记录
  const [roomId, setChatRoomId] = useState<number>(0); // 当前群聊id
  const [inputText, setInputText] = useState("");
  const userInfo = getUserInfo();
  const location = useLocation();

  useEffect(() => {
    const res = () => setChatRoomId(location.state?.chatroomId);
    res();
  }, [location.state?.chatroomId]);

  // 查询所有群聊
  async function queryChatroomList() {
    try {
      const res = await chatroomList();

      if (res.status === 201 || res.status === 200) {
        setRoomList(
          res.data.map((item: Chatroom) => {
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
  }

  // 查询群聊历史记录
  async function queryChatHistoryList(chatroomId: number) {
    try {
      const res = await chatHistoryList(chatroomId);

      if (res.status === 201 || res.status === 200) {
        setChatHistory(
          res.data.map((item: Chatroom) => {
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
  }

  // 组件挂载时查询群聊列表
  useEffect(() => {
    const res = () => queryChatroomList();
    res();
  }, []);

  const socketRef = useRef<Socket>(null);

  // 组件挂载时初始化 socket 连接
  useEffect(() => {
    if (!roomId) {
      return;
    }

    const socket = (socketRef.current = io("http://localhost:3005"));
    try {
      //这里的 io 是 Socket.io-client 库导出的核心函数。它的作用是初始化并建立一个客户端与服务器之间的实时、双向、基于事件的通信连接。
      // const socket = (socketRef.current = io("http://localhost:3005"));

      //socket.on("connect", ...)：这是一个“钩子”，只有当网络连通、握手成功后，才会执行内部的加入房间（joinRoom）操作。
      socket.on("connect", async function () {
        const payload: JoinRoomPayload = {
          chatroomId: roomId,
          userId: getUserInfo().id,
        };

        socket.emit("joinRoom", payload);

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        socket.on("message", (reply: Reply) => {
          if (reply.type === "sendMessage") {
            setChatHistory((chatHistory) => {
              return chatHistory
                ? [...chatHistory, reply.message]
                : [reply.message];
            });
            setTimeout(() => {
              document
                .getElementById("bottom-bar")
                ?.scrollIntoView({ block: "end" });
            }, 300);
          }
          setTimeout(() => {
            document
              .getElementById("bottom-bar")
              ?.scrollIntoView({ block: "end" });
          }, 300);
        });
      });
    } catch (error) {
      message.error("连接服务器失败，请稍后再试");
      console.log(error);
    }

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // 发送消息
  async function sendMessage(value: string) {
    if (!value) {
      return;
    }
    if (!roomId) {
      return;
    }
    const payload2: SendMessagePayload = {
      sendUserId: getUserInfo().id,
      chatroomId: roomId,
      message: {
        type: "text",
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload2);
  }

  return (
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div
              className={`chat-room-item ${item.id === roomId ? "selected" : ""}`}
              data-id={item.id}
              key={item.id}
              onClick={() => {
                queryChatHistoryList(item.id);
                setChatRoomId(item.id);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>

      <div className="message-list">
        {chatHistory?.map((item) => {
          return (
            <div
              className={`message-item ${item.senderId === userInfo.id ? "from-me" : ""}`}
              data-id={item.id}
              key={item.id}
            >
              <div className="message-sender">
                <img src={item.sender.headPic} />
                <span className="sender-nickname">{item.sender.nickName}</span>
              </div>

              <div className="message-content">{item.content}</div>
            </div>
          );
        })}
        {/* 自动滚动 */}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>

      <div className="message-input">
        <div className="message-type">
          <div className="message-type-itme">表情</div>
          <div className="message-type-itme">图片</div>
          <div className="message-type-itme">文本</div>
        </div>

        <div className="message-input-area">
          <TextArea
            className="message-input-box"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <Button
            className="message-send-btn"
            type="primary"
            onClick={() => {
              sendMessage(inputText);
              setInputText("");
            }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
