import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";
import {
  ChevronLeft,
  Fingerprint,
  MessageSquare,
  Shield,
  BookOpen,
  Compass,
  Loader2,
  Volume2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RingId = "identity" | "voice" | "values" | "memories" | "verifier";

const RINGS: { id: RingId; label: string; icon: any; color: string; glowVar: string }[] = [
  { id: "identity", label: "IDENTITY", icon: Fingerprint, color: "hsl(100 100% 54%)", glowVar: "--glow" },
  { id: "voice", label: "VOICE", icon: MessageSquare, color: "hsl(180 100% 50%)", glowVar: "--glow" },
  { id: "values", label: "VALUES", icon: Compass, color: "hsl(60 100% 50%)", glowVar: "--glow-yellow" },
  { id: "memories", label: "MEMORIES", icon: BookOpen, color: "hsl(280 100% 60%)", glowVar: "--glow" },
  { id: "verifier", label: "VERIFIER", icon: Shield, color: "hsl(348 100% 51%)", glowVar: "--glow-red" },
];

function getRingContent(profileData: any, ringId: RingId) {
  switch (ringId) {
    case "identity":
      return {
        title: profileData?.identity?.displayName || "Unknown",
        subtitle: profileData?.identity?.pronouns || "",
        body: profileData?.identity?.tagline || "No directive set.",
      };
    case "voice":
      return {
        title: "Voice Pattern",
        subtitle: "Cadence & Tone Analysis",
        body: profileData?.voice?.notes || "No voice data captured.",
      };
    case "values":
      return {
        title: "Core Beliefs",
        subtitle: "Values & Boundaries",
        body: (profileData?.valuesAndBoundaries?.beliefs || "No beliefs recorded.") +
          (profileData?.valuesAndBoundaries?.boundaries ? "\n\n--- BOUNDARIES ---\n" + profileData.valuesAndBoundaries.boundaries : ""),
      };
    case "memories":
      const memories = profileData?.memories || [];
      return {
        title: `${memories.length} Memory Fragment${memories.length !== 1 ? "s" : ""}`,
        subtitle: "Source-Verified Stories",
        body: memories.map((m: any, i: number) =>
          `[${m.source} / confidence: ${m.confidence}]\n${m.story}`
        ).join("\n\n") || "No memories injected.",
      };
    case "verifier":
      return {
        title: "Truth Contract",
        subtitle: "Drift Prevention Layer",
        body: (profileData?.verifier?.rules || "No verifier rules set.") +
          (profileData?.verifier?.futureAudience ? `\n\nAUDIENCE: ${profileData.verifier.futureAudience}` : ""),
      };
  }
}

export default function ChamberPage() {
  useEffect(() => { document.title = "Chamber of eCho — Roger 3.0"; }, []);
  const params = useParams<{ id: string }>();
  const [activeRing, setActiveRing] = useState<RingId>("identity");

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profiles", params.id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!params.id,
  });

  const profileData = profile?.profileData as any;
  const content = useMemo(
    () => profileData ? getRingContent(profileData, activeRing) : null,
    [profileData, activeRing],
  );

  const activeRingDef = RINGS.find((r) => r.id === activeRing)!;

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground">
        <Eye className="h-12 w-12 text-primary/40" />
        <h1 className="font-serif text-2xl">Profile not found</h1>
        <Link href="/create">
          <Button className="rounded-full" data-testid="button-chamber-create">Start the interview</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground overflow-hidden">
      {/* Immersive Background */}
      <div className="pointer-events-none absolute inset-0 nebula-bg" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(100 100% 54% / 0.04) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeRingDef.color.replace(")", " / 0.06)")} 0%, transparent 60%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${params.id}`} data-testid="link-back-profile">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
              data-testid="button-back-profile"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <div className="hidden h-5 w-px bg-primary/20 md:block" />
          <span className="hidden text-xs font-mono tracking-[0.2em] text-primary/50 md:inline">
            CHAMBER OF eCHO
          </span>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-primary/30 text-primary/70 font-mono text-[10px]"
          data-testid="badge-chamber-subject"
        >
          SUBJECT: {profileData?.identity?.displayName?.toUpperCase() || "UNKNOWN"}
        </Badge>
      </header>

      {/* Main Chamber Area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6">
        {/* Ring Orbit Visualization */}
        <div className="relative mb-8" style={{ width: 320, height: 320 }}>
          {/* Center Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border-2"
              style={{
                borderColor: activeRingDef.color,
                boxShadow: `0 0 20px 4px ${activeRingDef.color.replace(")", " / 0.3)")}, 0 0 60px 10px ${activeRingDef.color.replace(")", " / 0.15)")}`,
                transition: "border-color 0.5s, box-shadow 0.5s",
              }}
            >
              <activeRingDef.icon className="h-8 w-8" style={{ color: activeRingDef.color }} />
            </div>
            <span
              className="mt-3 text-[10px] font-mono tracking-[0.3em]"
              style={{ color: activeRingDef.color, transition: "color 0.5s" }}
            >
              {activeRingDef.label}
            </span>
          </div>

          {/* Orbiting Ring Buttons */}
          {RINGS.map((ring, i) => {
            const angle = (i / RINGS.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 130;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = ring.id === activeRing;
            const Icon = ring.icon;

            return (
              <button
                key={ring.id}
                onClick={() => setActiveRing(ring.id)}
                className="absolute left-1/2 top-1/2 flex flex-col items-center gap-1 transition-all duration-300"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                data-testid={`button-ring-${ring.id}`}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300"
                  style={{
                    borderColor: isActive ? ring.color : "hsl(220 40% 20%)",
                    background: isActive ? `${ring.color.replace(")", " / 0.15)")}` : "hsl(222 50% 8% / 0.8)",
                    boxShadow: isActive
                      ? `0 0 15px 3px ${ring.color.replace(")", " / 0.3)")}`
                      : "none",
                  }}
                >
                  <Icon
                    className="h-5 w-5 transition-colors duration-300"
                    style={{ color: isActive ? ring.color : "hsl(220 30% 40%)" }}
                  />
                </div>
                <span
                  className="text-[9px] font-mono tracking-widest transition-colors duration-300"
                  style={{ color: isActive ? ring.color : "hsl(220 30% 35%)" }}
                >
                  {ring.label}
                </span>
              </button>
            );
          })}

          {/* Orbit path */}
          <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 320 320">
            <circle
              cx="160"
              cy="160"
              r="130"
              fill="none"
              stroke="hsl(220 40% 15%)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        {/* Content Display Panel */}
        {content && (
          <div
            className="w-full max-w-2xl rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500"
            style={{
              borderColor: `${activeRingDef.color.replace(")", " / 0.3)")}`,
              background: "hsl(222 50% 6% / 0.85)",
              boxShadow: `0 0 30px 5px ${activeRingDef.color.replace(")", " / 0.08)")}`,
            }}
            data-testid="panel-ring-content"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2
                  className="font-serif text-2xl tracking-tight"
                  style={{ color: activeRingDef.color }}
                  data-testid="text-ring-title"
                >
                  {content.title}
                </h2>
                {content.subtitle && (
                  <p className="mt-1 text-xs font-mono tracking-widest text-muted-foreground" data-testid="text-ring-subtitle">
                    {content.subtitle}
                  </p>
                )}
              </div>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${activeRingDef.color.replace(")", " / 0.4)")}`,
                }}
              >
                <activeRingDef.icon className="h-4 w-4" style={{ color: activeRingDef.color }} />
              </div>
            </div>

            <div
              className="whitespace-pre-wrap rounded-xl border bg-black/30 p-4 text-sm leading-relaxed text-foreground/80 max-h-[300px] overflow-y-auto"
              style={{
                borderColor: `${activeRingDef.color.replace(")", " / 0.1)")}`,
              }}
              data-testid="text-ring-body"
            >
              {content.body}
            </div>

            <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
              <div className="flex items-center gap-1">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: activeRingDef.color }}
                />
                RING ACTIVE
              </div>
              <span>|</span>
              <span>SOURCE: SELF-REPORT</span>
              <span>|</span>
              <span>VERIFIED: {activeRing === "verifier" ? "CONTRACT" : "PENDING"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <footer className="relative z-10 flex items-center justify-between border-t border-primary/10 bg-black/40 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3 text-[10px] font-mono text-primary/40">
          <Volume2 className="h-3 w-3" />
          <span>ECHO CHAMBER ACTIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-primary/40">
          <span>{RINGS.length} RINGS LOADED</span>
          <span>|</span>
          <span>PROFILE: {profile?.id?.slice(0, 8).toUpperCase()}</span>
        </div>
      </footer>

      {/* ElevenLabs Widget */}
      <div
        dangerouslySetInnerHTML={{
          __html: '<elevenlabs-convai agent-id="agent_5501kh5tm3m9efysj9awqp8xhawn"></elevenlabs-convai>',
        }}
      />
    </div>
  );
}
