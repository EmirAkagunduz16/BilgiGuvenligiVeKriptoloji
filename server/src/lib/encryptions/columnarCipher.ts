export const columnarCipher = (message: string, key: number): string => {
  // Key = sütun sayısı
  if (key <= 0) throw new Error("Key must be positive");

  const cleanMessage = message.replace(/\s/g, "");
  const rows = Math.ceil(cleanMessage.length / key);
  const grid: string[][] = [];

  // Matrisi doldur
  let index = 0;
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < key; c++) {
      if (index < cleanMessage.length) {
        grid[r][c] = cleanMessage[index++];
      } else {
        grid[r][c] = "X"; // Padding
      }
    }
  }

  // Sütunları oku
  let result = "";
  for (let c = 0; c < key; c++) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][c];
    }
  }

  return result;
};

export const columnarDecipher = (message: string, key: number): string => {
  if (key <= 0) throw new Error("Key must be positive");

  const rows = Math.ceil(message.length / key);
  const grid: string[][] = Array.from({ length: rows }, () => []);

  // Sütun sütun yerleştir
  let index = 0;
  for (let c = 0; c < key; c++) {
    for (let r = 0; r < rows; r++) {
      if (index < message.length) {
        grid[r][c] = message[index++];
      }
    }
  }

  // Satır satır oku
  let result = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < key; c++) {
      if (grid[r][c]) {
        result += grid[r][c];
      }
    }
  }

  return result.replace(/X+$/, ""); // Padding'i kaldır
};
