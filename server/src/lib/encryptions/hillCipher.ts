const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

export const hillCipher = (message: string, key: string): string => {
  const keyParts = key.split(",").map(Number);
  if (keyParts.length !== 4) {
    throw new Error("Hill cipher key must have 4 numbers (2x2 matrix)");
  }

  const [a, b, c, d] = keyParts;
  const cleanMessage = message
    .toUpperCase()
    .split("")
    .map(normalizeChar)
    .filter((ch) => /[A-Z]/.test(ch))
    .join("");

  const paddedMessage =
    cleanMessage.length % 2 === 0 ? cleanMessage : cleanMessage + "X";

  let result = "";

  for (let i = 0; i < paddedMessage.length; i += 2) {
    const x1 = paddedMessage.charCodeAt(i) - 65;
    const x2 = paddedMessage.charCodeAt(i + 1) - 65;

    const y1 = (a * x1 + b * x2) % 26;
    const y2 = (c * x1 + d * x2) % 26;

    result += String.fromCharCode(y1 + 65);
    result += String.fromCharCode(y2 + 65);
  }

  return result;
};

const modInverse = (a: number, m: number): number => {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
};

export const hillDecipher = (message: string, key: string): string => {
  const keyParts = key.split(",").map(Number);
  if (keyParts.length !== 4) {
    throw new Error("Hill cipher key must have 4 numbers (2x2 matrix)");
  }

  const [a, b, c, d] = keyParts;

  const det = (a * d - b * c) % 26;
  const detInv = modInverse((det + 26) % 26, 26);

  const invA = ((d * detInv) % 26 + 26) % 26;
  const invB = ((-b * detInv) % 26 + 26) % 26;
  const invC = ((-c * detInv) % 26 + 26) % 26;
  const invD = ((a * detInv) % 26 + 26) % 26;

  let result = "";

  for (let i = 0; i < message.length; i += 2) {
    const y1 = message.charCodeAt(i) - 65;
    const y2 = message.charCodeAt(i + 1) - 65;

    const x1 = (invA * y1 + invB * y2) % 26;
    const x2 = (invC * y1 + invD * y2) % 26;

    result += String.fromCharCode(x1 + 65);
    result += String.fromCharCode(x2 + 65);
  }

  return result;
};
