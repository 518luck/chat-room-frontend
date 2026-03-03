import type { AddFriend } from "@/pages/Friendship/AddFriendModal";
import type { RegisterUser } from "@/pages/Register";
import type { UserInfo } from "@/pages/UpdateInfo";
import type { UpdatePassword } from "@/pages/UpdatePassword";
import { message } from "antd";
import axios from "axios";

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3005,
});

// 请求拦截器
axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("token");

  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const { data } = error.response;
    if (data.statusCode === 401) {
      message.error(data.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      return Promise.reject(error);
    }
  },
);

// 登录
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

// 注册验证码
export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

// 注册
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

// 更新密码验证码
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

// 更新密码
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/update_password", data);
}

// 查询用户详情
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

// 更新用户信息
export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/update", data);
}

// 获取更新用户信息验证码
export async function updateUserInfoCaptcha(email: string) {
  return await axiosInstance.get("/user/update/captcha", {
    params: {
      address: email,
    },
  });
}

// 获取预签名上传 URL
export async function presignedUrl(fileName: string) {
  return axiosInstance.get(`/minio/presignedUrl?name=${fileName}`);
}

// 获取用户好友关系
export async function friendshipList(name?: string) {
  return axiosInstance.get(`/friendship/list?name=${name || ""}`);
}

// 查看所有群聊
export async function chatroomList(name?: string) {
  return axiosInstance.get(`/chatroom/list?name=${name}`);
}

// 添加好友
export async function friendAdd(data: AddFriend) {
  return axiosInstance.post("/friendship/add", data);
}

// 获取好友申请列表
export async function friendRequestList() {
  return axiosInstance.get("/friendship/request_list");
}

// 同意好友请求
export async function agreeFriendRequest(id: number) {
  return axiosInstance.get(`/friendship/agree/${id}`);
}

// 拒绝好友请求
export async function rejectFriendRequest(id: number) {
  return axiosInstance.get(`/friendship/reject/${id}`);
}

// 获取群聊历史消息
export async function chatHistoryList(id: number) {
  return axiosInstance.get(`/chat-history/list?chatroomId=${id}`);
}

// 查找或创建1对1聊天房间
export async function findChatroom(userId1: number, userId2: number) {
  return axiosInstance.get(`/chatroom/findChatroom`, {
    params: {
      userId1,
      userId2,
    },
  });
}

// 创建1对1聊天房间
export async function createOneToOne(friendId: number) {
  return axiosInstance.get(`/chatroom/create-one-to-one`, {
    params: {
      friendId,
    },
  });
}

// 获取群聊成员
export async function groupMembers(chatroomId: number) {
  return axiosInstance.get(`/chatroom/members`, {
    params: {
      chatroomId,
    },
  });
}

// 加入群聊
export async function addMember(chatroomId: number, joinUsername: string) {
  return axiosInstance.get(`/chatroom/join/${chatroomId}`, {
    params: {
      joinUsername,
    },
  });
}

// 创建群聊
export async function createGroup(name: string) {
  return axiosInstance.get(`/chatroom/create-group`, {
    params: {
      name,
    },
  });
}
