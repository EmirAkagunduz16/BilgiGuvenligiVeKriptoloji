import type { EncryptionMethod } from "../types/encryption";
import { axiosInstance } from "./axios";

export const encryptApi = async (
  method: EncryptionMethod,
  message: string,
  key: string
) => {
  try {
    const response = await axiosInstance.post("/api/encrypt", {
      method: method.toLowerCase(),
      message,
      key,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cipher message");
  }
};

export const decryptApi = async (
  method: EncryptionMethod,
  message: string,
  key: string
) => {
  try {
    const response = await axiosInstance.post("/api/decrypt", {
      method: method.toLowerCase(),
      message,
      key,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decrypt message");
  }
};
  