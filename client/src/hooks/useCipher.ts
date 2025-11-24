import { useQuery } from "@tanstack/react-query";
import { encryptApi, decryptApi } from "../lib/api";
import type { EncryptionMethod } from "../types/encryption";

export const useEncrypt = (
  method: EncryptionMethod,
  message: string,
  key: string
) => {
  return useQuery({
    queryKey: ["encrypt"],
    queryFn: () => encryptApi(method, message, key),
  });
};

export const useDecrypt = (
  method: EncryptionMethod,
  encryptedMessage: string,
  key: string
) => {
  return useQuery({
    queryKey: ["decrypt", encryptedMessage, key],
    queryFn: () => decryptApi(method as EncryptionMethod, encryptedMessage, key),
  });
};
