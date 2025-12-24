/**
 * AES-128 Manuel İmplementasyon
 * Eğitim amaçlı - S-Box, SubBytes, ShiftRows, MixColumns, AddRoundKey adımları
 */

// S-Box tablosu (AES standardı)
const S_BOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

// Ters S-Box tablosu (deşifreleme için)
const INV_S_BOX: number[] = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
];

// Rcon tablosu (key expansion için)
const RCON: number[] = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// State'i 4x4 matris olarak temsil ediyoruz
type State = number[][];

// String'i byte dizisine çevir
const stringToBytes = (str: string): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i) & 0xff);
  }
  return bytes;
};

// Byte dizisini string'e çevir
const bytesToString = (bytes: number[]): string => {
  return bytes.map((b) => String.fromCharCode(b)).join("");
};

// Byte dizisini hex string'e çevir
const bytesToHex = (bytes: number[]): string => {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Hex string'i byte dizisine çevir
const hexToBytes = (hex: string): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
};

// Byte dizisini 4x4 state matrisine çevir
const bytesToState = (bytes: number[]): State => {
  const state: State = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    state[i % 4][Math.floor(i / 4)] = bytes[i] || 0;
  }
  return state;
};

// State matrisini byte dizisine çevir
const stateToBytes = (state: State): number[] => {
  const bytes: number[] = [];
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      bytes.push(state[row][col]);
    }
  }
  return bytes;
};

// SubBytes: Her byte'ı S-Box ile değiştir
const subBytes = (state: State): State => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = S_BOX[state[i][j]];
    }
  }
  return state;
};

// InvSubBytes: Ters S-Box ile değiştir
const invSubBytes = (state: State): State => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = INV_S_BOX[state[i][j]];
    }
  }
  return state;
};

// ShiftRows: Satırları sola kaydır
const shiftRows = (state: State): State => {
  // Satır 1: 1 byte sola
  const temp1 = state[1][0];
  state[1][0] = state[1][1];
  state[1][1] = state[1][2];
  state[1][2] = state[1][3];
  state[1][3] = temp1;

  // Satır 2: 2 byte sola
  const temp20 = state[2][0];
  const temp21 = state[2][1];
  state[2][0] = state[2][2];
  state[2][1] = state[2][3];
  state[2][2] = temp20;
  state[2][3] = temp21;

  // Satır 3: 3 byte sola (= 1 byte sağa)
  const temp3 = state[3][3];
  state[3][3] = state[3][2];
  state[3][2] = state[3][1];
  state[3][1] = state[3][0];
  state[3][0] = temp3;

  return state;
};

// InvShiftRows: Satırları sağa kaydır
const invShiftRows = (state: State): State => {
  // Satır 1: 1 byte sağa
  const temp1 = state[1][3];
  state[1][3] = state[1][2];
  state[1][2] = state[1][1];
  state[1][1] = state[1][0];
  state[1][0] = temp1;

  // Satır 2: 2 byte sağa
  const temp20 = state[2][0];
  const temp21 = state[2][1];
  state[2][0] = state[2][2];
  state[2][1] = state[2][3];
  state[2][2] = temp20;
  state[2][3] = temp21;

  // Satır 3: 3 byte sağa (= 1 byte sola)
  const temp3 = state[3][0];
  state[3][0] = state[3][1];
  state[3][1] = state[3][2];
  state[3][2] = state[3][3];
  state[3][3] = temp3;

  return state;
};

// Galois Field çarpma (GF(2^8))
const gmul = (a: number, b: number): number => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) {
      p ^= a;
    }
    const hiBitSet = a & 0x80;
    a <<= 1;
    if (hiBitSet) {
      a ^= 0x1b; // AES irreducible polynomial
    }
    b >>= 1;
  }
  return p & 0xff;
};

// MixColumns: Sütunları karıştır
const mixColumns = (state: State): State => {
  for (let col = 0; col < 4; col++) {
    const a = state[0][col];
    const b = state[1][col];
    const c = state[2][col];
    const d = state[3][col];

    state[0][col] = gmul(a, 2) ^ gmul(b, 3) ^ c ^ d;
    state[1][col] = a ^ gmul(b, 2) ^ gmul(c, 3) ^ d;
    state[2][col] = a ^ b ^ gmul(c, 2) ^ gmul(d, 3);
    state[3][col] = gmul(a, 3) ^ b ^ c ^ gmul(d, 2);
  }
  return state;
};

// InvMixColumns: Ters sütun karıştırma
const invMixColumns = (state: State): State => {
  for (let col = 0; col < 4; col++) {
    const a = state[0][col];
    const b = state[1][col];
    const c = state[2][col];
    const d = state[3][col];

    state[0][col] = gmul(a, 14) ^ gmul(b, 11) ^ gmul(c, 13) ^ gmul(d, 9);
    state[1][col] = gmul(a, 9) ^ gmul(b, 14) ^ gmul(c, 11) ^ gmul(d, 13);
    state[2][col] = gmul(a, 13) ^ gmul(b, 9) ^ gmul(c, 14) ^ gmul(d, 11);
    state[3][col] = gmul(a, 11) ^ gmul(b, 13) ^ gmul(c, 9) ^ gmul(d, 14);
  }
  return state;
};

// AddRoundKey: State ile round key'i XOR'la
const addRoundKey = (state: State, roundKey: number[]): State => {
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      state[row][col] ^= roundKey[col * 4 + row];
    }
  }
  return state;
};

// Key Expansion: 16 byte key'den 176 byte round keys üret
const keyExpansion = (key: number[]): number[][] => {
  const roundKeys: number[][] = [];
  const Nk = 4; // AES-128 için kelime sayısı
  const Nr = 10; // AES-128 için round sayısı

  // İlk round key = orijinal key
  const expandedKey: number[] = [...key];

  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let temp = expandedKey.slice((i - 1) * 4, i * 4);

    if (i % Nk === 0) {
      // RotWord
      temp = [temp[1], temp[2], temp[3], temp[0]];
      // SubWord
      temp = temp.map((b) => S_BOX[b]);
      // XOR with Rcon
      temp[0] ^= RCON[i / Nk - 1];
    }

    for (let j = 0; j < 4; j++) {
      expandedKey.push(expandedKey[(i - Nk) * 4 + j] ^ temp[j]);
    }
  }

  // Round keys'leri 16 byte'lık bloklara böl
  for (let round = 0; round <= Nr; round++) {
    roundKeys.push(expandedKey.slice(round * 16, (round + 1) * 16));
  }

  return roundKeys;
};

// PKCS7 Padding ekle
const addPadding = (bytes: number[]): number[] => {
  const padLen = 16 - (bytes.length % 16);
  const padded = [...bytes];
  for (let i = 0; i < padLen; i++) {
    padded.push(padLen);
  }
  return padded;
};

// PKCS7 Padding kaldır
const removePadding = (bytes: number[]): number[] => {
  const padLen = bytes[bytes.length - 1];
  if (padLen > 0 && padLen <= 16) {
    return bytes.slice(0, bytes.length - padLen);
  }
  return bytes;
};

/**
 * AES-128 Manuel Şifreleme
 * @param message - Şifrelenecek mesaj
 * @param key - 16 karakterlik anahtar
 * @returns Hex formatında şifreli metin
 */
export const aesEncryptManual = (message: string, key: string): string => {
  // Key'i 16 byte'a tamamla
  const keyBytes = stringToBytes(key.padEnd(16, "0").slice(0, 16));
  const roundKeys = keyExpansion(keyBytes);

  // Mesajı byte'lara çevir ve padding ekle
  const messageBytes = addPadding(stringToBytes(message));
  const encryptedBlocks: number[] = [];

  // Her 16 byte'lık blok için şifrele
  for (let block = 0; block < messageBytes.length; block += 16) {
    const blockBytes = messageBytes.slice(block, block + 16);
    let state = bytesToState(blockBytes);

    // İlk round key ekleme
    state = addRoundKey(state, roundKeys[0]);

    // 9 ana round
    for (let round = 1; round <= 9; round++) {
      state = subBytes(state);
      state = shiftRows(state);
      state = mixColumns(state);
      state = addRoundKey(state, roundKeys[round]);
    }

    // Son round (MixColumns yok)
    state = subBytes(state);
    state = shiftRows(state);
    state = addRoundKey(state, roundKeys[10]);

    encryptedBlocks.push(...stateToBytes(state));
  }

  return bytesToHex(encryptedBlocks);
};

/**
 * AES-128 Manuel Deşifreleme
 * @param encryptedHex - Hex formatında şifreli metin
 * @param key - 16 karakterlik anahtar
 * @returns Çözülmüş metin
 */
export const aesDecryptManual = (encryptedHex: string, key: string): string => {
  const keyBytes = stringToBytes(key.padEnd(16, "0").slice(0, 16));
  const roundKeys = keyExpansion(keyBytes);

  const encryptedBytes = hexToBytes(encryptedHex);
  const decryptedBlocks: number[] = [];

  // Her 16 byte'lık blok için deşifrele
  for (let block = 0; block < encryptedBytes.length; block += 16) {
    const blockBytes = encryptedBytes.slice(block, block + 16);
    let state = bytesToState(blockBytes);

    // Son round key ekleme
    state = addRoundKey(state, roundKeys[10]);

    // 9 ters round
    for (let round = 9; round >= 1; round--) {
      state = invShiftRows(state);
      state = invSubBytes(state);
      state = addRoundKey(state, roundKeys[round]);
      state = invMixColumns(state);
    }

    // İlk round (InvMixColumns yok)
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(state, roundKeys[0]);

    decryptedBlocks.push(...stateToBytes(state));
  }

  return bytesToString(removePadding(decryptedBlocks));
};
