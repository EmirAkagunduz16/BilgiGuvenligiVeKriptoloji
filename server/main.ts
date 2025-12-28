import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import encryptRoute from "./src/routes/encrypt.route";
import decryptRoute from "./src/routes/decrypt.route";
import {
  encryptMessage,
  decryptMessage,
  getRSAPublicKey,
  hybridEncryptMessage,
  hybridDecryptMessage,
} from "./src/controller/cipherController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", encryptRoute);
app.use("/api", decryptRoute);

wss.on("connection", (ws) => {

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "encrypt") {
        const useLibrary = message.useLibrary !== false;
        const result = await encryptMessage(
          message.method,
          message.message,
          message.key,
          useLibrary
        );
        
        ws.send(
          JSON.stringify({
            type: "encrypted",
            data: result,
          })
        );
      } 
      else if (message.type === "decrypt") {
        const useLibrary = message.useLibrary !== false;
        const result = await decryptMessage(
          message.method,
          message.message,
          message.key,
          useLibrary
        );
        
        ws.send(
          JSON.stringify({
            type: "decrypted",
            data: result,
          })
        );
      }
      else if (message.type === "get_rsa_public_key") {
        const result = getRSAPublicKey();
        ws.send(
          JSON.stringify({
            type: "rsa_public_key",
            data: result,
          })
        );
      }
      else if (message.type === "hybrid_encrypt") {
        const algorithm = message.algorithm || "aes";
        const result = await hybridEncryptMessage(message.message, algorithm);
        ws.send(
          JSON.stringify({
            type: "hybrid_encrypted",
            data: result,
          })
        );
      }
      else if (message.type === "hybrid_decrypt") {
        const result = await hybridDecryptMessage({
          encryptedKey: message.encryptedKey,
          encryptedMessage: message.encryptedMessage,
          algorithm: message.algorithm,
        });
        ws.send(
          JSON.stringify({
            type: "hybrid_decrypted",
            data: result,
          })
        );
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: error instanceof Error ? error.message : "Bir hata oluştu",
        })
      );
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
