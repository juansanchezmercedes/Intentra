import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

import { buildAdaptationPrompt } from "./prompt.js";

app.post("/api/adapt", async (req, res) => {
  try {
    const {
      originalText,
      preserveNotes,
      instructionalGoal,
      accessibilityRange,
      supports
    } = req.body;

    if (!originalText) {
      return res.status(400).json({ error: "Original text is required." });
    }

    const prompt = buildAdaptationPrompt({
      originalText,
      preserveNotes,
      instructionalGoal,
      accessibilityRange,
      supports
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an instructional adaptation copilot for teachers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    const raw = completion.choices[0].message.content;

    // Expect structured JSON back
    const parsed = JSON.parse(raw);

    res.json(parsed);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate adaptation." });
  }
});

app.listen(PORT, () => {
  console.log(`Verity server running on port ${PORT}`);
});
