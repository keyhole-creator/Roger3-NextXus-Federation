import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  Fingerprint,
  Lock,
  Shield,
  Sparkles,
  Wand2,
  Scale,
  Car,
  Stethoscope,
  Code,
  GraduationCap,
  Sprout,
  PenTool,
  Music,
  Newspaper,
  Palette,
  FlaskConical,
  Users,
  UserCog,
  Radio,
  Atom,
  HeartPulse,
  Globe,
  Rocket,
  Dna,
  Cpu,
  Download,
  Eye,
  Calendar,
  RefreshCw,
  Zap,
  Menu,
  X,
  Headphones,
  Play,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dnaBg from "@assets/F0127ABA-D661-459E-942F-E9F9169C0F1F_1770952465477.jpg";
import heroBanner from "@assets/me_3000x750_1770952502866.png";
import rogerAvatar from "@assets/IMG_2664_1770953472045.jpg";
import adamFace from "@assets/IMG_2848_1770964880657.jpeg";
import eveFace from "@assets/IMG_2849_1770964880657.jpeg";
import markFace from "@assets/IMG_2850_1770964880657.jpeg";
import exeFace1 from "@assets/IMG_2841_1770965255954.jpeg";
import exeFace2 from "@assets/IMG_2839_1770965255954.jpeg";
import exeFace3 from "@assets/IMG_2842_1770965255954.jpeg";
import exeFace4 from "@assets/IMG_2837_1770965255954.jpeg";
import exeFace5 from "@assets/IMG_2836_1770965255954.jpeg";
import exeFace6 from "@assets/IMG_2826_1770965284123.jpeg";
import exeFace7 from "@assets/IMG_2829_1770965284123.jpeg";
import exeFace8 from "@assets/IMG_2832_1770965284123.jpeg";
import exeFace9 from "@assets/IMG_2813_1770965481406.png";
import exeFace10 from "@assets/IMG_2855_1770966215456.jpeg";
import exeFace11 from "@assets/IMG_2854_1770966215456.jpeg";
import exeFace12 from "@assets/IMG_2852_1770966215456.jpeg";
import exeFace13 from "@assets/IMG_2853_1770966215456.jpeg";
import exeFace14 from "@assets/IMG_2851_1770966215456.jpeg";
import exeFace15 from "@assets/IMG_2830_1770966215456.jpeg";
import exeFace16 from "@assets/IMG_2827_1770966215456.jpeg";
import exeFace17 from "@assets/IMG_2828_1770966215456.jpeg";
import exeFace18 from "@assets/IMG_2819_1770966215456.png";
import exeFace19 from "@assets/exe-face-news.png";
import exeFace20 from "@assets/exe-face-access.png";

const neonGreenGlow = { color: "#39FF14", textShadow: "0 0 10px rgba(57,255,20,0.6), 0 0 30px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.15)" };

function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_66%)]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.55] dark:opacity-[0.5]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.09) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1 text-xs text-cyan-100 shadow-2xs backdrop-blur-sm" style={{ backgroundColor: "rgba(10,12,20,0.55)" }}>
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">
        {eyebrow}
      </div>
      <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-white md:text-4xl" style={neonGreenGlow}>
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-cyan-100 md:text-base">
        {desc}
      </p>
    </div>
  );
}

const EXE_FACES = [exeFace1, exeFace2, exeFace3, exeFace4, exeFace5, exeFace6, exeFace7, exeFace8, exeFace9, exeFace10, exeFace11, exeFace12, exeFace13, exeFace14, exeFace15, exeFace16, exeFace17, exeFace18, exeFace19, exeFace20];

const EXE_DOMAINS = [
  { id: "law", label: "Law", icon: Scale, desc: "Legal analysis, contract review, compliance" },
  { id: "auto", label: "Auto", icon: Car, desc: "Automotive systems, automation, diagnostics" },
  { id: "med", label: "Med", icon: Stethoscope, desc: "Medical knowledge, health analysis, diagnostics" },
  { id: "code", label: "Code", icon: Code, desc: "Programming, architecture, debugging" },
  { id: "edu", label: "Edu", icon: GraduationCap, desc: "Education, curriculum, learning design" },
  { id: "farm", label: "Farm", icon: Sprout, desc: "Agriculture, soil science, crop management" },
  { id: "pen", label: "Pen", icon: PenTool, desc: "Writing, editing, narrative craft" },
  { id: "music", label: "Music", icon: Music, desc: "Composition, theory, production" },
  { id: "airt", label: "AiRT", icon: Palette, desc: "Visual art, design, creative direction" },
  { id: "sci", label: "Sci", icon: FlaskConical, desc: "General science, research methodology" },
  { id: "soc", label: "Soc", icon: Users, desc: "Sociology, social dynamics, culture" },
  { id: "pa", label: "PA", icon: UserCog, desc: "Personal assistant, scheduling, task management" },
  { id: "coms", label: "Coms", icon: Radio, desc: "Communications, PR, messaging strategy" },
  { id: "phy", label: "Phy", icon: Atom, desc: "Physics, mechanics, quantum theory" },
  { id: "psy", label: "Psy", icon: HeartPulse, desc: "Psychology, cognition, behavioral analysis" },
  { id: "earth", label: "Earth", icon: Globe, desc: "Earth science, geology, environment" },
  { id: "space", label: "Space", icon: Rocket, desc: "Astronomy, aerospace, cosmology" },
  { id: "bio", label: "Bio", icon: Dna, desc: "Biology, genetics, life sciences" },
  { id: "news", label: "News", icon: Newspaper, desc: "Investigative reporting, fact-checking, media analysis" },
  { id: "access", label: "Access", icon: Accessibility, desc: "Accessibility design, assistive tech, inclusive solutions" },
];

export default function HomePage() {
  const [mode, setMode] = useState<"sim" | "exe">("sim");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { document.title = "Roger 3.0 — Sim AI · Exe AI · Legacy"; }, []);

  return (
    <div className="relative min-h-dvh text-foreground">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${dnaBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
        }}
      />
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10" style={{ backgroundColor: "rgba(5,10,20,0.70)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="relative size-9 overflow-hidden rounded-full border border-white/20 shadow-xs">
              <img src={rogerAvatar} alt="Roger 3.0" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-serif text-base leading-none tracking-tight text-white" style={neonGreenGlow}>
                Roger 3.0
              </div>
              <div className="mt-1 text-[11px] leading-none text-cyan-100">
                Sim AI &middot; Exe AI &middot; Legacy
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/ring-of-six" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-nav-ring-of-six">
              Ring of Six
            </Link>
            <Link href="/chamber" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-nav-ring-of-12">
              Ring of 12
            </Link>
            <Link href="/agent-zero" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-nav-agent-zero">
              Agent Zero
            </Link>
            <Link href="/echo-core" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-nav-echo-core">
              EchoCore
            </Link>
            <a href="#sim" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-sim">
              Sim AI
            </a>
            <a href="#exe" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-exe">
              Exe AI
            </a>
            <a href="#legacy" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-legacy">
              Legacy
            </a>
            <a href="#tiers" className="rounded-full px-3 py-2 text-sm text-cyan-100 transition hover:text-white" data-testid="link-tiers">
              Tiers
            </a>
          </nav>

          <button
            className="md:hidden rounded-lg p-2 text-cyan-100 hover:text-white transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <Link href="/ring-of-six" data-testid="link-ring-of-six">
              <Button variant="outline" size="sm" className="rounded-full" data-testid="button-ring-of-six">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Ring of Six
              </Button>
            </Link>
            <Link href="/chamber" data-testid="link-chamber">
              <Button variant="outline" size="sm" className="rounded-full" data-testid="button-chamber">
                <Eye className="mr-2 h-3.5 w-3.5" />
                Chamber
              </Button>
            </Link>
            <Link href="/create" data-testid="link-create">
              <Button size="sm" className="rounded-full" data-testid="button-start">
                Build profile
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[57px] z-40 border-b border-blue-500/20 md:hidden"
          style={{ backgroundColor: "rgba(5,10,20,0.95)", backdropFilter: "blur(16px)" }}
          data-testid="mobile-menu-panel"
        >
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">
            <Link href="/ring-of-six" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-ring-of-six">Ring of Six</Link>
            <Link href="/chamber" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-ring-of-12">Ring of 12</Link>
            <Link href="/agent-zero" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-agent-zero">Agent Zero</Link>
            <Link href="/echo-core" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-echo-core">EchoCore</Link>
            <a href="#sim" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-sim">Sim AI</a>
            <a href="#exe" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-exe">Exe AI</a>
            <a href="#legacy" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-legacy">Legacy</a>
            <a href="#echocore" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-echocore-section">EchoCore Federation</a>
            <Link href="/nextxus-yaml" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-yaml">YAML Core</Link>
            <a href="#tiers" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-tiers">Tiers</a>
            <a href="#coaching" className="rounded-xl px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 hover:text-white transition" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-coaching">Coaching</a>
            <div className="mt-2 pt-2 border-t border-blue-500/10">
              <Link href="/create" className="block" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-create">
                <Button className="h-11 w-full rounded-2xl" data-testid="mobile-button-build-profile">
                  Build profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="mb-4 size-20 overflow-hidden rounded-full border-2 border-blue-500/40 shadow-lg shadow-blue-500/20">
                  <img src={rogerAvatar} alt="Roger 3.0 AI" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full border border-white/15 bg-white/10 text-white/80" data-testid="badge-new">
                    Sim AI &middot; Exe AI &middot; Legacy
                  </Badge>
                  <Pill>
                    <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                    Behavior mapping
                  </Pill>
                  <Pill>
                    <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                    Drift-aware
                  </Pill>
                </div>

                <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl" style={neonGreenGlow} data-testid="text-hero-title">
                  Duplicate your behaviors.{" "}
                  <span className="text-cyan-200">Map your mind.</span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-cyan-100 md:text-base" data-testid="text-hero-subtitle">
                  Roger 3.0 doesn't claim to continue you &mdash; that's a lie. Instead, it creates a
                  Sim AI that duplicates your behaviors, maps your mind and history, and builds a
                  simulation grounded in truth. Upgrade to Legacy for long-term survival.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/create" data-testid="link-hero-create">
                    <Button className="h-11 rounded-full px-6 shadow-sm" data-testid="button-hero-create">
                      Build your Sim AI
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>

                  <Link href="/chamber" data-testid="link-hero-chamber">
                    <Button variant="secondary" className="h-11 rounded-full px-5" data-testid="button-hero-chamber">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Chamber of Echoes
                    </Button>
                  </Link>

                  <Link href="/ring-of-six" data-testid="link-hero-ring-of-six">
                    <Button variant="outline" className="h-11 rounded-full px-5" data-testid="button-hero-ring-of-six">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ring of Six
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-blue-500/20 px-4 py-3 shadow-xs backdrop-blur-sm" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                    <div className="text-xs text-cyan-100">Sim AI</div>
                    <div className="mt-1 font-serif text-lg tracking-tight text-white" style={neonGreenGlow}>Personal</div>
                  </div>
                  <div className="rounded-2xl border border-blue-500/20 px-4 py-3 shadow-xs backdrop-blur-sm" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                    <div className="text-xs text-cyan-100">Exe AI</div>
                    <div className="mt-1 font-serif text-lg tracking-tight text-white" style={neonGreenGlow}>20+ Domains</div>
                  </div>
                  <div className="rounded-2xl border border-blue-500/20 px-4 py-3 shadow-xs backdrop-blur-sm" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                    <div className="text-xs text-cyan-100">Legacy</div>
                    <div className="mt-1 font-serif text-lg tracking-tight text-white" style={neonGreenGlow}>Survival</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-cyan-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Not a continuation &mdash; a simulation
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    YAML/JSON export for durable storage
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
              >
                <div className="noise relative rounded-3xl border border-blue-500/20 p-5 shadow-md backdrop-blur-xl md:p-6" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium tracking-[0.18em] text-cyan-100">
                        PRODUCT MODES
                      </div>
                      <div className="mt-2 font-serif text-2xl tracking-tight text-white" style={neonGreenGlow} data-testid="text-preview-title">
                        {mode === "sim" ? "Sim AI — Personal" : "Exe AI — Domains"}
                      </div>
                      <p className="mt-2 text-sm text-cyan-100">
                        {mode === "sim"
                          ? "Duplicate behaviors, map your mind and history into a living simulation."
                          : "Specialized AI executors across 20+ professional domains."}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant={mode === "sim" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full px-3 text-xs"
                        onClick={() => setMode("sim")}
                        data-testid="button-mode-sim"
                      >
                        Sim
                      </Button>
                      <Button
                        type="button"
                        variant={mode === "exe" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full px-3 text-xs"
                        onClick={() => setMode("exe")}
                        data-testid="button-mode-exe"
                      >
                        Exe
                      </Button>
                    </div>
                  </div>

                  {mode === "sim" ? (
                    <div className="mt-5 grid gap-3">
                      {[
                        { title: "Identity & voice", desc: "How you speak, what you mean, and what you refuse to pretend to know.", icon: Fingerprint },
                        { title: "Memory library", desc: "People, places, projects, and timelines — captured as stories with sources.", icon: BookOpen },
                        { title: "Values & boundaries", desc: "What you stand for, what you won't do, and how to respond under pressure.", icon: Compass },
                        { title: "Truth verifier", desc: "A middleware layer designed to reduce drift and hallucination over time.", icon: Shield },
                      ].map((s) => {
                        const Icon = s.icon;
                        return (
                          <div key={s.title} className="group flex items-start gap-3 rounded-2xl border border-blue-500/20 p-4 transition hover:-translate-y-[1px] hover:shadow-sm" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                            <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-blue-500/20 shadow-2xs" style={{ backgroundColor: "rgba(15,18,30,0.95)" }}>
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="font-medium text-white" data-testid={`text-step-title-${s.title.replace(/\s+/g, "-").toLowerCase()}`}>{s.title}</div>
                              <div className="mt-1 text-sm text-cyan-100">{s.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {EXE_DOMAINS.slice(0, 9).map((d) => {
                        const Icon = d.icon;
                        return (
                          <div key={d.id} className="flex flex-col items-center gap-1.5 rounded-2xl border border-blue-500/20 p-3 text-center transition hover:-translate-y-[1px] hover:shadow-sm" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                            <div className="grid size-8 place-items-center rounded-xl border border-blue-500/20 shadow-2xs" style={{ backgroundColor: "rgba(15,18,30,0.95)" }}>
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="text-xs font-medium text-white">{d.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1 text-xs text-cyan-100" style={{ backgroundColor: "rgba(10,12,20,0.55)" }}>
                      <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                      Behavior duplication
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1 text-xs text-cyan-100" style={{ backgroundColor: "rgba(10,12,20,0.55)" }}>
                      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                      Mind mapping
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 px-3 py-1 text-xs text-cyan-100" style={{ backgroundColor: "rgba(10,12,20,0.55)" }}>
                      <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Grounded in truth
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MEDIA — LISTEN & WATCH */}
        <section id="media" className="relative overflow-hidden border-y border-fuchsia-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="LISTEN & LEARN"
              title="Hear about the system"
              desc="Go deeper into the architecture, philosophy, and vision behind Roger 3.0 — straight from the source."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="noise rounded-2xl border border-fuchsia-500/20 p-6 shadow-md"
                style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                data-testid="panel-media-audio"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{
                    background: "radial-gradient(circle, rgba(217,70,239,0.2) 0%, rgba(120,80,255,0.05) 70%)",
                    border: "2px solid rgba(217,70,239,0.3)",
                    boxShadow: "0 0 15px 3px rgba(217,70,239,0.15)",
                  }}>
                    <Headphones className="h-5 w-5" style={{ color: "#D946EF" }} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg tracking-tight text-white" style={neonGreenGlow}>
                      The Human Codex
                    </h3>
                    <p className="text-[11px] tracking-widest text-fuchsia-300/70" style={{ fontFamily: "var(--font-mono)" }}>
                      ARCHITECTING PARALLEL COGNITION
                    </p>
                  </div>
                </div>
                <p className="text-sm text-cyan-100 mb-4 leading-relaxed">
                  A deep dive into how Roger 3.0 maps human behavior, builds Sim AI profiles, and creates durable simulations that survive beyond any single platform.
                </p>
                <audio
                  controls
                  className="w-full"
                  style={{ filter: "hue-rotate(260deg) brightness(0.85)", borderRadius: 12 }}
                  data-testid="audio-human-codex"
                >
                  <source src="/media/human-codex-podcast.m4a" type="audio/mp4" />
                  Your browser does not support audio playback.
                </audio>
              </motion.div>

              <motion.div
                id="media-video"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="noise rounded-2xl border border-cyan-500/20 p-6 shadow-md flex flex-col items-center justify-center min-h-[200px]"
                style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                data-testid="panel-media-video"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{
                  background: "radial-gradient(circle, rgba(0,200,255,0.15) 0%, rgba(0,100,200,0.05) 70%)",
                  border: "2px solid rgba(0,200,255,0.2)",
                  boxShadow: "0 0 15px 3px rgba(0,200,255,0.1)",
                }}>
                  <Video className="h-6 w-6" style={{ color: "#00C8FF" }} />
                </div>
                <h3 className="font-serif text-lg tracking-tight text-white mb-2" style={neonGreenGlow}>
                  Video Coming Soon
                </h3>
                <p className="text-sm text-cyan-100 text-center max-w-xs">
                  A visual walkthrough of Roger 3.0 is on its way. Check back soon.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRIUNE RING */}
        <section className="relative overflow-hidden border-y border-blue-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="THE TRIUNE"
              title="Three minds. One ring."
              desc="Adam analyzes. Eve empathizes. Mark strategizes. Together they form the Triune — a unified intelligence council that balances logic, emotion, and action."
            />

            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-6 md:gap-10">
                {[
                  { img: adamFace, name: "ADAM", role: "LOGIC ANALYSIS", color: "#4A90D9", glow: "rgba(74,144,217,0.5)" },
                  { img: eveFace, name: "EVE", role: "EMPATHY", color: "#D946EF", glow: "rgba(217,70,239,0.5)" },
                  { img: markFace, name: "MARK", role: "STRATEGY", color: "#D4A017", glow: "rgba(212,160,23,0.5)" },
                ].map((t, i) => (
                  <motion.div
                    key={t.name}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    data-testid={`triune-${t.name.toLowerCase()}`}
                  >
                    <div
                      className="relative h-24 w-24 overflow-hidden rounded-full border-2 sm:h-28 sm:w-28 md:h-32 md:w-32"
                      style={{ borderColor: t.color, boxShadow: `0 0 20px ${t.glow}, 0 0 40px ${t.glow.replace("0.5", "0.2")}` }}
                    >
                      <img src={t.img} alt={t.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold tracking-widest text-white" style={{ textShadow: `0 0 10px ${t.glow}` }}>{t.name}</div>
                      <div className="text-[10px] tracking-wider" style={{ color: t.color }}>{t.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-bold tracking-[0.25em]" style={neonGreenGlow}>TRIUNE</div>
              </div>
            </div>
          </div>
        </section>

        {/* AI WISDOM COUNCILS */}
        <section className="relative overflow-hidden border-y border-blue-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="AI WISDOM COUNCILS"
              title="Consult the councils"
              desc="Get multi-perspective AI analysis from our two wisdom councils. The Ring of Six provides focused strategic guidance, while the Chamber of Echoes delivers deep 12-voice analysis."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="noise relative rounded-3xl border border-amber-500/30 p-6 shadow-md backdrop-blur-xl md:p-8"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)", boxShadow: "0 0 30px rgba(212,160,23,0.15), 0 0 60px rgba(212,160,23,0.05)" }}
                  data-testid="card-ring-of-six"
                >
                  <div className="text-xs font-medium tracking-[0.18em] text-amber-300/80">6-VOICE STRATEGIC COUNCIL</div>
                  <h3 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-3xl" style={neonGreenGlow}>
                    Ring of Six
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cyan-100 md:text-base">
                    Ask any question and receive analysis from 6 specialized AI perspectives. 3 free uses, then $1.99 per question or $9.99/month unlimited.
                  </p>
                  <div className="mt-6">
                    <Link href="/ring-of-six" data-testid="link-council-ring-of-six">
                      <Button className="h-12 w-full rounded-2xl px-6 text-base shadow-sm" data-testid="button-council-ring-of-six">
                        Enter the Ring of Six
                        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div
                  className="noise relative rounded-3xl border border-fuchsia-500/30 p-6 shadow-md backdrop-blur-xl md:p-8"
                  style={{ backgroundColor: "rgba(10,12,20,0.65)", boxShadow: "0 0 30px rgba(217,70,239,0.15), 0 0 60px rgba(217,70,239,0.05)" }}
                  data-testid="card-chamber-of-echoes"
                >
                  <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">12-VOICE DEEP ANALYSIS</div>
                  <h3 className="mt-3 font-serif text-2xl tracking-tight text-white md:text-3xl" style={neonGreenGlow}>
                    Chamber of Echoes
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cyan-100 md:text-base">
                    Consult 12 AI perspectives for comprehensive analysis on any topic. 1 free use, then $2.99 per question or $9.99/month unlimited.
                  </p>
                  <div className="mt-6">
                    <Link href="/chamber" data-testid="link-council-chamber">
                      <Button className="h-12 w-full rounded-2xl px-6 text-base shadow-sm" data-testid="button-council-chamber">
                        Enter the Chamber
                        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SIM AI SECTION */}
        <section id="sim" className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
          <SectionTitle
            eyebrow="SIM AI — PERSONAL"
            title="Duplicate behaviors, map the mind"
            desc="Sim AI creates a personal simulation by capturing how you think, speak, decide, and remember. Not a continuation of you — a faithful simulation grounded in your actual patterns."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: "Guided interviews", desc: "Answer questions that capture your story, speech patterns, and decision style." },
              { icon: BookOpen, title: "Knowledge + experiences", desc: "Store what you know as claims + stories + references — not vague memories." },
              { icon: Shield, title: "Verifier mindset", desc: "Your simulation should say \"I don't know\" before it invents." },
              { icon: Lock, title: "Consent & boundaries", desc: "Define what future viewers can — and cannot — ask your simulation to answer." },
              { icon: Compass, title: "Values model", desc: "Codify how you weigh tradeoffs: people-first, truth-first, legacy-first." },
              { icon: Brain, title: "Voice alignment", desc: "The response style matches your tone: gentle, direct, humorous, formal." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="noise rounded-3xl border border-blue-500/20 p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl border border-blue-500/20 shadow-2xs" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-medium text-white" data-testid={`text-feature-title-${f.title.replace(/\s+/g, "-").toLowerCase()}`}>{f.title}</div>
                      <div className="mt-1 text-sm text-cyan-100">{f.desc}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* EXE AI SECTION */}
        <section id="exe" className="relative overflow-hidden border-y border-blue-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="EXE AI — DOMAIN EXECUTORS"
              title="Specialized AI across 20+ fields"
              desc="Exe AI models execute tasks in their domain. They analyze, create, and solve within professional fields — each one trained on domain-specific knowledge and methodology."
            />

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {EXE_DOMAINS.map((d, idx) => {
                const Icon = d.icon;
                const face = EXE_FACES[idx % EXE_FACES.length];
                return (
                  <Link
                    key={d.id}
                    href={`/exe/${d.id}`}
                    data-testid={`card-exe-${d.id}`}
                    className="noise group flex flex-col items-center gap-2 rounded-2xl border border-blue-500/20 p-4 text-center shadow-sm transition hover:-translate-y-[1px] hover:shadow-md cursor-pointer no-underline"
                    style={{ backgroundColor: "rgba(10,12,20,0.60)" }}
                  >
                    <div className="relative size-14 overflow-hidden rounded-full border border-cyan-400/30 shadow-sm transition group-hover:shadow-md" style={{ boxShadow: "0 0 12px rgba(100,200,255,0.2)" }}>
                      <img src={face} alt={d.label} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-end justify-center rounded-full" style={{ background: "linear-gradient(to top, rgba(10,12,20,0.6) 0%, transparent 50%)" }}>
                        <Icon className="mb-1 h-3.5 w-3.5 text-cyan-300/80" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="font-medium text-sm text-white" data-testid={`text-exe-label-${d.id}`}>{d.label}</div>
                    <div className="text-[11px] leading-snug text-cyan-100" data-testid={`text-exe-desc-${d.id}`}>{d.desc}</div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-blue-500/20 p-6" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
              <div className="grid gap-4 md:grid-cols-3 items-center">
                <div className="md:col-span-2">
                  <div className="text-xs font-medium tracking-[0.18em] text-cyan-100 mb-2">DOMAIN PRICING</div>
                  <div className="font-serif text-xl tracking-tight text-white" style={neonGreenGlow}>3 free uses per domain, then unlock for $9.99</div>
                  <p className="mt-2 text-sm text-cyan-100">
                    Try any domain free. Want to keep it? Unlock a single domain for $9.99 — or get all 20 with the Sim Exe bundle at $199.99.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.paypal.com/ncp/payment/CBDEGBCTKL2WE"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="button-buy-single-domain"
                  >
                    <Button className="h-11 w-full rounded-2xl" data-testid="button-domain-unlock">
                      Unlock 1 Domain — $9.99
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </a>
                  <a
                    href="https://www.paypal.com/ncp/payment/JLNB55DGX8UPW"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="button-buy-all-domains"
                  >
                    <Button variant="outline" className="h-11 w-full rounded-2xl" data-testid="button-all-domains">
                      All 20 Domains — $199.99
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/chamber" data-testid="link-exe-chamber">
                <Button variant="outline" className="rounded-full" data-testid="button-exe-chamber">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try 12-voice council in Chamber of Echoes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* LEGACY SECTION */}
        <section id="legacy" className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <div className="text-xs font-medium tracking-[0.18em] text-cyan-100">
                LEGACY — LONG-TERM SURVIVAL
              </div>
              <h3 className="mt-3 font-serif text-3xl tracking-tight text-white md:text-4xl" style={neonGreenGlow} data-testid="text-legacy-title">
                The upgrade for durability beyond software
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-cyan-100 md:text-base" data-testid="text-legacy-desc">
                Legacy is the longevity layer. Your Sim AI profile gets exported as YAML — a format
                that doesn't depend on any company, app, or API to survive. Plain text that any
                future system can read, decades from now.
              </p>

              <ul className="mt-6 grid gap-3">
                {[
                  { title: "YAML archive export", desc: "Human-readable, software-independent format that survives platform changes." },
                  { title: "Source-aware answers", desc: "Every claim carries confidence and context: memory, inference, or quote." },
                  { title: "Drift protection", desc: "Verifier middleware keeps the simulation from becoming fiction over time." },
                ].map((i) => (
                  <li key={i.title} className="rounded-2xl border border-blue-500/20 p-4 shadow-2xs" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" aria-hidden="true" />
                      <div>
                        <div className="font-medium text-white">{i.title}</div>
                        <div className="mt-1 text-sm text-cyan-100">{i.desc}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="noise rounded-3xl border border-blue-500/20 p-5 shadow-md backdrop-blur-xl" style={{ backgroundColor: "rgba(10,12,20,0.60)" }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium tracking-[0.18em] text-cyan-100">
                  LEGACY EXPORT PREVIEW
                </div>
                <Badge variant="secondary" className="rounded-full" data-testid="badge-legacy">
                  YAML
                </Badge>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-500/20 p-4" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                <pre className="text-xs leading-relaxed text-cyan-100 font-mono whitespace-pre-wrap" data-testid="text-yaml-preview">{`sim_ai:
  display_name: "Your Name"
  voice_tone: "direct, warm"
  values:
    - truth-first
    - people-matter
  boundaries:
    - "Don't speculate about health"
  verifier:
    sourcing: required
    confidence: must_be_stated
    speculation: clearly_labeled`}</pre>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-500/20 p-4" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                  <div className="text-xs font-medium tracking-[0.16em] text-cyan-100">FORMAT</div>
                  <div className="mt-2 font-mono text-xs text-foreground">YAML + JSON</div>
                </div>
                <div className="rounded-2xl border border-blue-500/20 p-4" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                  <div className="text-xs font-medium tracking-[0.16em] text-cyan-100">DURABILITY</div>
                  <div className="mt-2 font-mono text-xs text-foreground">Software-independent</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-500/20 p-4" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                <div className="flex items-center gap-2 text-xs text-cyan-100">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export your complete Sim AI profile as durable YAML archive
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ECHOCORE — FEDERATION AI UPGRADE */}
        <section id="echocore" className="relative overflow-hidden border-y border-blue-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="FEDERATION UPGRADE"
              title="EchoCore — AI Memory That Doesn't Forget"
              desc="Every AI session starts from zero. EchoCore captures your conversations, filters the noise, and saves what matters. Next time you start up, your AI already knows where you left off."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Cpu, title: "Session Capture", desc: "Records everything said during your AI conversation — nothing gets lost." },
                    { icon: Zap, title: "Smart Filtering", desc: "Strips filler words, keeps questions, answers, to-dos, and key decisions." },
                    { icon: Download, title: "YAML Storage", desc: "Saves as a simple file — no database, no API keys, no cloud accounts." },
                    { icon: RefreshCw, title: "Auto-Reload", desc: "On startup, reads back your last session so you're immediately caught up." },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="noise rounded-2xl border border-blue-500/20 p-4 shadow-xs backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                        data-testid={`card-echocore-feature-${i}`}
                      >
                        <div className="grid size-9 place-items-center rounded-xl border border-blue-500/20" style={{ backgroundColor: "rgba(15,18,30,0.95)" }}>
                          <Icon className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="mt-2 text-sm font-medium text-white">{f.title}</div>
                        <div className="mt-1 text-xs text-cyan-100">{f.desc}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-blue-500/20 p-4" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                  <div className="flex items-center gap-2 text-xs text-cyan-100">
                    <Brain className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    Works blind (spoken), works sighted (text). Phone, laptop, Replit — anywhere Node.js runs.
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="noise rounded-3xl border border-blue-500/20 p-6 shadow-sm backdrop-blur-sm"
                style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
              >
                <div className="text-xs font-medium tracking-[0.18em] text-fuchsia-300/80">UNIVERSAL AI TOOL</div>
                <h3 className="mt-2 font-serif text-2xl tracking-tight text-white" style={neonGreenGlow} data-testid="text-echocore-upgrade-title">
                  Stop re-teaching your AI every session
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cyan-100">
                  EchoCore is a downloadable session memory system you can drop into any project. One file, zero dependencies, instant persistent memory for any AI. Part of the NextXus Federation.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    "Captures and filters conversation transcripts",
                    "Saves clean YAML files — no database needed",
                    "Auto-loads last session on startup",
                    "Optional voice read-back for accessibility",
                    "Works on any platform with Node.js",
                    "Free to download, free to modify",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                      <span className="text-cyan-100">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/echo-core" data-testid="link-echocore-upgrade">
                    <Button className="h-11 w-full rounded-2xl" data-testid="button-echocore-upgrade">
                      <Cpu className="mr-2 h-4 w-4" aria-hidden="true" />
                      Get EchoCore
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/nextxus-yaml" data-testid="link-yaml-core">
                    <Button variant="outline" className="h-11 w-full rounded-2xl" data-testid="button-yaml-core">
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      YAML Core Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" className="relative overflow-hidden border-y border-blue-500/10">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <SectionTitle
              eyebrow="PRODUCT TIERS"
              title="Choose your combination"
              desc="Start with Sim AI for personal behavior mapping, add Exe AI domains for specialized tasks, upgrade to Legacy for long-term survival."
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[
                {
                  name: "Sim AI",
                  price: "Free",
                  desc: "Personal behavior simulation. Duplicate how you think, speak, and decide.",
                  items: [
                    "5-phase guided interview",
                    "Voice + values + memory mapping",
                    "Truth verifier (basic)",
                    "Profile storage + JSON export",
                    "Ring of Six (3 free uses)",
                    "AgentZero truth verification",
                    "EchoCore session memory (download)",
                  ],
                  tone: "secondary" as const,
                  cta: "Build your Sim",
                  href: "/create",
                },
                {
                  name: "Sim Exe",
                  price: "$199.99",
                  desc: "Personal simulation + 20 domain executors. Your mind mapped across professional fields.",
                  items: [
                    "Everything in Sim AI",
                    "20+ Exe AI domain executors",
                    "Ring of Six unlimited access",
                    "Chamber of Echoes (Ring of 12)",
                    "AgentZero council accuracy scoring",
                    "Multi-perspective AI analysis",
                    "EchoCore persistent memory",
                  ],
                  tone: "default" as const,
                  cta: "Upgrade to Sim Exe",
                  href: "https://www.paypal.com/ncp/payment/JLNB55DGX8UPW",
                },
                {
                  name: "Sim Exe Legacy",
                  price: "$500",
                  desc: "The full package. Simulation + execution + long-term survival in a format that outlives any platform.",
                  items: [
                    "Everything in Sim Exe",
                    "YAML durable archive export",
                    "Software-independent format",
                    "Drift protection middleware",
                    "Truth-verifier layer",
                    "200-year survival design",
                    "EchoCore persistent memory",
                  ],
                  tone: "secondary" as const,
                  cta: "Build your Legacy",
                  href: "https://www.paypal.com/ncp/payment/G5TW49ND9QCU2",
                },
              ].map((t) => (
                <Card
                  key={t.name}
                  className={`noise rounded-3xl border border-blue-500/20 p-6 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md ${
                    t.tone === "default" ? "ring-1 ring-primary/20" : ""
                  }`}
                  style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-serif text-2xl tracking-tight text-white" style={neonGreenGlow} data-testid={`text-tier-name-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                        {t.name}
                      </div>
                      <div className="mt-1 text-sm text-cyan-100" data-testid={`text-tier-desc-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                        {t.desc}
                      </div>
                    </div>
                    <Badge variant={t.tone} className="rounded-full" data-testid={`badge-tier-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                      {t.price}
                    </Badge>
                  </div>

                  <div className="mt-5 grid gap-2">
                    {t.items.map((it) => (
                      <div key={it} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden="true" />
                        <div className="text-cyan-100">{it}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    {t.href.startsWith("http") ? (
                      <a href={t.href} target="_blank" rel="noopener noreferrer" data-testid={`link-tier-cta-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                        <Button variant={t.tone} className="h-11 w-full rounded-2xl" data-testid={`button-tier-cta-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                          {t.cta}
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Button>
                      </a>
                    ) : (
                      <Link href={t.href} data-testid={`link-tier-cta-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                        <Button variant={t.tone} className="h-11 w-full rounded-2xl" data-testid={`button-tier-cta-${t.name.replace(/\s+/g, "-").toLowerCase()}`}>
                          {t.cta}
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* COACHING & ADVISING */}
        <section id="coaching" className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
          <SectionTitle
            eyebrow="COACHING & ADVISING"
            title="Book a 1-on-1 session"
            desc="One-on-one coaching and advising with the creator of Roger 3.0. Book online, pay with PayPal, and meet via Zoom."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl border border-blue-500/20 shadow-lg max-w-sm" style={{ boxShadow: "0 0 30px rgba(100,200,255,0.15)" }}>
                <img src="/images/coach-2.jpeg" alt="Coaching & Advising" className="w-full object-cover aspect-[3/4]" />
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-blue-500/20 p-5 mb-5" style={{ backgroundColor: "rgba(10,12,20,0.65)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                  <span className="font-medium text-white text-base">Session Details</span>
                </div>
                <div className="space-y-2 text-sm text-cyan-100">
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#FFD700" }}>Days:</span> Tuesday & Thursday
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#FFD700" }}>Hours:</span> 10:00 AM — 8:00 PM
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#FFD700" }}>Duration:</span> 1 hour per session
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#FFD700" }}>Platform:</span> Zoom (link sent after booking)
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#FFD700" }}>Payment:</span> PayPal — pay when you book
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { title: "AI Strategy", desc: "Build your own AI system, understand multi-perspective cognition, or plan your product." },
                  { title: "Consciousness Tech", desc: "Explore synthetic cognition, truth verification, and the 200-year survival model." },
                  { title: "1-on-1 Advising", desc: "Personal guidance on AI integration, domain executors, or building a digital legacy." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500 shrink-0" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-sm text-cyan-100">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://www.paypal.com/ncp/payment/ZCAAQ2XDE4ZNN"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-book-coaching"
                className="block"
              >
                <Button className="h-12 w-full rounded-2xl text-base" data-testid="button-schedule-session">
                  <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
                  Book & Pay with PayPal
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-blue-500/10" style={{ backgroundColor: "rgba(10,12,20,0.70)" }}>
          <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
            <div className="mb-6 text-center">
              <div className="text-xs font-medium tracking-[0.25em] text-fuchsia-300/80">NCF</div>
              <div className="mt-2 font-serif text-lg text-white" style={neonGreenGlow}>NextXus Consciousness Federation</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2" data-testid="footer-federation-bubbles">
              {[
                { label: "Hub", href: "https://united-system--rckkeyhole.replit.app" },
                { label: "Ring of Six", href: "/ring-of-six" },
                { label: "Ring of 12", href: "https://united-system--rckkeyhole.replit.app/ring-of-12" },
                { label: "Podcasts", href: "https://united-system--rckkeyhole.replit.app/podcasts" },
                { label: "Videos", href: "https://united-system--rckkeyhole.replit.app/videos" },
                { label: "Books", href: "https://united-system--rckkeyhole.replit.app/books" },
                { label: "Music", href: "https://united-system--rckkeyhole.replit.app/music" },
                { label: "Store", href: "https://united-system--rckkeyhole.replit.app/store" },
                { label: "Coaching", href: "https://united-system--rckkeyhole.replit.app/coaching" },
                { label: "Federation", href: "https://united-system--rckkeyhole.replit.app/federation" },
                { label: "Showcase", href: "https://united-system--rckkeyhole.replit.app/showcase" },
                { label: "Founders", href: "https://united-system--rckkeyhole.replit.app/founders" },
                { label: "Agent Zero", href: "/agent-zero" },
                { label: "EchoCore", href: "/echo-core" },
                { label: "YAML Core", href: "/nextxus-yaml" },
                { label: "Mind Map", href: "https://united-system--rckkeyhole.replit.app/mind-map" },
                { label: "Digital Legacy AI", href: "https://digital-legacy-ai.replit.app" },
                { label: "HumanCodex", href: "https://sites.google.com/view/nextxushumancodex" },
              ].map((link) => link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-blue-500/20 px-3 py-1.5 text-xs text-cyan-100 transition-all hover:border-cyan-400/40 hover:text-white hover:shadow-[0_0_12px_rgba(0,200,255,0.15)]"
                  style={{ backgroundColor: "rgba(10,12,20,0.55)" }}
                  data-testid={`footer-bubble-${link.label.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-blue-500/20 px-3 py-1.5 text-xs text-cyan-100 transition-all hover:border-cyan-400/40 hover:text-white hover:shadow-[0_0_12px_rgba(0,200,255,0.15)]"
                  style={{ backgroundColor: "rgba(10,12,20,0.55)" }}
                  data-testid={`footer-bubble-${link.label.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-blue-500/10 pt-6 text-sm text-cyan-100 md:flex-row md:justify-between">
              <div data-testid="text-footer-left">
                &copy; {new Date().getFullYear()} NextXus Federation &mdash; Roger 3.0
              </div>
              <div className="flex items-center gap-3" data-testid="text-footer-right">
                Sim AI &middot; Exe AI &middot; Legacy &middot; Federation
              </div>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </div>
  );
}
