# Roger 3.0 — Environment Setup Guide

## API Keys, Configuration & Fallback Order

---

## Required API Keys

You need API keys from 4 AI providers. The system works with any combination — if one is missing, it falls back to the next.

| Provider | Environment Variable | Where to Get It | Model Used |
|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys | gpt-4o-mini |
| DeepSeek | `DEEPSEEK_API_KEY` | https://platform.deepseek.com/api_keys | deepseek-chat |
| xAI (Grok) | `XAI_API_KEY` | https://console.x.ai | grok-2-1212 |
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys | claude-sonnet-4-5, claude-haiku-4-5 |

### Setting Environment Variables

**On Replit:**
Go to the Secrets tab (lock icon) and add each key.

**On your PC (Linux/Mac):**
```bash
export OPENAI_API_KEY="sk-..."
export DEEPSEEK_API_KEY="sk-..."
export XAI_API_KEY="xai-..."
export ANTHROPIC_API_KEY="sk-ant-..."
```

**On your PC (Windows PowerShell):**
```powershell
$env:OPENAI_API_KEY = "sk-..."
$env:DEEPSEEK_API_KEY = "sk-..."
$env:XAI_API_KEY = "xai-..."
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

**Using a .env file:**
```
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
XAI_API_KEY=xai-...
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## AI Provider Fallback Order

When a provider fails or is missing, the system automatically tries the next one:

```
1. Preferred provider for the persona (e.g., Oracle → OpenAI)
     ↓ (if fails)
2. OpenAI (gpt-4o-mini)
     ↓ (if fails)
3. DeepSeek (deepseek-chat)
     ↓ (if fails)
4. xAI / Grok (grok-2-1212)
     ↓ (if fails)
5. Anthropic (claude-sonnet-4-5)
     ↓ (if fails)
6. Template response (pre-written text — no API needed)
```

### Ring of Six — Provider Assignments

| Member | Preferred Provider | Preferred Model |
|---|---|---|
| Oracle | OpenAI | gpt-4o-mini |
| Cipher | DeepSeek | deepseek-chat |
| Nexus | Anthropic | claude-sonnet-4-5 |
| Phoenix | xAI | grok-2-1212 |
| Sage | Anthropic | claude-haiku-4-5 |
| Echo | OpenAI | gpt-4o-mini |

### Ring of 12 — Provider Assignment

All 12 roles use the same fallback chain. If a user provides their own API key via the `apiKey` field, all 12 use that key directly with OpenAI gpt-4o-mini.

### Exe AI — Provider Assignment

All 20 domain executors use the same fallback chain starting with OpenAI.

---

## Database Setup

Roger 3.0 uses PostgreSQL with Drizzle ORM.

### On Replit
The database is automatically provisioned. The `DATABASE_URL` environment variable is set for you.

### On Your PC

**Option 1: Local PostgreSQL**
```bash
# Install PostgreSQL
# Create a database
createdb roger3

# Set the connection string
export DATABASE_URL="postgresql://localhost:5432/roger3"
```

**Option 2: Remote PostgreSQL (Neon, Supabase, etc.)**
```bash
export DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### Run Database Migrations
```bash
npx drizzle-kit push
```

This creates the `profiles` table from the schema defined in `shared/schema.ts`.

---

## Installing Dependencies

```bash
npm install
```

This installs all packages from `package.json` including:
- React, Vite, TypeScript (frontend)
- Express, Drizzle ORM (backend)
- OpenAI SDK, Anthropic SDK (AI providers)
- shadcn/ui, Radix UI, Tailwind CSS (UI)
- Framer Motion (animations)
- js-yaml (YAML export)

---

## Running the App

### Development Mode
```bash
npm run dev
```
The app starts on `http://localhost:5000`

### Build for Production
```bash
npm run build
```

---

## Minimum Viable Setup

If you just want to get it running with the least effort:

1. **Only OpenAI key required** — Everything falls back to OpenAI if other providers are missing
2. **PostgreSQL required** — For profile storage
3. **No ElevenLabs key needed** — The voice widget is embedded via iframe, no API key required on your end

```bash
export OPENAI_API_KEY="sk-your-key"
export DATABASE_URL="postgresql://localhost:5432/roger3"
npm install
npx drizzle-kit push
npm run dev
```

That's it. The Ring of Six will use OpenAI for all 6 members (instead of different providers), Exe AI will work, profiles will save, and everything functions.

---

## Full Setup (All Providers)

For the authentic multi-provider experience where each Ring of Six member uses a different AI:

```bash
export OPENAI_API_KEY="sk-..."
export DEEPSEEK_API_KEY="sk-..."
export XAI_API_KEY="xai-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export DATABASE_URL="postgresql://localhost:5432/roger3"
npm install
npx drizzle-kit push
npm run dev
```

---

## Port Configuration

| Service | Port | Notes |
|---|---|---|
| Frontend (Vite) | 5000 | Bound to 0.0.0.0:5000 |
| Backend (Express) | 5000 | Same port — Vite proxies API calls |

---

## File Structure

```
roger3/
├── client/                  # Frontend (React)
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Shared UI components (shadcn)
│   │   ├── assets/          # Images, videos
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   ├── App.tsx          # Router
│   │   └── index.css        # Global styles
│   ├── public/              # Static files (favicon, images)
│   └── index.html           # Entry HTML
├── server/
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Database operations
│   ├── db.ts                # Database connection
│   ├── vite.ts              # Vite middleware
│   └── static.ts            # Static file serving
├── shared/
│   └── schema.ts            # Database schema (Drizzle)
├── script/
│   └── build.ts             # Build script
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
├── postcss.config.js
└── components.json          # shadcn/ui config
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| App crashes on startup | Check if `DATABASE_URL` is set. Check if at least one AI API key is set. |
| AI responses return errors | Verify API keys are valid and have credits. The system falls back automatically, so if all 4 fail, you get template responses. |
| Database errors | Run `npx drizzle-kit push` to create/update tables. |
| Port 5000 in use | Kill whatever's using port 5000: `lsof -i :5000` then `kill <PID>` |
| Blank page on load | Run `npm run build` and check for TypeScript errors. |

---

*Roger 3.0 — NextXus Consciousness Federation*
