import { lowercaseAlphabet, uppercaseAlphabet } from "../constants/alphabet";

const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

export const vigenereCipher = (message: string, key: string): string => {
  if (!key) throw new Error("Key is required for Vigenere cipher");

  const cleanKey = key
    .split("")
    .filter((c) => /[a-zA-Z]/.test(c))
    .join("")
    .toLowerCase();

  if (cleanKey.length === 0) {
    throw new Error("Vigenere key must contain at least one letter");
  }

  let result = "";
  let keyIndex = 0;
  const normalizedKey = cleanKey;

  for (let i = 0; i < message.length; i++) {
    let char = message[i];
    char = normalizeChar(char);

    if (uppercaseAlphabet.includes(char)) {
      const charIndex = uppercaseAlphabet.indexOf(char);
      const keyChar = normalizedKey[keyIndex % normalizedKey.length];
      const keyShift = lowercaseAlphabet.indexOf(keyChar);
      const newIndex = (charIndex + keyShift) % 26;
      result += uppercaseAlphabet[newIndex];
      keyIndex++;
    } else if (lowercaseAlphabet.includes(char)) {
      const charIndex = lowercaseAlphabet.indexOf(char);
      const keyChar = normalizedKey[keyIndex % normalizedKey.length];
      const keyShift = lowercaseAlphabet.indexOf(keyChar);
      const newIndex = (charIndex + keyShift) % 26;
      result += lowercaseAlphabet[newIndex];
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
};

export const vigenereDecipher = (message: string, key: string): string => {
  if (!key) throw new Error("Key is required for Vigenere cipher");

  const cleanKey = key
    .split("")
    .filter((c) => /[a-zA-Z]/.test(c))
    .join("")
    .toLowerCase();

  if (cleanKey.length === 0) {
    throw new Error("Vigenere key must contain at least one letter");
  }

  let result = "";
  let keyIndex = 0;
  const normalizedKey = cleanKey;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    if (uppercaseAlphabet.includes(char)) {
      const charIndex = uppercaseAlphabet.indexOf(char);
      const keyChar = normalizedKey[keyIndex % normalizedKey.length];
      const keyShift = lowercaseAlphabet.indexOf(keyChar);
      const newIndex = ((charIndex - keyShift) % 26 + 26) % 26;
      result += uppercaseAlphabet[newIndex];
      keyIndex++;
    } else if (lowercaseAlphabet.includes(char)) {
      const charIndex = lowercaseAlphabet.indexOf(char);
      const keyChar = normalizedKey[keyIndex % normalizedKey.length];
      const keyShift = lowercaseAlphabet.indexOf(keyChar);
      const newIndex = ((charIndex - keyShift) % 26 + 26) % 26;
      result += lowercaseAlphabet[newIndex];
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
};
