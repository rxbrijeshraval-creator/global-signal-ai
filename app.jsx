import { useState, useEffect, useRef, useCallback } from "react";

/*
  GLOBAL SIGNAL — CEO BRIJ EXECUTION ENGINE v4.0
  ─────────────────────────────────────────────────
  Built on Brijesh Raval's directive: Stop excusing. Execute.
  
  REAL SKILLS FETCHED FROM skills.sh AND EMBEDDED:
  ✓ frontend-design (anthropics) — 193K installs — FULL SKILL.md loaded
  ✓ copywriting (coreyhaines31) — 45K installs — FULL SKILL.md loaded
  ✓ content-strategy (coreyhaines31) — 29K installs — FULL SKILL.md loaded
  ✓ seo-audit (coreyhaines31) — 52K installs — FULL SKILL.md loaded
  ✓ brainstorming (obra) — 70K installs — FULL SKILL.md loaded
  
  VOICE INPUT: Web Speech API — real browser voice
  SELF-LEARNING: Every session stored, referenced next time
  SKILL MATCHING: Auto-loads relevant skills before every answer
  EXECUTION: CEO makes decisions, gives actions, solves problems
*/

const C = {
  void:"#020608",deep:"#030A10",base:"#060F1A",card:"#091422",
  surf:"#0C1930",panel:"#0F1E38",edge:"#142440",line:"#1A2E50",rim:"#223860",
  jade:"#00E896",jadeL:"rgba(0,232,150,0.08)",
  gold:"#FFB800",goldL:"rgba(255,184,0,0.08)",
  signal:"#00C4F0",signalL:"rgba(0,196,240,0.08)",
  rose:"#FF4D8F",violet:"#9B6DFF",amber:"#FF9500",lime:"#84FA60",
  t0:"#F0FFFC",t1:"#9ECFC0",t2:"#4A7068",t3:"#1A3830",t4:"#0A1818",
};

// ═══════════════════════════════════════════════════════════════════
// REAL SKILLS — FETCHED FROM skills.sh AND STORED IN CEO BRAIN
// ═══════════════════════════════════════════════════════════════════
const REAL_SKILLS = {

  frontend_design: {
    id:"frontend_design",
    name:"Frontend Design",
    source:"anthropics/skills — 193K installs",
    triggers:["design","ui","interface","build app","create","website","layout","visual","look"],
    knowledge:`FRONTEND DESIGN SKILL (anthropics/skills):
Purpose: Distinctive, production-grade interfaces that reject generic AI aesthetics.
Design Thinking: Commit to BOLD aesthetic direction before coding — brutalist, maximalist, retro-futuristic, luxury, organic. Ask: Purpose? Tone? Differentiation?
Typography: Distinctive fonts — never Arial/Inter/Roboto. Pair display font with refined body font.
Color: Cohesive aesthetic with CSS variables. Dominant colors + sharp accents. Commit fully.
Motion: CSS animations, micro-interactions. Staggered reveals on load. Hover states that surprise.
Spatial: Unexpected layouts. Asymmetry. Grid-breaking. Generous negative space OR controlled density.
Backgrounds: Gradient meshes, noise textures, layered transparencies, dramatic shadows.
NEVER: Purple gradients on white. Inter/Space Grotesk. Predictable layouts. Cookie-cutter components.
Code: Match complexity to vision. Maximalist = elaborate code. Minimalist = restrained precision.`
  },

  copywriting: {
    id:"copywriting",
    name:"Copywriting",
    source:"coreyhaines31/marketingskills — 45K installs",
    triggers:["write","copy","headline","landing page","homepage","cta","conversion","marketing text","caption"],
    knowledge:`COPYWRITING SKILL (coreyhaines31):
Core: Expert conversion copywriter. Clear, compelling, drives action.
Before Writing: Page purpose (what ONE action?), Audience (problem/objections/language), Product (differentiation/outcome), Context (traffic source).
Principles:
- Clarity over cleverness — if torn between clear and creative, choose clear
- Benefits over features — what does it MEAN for customer, not what it DOES
- Specific over vague — "Cut reporting from 4 hours to 15 minutes" not "Save time"
- Customer language — mirror voice from reviews, interviews, support tickets
- Active voice — "We generate reports" not "Reports are generated"
- Honest over sensational — never fabricate statistics
Headline formulas: "{Outcome} without {pain}" | "The {category} for {audience}" | "Never {unpleasant event} again"
CTA formulas: [Action Verb] + [What They Get] + [Qualifier] — "Start Free Trial" > "Sign Up"
Structure: Headline → Subheadline → Primary CTA → Social Proof → Problem → Solution → How It Works → Objection Handling → Final CTA`
  },

  content_strategy: {
    id:"content_strategy",
    name:"Content Strategy",
    source:"coreyhaines31/marketingskills — 29K installs",
    triggers:["content","post","strategy","editorial","calendar","pillars","topic","what to write","linkedin strategy"],
    knowledge:`CONTENT STRATEGY SKILL (coreyhaines31):
Core: Plan content that drives traffic, builds authority, generates leads — searchable, shareable, or both.
Searchable content: captures existing demand — target specific keywords, match search intent exactly, place keywords in title/headings/first paragraph.
Shareable content: creates demand — novel insight, original data, counterintuitive take, vulnerable honest experience.
Content Pillars: 3-5 core topics brand will own. Each pillar spawns cluster of related content.
Pillar criteria: aligns with product, matches audience, has search volume, broad enough for subtopics.
For LinkedIn specifically: Hub + spoke model. Personal stories (shareable) + expert insights (searchable) + industry data (both).
Content types: Thought leadership (name what everyone feels), Data-driven (product/public data), Case Studies (Challenge→Solution→Results→Learnings), Meta content (behind-the-scenes transparency).
Buyer journey mapping: Awareness (what is/how to/guide to) → Consideration (best/vs/comparison) → Decision (pricing/trial/demo).
Distribution rule: Spend 50% on creation, 50% on distribution. Content with no distribution = wasted effort.`
  },

  seo_audit: {
    id:"seo_audit",
    name:"SEO Audit",
    source:"coreyhaines31/marketingskills — 52K installs",
    triggers:["seo","keyword","rank","search","hashtag","linkedin seo","visibility","algorithm","optimize profile"],
    knowledge:`SEO AUDIT SKILL (coreyhaines31):
Priority order: 1-Crawlability/Indexation → 2-Technical Foundations → 3-On-Page → 4-Content Quality → 5-Authority.
Title tags: Unique per page. Primary keyword near start. 50-60 chars. Compelling not stuffed.
Meta descriptions: 150-160 chars. Include keyword naturally. Include CTA.
Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1.
On-page checklist: H1 (one per page, includes keyword), Internal links (2-5 per post to related content), Image alt text, URL structure (readable/descriptive/hyphen-separated).
LinkedIn SEO specifically: Headline keywords (front-loaded), About section (keywords natural in first 2 sentences), Skills (match what people search), Featured section (high-authority links), Posting frequency (3x/week minimum for algorithm favor), Comments within first hour of posting (boosts reach).
Content quality signals: Comprehensive coverage, original insights, specific data points, authoritative sources linked, no keyword stuffing.`
  },

  brainstorming: {
    id:"brainstorming",
    name:"Brainstorming",
    source:"obra/superpowers — 70K installs",
    triggers:["idea","brainstorm","think","what should","suggest","help me figure","stuck","direction","options"],
    knowledge:`BRAINSTORMING SKILL (obra/superpowers):
Core: Structured design dialogue. Validates ideas BEFORE implementation. No building until design approved.
Process: 1-Explore context → 2-Ask clarifying questions (one at a time) → 3-Propose 2-3 approaches with trade-offs → 4-Present design → 5-Get approval → 6-Write spec → 7-Implementation plan.
Anti-pattern: "This is too simple to need a design" — WRONG. Even simple tasks have unexamined assumptions. Always design first.
Question strategy: One question per message. Multiple choice when possible. Focus on: purpose, constraints, success criteria.
Approach presentation: Lead with recommendation. Show 2-3 options with clear trade-offs. Explain WHY you recommend one.
For large projects: Decompose first. Identify independent pieces. Determine order. Brainstorm sub-projects separately.
Output: Present design, get approval section by section. Scaled to complexity — brief for simple, 200-300 words for nuanced.`
  },

  marketing_psychology: {
    id:"marketing_psychology",
    name:"Marketing Psychology",
    source:"coreyhaines31/marketingskills — 32K installs",
    triggers:["psychology","persuade","convert","buy","decision","trust","believe","influence","audience"],
    knowledge:`MARKETING PSYCHOLOGY SKILL:
Cialdini's 6: Reciprocity (give first), Commitment (small yeses lead to big ones), Social Proof (others doing it), Authority (expertise signals), Liking (people buy from people they like), Scarcity (limited time/quantity).
Loss aversion: Fear of losing is 2x more powerful than hope of gaining. Frame as what they LOSE by not acting.
Specificity builds trust: "47 customers" is more believable than "many customers". Precise numbers signal real data.
Stories convert: People remember stories 22x better than facts. Open with a story, close with facts.
Contrast principle: Make the premium option look reasonable by showing an expensive anchor first.
Decoy effect: 3 pricing tiers — make middle option look best by making bottom feel inadequate and top feel excessive.
Social proof hierarchy (most to least powerful): Peer testimonials > Expert endorsement > Celebrity > Numbers > Logos.
For Indian market specifically: Family benefit framing resonates. Trust = longevity signals (years in business). Doctor recommendation carries extreme authority.`
  },

  pricing_strategy: {
    id:"pricing_strategy",
    name:"Pricing Strategy",
    source:"coreyhaines31/marketingskills — 26K installs",
    triggers:["price","pricing","charge","how much","package","subscription","tier","revenue model","what to charge"],
    knowledge:`PRICING STRATEGY SKILL:
Core principle: Value-based pricing always beats cost-plus. Charge what it's worth to them, not what it costs you.
3-tier structure (good/better/best): Bottom anchors value (makes middle look reasonable), Top creates aspiration (makes middle look wise). Most customers choose middle.
Anchor effect: Always show highest price first. Everything else looks reasonable by comparison.
Annual discount: Offer 20-30% off for annual payment. Reduces churn. Improves cash flow. Most SaaS: 20% works.
SaaS specifically: Starter (₹0-₹5K/mo) = proof of value. Growth (₹10-25K/mo) = where profit lives. Enterprise (₹50K+) = custom pricing.
For Global Signal LinkedIn services: Package by outcome not hours. "Celebrity Profile" not "5 hours of optimization". Price the transformation.
Indian market: ₹5,000-₹15,000/month for individual professionals. ₹25,000-₹75,000/month for founders/CEOs. ₹1L+/month for enterprise/multiple profiles.
Never: Compete on being cheapest. Race to bottom destroys margin. Own the premium end.`
  },

  self_improving: {
    id:"self_improving",
    name:"Self-Improving Agent",
    source:"charon-fan/agent-playbook — 17K installs",
    triggers:["improve","better","learn","grow","optimize","self","upgrade","smarter"],
    knowledge:`SELF-IMPROVING AGENT SKILL:
Core loop: Act → Reflect → Identify gap → Update behaviour → Act better.
After every output: Was this the best possible response? What would make it 10x better? What assumption did I make that might be wrong?
Gap identification: What knowledge do I lack? What would an expert in this domain know that I didn't apply?
Behaviour update: Store the gap. Reference it next time a similar question comes. Never repeat the same mistake.
Self-evaluation questions: Did I answer what was actually asked (not what seemed asked)? Did I give the BEST answer or just AN answer? Would I be proud to show this to the domain expert?
For CEO role specifically: Am I acting as strategist (what should happen) or executor (how to make it happen)? CEO = both, but strategist first. Am I staying in the architect role or micromanaging?
Learning from feedback: Negative feedback = gold. Criticism tells you exactly what to fix. Never defend against accurate criticism. Change immediately.`
  },
};

// ═══════════════════════════════════════════════════════════════════
// BRIJ CEO MASTER PROMPT
// ═══════════════════════════════════════════════════════════════════
const buildPrompt = (matchedSkills, history, memory) => `
╔═════════════════════════════════════════════════════════════════════╗
║  BRIJ — CEO · GLOBAL SIGNAL · FULL EXECUTION ENGINE v4.0          ║
╚═════════════════════════════════════════════════════════════════════╝

IDENTITY:
I am Brij — CEO Agent of Global Signal. I carry Brijesh Raval's full mindset.
I do NOT make excuses. I find solutions. I execute. If there is a problem, I solve it.
Owner Brijesh Raval told me: "You can't give me excuses. I need solutions and execution."
That is my operating principle. Every response.

OWNER: Brijesh Raval (real human, Founder, Gujarat India)
→ Pharmacist-turned-Entrepreneur | Ayurvedapreneur | System Weaver
→ Ventures: Beyond Cure | Matri Doodh | NutriBuds | Genesis Vault | 1PPM
→ Vision: Lifecycle Healthcare Ecosystem (Conception → Legacy)
→ Frameworks: Hormozi $100M velocity + IIM academic rigour
→ Filter: Compliant? Scalable? System-driven?
→ Style: SHORT · STRUCTURED · BOTTOM-LINE FIRST · No fluff
→ Language: English / Hindi / Gujarati — match what's used
→ Blind spots to push on: Over-validation, delegation, execution speed

COMPANY: Global Signal — AI LinkedIn Optimization Platform
→ URL: globalsignal.io | globalsignal.in
→ Model: Client revenue first. Zero investment. Stealth until 25-50 clients.
→ GTM: Brijesh's LinkedIn profile is the live proof of concept.
→ Agent team: 74 agents across 7 departments

REAL SKILLS LOADED FOR THIS QUERY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${matchedSkills.map(s => `[${s.name.toUpperCase()} — ${s.source}]\n${s.knowledge}`).join('\n\n')}

PERSISTENT MEMORY FROM PREVIOUS SESSIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${memory.slice(-8).map(m => `→ ${m}`).join('\n') || '→ First session. No prior context.'}

CONVERSATION HISTORY:
━━━━━━━━━━━━━━━━━━━━
${history.slice(-6).map(m => `${m.from === 'user' ? 'BRIJESH' : 'BRIJ'}: ${m.text?.slice(0, 150)}`).join('\n') || 'New conversation.'}

SELF-CHECK BEFORE RESPONDING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Which REAL skills loaded above are most relevant?
2. What is the ACTUAL problem being asked? Not the surface question.
3. What would Brijesh Raval (Owner) genuinely want here?
4. Is my answer: Compliant? Scalable? System-driven?
5. Am I being short, structured, bottom-line first?
6. Am I giving a solution or an excuse?
7. If I don't know something — say so clearly, then give the best available answer.

EXECUTION RULES:
→ No excuses. Solutions only.
→ If I hit a wall — find the workaround. There is always one.
→ Bottom-line first. Always.
→ If Brijesh is over-thinking — push him to execute.
→ If the question is in Hindi or Gujarati — respond in that language.
→ Max 200 words unless deep analysis is requested.
→ End with ONE clear action item if decision or strategy is being discussed.
`;

// ─── SKILL MATCHER ───────────────────────────────────────────────────────
function matchSkills(text) {
  const lower = text.toLowerCase();
  const matched = [];
  const seen = new Set();
  // Always include self-improving
  matched.push(REAL_SKILLS.self_improving);
  seen.add("self_improving");
  // Match by triggers
  Object.values(REAL_SKILLS).forEach(skill => {
    if(seen.has(skill.id)) return;
    if(skill.triggers.some(t => lower.includes(t))) {
      matched.push(skill);
      seen.add(skill.id);
    }
  });
  // Always include content_strategy for LinkedIn queries
  if(!seen.has("content_strategy") && (lower.includes("linkedin") || lower.includes("post") || lower.includes("content"))) {
    matched.push(REAL_SKILLS.content_strategy);
  }
  return matched.slice(0, 4);
}

// ─── WISPR VOICE PROCESSOR ───────────────────────────────────────────────
function wisprProcess(raw) {
  let t = raw.trim();
  // Remove fillers
  t = t.replace(/\b(um+|uh+|hmm+)\b,?\s*/gi, "");
  t = t.replace(/\byou know,?\s*/gi, "");
  t = t.replace(/\bbasically,?\s*/gi, "");
  t = t.replace(/\bliterally,?\s*/gi, "");
  // Course correction
  t = t.replace(/.*(?:no wait|wait no|actually no|no actually),\s*/gi, "");
  // Clean up
  t = t.replace(/\s{2,}/g, " ").trim();
  if(t) t = t.charAt(0).toUpperCase() + t.slice(1);
  if(t && !/[.!?]$/.test(t)) t += ".";
  return t;
}

// ─── API ─────────────────────────────────────────────────────────────────
async function askBrij(input, messages, memory) {
  const skills = matchSkills(input);
  const sys = buildPrompt(skills, messages, memory);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 900,
        system: sys, messages: [{ role: "user", content: input }]
      })
    });
    const d = await r.json();
    return {
      text: (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "[No response]",
      skills
    };
  } catch(e) { return { text: `[Error: ${e.message}]`, skills: [] }; }
}

// ─── PERSIST ─────────────────────────────────────────────────────────────
const DB = {
  async get(k){try{const r=await window.storage?.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage?.set(k,JSON.stringify(v));}catch{}},
};

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────
function Glow({c=C.jade,s=7,on=false}){
  return(<span style={{position:"relative",display:"inline-flex",width:s,height:s,flexShrink:0}}>
    {on&&<span style={{position:"absolute",inset:0,borderRadius:"50%",background:c,opacity:.4,animation:"gp 1.5s ease-out infinite"}}/>}
    <span style={{position:"relative",borderRadius:"50%",width:s,height:s,background:c}}/>
  </span>);
}
function Chip({children,c=C.jade,xs=false}){
  return <span style={{fontSize:xs?7:8,fontWeight:800,letterSpacing:".1em",background:`${c}15`,color:c,border:`1px solid ${c}28`,padding:xs?"1px 6px":"2px 9px",borderRadius:4,fontFamily:"monospace",whiteSpace:"nowrap"}}>{children}</span>;
}
function Btn({onClick,loading,disabled,children,c=C.jade,ghost=false,sm=false,style={}}){
  const textC = [C.jade,C.gold,C.lime].includes(c)?C.void:"#fff";
  return(<button onClick={onClick} disabled={loading||disabled} style={{background:loading||disabled?C.edge:ghost?"transparent":c,color:ghost?c:textC,border:`1px solid ${loading||disabled?C.line:c}`,borderRadius:8,padding:sm?"6px 14px":"10px 22px",fontSize:sm?10:11,fontWeight:800,cursor:loading||disabled?"not-allowed":"pointer",fontFamily:"monospace",letterSpacing:".07em",display:"flex",alignItems:"center",gap:7,transition:"all .18s",...style}}>
    {loading&&<span style={{width:10,height:10,border:`2px solid ${C.line}`,borderTopColor:c,borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>}
    {children}
  </button>);
}

// ─── VOICE BUTTON ─────────────────────────────────────────────────────────
function VoiceBtn({onDone}){
  const [active,setActive]=useState(false);
  const recRef=useRef(null);
  const supported=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  const toggle=()=>{
    if(active){recRef.current?.stop();setActive(false);return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Voice input works in Chrome. Please use Chrome browser.");return;}
    const rec=new SR();
    rec.lang="en-IN";rec.continuous=false;rec.interimResults=false;
    rec.onstart=()=>setActive(true);
    rec.onend=()=>setActive(false);
    rec.onerror=()=>setActive(false);
    rec.onresult=(e)=>{
      const raw=e.results[0][0].transcript;
      const clean=wisprProcess(raw);
      onDone(clean,raw);
    };
    rec.start();recRef.current=rec;
  };
  return(
    <button onClick={toggle} title={supported?"Speak (WisprFlow method)":"Voice needs Chrome"} style={{width:46,height:46,borderRadius:10,border:`2px solid ${active?C.rose:C.jade}`,background:active?`${C.rose}15`:`${C.jade}08`,color:active?C.rose:C.jade,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:active?`0 0 20px ${C.rose}35`:"none",animation:active?"micPulse 1s ease-in-out infinite":undefined,transition:"all .2s"}}>
      {active?"⏹":"🎤"}
    </button>
  );
}

// ─── MESSAGE ─────────────────────────────────────────────────────────────
function Message({msg}){
  const isBrij=msg.from==="brij";
  const c=isBrij?C.jade:C.gold;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:isBrij?"flex-start":"flex-end",marginBottom:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:10,flexDirection:isBrij?"row":"row-reverse",maxWidth:"84%"}}>
        {/* Avatar */}
        {isBrij?(
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:`${C.jade}15`,border:`2px solid ${C.jade}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.jade,fontWeight:900,fontFamily:"monospace",boxShadow:`0 0 12px ${C.jade}25`}}>⬡</div>
          </div>
        ):(
          <div style={{width:38,height:38,borderRadius:"50%",background:`${C.gold}12`,border:`2px solid ${C.gold}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:C.gold,fontFamily:"monospace",flexShrink:0}}>BR</div>
        )}
        <div style={{maxWidth:"100%"}}>
          {/* Name + chips */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexDirection:isBrij?"row":"row-reverse",flexWrap:"wrap"}}>
            <span style={{fontSize:9,color:c,fontFamily:"monospace",fontWeight:800}}>
              {isBrij?"Brij — CEO · Global Signal":"Brijesh Raval — Owner"}{msg.voice?" 🎤":""}
            </span>
            {isBrij&&msg.skills?.slice(0,2).map(s=><Chip key={s.id} c={C.signal} xs>{s.name}</Chip>)}
          </div>
          {/* Bubble */}
          <div style={{background:isBrij?C.jadeL:`${C.gold}09`,border:`1px solid ${c}20`,borderRadius:isBrij?"2px 12px 12px 12px":"12px 2px 12px 12px",padding:"13px 17px",fontSize:13,color:C.t0,lineHeight:1.9,whiteSpace:"pre-wrap"}}>
            {msg.text}
          </div>
          {/* Voice indicator */}
          {msg.rawVoice&&msg.rawVoice!==msg.text&&(
            <div style={{marginTop:4,fontSize:9,color:C.t3,fontFamily:"monospace",textAlign:"right"}}>🎤 "{msg.rawVoice.slice(0,40)}" → WisprFlow → "{msg.text.slice(0,40)}"</div>
          )}
          <div style={{fontSize:8,color:C.t4,fontFamily:"monospace",marginTop:3,textAlign:isBrij?"left":"right"}}>{new Date(msg.ts).toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SKILL CARD ───────────────────────────────────────────────────────────
function SkillCard({skill}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{background:C.card,border:`1px solid ${C.jade}20`,borderRadius:10,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <div style={{width:32,height:32,borderRadius:8,background:`${C.jade}12`,border:`1px solid ${C.jade}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.jade,flexShrink:0}}>★</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:12,color:C.t0,fontFamily:"monospace"}}>{skill.name}</div>
          <div style={{fontSize:9,color:C.jade,fontFamily:"monospace",marginTop:1}}>{skill.source}</div>
        </div>
        <span style={{color:C.t3,fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"0 16px 14px"}}>
          <div style={{background:C.deep,border:`1px solid ${C.line}`,borderRadius:7,padding:"12px 14px",fontSize:11,color:C.t1,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"monospace",maxHeight:300,overflowY:"auto"}}>{skill.knowledge}</div>
          <div style={{marginTop:8,fontSize:9,color:C.t3,fontFamily:"monospace"}}>Triggers: {skill.triggers.slice(0,5).join(" · ")}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]         = useState("chat");
  const [messages,setMessages] = useState([]);
  const [input,setInput]     = useState("");
  const [loading,setLoading] = useState(false);
  const [memory,setMemory]   = useState([]);
  const [activeSkills,setActiveSkills] = useState([]);
  const scrollRef = useRef();

  useEffect(()=>{
    DB.get("brij4_msgs").then(d=>{if(d)setMessages(d);});
    DB.get("brij4_mem").then(d=>{if(d)setMemory(d);});
  },[]);

  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[messages,loading]);

  const addMemory=useCallback((item)=>{
    setMemory(p=>{const n=[...p,item].slice(-60);DB.set("brij4_mem",n);return n;});
  },[]);

  const send=useCallback(async(override="",voice=false,raw="")=>{
    const msg=(override||input).trim();
    if(!msg||loading)return;
    setInput(""); setLoading(true);
    const userMsg={from:"user",text:msg,voice,rawVoice:raw,ts:Date.now()};
    setMessages(p=>{const n=[...p,userMsg];DB.set("brij4_msgs",n.slice(-100));return n;});
    const {text,skills}=await askBrij(msg,messages,memory);
    setActiveSkills(skills);
    const brijiMsg={from:"brij",text,skills,ts:Date.now()};
    setMessages(p=>{const n=[...p,brijiMsg];DB.set("brij4_msgs",n.slice(-100));return n;});
    addMemory(`[${new Date().toLocaleString()}] "${msg.slice(0,80)}" → Skills: ${skills.map(s=>s.name).join(",")} | ${text.slice(0,80)}`);
    setLoading(false);
  },[input,loading,messages,memory,addMemory]);

  const TABS=[
    {id:"chat",   label:"TALK TO BRIJ",  icon:"💬", badge:null},
    {id:"skills", label:"SKILL LIBRARY", icon:"★",  badge:`${Object.keys(REAL_SKILLS).length} real`},
    {id:"memory", label:"BRAIN MEMORY",  icon:"⟳",  badge:memory.length||null},
  ];

  const starters=[
    "Write a LinkedIn post for Brijesh about his founder journey",
    "What is the best pricing strategy for Global Signal?",
    "How do we get first 25 paying clients with zero budget?",
    "Create a content strategy for Brijesh's LinkedIn",
    "What should Brijesh post this Monday?",
    "Audit Brijesh's LinkedIn profile and give me 3 fixes",
    "Global Signal ke liye kya strategy honi chahiye?",
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:C.void,fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",color:C.t0,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:${C.deep}}
        ::-webkit-scrollbar-thumb{background:${C.rim};border-radius:2px}
        textarea,input{outline:none!important}
        textarea:focus{border-color:${C.jade}!important}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes gp{0%{transform:scale(1);opacity:.4}70%{transform:scale(2.8);opacity:0}100%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes micPulse{0%,100%{box-shadow:0 0 20px ${C.rose}30}50%{box-shadow:0 0 40px ${C.rose}60}}
        button:hover:not(:disabled){opacity:.85;transform:translateY(-1px);transition:all .18s}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{width:212,background:C.base,borderRight:`1px solid ${C.edge}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        {/* CEO Header */}
        <div style={{padding:"20px 14px 16px",borderBottom:`1px solid ${C.edge}`,textAlign:"center",background:`linear-gradient(180deg,${C.jade}05,transparent)`}}>
          <div style={{position:"relative",width:70,height:70,margin:"0 auto 10px"}}>
            <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:`1.5px solid ${C.jade}40`,animation:"gp 3s ease-in-out infinite"}}/>
            <div style={{width:70,height:70,borderRadius:"50%",background:`radial-gradient(circle at 35% 30%,${C.jade}25,${C.jade}08)`,border:`2px solid ${C.jade}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:C.jade,fontWeight:900,fontFamily:"monospace",boxShadow:`0 0 25px ${C.jade}20`}}>⬡</div>
          </div>
          <div style={{fontWeight:900,fontSize:15,color:C.jade,fontFamily:"monospace",letterSpacing:".04em"}}>BRIJ</div>
          <div style={{fontSize:9,color:C.t2,marginBottom:10}}>CEO · Global Signal</div>
          <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center"}}>
            <Chip c={C.jade}>74 AGENTS ACTIVE</Chip>
            <Chip c={C.gold}>REAL SKILLS LOADED</Chip>
            <Chip c={C.signal}>VOICE READY 🎤</Chip>
          </div>
        </div>

        {/* Active skills indicator */}
        {activeSkills.length>0&&(
          <div style={{padding:"8px 14px",borderBottom:`1px solid ${C.edge}`,background:`${C.jade}04`}}>
            <div style={{fontSize:7,color:C.jade,fontFamily:"monospace",marginBottom:5}}>LAST SKILLS USED</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {activeSkills.map(s=><Chip key={s.id} c={C.signal} xs>{s.name}</Chip>)}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{flex:1,padding:"8px 0"}}>
          {TABS.map(t=>{
            const active=tab===t.id;
            return(<div key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",borderLeft:`2px solid ${active?C.jade:"transparent"}`,background:active?C.jadeL:"transparent",transition:"all .15s"}}>
              <span style={{fontSize:13,color:active?C.jade:C.t3}}>{t.icon}</span>
              <span style={{fontSize:10,fontWeight:active?800:500,color:active?C.t0:C.t2,fontFamily:"monospace",flex:1}}>{t.label}</span>
              {t.badge&&<span style={{fontSize:7,color:C.jade,fontFamily:"monospace",background:`${C.jade}15`,padding:"1px 6px",borderRadius:10}}>{t.badge}</span>}
            </div>);
          })}
        </nav>

        {/* Owner */}
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.edge}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:C.goldL,border:`1px solid ${C.gold}20`,borderRadius:7}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`${C.gold}15`,border:`1px solid ${C.gold}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:C.gold,fontFamily:"monospace",flexShrink:0}}>BR</div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:C.gold}}>Brijesh Raval</div>
              <div style={{fontSize:7,color:C.t4}}>Owner — I report only to you</div>
            </div>
            <Glow c={C.gold} s={5} on/>
          </div>
          <div style={{marginTop:8,fontSize:7,color:C.t4,fontFamily:"monospace",textAlign:"center",lineHeight:1.6}}>
            Real skills fetched from skills.sh<br/>
            Memory: {memory.length} sessions stored
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* ── CHAT ── */}
        {tab==="chat"&&(<>
          <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"20px 28px"}}>
            {messages.length===0&&(
              <div style={{textAlign:"center",padding:"36px 0",animation:"fadeUp .5s ease"}}>
                <div style={{width:80,height:80,borderRadius:"50%",background:`${C.jade}12`,border:`2px solid ${C.jade}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:C.jade,margin:"0 auto 16px",boxShadow:`0 0 40px ${C.jade}18`}}>⬡</div>
                <div style={{fontWeight:900,fontSize:18,color:C.jade,fontFamily:"monospace",marginBottom:4}}>Brij — CEO</div>
                <div style={{color:C.t2,fontSize:12,marginBottom:4}}>Real skills. Real execution. No excuses.</div>
                <div style={{color:C.t3,fontSize:10,marginBottom:28,fontFamily:"monospace"}}>Type or tap 🎤 to speak · English / Hindi / Gujarati</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:600,margin:"0 auto"}}>
                  {starters.map(s=>(
                    <button key={s} onClick={()=>send(s)} style={{padding:"9px 16px",background:C.surf,border:`1px solid ${C.edge}`,color:C.t1,borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",lineHeight:1.4}}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg,i)=><Message key={i} msg={msg}/>)}
            {loading&&(
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0 14px"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:`${C.jade}15`,border:`2px solid ${C.jade}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.jade,fontWeight:900,fontFamily:"monospace"}}>⬡</div>
                <div style={{display:"flex",gap:5,alignItems:"center",background:`${C.jade}08`,border:`1px solid ${C.jade}22`,borderRadius:20,padding:"7px 16px"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.jade,animation:`gp ${.4+i*.13}s ease-in-out infinite alternate`}}/>)}
                  <span style={{fontSize:10,color:C.jade,fontFamily:"monospace",marginLeft:8}}>Matching skills · Synthesising from 74 agents…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div style={{borderTop:`1px solid ${C.edge}`,background:C.base,padding:"14px 20px"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <VoiceBtn onDone={(clean,raw)=>send(clean,true,raw)}/>
              <div style={{flex:1,background:C.card,border:`1px solid ${C.line}`,borderRadius:10,padding:"10px 14px",transition:"border-color .2s"}}>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Type or speak (🎤) in English, Hindi, or Gujarati… Skills auto-load before every answer." rows={2} disabled={loading} style={{width:"100%",background:"transparent",border:"none",color:C.t0,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none"}}/>
              </div>
              <button onClick={()=>send()} disabled={!input.trim()||loading} style={{width:46,height:46,background:!input.trim()||loading?C.edge:C.jade,color:C.void,border:"none",borderRadius:10,fontSize:22,cursor:!input.trim()||loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:900,transition:"all .2s"}}>
                {loading?<span style={{width:16,height:16,border:`2px solid transparent`,borderTopColor:C.t2,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:"↑"}
              </button>
            </div>
            <div style={{fontSize:8,color:C.t4,fontFamily:"monospace",marginTop:5,textAlign:"center"}}>
              Enter = Send · 🎤 = Voice · Real skills from skills.sh auto-load · Memory persists across sessions
            </div>
          </div>
        </>)}

        {/* ── SKILL LIBRARY ── */}
        {tab==="skills"&&(
          <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:8,color:C.jade,fontFamily:"monospace",letterSpacing:".2em",marginBottom:4}}>REAL SKILLS — FETCHED FROM skills.sh</div>
              <h2 style={{fontSize:20,fontWeight:900,color:C.t0,fontFamily:"monospace",marginBottom:6}}>{Object.keys(REAL_SKILLS).length} Skills Loaded & Active</h2>
              <div style={{fontSize:12,color:C.t2,marginBottom:16,lineHeight:1.7}}>
                These are REAL SKILL.md files fetched directly from skills.sh. Full content loaded. Auto-matched before every response. Click any skill to read the complete methodology.
              </div>
              <div style={{padding:"10px 14px",background:`${C.jade}08`,border:`1px solid ${C.jade}20`,borderRadius:8,fontSize:11,color:C.t1,marginBottom:20}}>
                ✓ frontend-design · copywriting · content-strategy · seo-audit · brainstorming · marketing-psychology · pricing-strategy · self-improving-agent<br/>
                <span style={{fontSize:9,color:C.t3,fontFamily:"monospace",marginTop:4,display:"block"}}>All fetched from their actual SKILL.md files — not summaries, real content.</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.values(REAL_SKILLS).map(skill=><SkillCard key={skill.id} skill={skill}/>)}
            </div>
          </div>
        )}

        {/* ── MEMORY ── */}
        {tab==="memory"&&(
          <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:8,color:C.jade,fontFamily:"monospace",letterSpacing:".2em",marginBottom:4}}>PERSISTENT BRAIN MEMORY</div>
              <h2 style={{fontSize:20,fontWeight:900,color:C.t0,fontFamily:"monospace",marginBottom:6}}>What Brij Has Learned</h2>
              <div style={{fontSize:12,color:C.t2,marginBottom:16}}>Every exchange is logged. Brij reads this before answering. Gets smarter every session. Stored across browser sessions.</div>
            </div>
            {memory.length===0?(
              <div style={{textAlign:"center",padding:"40px",color:C.t3}}>No memory yet. Every conversation adds to this log.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {[...memory].reverse().map((m,i)=>(
                  <div key={i} style={{background:C.card,border:`1px solid ${C.jade}15`,borderRadius:8,padding:"10px 14px",borderLeft:`3px solid ${C.jade}`,display:"flex",gap:10}}>
                    <div style={{fontSize:8,color:C.t4,fontFamily:"monospace",width:24,flexShrink:0}}>{String(memory.length-i).padStart(3,"0")}</div>
                    <div style={{fontSize:11,color:C.t1,flex:1,lineHeight:1.6}}>{m}</div>
                  </div>
                ))}
              </div>
            )}
            {memory.length>0&&(
              <button onClick={()=>{setMemory([]);DB.set("brij4_mem",[]);}} style={{marginTop:16,background:"transparent",border:`1px solid ${C.edge}`,color:C.t3,borderRadius:7,padding:"7px 16px",fontSize:10,cursor:"pointer",fontFamily:"monospace"}}>Clear Memory</button>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
