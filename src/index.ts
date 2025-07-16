import express from "express"
import dotenv from "dotenv";
import { connectDb } from "./config/db";

dotenv.config();
const app = express();
app.use(express.json());

connectDb()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 BOOM! Server ignited on port ${PORT}. Let’s build something awesome!`));
