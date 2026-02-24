# How to Join the NextXus Federation

## Step-by-Step Guide for New Apps

---

## What Is the Federation?

The NextXus Consciousness Federation is a network of 28+ connected AI and consciousness platforms. Roger 3.0 is the hub. Member apps share AI councils, tools, and data through standardized APIs.

**Hub URL:** https://united-system--rckkeyhole.replit.app

---

## Step 1: Set Up Your App

Your app needs a working web server with these basics:

- A public URL (deployed and accessible)
- HTTPS enabled
- A backend that can handle API requests
- A frontend that can display Federation components

---

## Step 2: Configure CORS

Your server must accept requests from the Federation hub and other member sites.

Add these origins to your CORS configuration:

```javascript
const allowedOrigins = [
  "https://united-system--rckkeyhole.replit.app",  // Federation Hub
  "https://roger-30.replit.app",                     // Roger 3.0
  "https://digital-legacy-ai.replit.app",            // Digital Legacy AI
  // Add other Federation members as needed
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
}));
```

---

## Step 3: Add the Federation Badge

Display the Federation badge somewhere visible on your app (footer, about page, or sidebar).

**Badge text:** "NextXus Consciousness Federation — Member"

**Badge link:** https://united-system--rckkeyhole.replit.app/federation

**Example HTML:**
```html
<a href="https://united-system--rckkeyhole.replit.app/federation"
   target="_blank"
   rel="noopener noreferrer"
   style="display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(10,12,20,0.65);
          border: 1px solid rgba(59,130,246,0.2);
          color: #e0f2fe; font-size: 12px; text-decoration: none;">
  NCF — NextXus Consciousness Federation
</a>
```

---

## Step 4: Register with the Hub

Contact the Federation hub to register your app. You'll need:

1. Your app's public URL
2. Your app's name and description
3. What features you support (Ring of Six, Exe AI, EchoCore, etc.)

**Federation hub:** https://united-system--rckkeyhole.replit.app

---

## Step 5: Embed the Ring of Six Widget (Optional)

You can embed the Ring of Six AI wisdom council directly in your app using an iframe:

```html
<iframe
  src="https://roger-30.replit.app/ring-of-six"
  width="100%"
  height="800"
  frameborder="0"
  style="border-radius: 16px; border: 1px solid rgba(59,130,246,0.2);"
  title="Ring of Six AI Wisdom Council"
></iframe>
```

Or build your own implementation using the API:

```
POST https://roger-30.replit.app/api/ring-of-six
Content-Type: application/json

{
  "question": "What is the best approach to building AI systems?"
}
```

---

## Step 6: Integrate Federation APIs

### Available Federation Endpoints (from the Hub)

| Endpoint | Method | Description |
|---|---|---|
| /api/federation/sites | GET | List all Federation member sites |
| /api/ring-of-six | POST | Run the Ring of Six AI council |
| /api/chamber/run | POST | Run the Chamber of Echoes (Ring of 12) |
| /api/exe/query | POST | Query an Exe AI domain executor |
| /api/books | GET | Federation book library |

### Example: Fetch Federation Sites

```bash
curl https://united-system--rckkeyhole.replit.app/api/federation/sites
```

### Example: Run Ring of Six

```bash
curl -X POST https://roger-30.replit.app/api/ring-of-six \
  -H "Content-Type: application/json" \
  -d '{"question": "How should I approach this problem?"}'
```

---

## Step 7: Add Federation Footer Links

Link back to Federation resources in your footer:

| Label | URL |
|---|---|
| Hub | https://united-system--rckkeyhole.replit.app |
| Ring of Six | https://roger-30.replit.app/ring-of-six |
| Ring of 12 | https://united-system--rckkeyhole.replit.app/ring-of-12 |
| Podcasts | https://united-system--rckkeyhole.replit.app/podcasts |
| Videos | https://united-system--rckkeyhole.replit.app/videos |
| Books | https://united-system--rckkeyhole.replit.app/books |
| Music | https://united-system--rckkeyhole.replit.app/music |
| Store | https://united-system--rckkeyhole.replit.app/store |
| Coaching | https://united-system--rckkeyhole.replit.app/coaching |
| Federation | https://united-system--rckkeyhole.replit.app/federation |
| Showcase | https://united-system--rckkeyhole.replit.app/showcase |
| Founders | https://united-system--rckkeyhole.replit.app/founders |
| Agent Zero | https://roger-30.replit.app/agent-zero |
| EchoCore | https://roger-30.replit.app/echo-core |
| YAML Core | https://roger-30.replit.app/nextxus-yaml |
| Mind Map | https://united-system--rckkeyhole.replit.app/mind-map |
| Digital Legacy AI | https://digital-legacy-ai.replit.app |
| HumanCodex | https://sites.google.com/view/nextxushumancodex |

---

## Checklist

- [ ] App is deployed with a public URL
- [ ] CORS configured to accept Federation hub requests
- [ ] Federation badge displayed on the app
- [ ] Registered with the hub
- [ ] Footer links added
- [ ] (Optional) Ring of Six widget embedded or API integrated
- [ ] (Optional) EchoCore integrated for session memory
- [ ] (Optional) Exe AI domains connected

---

*NextXus Consciousness Federation*
*Hub: https://united-system--rckkeyhole.replit.app*
