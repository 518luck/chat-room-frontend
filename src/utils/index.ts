import type { User } from "@/pages/Notification";

// 获取用户信息
export function getUserInfo(): User {
  return JSON.parse(localStorage.getItem("userInfo")!);
}
