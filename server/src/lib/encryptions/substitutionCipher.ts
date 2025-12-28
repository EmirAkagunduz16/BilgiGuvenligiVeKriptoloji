import { lowercaseAlphabet, uppercaseAlphabet } from "../constants/alphabet";

const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

export const substitutionCipher = (message: string, key: string): string => {
  if (key.length !== 26) {
    throw new Error("Substitution key must be 26 characters long");
  }

  let result = "";
  const keyLower = key.toLowerCase();
  const keyUpper = key.toUpperCase();

  for (let i = 0; i < message.length; i++) {
    let char = message[i];
    char = normalizeChar(char);

    if (uppercaseAlphabet.includes(char)) {
      const index = uppercaseAlphabet.indexOf(char);
      result += keyUpper[index];
    } else if (lowercaseAlphabet.includes(char)) {
      const index = lowercaseAlphabet.indexOf(char);
      result += keyLower[index];
    } else {
      result += char;
    }
  }

  return result;
};

export const substitutionDecipher = (message: string, key: string): string => {
  if (key.length !== 26) {
    throw new Error("Substitution key must be 26 characters long");
  }

  let result = "";
  const keyLower = key.toLowerCase();
  const keyUpper = key.toUpperCase();

  for (let i = 0; i < message.length; i++) {
    const char = message[i];

    if (keyUpper.includes(char)) {
      const index = keyUpper.indexOf(char);
      result += uppercaseAlphabet[index];
    } else if (keyLower.includes(char)) {
      const index = keyLower.indexOf(char);
      result += lowercaseAlphabet[index];
    } else {
      result += char;
    }
  }

  return result;
};
