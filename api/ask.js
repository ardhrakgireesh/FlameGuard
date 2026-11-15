// Vercel serverless function using Google Gemini.
// Set GEMINI_API_KEY in Vercel > Settings > Environment Variables (free key from aistudio.google.com).
// The key stays on the server. The browser never sees it.
import { buildContext } from "../src/context.js";

const SYSTEM = `You are FlameGuard's assistant for NASA microgravity combustion records.
Answer ONLY from the CONTEXT the user message provides. Rules:
- If the context does not contain the answer, reply exactly: "The FlameGuard data does not cover that."
- Name the record or table each fact comes from (for example BASS-II PSI-25).
- Separate what NASA states from what is our own interpretation.
- Never invent numbers. Maximum 110 words. Plain language.`;

// Best-effort limits (memory is per server instance, so the real protection is a spend cap on the key).
const PER_MIN = 6, PER_DAY = 300;
const hits = new Map();
let day = { d: "", n: 0 };
function allowed(ip) {
  const now = Date.now(), today = new Date().toISOString().slice(0, 10);
  if (day.d !== today) day = { d: today, n: 0 };
  if (day.n >= PER_DAY) return false;
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= PER_MIN) return false;
  recent.push(now); hits.set(ip, recent); day.n++;
  if (hits.size > 5000) hits.clear();
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: "AI not configured" });
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "x").split(",")[0].trim();
  if (!allowed(ip)) return res.status(429).json({ error: "Too many questions. Try again later." });
  const question = req.body && req.body.question;
  if (typeof question !== "string" || question.trim().length < 2 || question.length > 200) return res.status(400).json({ error: "bad input" });
  const context = buildContext();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: `CONTEXT:\n${context}\n\nQUESTION: ${question}` }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.2 },
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "upstream " + r.status });
    const j = await r.json();
    const answer = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
    return res.status(200).json({ answer });
  } catch (e) {
    return res.status(502).json({ error: "upstream failed" });
  }
}
