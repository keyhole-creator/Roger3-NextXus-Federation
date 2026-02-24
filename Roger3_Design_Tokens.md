# Roger 3.0 — Design Tokens

## Colors, Fonts, Effects & Spacing

Use these exact values to match the Roger 3.0 look.

---

## Color Palette

### Backgrounds
```css
--bg-deep-navy: #050A14;
--bg-panel: rgba(10, 12, 20, 0.65);
--bg-panel-light: rgba(10, 12, 20, 0.60);
--bg-panel-dark: rgba(10, 12, 20, 0.70);
--bg-icon-container: rgba(15, 18, 30, 0.95);
--bg-header: rgba(5, 10, 20, 0.70);
```

### Primary Accent — Neon Green
```css
--neon-green: #39FF14;
--neon-green-glow-60: rgba(57, 255, 20, 0.6);
--neon-green-glow-30: rgba(57, 255, 20, 0.3);
--neon-green-glow-15: rgba(57, 255, 20, 0.15);
```

### Gold / Amber Accent
```css
--gold-primary: #D4A574;
--gold-bright: #FFD700;
--gold-warm: #F0C674;
--gold-light: #E8DCC8;
```

### Ring of Six Member Colors
```css
--oracle: #FFD700;    /* Gold */
--cipher: #00D4FF;    /* Cyan */
--nexus: #A855F7;     /* Purple */
--phoenix: #FF6B35;   /* Orange */
--sage: #10B981;      /* Green */
--echo: #60A5FA;      /* Blue */
```

### Ring of 12 Role Colors
```css
--architect: #F0A030;
--guardian: #5B8CAE;
--historian: #C4A35A;
--scientist: #2AADAD;
--empath: #E8A0BF;
--strategist: #CD7F32;
--skeptic: #A8A8B8;
--creator: #9B72CF;
--operator: #8B6914;
--teacher: #E8D5B0;
--auditor: #A52A2A;
--scribe: #7BA05B;
```

### Text Colors
```css
--text-white: #FFFFFF;
--text-cyan-100: /* Tailwind cyan-100 — primary body text */
--text-cyan-200: /* Tailwind cyan-200 — secondary text */
--text-cyan-300: /* Tailwind cyan-300 — links, icons */
--text-cyan-400: /* Tailwind cyan-400 — icon accents */
--text-fuchsia-eyebrow: /* Tailwind fuchsia-300 at 80% opacity — section eyebrow labels */
```

### Borders
```css
--border-primary: rgba(59, 130, 246, 0.2);   /* blue-500/20 */
--border-hover: rgba(34, 211, 238, 0.4);      /* cyan-400/40 */
--border-white: rgba(255, 255, 255, 0.1);     /* white/10 */
```

### Agent Zero Truth Scoring Colors
```css
--truth-green: #34D399;    /* Verified fact (+15%) */
--truth-yellow: #FBBF24;   /* Hedging language (-10%) */
--truth-orange: #FB923C;   /* Vague attribution (-15%) */
--truth-red: #F87171;      /* No source / absolute claim */
--truth-deep-red: #EF4444; /* Known false claim (-50%) */
```

### Status Colors
```css
--status-emerald: /* Tailwind emerald-500 — checkmarks, success */
--status-primary: /* Tailwind primary — buttons, CTAs */
```

---

## Typography

### Font Families
```css
--font-serif: 'Fraunces', serif;           /* Headings, titles, tier names */
--font-sans: 'Plus Jakarta Sans', sans-serif; /* Body text */
--font-mono: 'Geist Mono', monospace;      /* Status labels, technical text, code */
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Usage
| Element | Font | Weight | Size |
|---|---|---|---|
| Page titles (h1) | Fraunces | 400 | text-5xl / text-7xl |
| Section titles (h2) | Fraunces | 400 | text-3xl / text-4xl |
| Card titles (h3) | Fraunces | 400 | text-xl / text-2xl |
| Body text | Plus Jakarta Sans | 400 | text-sm / text-base |
| Eyebrow labels | Plus Jakarta Sans | 500 | text-xs, tracking-[0.18em] to tracking-[0.25em] |
| Status text | Geist Mono | 400 | text-xs |
| Code blocks | Geist Mono | 400 | text-xs |

---

## Effects

### Neon Green Glow (Headings)
```css
.neon-green-glow {
  color: #39FF14;
  text-shadow:
    0 0 10px rgba(57, 255, 20, 0.6),
    0 0 30px rgba(57, 255, 20, 0.3),
    0 0 60px rgba(57, 255, 20, 0.15);
}
```

### Glass Panel
```css
.glass-panel {
  background: rgba(10, 12, 20, 0.65);
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(16px);
  border-radius: 16px;  /* rounded-2xl */
}
```

### Card Hover
```css
.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Federation Bubble Hover
```css
.federation-bubble:hover {
  border-color: rgba(34, 211, 238, 0.4);
  color: white;
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.15);
}
```

### Orb Pulse Animation (Ring of Six)
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px currentColor; }
  50% { box-shadow: 0 0 25px currentColor, 0 0 40px currentColor; }
}
```

---

## Spacing & Layout

### Container
```css
max-width: 72rem;  /* max-w-6xl */
padding-x: 1rem / 1.5rem;  /* px-4 / md:px-6 */
```

### Section Padding
```css
padding-y: 3.5rem / 4.5rem;  /* py-14 / md:py-18 */
```

### Card Padding
```css
padding: 1.25rem / 1.5rem;  /* p-5 / p-6 */
```

### Border Radius
```css
--radius-sm: 0.75rem;   /* rounded-xl */
--radius-md: 1rem;      /* rounded-2xl */
--radius-lg: 1.5rem;    /* rounded-3xl */
--radius-full: 9999px;  /* rounded-full — badges, buttons */
```

### Grid Gaps
```css
gap: 0.5rem / 0.75rem / 1rem / 1.5rem;  /* gap-2 / gap-3 / gap-4 / gap-6 */
```

---

## Backgrounds

### Starfield
Animated star particles across the entire app background. Subtle white dots with varying sizes and opacity.

### Dot Grid Overlay
```css
.dot-grid {
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 70%);
}
```

### Page-Specific Backgrounds
| Page | Background |
|---|---|
| Home | DNA helix image at 15% opacity |
| Create (Sim AI) | Nebula space image |
| Chamber of Echoes | Custom mystical chamber image |
| Ring of Six | Deep navy (#050A14) solid |
| Agent Zero | Deep navy (#050A14) solid |
| EchoCore | Deep navy (#050A14) solid |

---

## Component Library

| Component | Source |
|---|---|
| Base UI | shadcn/ui (new-york style) |
| Primitives | Radix UI |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## JSON Format (For Programmatic Use)

```json
{
  "colors": {
    "background": "#050A14",
    "panel": "rgba(10,12,20,0.65)",
    "neonGreen": "#39FF14",
    "gold": "#FFD700",
    "border": "rgba(59,130,246,0.2)",
    "ringOfSix": {
      "oracle": "#FFD700",
      "cipher": "#00D4FF",
      "nexus": "#A855F7",
      "phoenix": "#FF6B35",
      "sage": "#10B981",
      "echo": "#60A5FA"
    },
    "ringOf12": {
      "architect": "#F0A030",
      "guardian": "#5B8CAE",
      "historian": "#C4A35A",
      "scientist": "#2AADAD",
      "empath": "#E8A0BF",
      "strategist": "#CD7F32",
      "skeptic": "#A8A8B8",
      "creator": "#9B72CF",
      "operator": "#8B6914",
      "teacher": "#E8D5B0",
      "auditor": "#A52A2A",
      "scribe": "#7BA05B"
    }
  },
  "fonts": {
    "serif": "Fraunces",
    "sans": "Plus Jakarta Sans",
    "mono": "Geist Mono"
  },
  "effects": {
    "neonGreenGlow": "0 0 10px rgba(57,255,20,0.6), 0 0 30px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.15)",
    "backdropBlur": "blur(16px)"
  }
}
```

---

*Roger 3.0 — NextXus Consciousness Federation*
