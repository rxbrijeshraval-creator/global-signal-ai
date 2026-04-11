/**
 * POST /api/pipeline
 * ─────────────────────────────────────────────────────────────
 * Server-side pipeline execution.
 * Runs multiple agents in sequence — all secure on server.
 * ─────────────────────────────────────────────────────────────
 * Body: { pipelineId, input }
 * Returns: { pipelineId, steps, results, finalOutput }
 */
import { runPipeline, PIPELINES } from "../lib/agents.js";
import { logAnalytics } from "../lib/db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { pipelineId, input } = req.body;

    if (!pipelineId) return res.status(400).json({ error: "pipelineId required" });
    if (!input?.trim()) return res.status(400).json({ error: "input required" });
    if (!PIPELINES[pipelineId]) return res.status(400).json({ error: `Pipeline ${pipelineId} not found` });

    console.log(`[Pipeline] Starting: ${pipelineId} | Input: ${input.slice(0, 80)}`);

    const result = await runPipeline(pipelineId, input);

    // Log analytics
    logAnalytics({
      type: "pipeline_run",
      pipelineId,
      steps: result.steps.length,
      success: Object.values(result.results).every(r => r.status === "done"),
    });

    return res.status(200).json(result);

  } catch (err) {
    console.error("Pipeline error:", err);
    return res.status(500).json({ error: err.message });
  }
}
