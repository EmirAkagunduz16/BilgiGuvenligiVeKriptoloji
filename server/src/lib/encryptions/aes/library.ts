import CryptoJS from "crypto-js";

/**
 * AES-128 ile şifreleme (crypto-js kütüphanesi)
 * CBC modu, PKCS7 padding
 * @param message - Şifrelenecek mesaj
 * @param key - 16 karakterlik anahtar
 * @returns Base64 formatında şifreli metin
 */
export const aesEncrypt = (message: string, key: string): string => {
  // Anahtar 16 karakter olmalı, eksikse padding yap
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

/**
 * AES-128 ile deşifreleme (crypto-js kütüphanesi)
 * @param encryptedMessage - Base64 formatında şifreli metin
 * @param key - 16 karakterlik anahtar
 * @returns Çözülmüş metin
 */
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
