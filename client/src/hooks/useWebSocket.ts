import { useEffect, useRef, useState, useCallback } from "react";

// Gönderilen mesaj tipleri
interface EncryptMessage {
  type: "encrypt";
  method: string;
  message: string;
  key: string | number;
  useLibrary?: boolean;
}

interface DecryptMessage {
  type: "decrypt";
  method: string;
  message: string;
  key: string | number;
  useLibrary?: boolean;
}

interface HybridEncryptMessage {
  type: "hybrid_encrypt";
  message: string;
  algorithm: "aes" | "des";
}

interface HybridDecryptMessage {
  type: "hybrid_decrypt";
  encryptedKey: string;
  encryptedMessage: string;
  algorithm: "aes" | "des";
}

interface GetRSAPublicKeyMessage {
  type: "get_rsa_public_key";
}

// Alınan mesaj tipleri
interface EncryptedResponse {
  type: "encrypted";
  data: {
    encryptedMessage: string;
    useLibrary?: boolean;
  };
}

interface DecryptedResponse {
  type: "decrypted";
  data: {
    decryptedMessage: string;
  };
}

interface HybridEncryptedResponse {
  type: "hybrid_encrypted";
  data: {
    encryptedKey: string;
    encryptedMessage: string;
    algorithm: "aes" | "des";
  };
}

interface HybridDecryptedResponse {
  type: "hybrid_decrypted";
  data: {
    decryptedMessage: string;
  };
}

interface RSAPublicKeyResponse {
  type: "rsa_public_key";
  data: {
    publicKey: string;
  };
}

interface ErrorResponse {
  type: "error";
  message: string;
}

// Birleşik tipler
type WebSocketSendMessage = 
  | EncryptMessage 
  | DecryptMessage 
  | HybridEncryptMessage 
  | HybridDecryptMessage 
  | GetRSAPublicKeyMessage;

type WebSocketReceiveMessage = 
  | EncryptedResponse 
  | DecryptedResponse 
  | HybridEncryptedResponse 
  | HybridDecryptedResponse 
  | RSAPublicKeyResponse 
  | ErrorResponse;

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketReceiveMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (error) {
        console.error(error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message: WebSocketSendMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      throw new Error("WebSocket bağlantısı açık değil");
    }
  }, []);

  return {
    isConnected,
    sendMessage,
    lastMessage,
  };
};
