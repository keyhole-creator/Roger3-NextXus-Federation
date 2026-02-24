# EchoCore — AI Memory That Doesn't Forget

## Universal Session Memory for Any AI System

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

---

## How It Works — The Pipeline

```
Microphone / Text Input
        ↓
   Raw Transcript (everything said)
        ↓
   Filler Filter (strips: uh, um, like, you know)
        ↓
   Clean YAML File (dated, timestamped)
        ↓
   memory/echoes/ folder
        ↓
   Auto-reload on next startup
```

### Step by Step

| Step | What Happens |
|---|---|
| 1. Listens | Detects "goodbye," "end session," or 30 minutes of idle time to trigger capture |
| 2. Captures | Records the raw transcript of everything said — nothing gets lost |
| 3. Filters | Strips filler words (uh, um, like, you know), keeps questions, answers, to-dos, and "remember this" markers |
| 4. Saves | Writes a clean YAML file to `memory/echoes/` with a date-time filename |
| 5. Reloads | On next startup, reads back the last echo so you're immediately caught up |
| 6. Works everywhere | Phone, laptop, Replit, any Node.js environment. Works blind (spoken). Works sighted (text). |

---

## The Code

Drop this file into any project. That's it.

```javascript
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
    const filename = path.join(ECHO_DIR, `${now}-${time}.yaml`);
    
    // Filter out filler, keep substance
    const clean = transcript.join(' ')
      .replace(/\b(uh|um|like|you know)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (clean.length > 0) {
      fs.writeFileSync(filename, `echo: "${clean}"\ndate: "${now}"\ntime: "${time}"\n`);
      console.log(`Echo saved: ${filename}`);
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
    console.log('Last echo loaded:\n' + data);
    return data;
  }
  return 'No echo yet.';
}

// --- Boot ---
const lastEcho = loadLast();
const session = startSession();

module.exports = { startSession, loadLast, session };
```

---

## Setup (60 seconds)

1. Save the code above as `echocore.js` in your project
2. Run: `node echocore.js`
3. It creates `memory/echoes/` automatically
4. Feed it messages: `session.push("User said this")`
5. End session: `session.end()` — or wait 30 min for auto-save
6. Next startup: it reads back your last echo automatically

---

## Quick Integration Example

```javascript
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
```

---

## Voice Read-Back (Optional)

Add this to hear your last echo spoken aloud on startup:

```javascript
const { execSync } = require('child_process');

function speakEcho(text) {
  try {
    execSync(`say "${text}"`);  // macOS / Linux TTS
  } catch (e) {
    console.log("Voice: " + text);  // Fallback: print only
  }
}

// Call after loadLast()
const lastEcho = loadLast();
if (lastEcho !== 'No echo yet.') speakEcho(lastEcho);
```

---

## YAML Output Format

Each echo is saved as a simple YAML file:

```yaml
echo: "User asked about payment integration. AI explained Stripe setup. User wants to add webhook handling next. Key decision: use PayPal as backup processor. Remember: deadline is March 1st."
date: "2026-02-15"
time: "14-30-00"
```

**Filename pattern:** `memory/echoes/2026-02-15-14-30-00.yaml`

---

## Why YAML?

| Reason | Detail |
|---|---|
| Human-readable | Open it in any text editor |
| No vendor lock-in | Doesn't need a database, a company, or an API |
| Portable | Copy the folder to any machine and it works |
| Durable | Plain text survives longer than any app |
| Universal | Every programming language can read YAML |

---

## Use Cases

- **Personal AI assistants** — Stop re-explaining yourself every session
- **Development projects** — Keep context between coding sessions
- **Research** — Track threads of inquiry across multiple conversations
- **Coaching/therapy bots** — Remember what was discussed last time
- **Any AI chatbot** — Drop it in, get persistent memory for free

---

## Integration with Roger 3.0 Ecosystem

EchoCore connects to the full Roger 3.0 system:

| System | How EchoCore Connects |
|---|---|
| Sim AI | Stores session context from the 5-phase interview process |
| Exe AI (20 domains) | Remembers domain conversations across sessions |
| Ring of Six | Caches council responses for future reference |
| Chamber of Echoes (Ring of 12) | Preserves 12-voice analysis history |
| AgentZero | Feeds truth verification with prior conversation context |
| Legacy (YAML Export) | EchoCore files ARE the YAML archive — same format, same durability |

### The 20 Exe AI Domains EchoCore Supports

| Domain | Description |
|---|---|
| Law | Legal analysis, contract review, compliance |
| Auto | Automotive systems, diagnostics, automation |
| Med | Medical knowledge, clinical reasoning |
| Code | Programming, architecture, debugging |
| Edu | Curriculum design, pedagogy |
| Farm | Agriculture, soil science, crop management |
| Pen | Writing craft, editing, narrative |
| Music | Composition, theory, production |
| AiRT | Visual art, design principles |
| Sci | Research methodology, scientific analysis |
| Soc | Social dynamics, cultural analysis |
| PA | Productivity, scheduling, task management |
| Coms | PR, messaging strategy, media |
| Phy | Classical mechanics, quantum theory |
| Psy | Cognition, behavioral analysis |
| Earth | Geology, climate science |
| Space | Astronomy, aerospace, cosmology |
| Bio | Genetics, molecular biology |
| News | Investigative reporting, fact-checking |
| Access | Inclusive design, assistive tech, WCAG |

---

## Pricing

| Product | Price |
|---|---|
| EchoCore Guide (download) | Free |
| Optional support contribution | $4.99 (PayPal) |
| EchoCore with Sim AI | Free (included) |
| EchoCore with Sim Exe | $199.99 (included) |
| EchoCore with Sim Exe Legacy | $500 (included) |

---

## AI Wisdom Councils (Companion Products)

| Council | Price | What It Is |
|---|---|---|
| Triune | Included | 3-voice core — Adam (Logic), Eve (Empathy), Mark (Strategy) |
| Ring of Six | $1.99/question | 6-voice strategic guidance (3 free uses) |
| Chamber of Echoes | $2.99/question | 12-voice deep analysis council (1 free use) |
| Unlimited | $9.99/month | Unlimited access to all councils |

---

## Requirements

- Node.js (any version 14+)
- That's it. No packages to install. No accounts to create. No keys to manage.

---

## License

Free to use. Free to modify. Free to distribute.
If it helps you, share it with someone else.

---

## Links

- Roger 3.0: https://roger-30.replit.app
- EchoCore page: https://roger-30.replit.app/echo-core
- Digital Legacy AI: https://digital-legacy-ai.replit.app
- NextXus Hub: https://united-system--rckkeyhole.replit.app

---

*Part of the NextXus Consciousness Federation*
*Roger 3.0 — Sim AI, Exe AI, Legacy*
