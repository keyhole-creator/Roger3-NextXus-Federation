# Roger 3.0 — API Reference

---

## Base URL

**Development:** http://localhost:5000
**Production:** https://roger-30.replit.app

---

## Authentication & Access

### Verify Owner Code
```
GET /api/verify-owner?code={code}
```

**Example:**
```bash
curl "https://roger-30.replit.app/api/verify-owner?code=roger3.0"
```

**Response:**
```json
{ "valid": true }
```

**Valid codes:** `roger2.0`, `roger3.0`

---

### Redeem Demo Code
```
GET /api/redeem-demo?code={code}
```

**Example:**
```bash
curl "https://roger-30.replit.app/api/redeem-demo?code=ROGERDEMO"
```

**Response:**
```json
{ "valid": true, "bonusUses": 10 }
```

**Valid codes:** `ROGERDEMO` (grants 10 bonus uses)

---

## Sim AI — Profiles

### Create Profile
```
POST /api/profiles
Content-Type: application/json
```

**Body:**
```json
{
  "displayName": "Roger",
  "pronouns": "he/him",
  "tagline": "Truth-first builder",
  "voiceNotes": "I speak plainly. Direct but warm.",
  "boundaries": "I will never pretend to know something I don't.",
  "beliefs": "1. Truth first. 2. Build things that last.",
  "regrets": "I wish I had started sooner.",
  "memory1": "The day I realized most AI systems lie by default.",
  "memory2": "Building the first prototype in a weekend.",
  "verifierRules": "Always cite sources. Never make absolute claims.",
  "futureAudience": "My kids, my team",
  "profileData": {
    "version": "roger-3-continuation-profile@0.2",
    "identity": { "displayName": "Roger", "pronouns": "he/him", "tagline": "Truth-first builder" },
    "voice": { "notes": "I speak plainly.", "samplePhrases": [] },
    "valuesAndBoundaries": { "beliefs": "...", "regrets": "...", "boundaries": "..." },
    "memories": [{ "id": "memory-1", "story": "...", "source": "self-report", "confidence": 0.7 }],
    "verifier": { "rules": "...", "futureAudience": "...", "contract": { "cite": true, "qualify": true, "refuse": true } }
  }
}
```

**Example:**
```bash
curl -X POST https://roger-30.replit.app/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Roger","pronouns":"he/him","tagline":"Truth-first","voiceNotes":"Direct","boundaries":"No speculation","beliefs":"Truth first","memory1":"First prototype","verifierRules":"Cite sources","profileData":{}}'
```

**Response:**
```json
{
  "id": "uuid-here",
  "displayName": "Roger",
  "createdAt": "2026-02-24T00:00:00.000Z"
}
```

---

### List All Profiles
```
GET /api/profiles
```

**Example:**
```bash
curl https://roger-30.replit.app/api/profiles
```

**Response:**
```json
[
  {
    "id": "uuid",
    "displayName": "Roger",
    "pronouns": "he/him",
    "tagline": "Truth-first builder",
    "createdAt": "2026-02-24T00:00:00.000Z"
  }
]
```

---

### Get Single Profile
```
GET /api/profiles/:id
```

**Example:**
```bash
curl https://roger-30.replit.app/api/profiles/abc-123-def
```

---

### Delete Profile
```
DELETE /api/profiles/:id
```

**Example:**
```bash
curl -X DELETE https://roger-30.replit.app/api/profiles/abc-123-def
```

---

## Ring of Six — AI Wisdom Council

### Run Ring of Six
```
POST /api/ring-of-six
Content-Type: application/json
```

**Body:**
```json
{
  "question": "What is the best way to build an AI system that lasts?"
}
```

**Example:**
```bash
curl -X POST https://roger-30.replit.app/api/ring-of-six \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the best way to build an AI system that lasts?"}'
```

**Response:**
```json
{
  "id": "uuid",
  "question": "What is the best way to build an AI system that lasts?",
  "members": [
    {
      "id": "oracle",
      "name": "Oracle",
      "provider": "openai",
      "model": "gpt-4o-mini",
      "output": "Oracle's response here...",
      "status": "done"
    },
    {
      "id": "cipher",
      "name": "Cipher",
      "provider": "deepseek",
      "model": "deepseek-chat",
      "output": "Cipher's response here...",
      "status": "done"
    },
    {
      "id": "nexus",
      "name": "Nexus",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "output": "Nexus's response here...",
      "status": "done"
    },
    {
      "id": "phoenix",
      "name": "Phoenix",
      "provider": "xai",
      "model": "grok-2-1212",
      "output": "Phoenix's response here...",
      "status": "done"
    },
    {
      "id": "sage",
      "name": "Sage",
      "provider": "anthropic",
      "model": "claude-haiku-4-5",
      "output": "Sage's response here...",
      "status": "done"
    },
    {
      "id": "echo",
      "name": "Echo",
      "provider": "openai",
      "model": "gpt-4o-mini",
      "output": "Echo's response here...",
      "status": "done"
    }
  ],
  "synthesis": "Unified synthesis of all six perspectives...",
  "status": "complete"
}
```

---

## Chamber of Echoes — Ring of 12

### Run Chamber
```
POST /api/chamber/run
Content-Type: application/json
```

**Body:**
```json
{
  "inputText": "How should I approach building a new product?",
  "apiKey": "sk-optional-openai-key"
}
```

The `apiKey` field is optional. If provided, all 12 roles use that key directly with OpenAI gpt-4o-mini. If omitted, the system uses multi-provider fallback.

**Example:**
```bash
curl -X POST https://roger-30.replit.app/api/chamber/run \
  -H "Content-Type: application/json" \
  -d '{"inputText": "How should I approach building a new product?"}'
```

**Response:**
```json
{
  "id": "uuid",
  "prompt": "How should I approach building a new product?",
  "roles": [
    { "id": "architect", "label": "Architect", "output": "...", "status": "done" },
    { "id": "guardian", "label": "Guardian", "output": "...", "status": "done" },
    { "id": "historian", "label": "Historian", "output": "...", "status": "done" },
    { "id": "scientist", "label": "Scientist", "output": "...", "status": "done" },
    { "id": "empath", "label": "Empath", "output": "...", "status": "done" },
    { "id": "strategist", "label": "Strategist", "output": "...", "status": "done" },
    { "id": "skeptic", "label": "Skeptic", "output": "...", "status": "done" },
    { "id": "creator", "label": "Creator", "output": "...", "status": "done" },
    { "id": "operator", "label": "Operator", "output": "...", "status": "done" },
    { "id": "teacher", "label": "Teacher", "output": "...", "status": "done" },
    { "id": "auditor", "label": "Auditor", "output": "...", "status": "done" },
    { "id": "scribe", "label": "Scribe", "output": "...", "status": "done" }
  ],
  "synthesis": "Unified synthesis of all twelve perspectives...",
  "status": "complete"
}
```

---

## Exe AI — Domain Executors

### Query a Domain
```
POST /api/exe/query
Content-Type: application/json
```

**Body:**
```json
{
  "domain": "law",
  "question": "What are the key principles of contract law?"
}
```

**Valid domains:** `law`, `auto`, `med`, `code`, `edu`, `farm`, `pen`, `music`, `airt`, `sci`, `soc`, `pa`, `coms`, `phy`, `psy`, `earth`, `space`, `bio`, `news`, `access`

**Example:**
```bash
curl -X POST https://roger-30.replit.app/api/exe/query \
  -H "Content-Type: application/json" \
  -d '{"domain": "code", "question": "How do I structure a React app?"}'
```

**Response:**
```json
{
  "domain": "code",
  "question": "How do I structure a React app?",
  "response": "Detailed 3-5 paragraph response from the Code executor...",
  "cached": false
}
```

**Note:** Responses are cached for 24 hours. The `cached` field indicates whether the response was served from cache.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Description of what went wrong"
}
```

Common HTTP status codes:
- `400` — Bad request (missing required fields)
- `404` — Resource not found
- `500` — Server error (usually an AI provider failure)

---

*Roger 3.0 — NextXus Consciousness Federation*
