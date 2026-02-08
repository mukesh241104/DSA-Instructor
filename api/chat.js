
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

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

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

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
}
