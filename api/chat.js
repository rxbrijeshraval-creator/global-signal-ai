/**
 * POST /api/chat
 * ─────────────────────────────────────────────────────────────
 * Secure proxy for Claude API — API key stays on server.
 * Frontend never sees the key.
 * ─────────────────────────────────────────────────────────────
 * Body: { agentId, message, history, memory }
 * Returns: { reply, agentName, agentRole }
 */
import { AGENTS } from "../lib/agents.js";
import { getMemory, addMemory } from "../lib/db.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { agentId = "brij", message, history = [], memory = [] } = req.body;

    if (!message?.trim()) return res.status(400).json({ error: "Message required" });

    const agent = AGENTS[agentId];
    if (!agent) return res.status(400).json({ error: `Agent ${agentId} not found` });

    // Build context
    const histStr = history.slice(-5).map(h =>
      `${h.from === "user" ? "BRIJESH" : h.agentId?.toUpperCase() || "AGENT"}: ${h.text?.slice(0, 150)}`
    ).join("\n");

    const memStr = memory.slice(-6).map(m => `→ ${m}`).join("\n") || "→ First session.";

    const systemPrompt = `${agent.system}

RECENT MEMORY FROM PAST SESSIONS:
${memStr}

CONVERSATION HISTORY:
${histStr || "New conversation."}

IMPORTANT: Be warm, human, genuine. Real person energy — not robotic.
Match the language of the person (English/Hindi/Gujarati).
Max 200 words unless deep analysis specifically requested.`;

    // Call Claude API — key is server-side only
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,  // ← SECURE: never sent to frontend
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 900,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      throw new Error(`Claude error: ${err}`);
    }

    const data = await claudeRes.json();
    const reply = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n") || "[No response]";

    // Store memory on server side
    addMemory({
      agentId,
      query: message.slice(0, 100),
      summary: reply.slice(0, 100),
    });

    return res.status(200).json({
      reply,
      agentName: agent.name,
      agentRole: agent.role,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: err.message });
  }
}
