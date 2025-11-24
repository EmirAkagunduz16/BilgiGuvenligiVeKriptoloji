import { lowercaseAlphabet, uppercaseAlphabet } from "../constants/alphabet";

// Türkçe karakterleri İngilizce karşılıklarına çevir
const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

export const caeserCipher = (message: string, key: number): string => {
  let result = "";

  // JavaScript modulo bug fix: Negatif sayılar için doğru mod alma
  const safeMod = (n: number, m: number) => ((n % m) + m) % m;

  for (let i = 0; i < message.length; i++) {
    let char = message[i];
    
    // Türkçe karakteri normalize et
    char = normalizeChar(char);

    if (uppercaseAlphabet.includes(char)) {
      const index = uppercaseAlphabet.indexOf(char);
      const newIndex = safeMod(index + key, 26);
      result += uppercaseAlphabet[newIndex];
    } else if (lowercaseAlphabet.includes(char)) {
      const index = lowercaseAlphabet.indexOf(char);
      const newIndex = safeMod(index + key, 26);
      result += lowercaseAlphabet[newIndex];
    } else {
      // Harf değilse (boşluk, noktalama vb.)
      result += char;
    }
  }

  return result;
};

export const caeserDecipher = (message: string, key: number): string => {
  // Deşifreleme için negatif kaydırma kullan
  return caeserCipher(message, -key);
};
