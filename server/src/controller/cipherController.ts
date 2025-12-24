import {
  aesEncrypt,
  aesDecrypt,
  aesEncryptManual,
  aesDecryptManual,
} from "../lib/encryptions/aes";
import {
  desEncrypt,
  desDecrypt,
  desEncryptManual,
  desDecryptManual,
} from "../lib/encryptions/des";
import {
  getServerPublicKey,
  serverHybridEncrypt,
  serverHybridDecrypt,
  type HybridEncryptionResult,
} from "../lib/encryptions/rsa";
import { caeserCipher, caeserDecipher } from "../lib/encryptions/caeserCipher";
import { columnarCipher, columnarDecipher } from "../lib/encryptions/columnarCipher";
import { hillCipher, hillDecipher } from "../lib/encryptions/hillCipher";
import { pigpenCipher, pigpenDecipher } from "../lib/encryptions/pigpenCipher";
import { playfairCipher, playfairDecipher } from "../lib/encryptions/playfairCipher";
import { polybiusCipher, polybiusDecipher } from "../lib/encryptions/polybiusCipher";
import { railfenceCipher, railfenceDecipher } from "../lib/encryptions/railfenceCipher";
import { routeCipher, routeDecipher } from "../lib/encryptions/routeCipher";
import { substitutionCipher, substitutionDecipher } from "../lib/encryptions/substitutionCipher";
import { vigenereCipher, vigenereDecipher } from "../lib/encryptions/vigenereCipher";

/**
 * Şifreleme controller'ı
 * @param method - Şifreleme metodu
 * @param message - Şifrelenecek mesaj
 * @param key - Anahtar
 * @param useLibrary - true: kütüphane, false: manuel (sadece AES/DES için)
 */
export const encryptController = async (
  method: string,
  message: string,
  key: string | number | null,
  useLibrary: boolean = true
) => {
  if (!key || key === null || key === undefined) {
    throw new Error("Key is required");
  }

  try {
    switch (method) {
      case "caeser":
        return caeserCipher(message, Number(key));
      case "substitution":
        return substitutionCipher(message, String(key));
      case "railfence":
        return railfenceCipher(message, Number(key));
      case "playfair":
        return playfairCipher(message, String(key));
      case "route":
        return routeCipher(message, Number(key));
      case "columnar":
        return columnarCipher(message, Number(key));
      case "polybius":
        return polybiusCipher(message, String(key));
      case "pigpen":
        return pigpenCipher(message, String(key));
      case "hill":
        return hillCipher(message, String(key));
      case "vigenere":
        return vigenereCipher(message, String(key));
      case "aes":
        // useLibrary parametresine göre kütüphane veya manuel kullan
        return useLibrary 
          ? aesEncrypt(message, String(key))
          : aesEncryptManual(message, String(key));
      case "des":
        return useLibrary 
          ? desEncrypt(message, String(key))
          : desEncryptManual(message, String(key));
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    throw new Error("Error encrypting message");
  }
};

/**
 * Deşifreleme controller'ı
 * @param method - Şifreleme metodu
 * @param message - Şifreli mesaj
 * @param key - Anahtar
 * @param useLibrary - true: kütüphane, false: manuel (sadece AES/DES için)
 */
export const decryptController = async (
  method: string,
  message: string,
  key: string | number | null,
  useLibrary: boolean = true
) => {
  if (!key || key === null || key === undefined) {
    throw new Error("Key is required");
  }

  try {
    switch (method) {
      case "caeser":
        return caeserDecipher(message, Number(key));
      case "substitution":
        return substitutionDecipher(message, String(key));
      case "railfence":
        return railfenceDecipher(message, Number(key));
      case "playfair":
        return playfairDecipher(message, String(key));
      case "route":
        return routeDecipher(message, Number(key));
      case "columnar":
        return columnarDecipher(message, Number(key));
      case "polybius":
        return polybiusDecipher(message, String(key));
      case "pigpen":
        return pigpenDecipher(message, String(key));
      case "hill":
        return hillDecipher(message, String(key));
      case "vigenere":
        return vigenereDecipher(message, String(key));
      case "aes":
        return useLibrary 
          ? aesDecrypt(message, String(key))
          : aesDecryptManual(message, String(key));
      case "des":
        return useLibrary 
          ? desDecrypt(message, String(key))
          : desDecryptManual(message, String(key));
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    throw new Error("Error decrypting message");
  }
};

export const encryptMessage = async (
  method: string,
  message: string,
  key: string | number,
  useLibrary: boolean = true
) => {
  const encryptedMessage = await encryptController(method, message, key, useLibrary);
  return { encryptedMessage, useLibrary };
};

export const decryptMessage = async (
  method: string,
  message: string,
  key: string | number,
  useLibrary: boolean = true
) => {
  const decryptedMessage = await decryptController(method, message, key, useLibrary);
  return { decryptedMessage };
};

// ==========================================
// RSA HİBRİT ŞİFRELEME FONKSİYONLARI
// ==========================================

/**
 * Sunucunun RSA public key'ini döndür
 */
export const getRSAPublicKey = () => {
  return { publicKey: getServerPublicKey() };
};

/**
 * Hibrit şifreleme (RSA + AES/DES)
 * - RSA ile simetrik anahtar şifrelenir
 * - AES/DES ile mesaj şifrelenir
 */
export const hybridEncryptMessage = async (
  message: string,
  algorithm: "aes" | "des" = "aes"
): Promise<HybridEncryptionResult> => {
  try {
    return serverHybridEncrypt(message, algorithm);
  } catch (error) {
    throw new Error("Error in hybrid encryption");
  }
};

/**
 * Hibrit deşifreleme (RSA + AES/DES)
 */
export const hybridDecryptMessage = async (
  encryptedData: HybridEncryptionResult
): Promise<{ decryptedMessage: string }> => {
  try {
    const decryptedMessage = serverHybridDecrypt(encryptedData);
    return { decryptedMessage };
  } catch (error) {
    throw new Error("Error in hybrid decryption");
  }
};
