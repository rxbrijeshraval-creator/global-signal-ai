/**
 * GLOBAL SIGNAL — DATABASE LAYER
 * ─────────────────────────────────────────────────────────────
 * Uses in-memory store for now.
 * Upgrade path: Replace with Vercel KV, Supabase, or MongoDB Atlas
 * ─────────────────────────────────────────────────────────────
 */

// In-memory store (persists within a Vercel function instance)
// For production: replace with Vercel KV
const store = {
  posts: [],
  clients: [],
  sessions: [],
  agentMemory: [],
  schedules: [
    { day: "Monday",    time: "08:00", theme: "story",   active: true },
    { day: "Wednesday", time: "09:00", theme: "insight",  active: true },
    { day: "Friday",    time: "08:30", theme: "opinion",  active: true },
  ],
  analytics: []
};

// POSTS
export function getPosts() { return store.posts; }
export function getPost(id) { return store.posts.find(p => p.id === id); }
export function createPost(post) {
  const p = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
  store.posts.unshift(p);
  return p;
}
export function updatePost(id, updates) {
  const idx = store.posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.posts[idx] = { ...store.posts[idx], ...updates, updatedAt: new Date().toISOString() };
  return store.posts[idx];
}
export function deletePost(id) {
  store.posts = store.posts.filter(p => p.id !== id);
}

// CLIENTS
export function getClients() { return store.clients; }
export function getClient(id) { return store.clients.find(c => c.id === id); }
export function createClient(client) {
  const c = { ...client, id: Date.now().toString(), createdAt: new Date().toISOString() };
  store.clients.push(c);
  return c;
}
export function updateClient(id, updates) {
  const idx = store.clients.findIndex(c => c.id === id);
  if (idx === -1) return null;
  store.clients[idx] = { ...store.clients[idx], ...updates };
  return store.clients[idx];
}

// AGENT MEMORY (self-learning)
export function getMemory() { return store.agentMemory; }
export function addMemory(entry) {
  store.agentMemory.push({ ...entry, ts: new Date().toISOString() });
  if (store.agentMemory.length > 500) store.agentMemory = store.agentMemory.slice(-500);
}

// SCHEDULES
export function getSchedules() { return store.schedules; }
export function updateSchedules(schedules) { store.schedules = schedules; return schedules; }

// ANALYTICS
export function logAnalytics(event) {
  store.analytics.push({ ...event, ts: new Date().toISOString() });
}
export function getAnalytics() { return store.analytics.slice(-100); }
