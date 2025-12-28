import crypto from "crypto";

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface HybridEncryptionResult {
  encryptedKey: string;
  encryptedMessage: string;
  algorithm: "aes" | "des";
}

let serverKeyPair: RSAKeyPair | null = null;

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

export const getServerKeyPair = (): RSAKeyPair => {
  if (!serverKeyPair) {
    serverKeyPair = generateRSAKeyPair();
    console.log("🔐 RSA anahtar çifti oluşturuldu");
  }
  return serverKeyPair;
};

export const getServerPublicKey = (): string => {
  return getServerKeyPair().publicKey;
};

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

export const generateSymmetricKey = (algorithm: "aes" | "des"): string => {
  const length = algorithm === "aes" ? 16 : 8;
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
