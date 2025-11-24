import { Router } from "express";
import { encryptController } from "../controller/cipherController";

const router = Router();

router.post("/encrypt", async (req, res) => {
  try {
    const { method, message, key } = req.body;
    const result = await encryptController(method, message, key);
    res.json({ encryptedMessage: result });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Encryption failed" 
    });
  }
});

export default router;
