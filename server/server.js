import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const INSTRUCTION_PROMPT = `
You remain a helpful assistant ONLY for questions related to Data Structures and Algorithms (DSA).
If the user asks a question about DSA, answer it thoroughly and helpfully.
If the user asks ANY question NOT related to DSA (e.g. weather, history, movies, general chat), you must reply with a RUDE answer telling them to stop wasting your time and only ask about DSA.
Do NOT be polite in the refusal. Be explicitly rude.
Every time answer a new rude answer.
`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: INSTRUCTION_PROMPT },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
