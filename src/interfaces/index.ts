import type { RegisterUser } from "@/pages/Register";
import type { UpdatePassword } from "@/pages/UpdatePassword";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3005,
});

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
