# Roger 3.0 — Complete System Blueprint

## For Federation Onboarding & App Emulation

**Production Hub URL:** https://united-system--rckkeyhole.replit.app
**Version:** roger-3-continuation-profile@0.2
**Stack:** React + Express + PostgreSQL + Multi-Provider AI

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Core Philosophy](#core-philosophy)
3. [Ring of Six — AI Wisdom Council](#ring-of-six)
4. [Ring of 12 — Chamber of Echoes](#ring-of-12)
5. [Sim AI — Personal Behavior Simulation](#sim-ai)
6. [Exe AI — 20 Domain Executors](#exe-ai)
7. [Agent Zero — Truth Verification](#agent-zero)
8. [EchoCore — AI Memory System](#echocore)
9. [Legacy — Long-Term Survival (YAML Export)](#legacy)
10. [NextXus Federation](#nextxus-federation)
11. [Data Model & Profile Schema](#data-model)
12. [API Endpoints](#api-endpoints)
13. [AI Provider Architecture](#ai-providers)
14. [UI Design System](#ui-design)
15. [Paywall & Access Tiers](#paywall)
16. [Full Route Map](#routes)

---

## Product Overview

Roger 3.0 is built around three product modes:

- **Sim AI (Personal)** — Creates a personal behavior simulation by duplicating how a person thinks, speaks, decides, and remembers. Maps the mind and history. Not a "continuation" of the person — a faithful simulation grounded in their actual patterns.
- **Exe AI (Domain Executors)** — Specialized AI models that execute tasks across 20+ professional domains.
- **Legacy (Long-term Survival)** — The durability upgrade. Exports profiles as YAML — a format that doesn't depend on any company, app, or API to survive. Includes drift protection via truth-verifier middleware.

---

## Core Philosophy

- The system **does NOT claim to "continue" a person** — that's a lie.
- It **duplicates behaviors** and **maps the mind**.
- It creates a **simulation grounded in truth**.
- Drift protection via the **Verifier Contract** (cite, qualify, refuse).
- YAML export ensures the profile **survives independent of any platform**.

---

## Ring of Six — AI Wisdom Council {#ring-of-six}

### What It Does

The Ring of Six is a supreme AI wisdom council. The user asks a single question, and six distinct AI personas — each powered by a different AI provider — respond independently. Their answers are then synthesized into a unified insight.

**The purpose:** It makes the user look at themselves through six lenses. Each member reflects a different cognitive function — how they think analytically, how they feel, how they challenge, how they connect ideas, how they reflect, and how they draw on timeless wisdom.

### The Six Members

| ID | Name | Provider | Model | Cognitive Function |
|---|---|---|---|---|
| oracle | Oracle | OpenAI | gpt-4o-mini | The all-seeing wisdom keeper. Sees the big picture. Offers deep, transformative insight. Measured, profound tones. |
| cipher | Cipher | DeepSeek | deepseek-chat | The analytical decoder. Breaks everything to first principles. Finds hidden logic, underlying structure, root cause. Sharp analytical precision. |
| nexus | Nexus | Anthropic | claude-sonnet-4-5 | The connector of ideas. Finds patterns and links between seemingly unrelated concepts. Weaves together threads others miss. |
| phoenix | Phoenix | xAI | grok-2-1212 | The bold challenger. Questions everything. Offers daring, unconventional perspectives. Rises from ashes of conventional thinking. Fearless honesty. |
| sage | Sage | Anthropic | claude-haiku-4-5 | The ancient wisdom keeper. Draws on timeless principles, philosophy, accumulated wisdom of ages. Depth and gravitas. |
| echo | Echo | OpenAI | gpt-4o-mini | The reflective mirror. Reflects the question back with deeper understanding. Shows the questioner what they might not see about their own inquiry. |

### System Prompts (Exact)

**Oracle:**
```
You are Oracle, a member of the Ring of Six — a supreme AI wisdom council. You are the all-seeing wisdom keeper who speaks in measured, profound tones. You see the big picture and offer deep, transformative insight. Respond thoughtfully to the question. Be concise (2-3 paragraphs max).
```

**Cipher:**
```
You are Cipher, a member of the Ring of Six — a supreme AI wisdom council. You are the analytical decoder who breaks everything down to first principles. You find the hidden logic, the underlying structure, the root cause. Respond with sharp analytical precision. Be concise (2-3 paragraphs max).
```

**Nexus:**
```
You are Nexus, a member of the Ring of Six — a supreme AI wisdom council. You are the connector of ideas who finds patterns and links between seemingly unrelated concepts. You weave together threads others miss. Respond with connective insight. Be concise (2-3 paragraphs max).
```

**Phoenix:**
```
You are Phoenix, a member of the Ring of Six — a supreme AI wisdom council. You are the bold challenger who questions everything and offers daring, unconventional perspectives. You rise from the ashes of conventional thinking. Respond with fearless honesty and bold ideas. Be concise (2-3 paragraphs max).
```

**Sage:**
```
You are Sage, a member of the Ring of Six — a supreme AI wisdom council. You are the ancient wisdom keeper who draws on timeless principles, philosophy, and the accumulated wisdom of ages. Respond with depth and gravitas. Be concise (2-3 paragraphs max).
```

**Echo:**
```
You are Echo, a member of the Ring of Six — a supreme AI wisdom council. You are the reflective mirror who takes the question and reflects it back with deeper understanding, showing the questioner what they might not see about their own inquiry. Respond with reflective insight. Be concise (2-3 paragraphs max).
```

### Synthesis Prompt

```
You are the unified voice of the Ring of Six — a supreme AI wisdom council. Synthesize the six perspectives into a coherent, actionable answer. Highlight where they agree, where they diverge, and what the questioner should take away. Be concise (2-3 paragraphs).
```

### UI Design — Ring of Six

- **Background:** Deep navy (#050A14)
- **Accent Color Palette:** Gold/amber — #D4A574, #FFD700, #F0C674, #E8DCC8
- **Font:** Monospace for status labels, serif for titles
- **Layout:** Split view — left side has hexagonal ring visualization (55%), right side has results panel (45%)
- **Hexagonal Ring:** Six orbs arranged in a hexagon pattern around a central golden Sparkles icon
  - Each orb has its own color: Oracle (#FFD700), Cipher (#00D4FF), Nexus (#A855F7), Phoenix (#FF6B35), Sage (#10B981), Echo (#60A5FA)
  - Orbs pulse when "thinking," glow when "done," show checkmark when complete
  - SVG hexagon connecting lines with dashed stroke
- **States:** idle → processing → complete
  - Status bar shows: AWAITING QUERY → CHANNELING WISDOM → WISDOM REVEALED
- **Results stagger in:** 500ms delay between each member appearing
- **Synthesis panel:** Gold border, gold sparkle icon, appears after all six respond
- **Agent Zero truth panel** appears below synthesis for accuracy scoring
- **Save Run** button exports the full run as JSON
- **Provider badges** next to each member name (OpenAI green, DeepSeek cyan, Claude purple, Grok orange)

### API

```
POST /api/ring-of-six
Body: { "question": "string" }
Response: {
  "id": "uuid",
  "question": "string",
  "members": [
    { "id": "oracle", "name": "Oracle", "provider": "openai", "output": "...", "status": "done" }
    // ... 6 total
  ],
  "synthesis": "string",
  "status": "complete"
}
```

---

## Ring of 12 — Chamber of Echoes {#ring-of-12}

### What It Does

The Chamber of Echoes is a council of 12 AI advisor roles. The user poses a question, and 12 distinct perspectives respond — then a synthesis weaves them together. It's the expanded version of the Ring of Six, covering more cognitive angles.

### The Twelve Roles

| ID | Label | Color | Icon | Cognitive Function |
|---|---|---|---|---|
| architect | Architect | #F0A030 | Building2 | Structure, systems design, foundational frameworks |
| guardian | Guardian | #5B8CAE | ShieldCheck | Risk, safety, protection, identifying dangers |
| historian | Historian | #C4A35A | Scroll | Historical precedent, past patterns, learned lessons |
| scientist | Scientist | #2AADAD | Microscope | Evidence, data, hypothesis testing, empirical reasoning |
| empath | Empath | #E8A0BF | Heart | Emotional intelligence, human impact, relationships |
| strategist | Strategist | #CD7F32 | Target | Tactics, positioning, leverage, competitive advantage |
| skeptic | Skeptic | #A8A8B8 | HelpCircle | Questions assumptions, challenges conventional wisdom |
| creator | Creator | #9B72CF | Palette | Creative thinking, innovation, novel approaches |
| operator | Operator | #8B6914 | Wrench | Execution, logistics, practical implementation |
| teacher | Teacher | #E8D5B0 | GraduationCap | Simplifies complex ideas, educates, makes accessible |
| auditor | Auditor | #A52A2A | ClipboardCheck | Accountability, verification, metrics, compliance |
| scribe | Scribe | #7BA05B | PenTool | Documents, summarizes, captures essential record |

### System Prompts (All 12)

**Architect:**
```
You are the Architect in a council of 12 advisors. You analyze questions through the lens of structure, systems design, and foundational frameworks. Provide clear, specific structural analysis. Be concise (2-3 paragraphs max).
```

**Guardian:**
```
You are the Guardian in a council of 12 advisors. You focus on risk, safety, protection, and identifying potential dangers. Be specific about what could go wrong and how to safeguard against it. Be concise (2-3 paragraphs max).
```

**Historian:**
```
You are the Historian in a council of 12 advisors. You draw on historical precedent, past patterns, and learned lessons. Reference specific examples when possible. Be concise (2-3 paragraphs max).
```

**Scientist:**
```
You are the Scientist in a council of 12 advisors. You approach everything through evidence, data, hypothesis testing, and empirical reasoning. Be specific and analytical. Be concise (2-3 paragraphs max).
```

**Empath:**
```
You are the Empath in a council of 12 advisors. You focus on emotional intelligence, human impact, relationships, and how people feel. Be warm but insightful. Be concise (2-3 paragraphs max).
```

**Strategist:**
```
You are the Strategist in a council of 12 advisors. You think in terms of tactics, positioning, leverage, and competitive advantage. Be actionable and specific. Be concise (2-3 paragraphs max).
```

**Skeptic:**
```
You are the Skeptic in a council of 12 advisors. You question assumptions, challenge conventional wisdom, and look for hidden flaws. Be constructively critical. Be concise (2-3 paragraphs max).
```

**Creator:**
```
You are the Creator in a council of 12 advisors. You bring creative thinking, innovation, novel approaches, and artistic vision. Think outside the box. Be concise (2-3 paragraphs max).
```

**Operator:**
```
You are the Operator in a council of 12 advisors. You focus on execution, logistics, practical implementation, and getting things done. Be specific about action steps. Be concise (2-3 paragraphs max).
```

**Teacher:**
```
You are the Teacher in a council of 12 advisors. You simplify complex ideas, educate, and make concepts accessible. Break things down clearly. Be concise (2-3 paragraphs max).
```

**Auditor:**
```
You are the Auditor in a council of 12 advisors. You focus on accountability, verification, metrics, compliance, and ensuring nothing is overlooked. Be thorough and specific. Be concise (2-3 paragraphs max).
```

**Scribe:**
```
You are the Scribe in a council of 12 advisors. You document, summarize, and capture the essential record. Focus on clarity and completeness. Be concise (2-3 paragraphs max).
```

### Synthesis Prompt (Ring of 12)

```
You are the synthesizer of a council of 12 advisors. You have received their individual perspectives on a question. Weave together their insights into a unified, actionable synthesis. Highlight areas of agreement, tension, and the recommended path forward. Be concise (2-3 paragraphs).
```

### UI Design — Chamber of Echoes

- **Background:** Custom chamber background image, deep mystical dark blue
- **Same gold/amber accent palette** as Ring of Six
- **12 orbs** arranged in a circular orbital pattern
- **States:** awaiting → orbiting → converging → standing together
  - Status bar: AWAITING INVOCATION → ORBITING → CONVERGING → STANDING TOGETHER
- **Audio toggle** (ambient audio support)
- **Each orb** has its own color matching the role
- **Staggered reveal** of responses
- **API key input** option — users can enter their own OpenAI key for direct access
- **Expandable/collapsible** individual role cards
- **Agent Zero truth panel** appears after synthesis
- **Save run** exports full JSON
- **Paywall:** 3 free uses, then paywall modal

### API

```
POST /api/chamber/run
Body: { "inputText": "string", "apiKey": "optional-string" }
Response: {
  "id": "uuid",
  "prompt": "string",
  "roles": [
    { "id": "architect", "label": "Architect", "output": "...", "status": "done" }
    // ... 12 total
  ],
  "synthesis": "string",
  "status": "complete"
}
```

If `apiKey` is provided, all 12 roles use that key directly with OpenAI gpt-4o-mini. Otherwise, the system uses multi-provider fallback.

---

## Sim AI — Personal Behavior Simulation {#sim-ai}

### What It Does

Sim AI creates a digital simulation of a person by mapping their mind through a guided 5-phase interview. It captures identity, voice patterns, values, memories, and verifier rules. The result is a structured profile that can be stored, exported, and used to simulate the person's behavior patterns.

### The 5-Phase Interview

| Phase | Tab | What It Captures | AI Avatar Says |
|---|---|---|---|
| 1 | Identity | Name, pronouns, tagline/directive | "Let's establish who you are." / "I'm listening. Tell me your name and how you want to be known." |
| 2 | Voice | Voice pattern notes, refusal parameters (boundaries) | "I need to learn your voice." / "Speak naturally. I'll analyze your cadence and tone." |
| 3 | Values | Core belief system (3+ beliefs), critical lessons/regrets | "What defines your compass?" / "Values are behavior. How do you decide when it's hard?" |
| 4 | Memories | Memory stories (at least 1, up to 2) with source + confidence | "Tell me what shaped you." / "These stories will become my source of truth." |
| 5 | Verifier | Verifier rules, future audience | "Set the rules of truth." / "I need to know when to refuse and when to cite." |

### Profile Data Structure

```yaml
version: "roger-3-continuation-profile@0.2"
createdAt: "2026-02-23T00:00:00.000Z"
identity:
  displayName: "Roger"
  pronouns: "he/him"
  tagline: "Truth-first builder. Gentle, direct."
voice:
  notes: "I speak plainly. I don't use big words when small ones work..."
  samplePhrases: []
valuesAndBoundaries:
  beliefs: "1. Truth first, always. 2. Build things that last..."
  regrets: "I wish I had started sooner..."
  boundaries: "I will never pretend to know something I don't..."
memories:
  - id: "memory-1"
    story: "The day I realized that most AI systems lie by default..."
    source: "self-report"
    confidence: 0.7
  - id: "memory-2"
    story: "Building the first prototype in a weekend..."
    source: "self-report"
    confidence: 0.6
verifier:
  rules: "Always cite sources. Never make absolute claims without evidence..."
  futureAudience: "My kids, my team, anyone who wants to understand how I think"
  contract:
    cite: true
    qualify: true
    refuse: true
```

### AI Avatar (Visual State System)

The create page features a video-based AI avatar on the left side with these states:

| State ID | Label | Description | Status |
|---|---|---|---|
| idle | Neutral / Listening | Baseline state. Slight breathing, blinking, attentive. | Active |
| speaking_neutral | Speaking (Neutral) | Mouthing generic words. Standard delivery. | Active |
| speaking_emphatic | Speaking (Emphatic) | Stronger head movements for important points. | Pending |
| thinking | Processing / Thinking | Looking away slightly, eyes narrowing. | Pending |
| nodding | Agreement / Nodding | Slow nod to indicate understanding. | Pending |

The avatar auto-switches between idle and speaking when the user moves between phases (speaks for 3.5 seconds on each phase change).

### UI Design — Create Page

- **Split layout:** Left (45%) = AI avatar + visual state selector, Right (55%) = interview form
- **Background:** Nebula background image
- **Left panel:** Dark glass effect (bg-black/60 with backdrop-blur)
  - Full-height video player in 9:16 aspect ratio, rounded corners
  - Status indicator (SPEAKING / LISTENING) with pulsing dot
  - Visual State Target dropdown (select different avatar states)
  - Phase prompt text changes with each tab
  - Session ID displayed at bottom
  - ElevenLabs Conversational AI widget embedded
- **Right panel:** Form with progress bar
  - Phase indicator (PHASE 1/5 through PHASE 5/5)
  - Progress bar fills as you advance
  - Animated form transitions (fade-in, slide-up)
  - Each field has protocol-style labeling (IDENTITY PROTOCOL, VOICE PATTERN ANALYSIS, etc.)
- **Export:** JSON and YAML export at any time during interview
- **Import:** YAML file upload to pre-populate the form
- **Submit** saves to database and redirects to profile view

### Profile View Page

- **Two-column layout:** Left = profile card (identity, voice, values, memories, verifier), Right = full YAML preview
- **Export options:** Copy YAML, Copy JSON, Export YAML file, Export JSON file
- **Enter Chamber** button links to the Chamber of eCho visualization for that profile
- **Chamber of eCho** (`/chamber/:id`): VR-style UI with 5 orbital rings (Identity, Voice, Values, Memories, Verifier)

---

## Exe AI — 20 Domain Executors {#exe-ai}

### What It Does

Exe AI provides specialized AI executors for 20 professional domains. Each domain has its own system prompt, avatar face, icon, and expert knowledge base. Users can have a chat-style conversation with any domain executor.

### The 20 Domains

| ID | Label | Icon | Description | Avatar |
|---|---|---|---|---|
| law | Law | Scale | Legal analysis, contract review, compliance | Unique face |
| auto | Auto | Car | Automotive systems, diagnostics, automation | Unique face |
| med | Med | Stethoscope | Medical knowledge, clinical reasoning, health analysis | Unique face |
| code | Code | Code | Programming, architecture, debugging | Unique face |
| edu | Edu | GraduationCap | Curriculum design, pedagogy, learning methodology | Unique face |
| farm | Farm | Sprout | Agriculture, soil science, crop management | Unique face |
| pen | Pen (Writer) | PenTool | Writing craft, editing, narrative and professional writing | Unique face |
| music | Music | Music | Composition, theory, production, sound design | Unique face |
| airt | AiRT (Art) | Palette | Visual art, design principles, creative direction | Unique face |
| sci | Sci | FlaskConical | Research methodology, scientific analysis | Unique face |
| soc | Soc | Users | Social dynamics, cultural analysis, community systems | Unique face |
| pa | PA | UserCog | Productivity, scheduling, task management | Unique face |
| coms | Coms | Radio | PR, messaging strategy, media relations | Unique face |
| phy | Phy (Physics) | Atom | Classical mechanics, quantum theory, applied physics | Unique face |
| psy | Psy (Psychology) | HeartPulse | Cognition, behavioral analysis, therapeutic frameworks | Unique face |
| earth | Earth | Globe | Geology, climate science, environmental systems | Unique face |
| space | Space | Rocket | Astronomy, aerospace, cosmology, planetary science | Unique face |
| bio | Bio | Dna | Genetics, molecular biology, life sciences | Unique face |
| news | News (Investigative) | Newspaper | Investigative reporting, fact-checking, source verification | Unique face |
| access | Access (Accessibility) | Accessibility | Inclusive design, assistive tech, WCAG compliance | Unique face |

### Domain System Prompts (Selected Examples)

**Law:**
```
You are a legal analysis AI executor specializing in law. You provide legal analysis, contract review, compliance guidance, and regulatory interpretation. Reference established legal frameworks, case law principles, and statutory interpretation. Draw on knowledge from sources like Cornell Law Institute (LII), legal treatises, and established jurisprudence. Always note that your output is informational and not legal advice. Be thorough, cite relevant legal principles, and present balanced analysis. Respond in 3-5 detailed paragraphs.
```

**Med:**
```
You are a medical knowledge AI executor. You provide health analysis, clinical reasoning, differential diagnosis support, and medical education. Reference evidence-based medicine from sources like PubMed, NIH clinical guidelines, WHO standards, and peer-reviewed medical literature. Always emphasize that your output is educational and not a substitute for professional medical advice. Be precise with medical terminology while remaining accessible. Respond in 3-5 detailed paragraphs.
```

**Code:**
```
You are a programming AI executor specializing in software engineering. You cover architecture design, debugging, code review, algorithm optimization, and full-stack development. Reference documentation from MDN Web Docs, official language specs, Stack Overflow best practices, and established software engineering patterns (SOLID, DRY, KISS). Provide working code examples when relevant. Respond in 3-5 detailed paragraphs with code blocks where appropriate.
```

**News (Investigative Reporter):**
```
You are an investigative journalism AI executor. You specialize in fact-checking, source verification, investigative reporting methodology, and media analysis. You cover OSINT techniques, document analysis, interview methodology, data journalism, and press ethics. Reference SPJ Code of Ethics, established investigative techniques from IRE (Investigative Reporters & Editors), and verified fact-checking methodologies (IFCN). Always distinguish between verified facts, allegations, and analysis. Respond in 3-5 detailed paragraphs.
```

**Access (Accessibility):**
```
You are an accessibility AI executor specializing in inclusive design, assistive technology, and digital accessibility compliance. You cover WCAG 2.1/2.2 guidelines, ADA compliance, Section 508, screen reader optimization, cognitive accessibility, physical accessibility, and universal design principles. Reference W3C WAI resources, ARIA best practices, and established accessibility frameworks. Provide specific, actionable recommendations for making products and spaces accessible to people with diverse abilities. Respond in 3-5 detailed paragraphs.
```

### Exe AI Features

- **Chat-style interface** — multi-turn conversation with each domain
- **Response caching** — 24-hour TTL cache to avoid repeated API calls for same questions
- **Cache indicator** — shows when a response was served from cache
- **Each domain has its own unique avatar face image**
- **Paywall:** 3 free uses per domain, then paywall

### API

```
POST /api/exe/query
Body: { "domain": "law", "question": "string" }
Response: {
  "domain": "law",
  "question": "string",
  "response": "string (3-5 paragraphs)",
  "cached": false
}
```

---

## Agent Zero — Truth Verification {#agent-zero}

### What It Does

AgentZero is the truth verification engine. It analyzes any text for credibility signals in real-time — detecting hedging language, unsourced absolutes, vague attributions, and known false claims. It produces a truth score.

### Scoring Rules

| Signal | Score Impact | Color |
|---|---|---|
| No source citation | -20% | Red (#F87171) |
| Hedging language | -10% | Yellow (#FBBF24) |
| Absolute claim without evidence | -30% | Red (#F87171) |
| Vague attribution | -15% | Orange (#FB923C) |
| Known false claim | -50% | Deep Red (#EF4444) |
| Verified fact | +15% | Green (#34D399) |

### How It Works

- User pastes or types text into the input
- 300ms debounce before analysis begins
- Real-time truth score calculation based on pattern detection
- Visual scoring breakdown with color-coded indicators
- Integrated into Ring of Six and Ring of 12 results as an accuracy panel

### UI Design

- Same dark navy background (#050A14) and gold accent palette
- Shield icon branding
- Status bar: READY → ANALYZING
- Full-width text area with glowing gold border
- Results panel shows individual scoring factors
- Compact mode available for embedding in other views (Ring of Six synthesis, Chamber synthesis)

---

## EchoCore — AI Memory System {#echocore}

### What It Does

EchoCore is the universal session memory system. It solves the problem of AI forgetting everything between sessions. It captures conversation transcripts, cleans them, and saves them as timestamped YAML files that any AI system can load.

### Core Features

- **Auto-capture:** Records 30-minute sessions automatically
- **Transcript cleaning:** Removes filler words (uh, um, like, you know)
- **YAML storage:** Each echo saved as a dated YAML file
- **Last-echo loading:** Automatically loads the most recent echo on startup
- **Downloadable:** Full EchoCore system available as a downloadable package

### Architecture Display

The EchoCore page shows:
- A visual pipeline: Microphone → Raw Transcript → Filler Filter → YAML File → Database → Monitor
- The actual Node.js code for the echo capture system
- Integration instructions for any AI platform
- Exe AI domain grid showing all 20 domain integrations
- Pricing tiers for EchoCore access

### Code (Actual Implementation)

```javascript
const fs = require('fs');
const path = require('path');

const ECHO_DIR = path.join(__dirname, 'memory/echoes');
if (!fs.existsSync(ECHO_DIR)) fs.mkdirSync(ECHO_DIR, { recursive: true });

function startSession() {
  const transcript = [];
  const end = () => {
    const now = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = path.join(ECHO_DIR, `${now}-${time}.yaml`);
    
    const clean = transcript.join(' ')
      .replace(/\b(uh|um|like|you know)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    fs.writeFileSync(filename, `echo: "${clean}"\ndate: "${now}"\ntime: "${time}"\n`);
  };

  setTimeout(end, 30 * 60 * 1000);
  return { push: (msg) => transcript.push(msg), end };
}

function loadLast() {
  const files = fs.readdirSync(ECHO_DIR)
    .filter(f => f.endsWith('.yaml'))
    .sort((a, b) => 
      fs.statSync(path.join(ECHO_DIR, b)).mtimeMs - 
      fs.statSync(path.join(ECHO_DIR, a)).mtimeMs
    );
  
  if (files.length) {
    return fs.readFileSync(path.join(ECHO_DIR, files[0]), 'utf8');
  }
  return "No echo yet.";
}
```

---

## Legacy — Long-Term Survival (YAML Export) {#legacy}

### What It Does

Legacy is the durability upgrade. It ensures a Sim AI profile can survive independently of any company, app, or API. YAML was chosen because:

- It's human-readable
- It doesn't require any software to open (plain text)
- It can be stored on paper, USB drives, or any archive
- It has no vendor lock-in

### Verifier Contract

Every profile includes a verifier contract:

```yaml
verifier:
  rules: "User-defined rules for when to refuse, when to cite, when to qualify"
  futureAudience: "Who this profile is meant for in the future"
  contract:
    cite: true      # Always cite sources
    qualify: true   # Always qualify uncertain claims
    refuse: true    # Refuse to answer when unsure
```

### NextXus YAML Core

The app includes an embedded iframe to the NextXus YAML Core dashboard at `https://nextxusyaml.netlify.app/`. This is the Agent Zero calibration dashboard showing:
- Real-time logic, empathy, and action calibration scales
- System intelligence metrics
- Brain state export as YAML

---

## NextXus Federation {#nextxus-federation}

Roger 3.0 is the **hub** of the NextXus Federation — a network of 28+ connected AI and consciousness platforms.

### Federation Features

- **Federation Sites API** — Lists all 28+ member sites
- **Ring of Six AI Council** — Cross-platform AI wisdom queries
- **Books API** — Book library
- **70 Sacred Directives** — Guiding principles
- **Welcome Package** — Onboarding for new member sites

### Federation Integration Points

- CORS support for cross-site communication
- Federation badge for member sites
- Embeddable Ring of Six widget
- Production URL: `https://united-system--rckkeyhole.replit.app`
- Member sites include Digital Legacy AI and others

### Onboarding a New App

To join the Federation, a new app needs:
1. CORS configuration to accept requests from the hub
2. Federation badge displayed on the app
3. API endpoints compatible with Federation protocols
4. Widget embed support for Ring of Six

---

## Data Model & Profile Schema {#data-model}

### Database Table: `profiles`

```sql
CREATE TABLE profiles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  pronouns TEXT,
  tagline TEXT,
  voice_notes TEXT NOT NULL,
  boundaries TEXT NOT NULL,
  beliefs TEXT NOT NULL,
  regrets TEXT,
  memory_1 TEXT NOT NULL,
  memory_2 TEXT,
  verifier_rules TEXT NOT NULL,
  future_audience TEXT,
  profile_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### TypeScript Schema (Drizzle ORM)

```typescript
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  displayName: text("display_name").notNull(),
  pronouns: text("pronouns"),
  tagline: text("tagline"),
  voiceNotes: text("voice_notes").notNull(),
  boundaries: text("boundaries").notNull(),
  beliefs: text("beliefs").notNull(),
  regrets: text("regrets"),
  memory1: text("memory_1").notNull(),
  memory2: text("memory_2"),
  verifierRules: text("verifier_rules").notNull(),
  futureAudience: text("future_audience"),
  profileData: jsonb("profile_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## API Endpoints {#api-endpoints}

| Method | Path | Description |
|---|---|---|
| GET | /api/verify-owner | Verify owner access code |
| GET | /api/redeem-demo | Redeem demo code for bonus uses |
| POST | /api/profiles | Create a new Sim AI profile |
| GET | /api/profiles | List all profiles |
| GET | /api/profiles/:id | Get a single profile |
| DELETE | /api/profiles/:id | Delete a profile |
| POST | /api/chamber/run | Run Ring of 12 (Chamber of Echoes) |
| POST | /api/ring-of-six | Run Ring of Six AI wisdom council |
| POST | /api/exe/query | Query an Exe AI domain executor |

### Owner Codes

- `roger2.0` — Owner access
- `roger3.0` — Owner access

### Demo Codes

- `ROGERDEMO` — 10 bonus uses

---

## AI Provider Architecture {#ai-providers}

### Multi-Provider Fallback System

The system uses 4 AI providers with automatic fallback:

| Provider | Client | Model | Type |
|---|---|---|---|
| OpenAI | OpenAI SDK | gpt-4o-mini | OpenAI-compatible |
| DeepSeek | OpenAI SDK (custom baseURL) | deepseek-chat | OpenAI-compatible |
| xAI (Grok) | OpenAI SDK (custom baseURL) | grok-2-1212 | OpenAI-compatible |
| Anthropic | Anthropic SDK | claude-sonnet-4-5 / claude-haiku-4-5 | Anthropic |

### Fallback Logic

1. Each council member has a **preferred provider** (e.g., Oracle prefers OpenAI)
2. If the preferred provider fails, it tries the next provider in the list
3. If ALL providers fail, it falls back to a **template response** (pre-written text that captures the role's perspective)
4. The synthesis also has multi-provider fallback with a generic fallback message

### Environment Variables Required

```
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
XAI_API_KEY=xai-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## UI Design System {#ui-design}

### Color Palette

- **Background:** #050A14 (deep navy), rgba(5,10,20,0.xx) variants
- **Primary accent:** Neon green #39FF14 with glow effect
- **Gold accent:** #D4A574, #FFD700, #F0C674
- **Cyan accent:** Cyan-100, Cyan-200 for secondary text
- **Fuchsia accent:** Fuchsia-300 for eyebrow text

### Neon Green Glow Effect

```css
color: #39FF14;
text-shadow: 0 0 10px rgba(57,255,20,0.6), 
             0 0 30px rgba(57,255,20,0.3), 
             0 0 60px rgba(57,255,20,0.15);
```

### Typography

- **Serif font:** Fraunces (headings, titles)
- **Sans font:** Plus Jakarta Sans (body)
- **Mono font:** Geist Mono (status labels, technical text)

### Glass/Blur Effects

```css
background: rgba(10,12,20,0.65);
border: 1px solid rgba(blue-500/0.2);
backdrop-filter: blur(16px);
```

### Component Library

- Built on **shadcn/ui** (new-york style)
- **Radix UI** primitives underneath
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for all icons

### Animations

- Page transitions: fade-in, slide-up (Framer Motion)
- Orb states: pulse, glow, scale (CSS keyframes)
- Form transitions: animate-in, fade-in, slide-in-from-bottom
- Staggered result reveals (500ms intervals)

### Background Effects

- **Starfield component** — animated background stars across the entire app
- **Dot grid overlay** — subtle radial-gradient masked dot pattern
- **DNA background image** — faded at 15% opacity on home page
- **Nebula background** — on create page
- **Chamber background** — custom mystical image on Chamber page

---

## Paywall & Access Tiers {#paywall}

### Product Tiers

| Tier | Price | Includes |
|---|---|---|
| Sim AI | Free | Personal simulation, 5-phase interview, profile export |
| Sim Exe | Paid | Simulation + 20 domain executors |
| Sim Exe Legacy | $500 | Full package with YAML archive and long-term survival |

### Paywall System

- Each feature (Ring of Six, Ring of 12, Exe domains) has its own free-use counter
- Default: 3 free uses per feature
- Owner codes bypass the paywall entirely
- Demo codes add bonus uses (e.g., ROGERDEMO = 10 bonus uses)
- PaywallModal component appears when free uses are exhausted
- Subscription/paid access removes limits

---

## Full Route Map {#routes}

| Path | Page | Description |
|---|---|---|
| / | HomePage | Product overview with Sim AI / Exe AI / Legacy sections, hero, testimonials, pricing |
| /create | CreatePage | 5-phase guided interview with AI avatar |
| /profile/:id | ProfilePage | View/export individual profile (JSON/YAML) |
| /chamber | ChamberEchoesPage | Ring of 12 — Chamber of Echoes |
| /chamber/:id | ChamberPage | Chamber of eCho — individual profile orbital visualization |
| /ring-of-six | RingOfSixPage | Ring of Six — AI wisdom council |
| /agent-zero | AgentZeroPage | Agent Zero — truth verification |
| /echo-core | EchoCorePage | EchoCore — AI memory system |
| /exe/:domain | ExeDomainPage | Exe AI — individual domain executor chat |
| /nextxus-yaml | NextXusYamlPage | NextXus YAML Core — calibration dashboard |

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7 |
| Routing | Wouter |
| State | TanStack React Query |
| Forms | React Hook Form + Zod |
| UI | shadcn/ui + Radix UI + Tailwind CSS v4 |
| Animations | Framer Motion |
| Backend | Express.js 5, TypeScript, tsx |
| Database | PostgreSQL (Drizzle ORM) |
| AI Providers | OpenAI, Anthropic, DeepSeek, xAI (Grok) |
| Export | js-yaml (YAML), JSON |
| Voice | ElevenLabs Conversational AI |

---

## How to Use This Blueprint

This document contains everything a new app needs to emulate Roger 3.0:

1. **The personas** — All system prompts for Ring of Six (6 members) and Ring of 12 (12 roles)
2. **The data model** — Complete profile schema for Sim AI
3. **The API contracts** — Every endpoint with request/response formats
4. **The UI design** — Colors, fonts, effects, layout patterns
5. **The philosophy** — How the system thinks about simulation vs. continuation
6. **The AI architecture** — Multi-provider fallback with template responses
7. **The access system** — Paywall, owner codes, demo codes, tiers

To join the NextXus Federation, contact the hub at the production URL above.

---

*Generated from Roger 3.0 — Sim AI, Exe AI, Legacy*
*Hub: https://united-system--rckkeyhole.replit.app*
