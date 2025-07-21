import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import path from "path";
import { publicApi } from "./App/publicApi";
import { globalErrorHandler } from "./middleware/error.middleware";
import { privateApi } from "./App/privateApi";

dotenv.config();
const app = express();
app.use(express.json());

connectDb()

app.use(cors({
  origin: "http://192.168.1.93:8081", // 🟢 Ini IP Expo 
  credentials: true
}));

// Middleware for serving static files
app.use("/user", express.static(path.resolve("public/user")));

// Apply public API routes
app.use(publicApi)

// Apply private API routes
app.use(privateApi)

// Error handling middleware
app.use(globalErrorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 BOOM! Server ignited on port ${PORT}. Let’s build something awesome!`));
