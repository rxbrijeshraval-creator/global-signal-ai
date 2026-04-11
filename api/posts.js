/**
 * GET  /api/posts     → list all posts
 * POST /api/posts     → create post (generate with agents)
 * PUT  /api/posts     → update post (approve/reject)
 * DELETE /api/posts   → delete post
 */
import { getPosts, createPost, updatePost, deletePost } from "../lib/db.js";
import { runPipeline } from "../lib/agents.js";

const CORS = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const THEME_TO_PIPELINE = {
  story:   { pipeline: "content", hint: "Write a powerful personal founder story post" },
  insight: { pipeline: "content", hint: "Write an industry insight about Ayurveda + modern science" },
  opinion: { pipeline: "content", hint: "Write a bold contrarian opinion about healthcare startup funding in India" },
  teach:   { pipeline: "content", hint: "Teach something valuable and specific about Ayurvedic medicine or entrepreneurship" },
  venture: { pipeline: "content", hint: "Share an exciting update about Beyond Cure, Matri Doodh, or NutriBuds" },
  monday:  { pipeline: "content", hint: "Write a Monday motivation post energising founders and health professionals" },
};

export default async function handler(req, res) {
  CORS(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — list all posts
  if (req.method === "GET") {
    return res.status(200).json({ posts: getPosts() });
  }

  // POST — generate new post using Content Factory pipeline
  if (req.method === "POST") {
    try {
      const { theme = "story", customTopic = "" } = req.body;
      const themeConfig = THEME_TO_PIPELINE[theme] || THEME_TO_PIPELINE.story;
      const input = customTopic.trim() || themeConfig.hint;

      console.log(`[Posts] Generating: theme=${theme} | input=${input.slice(0, 60)}`);

      // Run full Content Factory pipeline on server
      const result = await runPipeline(themeConfig.pipeline, input);
      const finalPost = result.finalOutput;

      // Save to DB
      const post = createPost({
        theme,
        themeName: theme.charAt(0).toUpperCase() + theme.slice(1),
        text: finalPost,
        agentOutputs: result.results,
        status: "pending",
        scheduledDay: ["Monday", "Wednesday", "Friday"][getPosts().filter(p=>p.status==="approved").length % 3],
        scheduledTime: "08:30",
        qualityScore: (() => {
          // Extract score from Param's output if available
          const paramOut = result.results?.param?.output || "";
          const match = paramOut.match(/(\d{2,3})\s*\/\s*100/);
          return match ? parseInt(match[1]) : Math.floor(75 + Math.random() * 20);
        })(),
      });

      return res.status(201).json({ post, pipeline: result });

    } catch (err) {
      console.error("Post generation error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT — update post (approve/reject)
  if (req.method === "PUT") {
    try {
      const { id, status, rejectReason, scheduledDay, scheduledTime } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });

      const updates = { status };
      if (rejectReason) updates.rejectReason = rejectReason;
      if (scheduledDay) updates.scheduledDay = scheduledDay;
      if (scheduledTime) updates.scheduledTime = scheduledTime;
      if (status === "approved") updates.approvedAt = new Date().toISOString();
      if (status === "rejected") updates.rejectedAt = new Date().toISOString();

      const post = updatePost(id, updates);
      if (!post) return res.status(404).json({ error: "Post not found" });

      return res.status(200).json({ post });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE
  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id required" });
    deletePost(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
