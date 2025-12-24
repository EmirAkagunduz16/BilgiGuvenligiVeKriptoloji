import { aesCipher } from "../lib/encryptions/aesCipher";
import { caeserCipher, caeserDecipher } from "../lib/encryptions/caeserCipher";
import { columnarCipher, columnarDecipher } from "../lib/encryptions/columnarCipher";
import { desCipher } from "../lib/encryptions/desCipher";
import { hillCipher, hillDecipher } from "../lib/encryptions/hillCipher";
import { pigpenCipher, pigpenDecipher } from "../lib/encryptions/pigpenCipher";
import { playfairCipher, playfairDecipher } from "../lib/encryptions/playfairCipher";
import { polybiusCipher, polybiusDecipher } from "../lib/encryptions/polybiusCipher";
import { railfenceCipher, railfenceDecipher } from "../lib/encryptions/railfenceCipher";
import { routeCipher, routeDecipher } from "../lib/encryptions/routeCipher";
import { substitutionCipher, substitutionDecipher } from "../lib/encryptions/substitutionCipher";
import { vigenereCipher, vigenereDecipher } from "../lib/encryptions/vigenereCipher";

export const encryptController = async (
  method: string,
  message: string,
  key: string | number | null
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
        return aesCipher(message, String(key));
      case "des":
        return desCipher(message, String(key));
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    throw new Error("Error encrypting message");
  }
};

export const decryptController = async (
  method: string,
  message: string,
  key: string | number | null
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
        return aesCipher(message, String(key)); // AES kendi decrypt'ini içeriyor olabilir
      case "des":
        return desCipher(message, String(key)); // DES kendi decrypt'ini içeriyor olabilir
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
  key: string | number
) => {
  const encryptedMessage = await encryptController(method, message, key);
  return { encryptedMessage };
};

export const decryptMessage = async (
  method: string,
  message: string,
  key: string | number
) => {
  const decryptedMessage = await decryptController(method, message, key);
  return { decryptedMessage };
};
