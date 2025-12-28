import { aesEncrypt, aesDecrypt } from "../aes";
import { desEncrypt, desDecrypt } from "../des";
import {
  rsaEncrypt,
  rsaDecrypt,
  generateSymmetricKey,
  getServerKeyPair,
  HybridEncryptionResult,
} from "./library";


export const hybridEncrypt = (
  message: string,
  publicKey: string,
  algorithm: "aes" | "des" = "aes"
): HybridEncryptionResult => {
  const symmetricKey = generateSymmetricKey(algorithm);

  let encryptedMessage: string;
  if (algorithm === "aes") {
    encryptedMessage = aesEncrypt(message, symmetricKey);
  } else {
    encryptedMessage = desEncrypt(message, symmetricKey);
  }

  const encryptedKey = rsaEncrypt(symmetricKey, publicKey);

  return {
    encryptedKey,
    encryptedMessage,
    algorithm,
  };
};

export const hybridDecrypt = (
  encryptedData: HybridEncryptionResult,
  privateKey: string
): string => {
  const symmetricKey = rsaDecrypt(encryptedData.encryptedKey, privateKey);

  if (encryptedData.algorithm === "aes") {
    return aesDecrypt(encryptedData.encryptedMessage, symmetricKey);
  } else {
    return desDecrypt(encryptedData.encryptedMessage, symmetricKey);
  }
};

export const serverHybridEncrypt = (
  message: string,
  algorithm: "aes" | "des" = "aes"
): HybridEncryptionResult => {
  const { publicKey } = getServerKeyPair();
  return hybridEncrypt(message, publicKey, algorithm);
};

export const serverHybridDecrypt = (
  encryptedData: HybridEncryptionResult
): string => {
  const { privateKey } = getServerKeyPair();
  return hybridDecrypt(encryptedData, privateKey);
};
