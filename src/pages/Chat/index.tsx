import { Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
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

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: Message;
    }
  | {
      type: "joinRoom";
      userId: number;
    };

export function Chat() {
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    try {
      //这里的 io 是 Socket.io-client 库导出的核心函数。它的作用是初始化并建立一个客户端与服务器之间的实时、双向、基于事件的通信连接。
      const socket = (socketRef.current = io("http://localhost:3005"));

      //socket.on("connect", ...)：这是一个“钩子”，只有当网络连通、握手成功后，才会执行内部的加入房间（joinRoom）操作。
      socket.on("connect", function () {
        const payload: JoinRoomPayload = {
          chatroomId: 1,
          userId: 1,
        };

        socket.emit("joinRoom", payload);

        socket.on("message", (reply: Reply) => {
          if (reply.type === "joinRoom") {
            setMessageList((messageList) => [
              ...messageList,
              {
                type: "text",
                content: "用户 " + reply.userId + "加入聊天室",
              },
            ]);
          } else {
            setMessageList((messageList) => [...messageList, reply.message]);
          }
        });
      });
    } catch (error) {
      message.error("连接服务器失败，请稍后再试");
      console.log(error);
    }
  }, []);

  function sendMessage(value: string) {
    const payload2: SendMessagePayload = {
      sendUserId: 1,
      chatroomId: 1,
      message: {
        type: "text",
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload2);
  }

  return (
    <div>
      <Input
        onBlur={(e) => {
          sendMessage(e.target.value);
        }}
      />
      <div>
        {messageList.map((item) => {
          return (
            <div>
              {item.type === "image" ? (
                <img src={item.content} />
              ) : (
                item.content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
