/**
 * GET /api/health
 * Health check — confirms backend is running
 */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    status: "ok",
    system: "Global Signal Backend",
    version: "1.0.0",
    owner: "Brijesh Raval",
    timestamp: new Date().toISOString(),
    endpoints: {
      "POST /api/chat":          "Secure Claude API proxy — chat with any C-Suite agent",
      "POST /api/pipeline":      "Run agent pipelines (optimizer, content, ideas, auditor, repurpose, intelligence, growth)",
      "GET  /api/posts":         "List all generated posts",
      "POST /api/posts":         "Generate new post via Content Factory pipeline",
      "PUT  /api/posts":         "Approve or reject a post",
      "GET  /api/schedule":      "Get post schedule",
      "POST /api/schedule":      "Update schedule or trigger generation",
      "GET  /api/yc?filter=top": "Fetch YC companies (top/ai/health/hiring/india)",
      "POST /api/yc/search":     "AI-powered YC company search",
      "GET  /api/health":        "This endpoint",
    },
    agentsAvailable: 25,
    pipelinesAvailable: 7,
  });
}
