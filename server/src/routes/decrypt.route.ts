import { Router } from "express";
import { decryptController } from "../controller/cipherController";

const router = Router();

router.post("/decrypt", async (req, res) => {
  try {
    const { method, message, key } = req.body;
    const result = await decryptController(method, message, key);
    res.json({ decryptedMessage: result });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Decryption failed" 
    });
  }
});

export default router;
