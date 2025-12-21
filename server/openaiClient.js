import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env so the key is available when running from project root
dotenv.config({ path: path.join(__dirname, ".env") });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default client;