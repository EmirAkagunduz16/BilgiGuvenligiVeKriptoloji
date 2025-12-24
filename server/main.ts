import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import encryptRoute from "./src/routes/encrypt.route";
import decryptRoute from "./src/routes/decrypt.route";
import { encryptMessage, decryptMessage } from "./src/controller/cipherController";
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

// WebSocket bağlantısı yönetimi
wss.on("connection", (ws) => {

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "encrypt") {
        const result = await encryptMessage(
          message.method,
          message.message,
          message.key
        );
        
        ws.send(
          JSON.stringify({
            type: "encrypted",
            data: result,
          })
        );
      } else if (message.type === "decrypt") {
        const result = await decryptMessage(
          message.method,
          message.message,
          message.key
        );
        
        ws.send(
          JSON.stringify({
            type: "decrypted",
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
