import axios from "axios";
import axiosInstance from "./axios";

export async function register(formData: FormData) {
  try {
    const response = await axiosInstance.post(`/user/register`, formData);
    return response.data;
  } catch (error : any) {
    return error.message;
  }
}

export async function verifyCode(data: { email: string; code: string }) {
  try {
    const response = await axiosInstance.post(`/user/verify-code`, data);
    return response.data;
  } catch (error : any) {
    return error.message;
  }
}

export async function login(formData: FormData) {
  try {
    const response = await axiosInstance.post(`/user/login`, formData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  } catch (error : any) {
    return error.message;
  }
}
