const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

export const polybiusCipher = (message: string, key: string): string => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  
  let result = "";
  
  for (let i = 0; i < message.length; i++) {
    let char = message[i].toUpperCase();
    char = normalizeChar(char);
    
    if (char === "J") char = "I";
    
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      const row = Math.floor(index / 5) + 1;
      const col = (index % 5) + 1;
      result += `${row}${col}`;
    } else {
      result += char;
    }
  }
  
  return result;
};

export const polybiusDecipher = (message: string, key: string): string => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  let result = "";
  
  for (let i = 0; i < message.length; i += 2) {
    const pair = message.slice(i, i + 2);
    
    if (/^\d{2}$/.test(pair)) {
      const row = parseInt(pair[0]) - 1;
      const col = parseInt(pair[1]) - 1;
      const index = row * 5 + col;
      
      if (index >= 0 && index < alphabet.length) {
        result += alphabet[index];
      }
    } else {
      result += pair;
    }
  }
  
  return result;
};
