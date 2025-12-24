import { aesEncrypt, aesDecrypt } from "../aes";
import { desEncrypt, desDecrypt } from "../des";
import {
  rsaEncrypt,
  rsaDecrypt,
  generateSymmetricKey,
  getServerKeyPair,
  HybridEncryptionResult,
} from "./library";

/**
 * Hibrit Şifreleme (RSA + AES/DES)
 * 
 * Çalışma prensibi:
 * 1. Rastgele bir simetrik anahtar oluştur
 * 2. Mesajı simetrik algoritma (AES/DES) ile şifrele
 * 3. Simetrik anahtarı RSA public key ile şifrele
 * 4. Her ikisini de gönder
 */
export const hybridEncrypt = (
  message: string,
  publicKey: string,
  algorithm: "aes" | "des" = "aes"
): HybridEncryptionResult => {
  // 1. Rastgele simetrik anahtar oluştur
  const symmetricKey = generateSymmetricKey(algorithm);

  // 2. Mesajı simetrik algoritma ile şifrele
  let encryptedMessage: string;
  if (algorithm === "aes") {
    encryptedMessage = aesEncrypt(message, symmetricKey);
  } else {
    encryptedMessage = desEncrypt(message, symmetricKey);
  }

  // 3. Simetrik anahtarı RSA ile şifrele
  const encryptedKey = rsaEncrypt(symmetricKey, publicKey);

  return {
    encryptedKey,
    encryptedMessage,
    algorithm,
  };
};

/**
 * Hibrit Deşifreleme (RSA + AES/DES)
 * 
 * Çalışma prensibi:
 * 1. RSA private key ile simetrik anahtarı çöz
 * 2. Simetrik anahtar ile mesajı çöz
 */
export const hybridDecrypt = (
  encryptedData: HybridEncryptionResult,
  privateKey: string
): string => {
  // 1. RSA ile simetrik anahtarı çöz
  const symmetricKey = rsaDecrypt(encryptedData.encryptedKey, privateKey);

  // 2. Simetrik algoritma ile mesajı çöz
  if (encryptedData.algorithm === "aes") {
    return aesDecrypt(encryptedData.encryptedMessage, symmetricKey);
  } else {
    return desDecrypt(encryptedData.encryptedMessage, symmetricKey);
  }
};

/**
 * Sunucu tarafında hibrit şifreleme (sunucunun public key'i ile)
 */
export const serverHybridEncrypt = (
  message: string,
  algorithm: "aes" | "des" = "aes"
): HybridEncryptionResult => {
  const { publicKey } = getServerKeyPair();
  return hybridEncrypt(message, publicKey, algorithm);
};

/**
 * Sunucu tarafında hibrit deşifreleme (sunucunun private key'i ile)
 */
export const serverHybridDecrypt = (
  encryptedData: HybridEncryptionResult
): string => {
  const { privateKey } = getServerKeyPair();
  return hybridDecrypt(encryptedData, privateKey);
};
