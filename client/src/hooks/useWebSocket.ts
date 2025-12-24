import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  type: "encrypt" | "decrypt" | "encrypted" | "decrypted" | "error";
  data?: {
    encryptedMessage?: string;
    decryptedMessage?: string;
  };
  message?: string;
  method?: string;
  key?: string;
}

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
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

  const sendMessage = useCallback((message: WebSocketMessage) => {
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
