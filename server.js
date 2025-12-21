import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import client from "./server/openaiClient.js";
import { READBRIDGE_SYSTEM_PROMPT } from "./server/prompt.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the frontend from /public so the same origin can call /generate
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate", async (req, res) => {
  try {
    const {
      readingFocus,
      readingLevel,
      topic,
      gradeBand,
      assignmentGoal
    } = req.body;

    if (!readingFocus || !readingLevel || !topic) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userPrompt = `
Reading focus: ${readingFocus}
Reading level: ${readingLevel}
Grade band: ${gradeBand || "Not provided"}
Student interest: ${topic}
Assignment goal: ${assignmentGoal || "Not provided"}

Return JSON with passage (HTML), vocab (HTML list), questions (HTML list), and notes (plain text).`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: READBRIDGE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");

    res.json({
      passage: parsed.passage || "",
      vocab: parsed.vocab || "",
      questions: parsed.questions || "",
      notes: parsed.notes || ""
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Generation failed" });
  }
});

// Fallback to index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("ReadBridge server running on http://localhost:3000");
});
