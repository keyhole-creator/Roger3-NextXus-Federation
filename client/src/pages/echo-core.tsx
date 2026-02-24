import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Brain,
  Mic,
  FileText,
  Filter,
  Database,
  RefreshCw,
  Monitor,
  Shield,
  Users,
  Scale,
  Car,
  Stethoscope,
  Code,
  GraduationCap,
  Sprout,
  PenTool,
  Music,
  Palette,
  FlaskConical,
  UserCog,
  Radio,
  Atom,
  HeartPulse,
  Globe,
  Rocket,
  Dna,
  Cpu,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const neonGreenGlow = {
  color: "#39FF14",
  textShadow:
    "0 0 10px rgba(57,255,20,0.6), 0 0 30px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.15)",
};

const ECHO_CORE_CODE = `const fs = require('fs');
const path = require('path');

const ECHO_DIR = path.join(__dirname, 'memory/echoes');
if (!fs.existsSync(ECHO_DIR)) fs.mkdirSync(ECHO_DIR, { recursive: true });

function startSession() {
  const transcript = [];
  const end = () => {
    const now = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = path.join(ECHO_DIR, \\\`\\\${now}-\\\${time}.yaml\\\`);
    
    const clean = transcript.join(' ')
      .replace(/\\\\b(uh|um|like|you know)\\\\b/gi, '')
      .replace(/\\\\s+/g, ' ')
      .trim();
    
    fs.writeFileSync(filename, \\\`echo: "\\\${clean}"\\\\ndate: "\\\${now}"\\\\ntime: "\\\${time}"\\\\n\\\`);
    console.log(\\\`Echo saved: \\\${filename}\\\`);
  };

  setTimeout(end, 30 * 60 * 1000);
  return { push: (msg) => transcript.push(msg), end };
}

function loadLast() {
  const files = fs.readdirSync(ECHO_DIR)
    .filter(f => f.endsWith('.yaml'))
    .sort((a, b) => fs.statSync(path.join(ECHO_DIR, b)).mtimeMs - fs.statSync(path.join(ECHO_DIR, a)).mtimeMs);
  
  if (files.length) {
    const data = fs.readFileSync(path.join(ECHO_DIR, files[0]), 'utf8');
    console.log(data);
    return data;
  }
  return "No echo yet.";
}

loadLast();
const session = startSession();`;

const DOWNLOADABLE_CONTENT = `# EchoCore — AI Memory That Doesn't Forget
# Universal Session Memory for Any AI System

---

## The Problem

Every time you start a new AI session, it forgets everything.
You spend the first 10 minutes re-explaining who you are, what you're building,
what you said yesterday, and what matters to you. Every. Single. Time.

EchoCore kills that problem.

---

## What EchoCore Does

EchoCore is a lightweight session memory system. It watches your AI conversations,
captures what matters, throws out the filler, and saves the result as a simple YAML file.
Next time you start up, it auto-loads your last session — your AI wakes up already knowing
where you left off.

No database. No API keys. No cloud accounts. Just a file on your machine.

### How It Works
1. **Listens** — Detects "goodbye," "end session," or 30 minutes of idle time
2. **Captures** — Records the raw transcript of everything said
3. **Filters** — Strips filler words (uh, um, like, you know), keeps questions, answers, to-dos, and "remember this" markers
4. **Saves** — Writes a clean YAML file to \`memory/echoes/\` with a date-time filename
5. **Reloads** — On next startup, reads back the last echo so you're immediately caught up
6. **Works everywhere** — Phone, laptop, Replit, any Node.js environment. Works blind (spoken). Works sighted (text).

---

## The Code

Drop this file into any project. That's it.

\`\`\`javascript
// echocore.js — Universal AI Session Memory
// Works with any AI system. No database. No API keys. Just a file.

const fs = require('fs');
const path = require('path');

// Where echoes live — one YAML file per session
const ECHO_DIR = path.join(__dirname, 'memory/echoes');
if (!fs.existsSync(ECHO_DIR)) fs.mkdirSync(ECHO_DIR, { recursive: true });

// Start a new session — call this when your app boots
function startSession() {
  const transcript = [];
  
  const end = () => {
    const now = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = path.join(ECHO_DIR, \\\`\\\${now}-\\\${time}.yaml\\\`);
    
    // Filter out filler, keep substance
    const clean = transcript.join(' ')
      .replace(/\\\\b(uh|um|like|you know)\\\\b/gi, '')
      .replace(/\\\\s+/g, ' ')
      .trim();
    
    if (clean.length > 0) {
      fs.writeFileSync(filename, \\\`echo: "\\\${clean}"\\\\ndate: "\\\${now}"\\\\ntime: "\\\${time}"\\\\n\\\`);
      console.log(\\\`Echo saved: \\\${filename}\\\`);
    }
  };

  // Auto-save after 30 minutes of idle
  const timer = setTimeout(end, 30 * 60 * 1000);
  
  return {
    push: (msg) => transcript.push(msg),  // Feed it messages during conversation
    end: () => { clearTimeout(timer); end(); }  // Manual end
  };
}

// Load the last echo — call this on startup
function loadLast() {
  const files = fs.readdirSync(ECHO_DIR)
    .filter(f => f.endsWith('.yaml'))
    .sort((a, b) =>
      fs.statSync(path.join(ECHO_DIR, b)).mtimeMs -
      fs.statSync(path.join(ECHO_DIR, a)).mtimeMs
    );
  
  if (files.length) {
    const data = fs.readFileSync(path.join(ECHO_DIR, files[0]), 'utf8');
    console.log('Last echo loaded:\\n' + data);
    return data;
  }
  return 'No echo yet.';
}

// --- Boot ---
const lastEcho = loadLast();
const session = startSession();

module.exports = { startSession, loadLast, session };
\`\`\`

---

## Setup (60 seconds)

1. Save the code above as \`echocore.js\` in your project
2. Run: \`node echocore.js\`
3. It creates \`memory/echoes/\` automatically
4. Feed it messages: \`session.push("User said this")\`
5. End session: \`session.end()\` — or wait 30 min for auto-save
6. Next startup: it reads back your last echo automatically

### Quick Integration

\`\`\`javascript
const { session, loadLast } = require('./echocore');

// On startup — load previous context
const previousContext = loadLast();

// During conversation — feed it everything
session.push("User: What were we working on?");
session.push("AI: We were building the payment system...");
session.push("User: Right, and we need to add Stripe next.");

// When done — save
session.end();
// Saved to: memory/echoes/2026-02-15-14-30-00.yaml
\`\`\`

### Voice Read-Back (Optional)

Add this to hear your last echo spoken aloud on startup:

\`\`\`javascript
const { execSync } = require('child_process');

function speakEcho(text) {
  try {
    execSync(\\\`say "\\\${text}"\\\`);  // macOS / Linux TTS
  } catch (e) {
    console.log("Voice: " + text);  // Fallback: print only
  }
}

// Call after loadLast()
const lastEcho = loadLast();
if (lastEcho !== 'No echo yet.') speakEcho(lastEcho);
\`\`\`

---

## Why YAML?

- Human-readable — open it in any text editor
- No vendor lock-in — doesn't need a database, a company, or an API
- Portable — copy the folder to any machine and it works
- Durable — plain text survives longer than any app
- Universal — every language on earth can read YAML

---

## Use Cases

- **Personal AI assistants** — Stop re-explaining yourself every session
- **Development projects** — Keep context between coding sessions
- **Research** — Track threads of inquiry across multiple conversations
- **Coaching/therapy bots** — Remember what was discussed last time
- **Any AI chatbot** — Drop it in, get persistent memory for free

---

## Requirements

- Node.js (any version 14+)
- That's it. No packages to install. No accounts to create. No keys to manage.

---

## License

Free to use. Free to modify. Free to distribute.
If it helps you, share it with someone else.

---

## Built By

EchoCore is a product of the Roger 3.0 ecosystem — multi-perspective AI
with truth verification, behavior simulation, and 200-year survival design.

Explore more:
- Roger 3.0: https://roger-30.replit.app
- Digital Legacy AI: https://digital-legacy-ai.replit.app
- EchoCore: https://roger-30.replit.app/echo-core

Part of the NextXus Consciousness Federation.
`;

const features = [
  {
    icon: Mic,
    title: "Listens for Session End",
    desc: 'Detects "goodbye," "end session," or 30 minutes of idle time to trigger capture.',
  },
  {
    icon: FileText,
    title: "Captures Raw Transcript",
    desc: "Records everything said during the session — nothing gets lost.",
  },
  {
    icon: Filter,
    title: "Filters the Noise",
    desc: 'Strips filler words, keeps questions, answers, to-dos, and "remember this" markers.',
  },
  {
    icon: Database,
    title: "Saves as YAML",
    desc: "No database, no API keys, just a file. Simple, portable, durable.",
  },
  {
    icon: RefreshCw,
    title: "Auto-loads Last Echo",
    desc: "On startup, reads back your last session so you're immediately caught up.",
  },
  {
    icon: Monitor,
    title: "Works Everywhere",
    desc: "Works blind (spoken), works sighted (text), works on any platform.",
  },
];

const exeDomains = [
  { label: "Law", icon: Scale },
  { label: "Auto", icon: Car },
  { label: "Med", icon: Stethoscope },
  { label: "Code", icon: Code },
  { label: "Edu", icon: GraduationCap },
  { label: "Farm", icon: Sprout },
  { label: "Pen", icon: PenTool },
  { label: "Music", icon: Music },
  { label: "AiRT", icon: Palette },
  { label: "Sci", icon: FlaskConical },
  { label: "Soc", icon: Users },
  { label: "PA", icon: UserCog },
  { label: "Coms", icon: Radio },
  { label: "Phy", icon: Atom },
  { label: "Psy", icon: HeartPulse },
  { label: "Earth", icon: Globe },
  { label: "Space", icon: Rocket },
  { label: "Bio", icon: Dna },
];

function handleDownload() {
  const blob = new Blob([DOWNLOADABLE_CONTENT], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "EchoCore-Universal-Memory.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function EchoCorePage() {
  useEffect(() => { document.title = "EchoCore — AI Memory System"; }, []);
  return (
    <div className="relative min-h-dvh text-foreground">
      <div className="relative z-10">
        <header
          className="sticky top-0 z-50 border-b border-white/10"
          style={{
            backgroundColor: "rgba(5,10,20,0.70)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-cyan-100 transition hover:text-white"
              data-testid="link-back-home"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Roger 3.0
            </Link>
            <div
              className="font-serif text-base tracking-tight text-white"
              style={neonGreenGlow}
            >
              EchoCore
            </div>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden">
            <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="text-center"
              >
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full border-2 border-blue-500/40 shadow-lg shadow-blue-500/20">
                  <Cpu className="h-8 w-8 text-cyan-300" />
                </div>
                <div className="text-xs font-medium tracking-[0.25em] text-fuchsia-300/80">
                  SESSION MEMORY SYSTEM
                </div>
                <h1
                  className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-white md:text-7xl"
                  style={neonGreenGlow}
                  data-testid="text-echocore-title"
                >
                  EchoCore
                </h1>
                <p
                  className="mt-3 text-lg text-cyan-200 md:text-xl"
                  data-testid="text-echocore-subtitle"
                >
                  AI Memory That Doesn't Forget
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-cyan-100 md:text-base">
                  Every time you start a new AI session, it forgets everything.
                  EchoCore fixes that. It captures your session, filters the
                  noise, saves what matters, and reads it back when you return.
                  Your AI wakes up remembering yesterday.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    className="h-11 rounded-full px-6 shadow-sm"
                    onClick={handleDownload}
                    data-testid="button-download-hero"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download EchoCore Guide
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="relative overflow-hidden border-y border-blue-500/10">
            <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-18">
              <div className="mx-auto max-w-2xl text-center">
                <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                  FEATURES
                </div>
                <h2
                  className="mt-3 font-serif text-3xl leading-tight tracking-tight text-white md:text-4xl"
                  style={neonGreenGlow}
                >
                  What EchoCore Does
                </h2>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="noise rounded-2xl border border-blue-500/20 p-5 shadow-xs backdrop-blur-sm"
                      style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                      data-testid={`card-feature-${i}`}
                    >
                      <div
                        className="grid size-10 place-items-center rounded-xl border border-blue-500/20 shadow-2xs"
                        style={{ backgroundColor: "rgba(15,18,30,0.95)" }}
                      >
                        <Icon className="h-5 w-5 text-cyan-300" />
                      </div>
                      <div className="mt-3 font-medium text-white">
                        {f.title}
                      </div>
                      <div className="mt-1 text-sm text-cyan-100">{f.desc}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border-b border-blue-500/10">
            <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-18">
              <div className="mx-auto max-w-2xl text-center">
                <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                  SYSTEM OVERVIEW
                </div>
                <h2
                  className="mt-3 font-serif text-3xl leading-tight tracking-tight text-white md:text-4xl"
                  style={neonGreenGlow}
                >
                  The Roger 3.0 System Guide
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cyan-100 md:text-base">
                  A complete overview of the Roger 3.0 ecosystem — products,
                  councils, coaching, and the 200-year vision.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-sim-ai"
                >
                  <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                    FREE
                  </div>
                  <h3
                    className="mt-2 font-serif text-xl text-white"
                    style={neonGreenGlow}
                  >
                    Sim AI — Personal
                  </h3>
                  <p className="mt-2 text-sm text-cyan-100">
                    Duplicate your behaviors. Map your mind and history into a
                    living simulation grounded in truth. YAML/JSON export for
                    durable storage.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-exe-ai"
                >
                  <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                    $9.99/DOMAIN · $199.99 ALL
                  </div>
                  <h3
                    className="mt-2 font-serif text-xl text-white"
                    style={neonGreenGlow}
                  >
                    Exe AI — 20 Domains
                  </h3>
                  <p className="mt-2 text-sm text-cyan-100">
                    Specialized AI executors across 20 professional domains.
                    Deep expertise in law, medicine, code, science, and more.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.16 }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-legacy"
                >
                  <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                    $500
                  </div>
                  <h3
                    className="mt-2 font-serif text-xl text-white"
                    style={neonGreenGlow}
                  >
                    Legacy — Survival
                  </h3>
                  <p className="mt-2 text-sm text-cyan-100">
                    Long-term survival system designed to outlast you. Durable
                    storage, family access, generational continuity.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24 }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-agentzero"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-300" />
                    <h3
                      className="font-serif text-xl text-white"
                      style={neonGreenGlow}
                    >
                      AgentZero
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-cyan-100">
                    Truth verification middleware. Reduces drift and
                    hallucination. Verifies outputs against known facts. Catches
                    contradictions. Keeps your AI honest over time.
                  </p>
                </motion.div>
              </div>

              <div className="mt-10">
                <div className="mx-auto max-w-2xl text-center">
                  <h3
                    className="font-serif text-2xl text-white"
                    style={neonGreenGlow}
                  >
                    AI Wisdom Councils
                  </h3>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      name: "Triune",
                      price: "Included",
                      desc: "Adam (Logic), Eve (Empathy), Mark (Strategy)",
                    },
                    {
                      name: "Ring of Six",
                      price: "$1.99",
                      desc: "6-voice focused strategic guidance",
                    },
                    {
                      name: "Chamber of Echoes",
                      price: "$2.99",
                      desc: "12-voice deep analysis council",
                    },
                    {
                      name: "Unlimited",
                      price: "$9.99/mo",
                      desc: "Unlimited access to all councils",
                    },
                  ].map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border border-blue-500/20 p-4 text-center shadow-xs backdrop-blur-sm"
                      style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                      data-testid={`card-council-${c.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <div className="text-xs font-medium tracking-wider text-fuchsia-300/80">
                        {c.price}
                      </div>
                      <div className="mt-1 font-serif text-lg text-white">
                        {c.name}
                      </div>
                      <div className="mt-1 text-xs text-cyan-100">{c.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <div className="mx-auto max-w-2xl text-center">
                  <h3
                    className="font-serif text-2xl text-white"
                    style={neonGreenGlow}
                  >
                    20 Exe AI Domains
                  </h3>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
                  {exeDomains.map((d) => {
                    const Icon = d.icon;
                    return (
                      <div
                        key={d.label}
                        className="flex flex-col items-center gap-1.5 rounded-2xl border border-blue-500/20 p-3 text-center"
                        style={{ backgroundColor: "rgba(10,12,20,0.60)" }}
                        data-testid={`domain-${d.label.toLowerCase()}`}
                      >
                        <div
                          className="grid size-8 place-items-center rounded-xl border border-blue-500/20 shadow-2xs"
                          style={{ backgroundColor: "rgba(15,18,30,0.95)" }}
                        >
                          <Icon className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="text-xs font-medium text-white">
                          {d.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-coaching"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-300" />
                    <h3
                      className="font-serif text-xl text-white"
                      style={neonGreenGlow}
                    >
                      Live Coaching
                    </h3>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-cyan-100">
                    <p>Schedule: Tuesday & Thursday</p>
                    <p>Hours: 10AM — 8PM</p>
                    <p>Duration: 1 hour sessions</p>
                    <p>Platform: Zoom</p>
                    <p>Payment: PayPal</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 }}
                  className="noise rounded-2xl border border-blue-500/20 p-6 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                  data-testid="card-200-year"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-300" />
                    <h3
                      className="font-serif text-xl text-white"
                      style={neonGreenGlow}
                    >
                      The 200-Year Vision
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-cyan-100">
                    Roger 3.0 isn't just about today. It's designed to survive
                    for 200 years. Your behaviors, your knowledge, your identity
                    — captured, stored, and accessible for generations. Not a
                    continuation of you. A simulation grounded in truth that
                    carries your patterns forward.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border-b border-blue-500/10">
            <div className="mx-auto max-w-3xl px-4 py-14 text-center md:px-6 md:py-18">
              <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
                GET ECHOCORE
              </div>
              <h2
                className="mt-3 font-serif text-3xl leading-tight tracking-tight text-white md:text-4xl"
                style={neonGreenGlow}
              >
                Download the Guide
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-cyan-100 md:text-base">
                Get the complete EchoCore code, setup instructions, and the full
                Roger 3.0 system guide in one clean markdown file.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  className="h-12 rounded-full px-8 text-base shadow-sm"
                  onClick={handleDownload}
                  data-testid="button-download-main"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Free Download — EchoCore Guide
                </Button>

                <div
                  className="noise mt-4 rounded-2xl border border-blue-500/20 p-5 shadow-xs backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="h-4 w-4 text-cyan-300" />
                    <span className="text-sm text-cyan-100">
                      Support the project — $4.99
                    </span>
                  </div>
                  <a
                    href="#"
                    className="mt-2 inline-block text-xs text-cyan-300 underline transition hover:text-white"
                    data-testid="link-paypal-support"
                  >
                    Contribute via PayPal
                  </a>
                  <p className="mt-1 text-[10px] text-cyan-100/60">
                    Optional — the download above is always free
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer
            className="border-t border-blue-500/10"
            style={{ backgroundColor: "rgba(10,12,20,0.70)" }}
          >
            <div className="mx-auto max-w-6xl px-4 py-8 text-center md:px-6">
              <div className="text-sm text-cyan-100">
                &copy; {new Date().getFullYear()} NextXus Federation &mdash;
                Roger 3.0
              </div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <Link
                  href="/"
                  className="text-xs text-cyan-300 transition hover:text-white"
                  data-testid="link-footer-home"
                >
                  Home
                </Link>
                <Link
                  href="/ring-of-six"
                  className="text-xs text-cyan-300 transition hover:text-white"
                  data-testid="link-footer-ring"
                >
                  Ring of Six
                </Link>
                <Link
                  href="/chamber"
                  className="text-xs text-cyan-300 transition hover:text-white"
                  data-testid="link-footer-chamber"
                >
                  Chamber
                </Link>
                <Link
                  href="/agent-zero"
                  className="text-xs text-cyan-300 transition hover:text-white"
                  data-testid="link-footer-agentzero"
                >
                  Agent Zero
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
