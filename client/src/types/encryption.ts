export type EncryptionMethod =
  | "caeser"
  | "substitution"
  | "railfence"
  | "playfair"
  | "route"
  | "columnar"
  | "polybius"
  | "pigpen"
  | "hill"
  | "vigenere"
  | "aes"
  | "des";

// Modern şifreleme algoritmaları (kütüphane/manuel seçeneği olan)
export type ModernEncryptionMethod = "aes" | "des";

// Implementasyon modu
export type ImplementationMode = "library" | "manual";

// RSA Key Pair tipi
export interface RSAKeyPair {
  publicKey: string;
  privateKey?: string; // Private key sadece sunucu tarafında
}

// Hibrit şifreleme sonucu
export interface HybridEncryptionResult {
  encryptedKey: string;
  encryptedMessage: string;
  algorithm: "aes" | "des";
}

// WebSocket mesaj tipleri
export interface EncryptRequest {
  type: "encrypt";
  method: EncryptionMethod;
  message: string;
  key: string | number;
  useLibrary?: boolean; // true: kütüphane, false: manuel (sadece AES/DES için)
}

export interface DecryptRequest {
  type: "decrypt";
  method: EncryptionMethod;
  message: string;
  key: string | number;
  useLibrary?: boolean;
}

export interface HybridEncryptRequest {
  type: "hybrid_encrypt";
  message: string;
  algorithm: "aes" | "des";
}

export interface HybridDecryptRequest {
  type: "hybrid_decrypt";
  encryptedKey: string;
  encryptedMessage: string;
  algorithm: "aes" | "des";
}
