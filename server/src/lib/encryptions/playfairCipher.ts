// Türkçe karakterleri İngilizce karşılıklarına çevir
const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

const generatePlayfairMatrix = (key: string): string[][] => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J yok, I/J aynı
  const keyUpper = key
    .toUpperCase()
    .split("")
    .map(normalizeChar)
    .filter((c) => alphabet.includes(c))
    .join("");
  
  const used = new Set<string>();
  let matrixStr = "";

  // Önce key karakterlerini ekle
  for (const char of keyUpper) {
    if (!used.has(char)) {
      matrixStr += char;
      used.add(char);
    }
  }

  // Sonra alfabenin kalanını ekle
  for (const char of alphabet) {
    if (!used.has(char)) {
      matrixStr += char;
      used.add(char);
    }
  }

  // 5x5 matris oluştur
  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(matrixStr.slice(i * 5, (i + 1) * 5).split(""));
  }

  return matrix;
};

const findPosition = (matrix: string[][], char: string): [number, number] => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === char) {
        return [row, col];
      }
    }
  }
  return [0, 0];
};

const prepareText = (text: string): string => {
  let prepared = text
    .toUpperCase()
    .split("")
    .map(normalizeChar)
    .filter((c) => /[A-Z]/.test(c))
    .join("")
    .replace(/J/g, "I");

  // Çift harfleri ayır ve X ekle
  let result = "";
  for (let i = 0; i < prepared.length; i++) {
    result += prepared[i];
    if (i < prepared.length - 1 && prepared[i] === prepared[i + 1]) {
      result += "X";
    }
  }

  // Tek sayıda harf varsa son X ekle
  if (result.length % 2 !== 0) {
    result += "X";
  }

  return result;
};

export const playfairCipher = (message: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  const prepared = prepareText(message);
  let result = "";

  for (let i = 0; i < prepared.length; i += 2) {
    const char1 = prepared[i];
    const char2 = prepared[i + 1];

    const [row1, col1] = findPosition(matrix, char1);
    const [row2, col2] = findPosition(matrix, char2);

    if (row1 === row2) {
      // Aynı satır - sağa kaydır
      result += matrix[row1][(col1 + 1) % 5];
      result += matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
      // Aynı sütun - aşağı kaydır
      result += matrix[(row1 + 1) % 5][col1];
      result += matrix[(row2 + 1) % 5][col2];
    } else {
      // Dikdörtgen
      result += matrix[row1][col2];
      result += matrix[row2][col1];
    }
  }

  return result;
};

export const playfairDecipher = (message: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  let result = "";

  for (let i = 0; i < message.length; i += 2) {
    const char1 = message[i];
    const char2 = message[i + 1];

    const [row1, col1] = findPosition(matrix, char1);
    const [row2, col2] = findPosition(matrix, char2);

    if (row1 === row2) {
      // Aynı satır - sola kaydır
      result += matrix[row1][(col1 - 1 + 5) % 5];
      result += matrix[row2][(col2 - 1 + 5) % 5];
    } else if (col1 === col2) {
      // Aynı sütun - yukarı kaydır
      result += matrix[(row1 - 1 + 5) % 5][col1];
      result += matrix[(row2 - 1 + 5) % 5][col2];
    } else {
      // Dikdörtgen
      result += matrix[row1][col2];
      result += matrix[row2][col1];
    }
  }

  return result;
};
