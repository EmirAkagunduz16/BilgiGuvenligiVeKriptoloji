const normalizeChar = (char: string): string => {
  const turkishChars = "çÇğĞıİöÖşŞüÜ";
  const englishChars = "cCgGiIoOsSuU";
  const index = turkishChars.indexOf(char);
  return index !== -1 ? englishChars[index] : char;
};

const pigpenMap: { [key: string]: string } = {
  A: "⌈",
  B: "⌉",
  C: "⌊",
  D: "⌋",
  E: "∟",
  F: "∠",
  G: "∧",
  H: "∨",
  I: "<",
  J: ">",
  K: "⊔",
  L: "⊓",
  M: "⊏",
  N: "⊐",
  O: "◊",
  P: "◇",
  Q: "◈",
  R: "◉",
  S: "●",
  T: "○",
  U: "◐",
  V: "◑",
  W: "◒",
  X: "◓",
  Y: "▪",
  Z: "▫",
};

export const pigpenCipher = (message: string, key: string): string => {
  let result = "";

  for (let i = 0; i < message.length; i++) {
    let char = message[i].toUpperCase();
    char = normalizeChar(char);

    if (pigpenMap[char]) {
      result += pigpenMap[char];
    } else {
      result += char;
    }
  }

  return result;
};

export const pigpenDecipher = (message: string, key: string): string => {
  const reversePigpenMap: { [key: string]: string } = {};
  for (const [letter, symbol] of Object.entries(pigpenMap)) {
    reversePigpenMap[symbol] = letter;
  }

  let result = "";

  for (const char of message) {
    if (reversePigpenMap[char]) {
      result += reversePigpenMap[char];
    } else {
      result += char;
    }
  }

  return result;
};
