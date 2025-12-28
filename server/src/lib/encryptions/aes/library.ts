import CryptoJS from "crypto-js";

export const aesEncrypt = (message: string, key: string): string => {
  const paddedKey = key.padEnd(16, "0").slice(0, 16);
  const keyWordArray = CryptoJS.enc.Utf8.parse(paddedKey);
  const iv = CryptoJS.enc.Utf8.parse(paddedKey); // Basitlik için IV = key

  const encrypted = CryptoJS.AES.encrypt(message, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const aesDecrypt = (encryptedMessage: string, key: string): string => {
  const paddedKey = key.padEnd(16, "0").slice(0, 16);
  const keyWordArray = CryptoJS.enc.Utf8.parse(paddedKey);
  const iv = CryptoJS.enc.Utf8.parse(paddedKey);

  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
