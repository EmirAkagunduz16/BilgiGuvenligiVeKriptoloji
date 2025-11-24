import express from "express";
import cors from "cors";
import encryptRoute from "./src/routes/encrypt.route";
import decryptRoute from "./src/routes/decrypt.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();

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

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
