import crypto from "crypto";

/**
 * RSA Anahtar Çifti
 */
export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Hibrit Şifreleme Sonucu
 * RSA ile şifrelenmiş simetrik anahtar + Simetrik algoritma ile şifrelenmiş mesaj
 */
export interface HybridEncryptionResult {
  encryptedKey: string; // RSA ile şifrelenmiş simetrik anahtar (Base64)
  encryptedMessage: string; // AES/DES ile şifrelenmiş mesaj
  algorithm: "aes" | "des"; // Kullanılan simetrik algoritma
}

// Sunucu için global RSA anahtar çifti (uygulama başlangıcında oluşturulur)
let serverKeyPair: RSAKeyPair | null = null;

/**
 * RSA-2048 anahtar çifti oluştur
 * @returns Public ve Private key çifti (PEM formatında)
 */
export const generateRSAKeyPair = (): RSAKeyPair => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // 2048 bit güvenlik için yeterli
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
};

/**
 * Sunucu RSA anahtar çiftini başlat veya mevcut olanı döndür
 */
export const getServerKeyPair = (): RSAKeyPair => {
  if (!serverKeyPair) {
    serverKeyPair = generateRSAKeyPair();
    console.log("🔐 RSA anahtar çifti oluşturuldu");
  }
  return serverKeyPair;
};

/**
 * Sunucunun public key'ini al (client'a gönderilecek)
 */
export const getServerPublicKey = (): string => {
  return getServerKeyPair().publicKey;
};

/**
 * RSA ile veri şifrele (public key ile)
 * @param data - Şifrelenecek veri (genellikle simetrik anahtar)
 * @param publicKey - RSA public key (PEM formatında)
 * @returns Base64 formatında şifrelenmiş veri
 */
export const rsaEncrypt = (data: string, publicKey: string): string => {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data, "utf8")
  );
  return encrypted.toString("base64");
};

/**
 * RSA ile veri çöz (private key ile)
 * @param encryptedData - Base64 formatında şifrelenmiş veri
 * @param privateKey - RSA private key (PEM formatında)
 * @returns Çözülmüş veri
 */
export const rsaDecrypt = (encryptedData: string, privateKey: string): string => {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedData, "base64")
  );
  return decrypted.toString("utf8");
};

/**
 * Rastgele simetrik anahtar oluştur
 * @param algorithm - "aes" (16 byte) veya "des" (8 byte)
 */
export const generateSymmetricKey = (algorithm: "aes" | "des"): string => {
  const length = algorithm === "aes" ? 16 : 8;
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
