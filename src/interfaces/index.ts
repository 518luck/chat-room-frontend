import type { RegisterUser } from "@/pages/Register";
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
