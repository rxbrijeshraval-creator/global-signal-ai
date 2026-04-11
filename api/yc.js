/**
 * GET  /api/yc?filter=top|ai|health|hiring|india  → fetch YC companies
 * POST /api/yc/search → AI-powered search with context
 */
import { AGENTS } from "../lib/agents.js";

const YC_ENDPOINTS = {
  top:     "https://yc-oss.github.io/api/companies/top.json",
  all:     "https://yc-oss.github.io/api/companies/top.json",
  hiring:  "https://yc-oss.github.io/api/companies/hiring.json",
  ai:      "https://yc-oss.github.io/api/tags/artificial-intelligence.json",
  health:  "https://yc-oss.github.io/api/industries/healthcare.json",
  india:   "https://yc-oss.github.io/api/tags/india.json",
  women:   "https://yc-oss.github.io/api/companies/women-founded.json",
  saas:    "https://yc-oss.github.io/api/tags/saas.json",
  b2b:     "https://yc-oss.github.io/api/tags/b2b.json",
  meta:    "https://yc-oss.github.io/api/meta.json",
};

const CORS = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(req, res) {
  CORS(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — fetch YC data
  if (req.method === "GET") {
    try {
      const filter = req.query?.filter || "top";
      const url = YC_ENDPOINTS[filter] || YC_ENDPOINTS.top;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`YC API error: ${response.status}`);
      const data = await response.json();

      // Normalize and limit
      const companies = Array.isArray(data)
        ? data.slice(0, 200).map(c => ({
            name: c.name,
            batch: c.batch,
            status: c.status,
            one_liner: c.one_liner,
            industry: c.industry,
            tags: c.tags?.slice(0, 5),
            isHiring: c.isHiring,
            website: c.website,
            team_size: c.team_size,
            stage: c.stage,
            top_company: c.top_company,
          }))
        : data; // meta.json is not an array

      return res.status(200).json({ companies, filter, count: Array.isArray(companies) ? companies.length : 1 });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — AI search through YC data for Global Signal purposes
  if (req.method === "POST") {
    try {
      const { query, companies = [] } = req.body;
      if (!query) return res.status(400).json({ error: "query required" });

      // Prepare data for Claude (sample to keep context manageable)
      const sample = companies.slice(0, 50).map(c =>
        `${c.name} (${c.batch}) — ${c.one_liner?.slice(0, 80)} | Industry: ${c.industry} | Status: ${c.status}${c.isHiring ? " | HIRING" : ""}`
      ).join("\n");

      const system = `You are the YC Intelligence Bot for Global Signal — helping Brijesh Raval research Y Combinator companies.

BRIJESH'S CONTEXT:
→ Building Global Signal: AI LinkedIn Optimization Platform
→ Also building: Beyond Cure (Ayurveda), Matri Doodh (maternal health), NutriBuds (pediatric nutrition)
→ Looking for: Investors, strategic partners, potential enterprise clients, market intelligence
→ India focus + global ambition

YC COMPANY DATA (${companies.length} companies):
${sample}

Be direct and actionable. Every result should tell Brijesh:
1. Which company/person to approach
2. Why they're relevant
3. What angle to use when reaching out

Format your response clearly with company names highlighted.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system,
          messages: [{ role: "user", content: query }],
        }),
      });

      if (!response.ok) throw new Error(`Claude error: ${response.status}`);
      const data = await response.json();
      const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");

      return res.status(200).json({ reply, queriedCompanies: companies.length });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
