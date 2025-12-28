export const railfenceCipher = (message: string, key: number): string => {
  if (key <= 1) return message;

  const rails: string[][] = Array.from({ length: key }, () => []);
  let rail = 0;
  let direction = 1;

  for (const char of message) {
    rails[rail].push(char);
    rail += direction;

    if (rail === 0 || rail === key - 1) {
      direction *= -1;
    }
  }

  return rails.flat().join("");
};

export const railfenceDecipher = (message: string, key: number): string => {
  if (key <= 1) return message;

  const length = message.length;
  const rails: (string | null)[][] = Array.from({ length: key }, () =>
    Array(length).fill(null)
  );

  let rail = 0;
  let direction = 1;

  for (let i = 0; i < length; i++) {
    rails[rail][i] = "*";
    rail += direction;

    if (rail === 0 || rail === key - 1) {
      direction *= -1;
    }
  }

  let index = 0;
  for (let r = 0; r < key; r++) {
    for (let c = 0; c < length; c++) {
      if (rails[r][c] === "*" && index < length) {
        rails[r][c] = message[index++];
      }
    }
  }

  let result = "";
  rail = 0;
  direction = 1;

  for (let i = 0; i < length; i++) {
    result += rails[rail][i] || "";
    rail += direction;

    if (rail === 0 || rail === key - 1) {
      direction *= -1;
    }
  }

  return result;
};
