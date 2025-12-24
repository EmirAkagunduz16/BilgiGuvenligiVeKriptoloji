import CryptoJS from "crypto-js";

/**
 * DES ile şifreleme (crypto-js kütüphanesi)
 * @param message - Şifrelenecek mesaj
 * @param key - 8 karakterlik anahtar
 * @returns Base64 formatında şifreli metin
 */
export const desEncrypt = (message: string, key: string): string => {
  // Anahtar 8 karakter olmalı, eksikse padding yap
  const paddedKey = key.padEnd(8, "0").slice(0, 8);
  const keyWordArray = CryptoJS.enc.Utf8.parse(paddedKey);
  const iv = CryptoJS.enc.Utf8.parse(paddedKey); // Basitlik için IV = key

  const encrypted = CryptoJS.DES.encrypt(message, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

/**
 * DES ile deşifreleme (crypto-js kütüphanesi)
 * @param encryptedMessage - Base64 formatında şifreli metin
 * @param key - 8 karakterlik anahtar
 * @returns Çözülmüş metin
 */
export const desDecrypt = (encryptedMessage: string, key: string): string => {
  const paddedKey = key.padEnd(8, "0").slice(0, 8);
  const keyWordArray = CryptoJS.enc.Utf8.parse(paddedKey);
  const iv = CryptoJS.enc.Utf8.parse(paddedKey);

  const decrypted = CryptoJS.DES.decrypt(encryptedMessage, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
