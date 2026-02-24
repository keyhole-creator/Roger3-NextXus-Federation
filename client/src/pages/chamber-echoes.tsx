import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Scroll,
  Microscope,
  Heart,
  Target,
  HelpCircle,
  Palette,
  Wrench,
  GraduationCap,
  ClipboardCheck,
  PenTool,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  Loader2,
  ChevronLeft,
  Save,
  Send,
  Key,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePaywall } from "@/hooks/use-paywall";
import { PaywallModal } from "@/components/paywall-modal";
import { AgentZeroTruthPanel } from "@/components/agentzero-truth-panel";
import chamberBg from "@/assets/images/chamber-bg.png";

type ChamberState = "awaiting" | "orbiting" | "converging" | "standing";

interface RoleDef {
  id: string;
  label: string;
  color: string;
  icon: any;
}

interface RoleResult {
  id: string;
  label: string;
  output: string;
  status: "pending" | "thinking" | "done";
}

interface RunResult {
  id: string;
  prompt: string;
  roles: RoleResult[];
  synthesis: string;
  status: string;
}

const ROLES: RoleDef[] = [
  { id: "architect", label: "Architect", color: "#F0A030", icon: Building2 },
  { id: "guardian", label: "Guardian", color: "#5B8CAE", icon: ShieldCheck },
  { id: "historian", label: "Historian", color: "#C4A35A", icon: Scroll },
  { id: "scientist", label: "Scientist", color: "#2AADAD", icon: Microscope },
  { id: "empath", label: "Empath", color: "#E8A0BF", icon: Heart },
  { id: "strategist", label: "Strategist", color: "#CD7F32", icon: Target },
  { id: "skeptic", label: "Skeptic", color: "#A8A8B8", icon: HelpCircle },
  { id: "creator", label: "Creator", color: "#9B72CF", icon: Palette },
  { id: "operator", label: "Operator", color: "#8B6914", icon: Wrench },
  { id: "teacher", label: "Teacher", color: "#E8D5B0", icon: GraduationCap },
  { id: "auditor", label: "Auditor", color: "#A52A2A", icon: ClipboardCheck },
  { id: "scribe", label: "Scribe", color: "#7BA05B", icon: PenTool },
];

const STATUS_LABELS: Record<ChamberState, string> = {
  awaiting: "AWAITING INVOCATION",
  orbiting: "ORBITING",
  converging: "CONVERGING",
  standing: "STANDING TOGETHER",
};

function StatusBar({ state, audioEnabled, onToggleAudio }: { state: ChamberState; audioEnabled: boolean; onToggleAudio: () => void }) {
  return (
    <div className="relative z-30 flex items-center justify-between px-4 py-2 md:px-6" style={{ background: "rgba(5,10,20,0.85)", borderBottom: "1px solid rgba(212,165,116,0.2)" }}>
      <Link href="/" data-testid="link-back-home">
        <Button variant="ghost" size="sm" className="text-[#E8DCC8] hover:text-[#FFD700] hover:bg-transparent gap-1 px-2">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-xs tracking-widest">HOME</span>
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{
          background: state === "awaiting" ? "#D4A574" : state === "standing" ? "#FFD700" : "#F0C674",
          boxShadow: state !== "awaiting" ? "0 0 8px 2px rgba(240,198,116,0.5)" : "none",
          animation: state === "orbiting" || state === "converging" ? "pulse 1s infinite" : "none",
        }} />
        <span data-testid="text-chamber-status" className="text-xs tracking-[0.25em]" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
          {STATUS_LABELS[state]}
        </span>
      </div>
      <button data-testid="button-audio-toggle" onClick={onToggleAudio} className="p-2 rounded-full transition-colors" style={{ color: "#D4A574" }}>
        {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  );
}

function OrbRing({ state, roleResults, selectedRole, onSelectRole }: {
  state: ChamberState;
  roleResults: RoleResult[];
  selectedRole: string | null;
  onSelectRole: (id: string) => void;
}) {
  const getRadius = () => {
    if (state === "converging") return 60;
    if (state === "standing") return 0;
    return 140;
  };

  const radius = getRadius();
  const rotationDuration = state === "orbiting" ? "4s" : state === "converging" ? "2s" : "20s";
  const isStanding = state === "standing";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      <style>{`
        @keyframes chamberOrbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes chamberPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(212,165,116,0.15)" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="absolute flex items-center justify-center">
        <div className="rounded-full flex items-center justify-center" style={{
          width: 80, height: 80,
          background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(212,165,116,0.05) 70%, transparent 100%)",
          border: "2px solid rgba(212,165,116,0.4)",
          boxShadow: "0 0 30px 8px rgba(255,215,0,0.15), 0 0 60px 15px rgba(212,165,116,0.08)",
        }}>
          <Sparkles className="h-6 w-6" style={{ color: "#FFD700" }} />
        </div>
      </div>

      <div style={{
        position: "absolute", width: 300, height: 300,
        animation: isStanding ? "none" : `chamberOrbitSpin ${rotationDuration} linear infinite`,
      }}>
        {ROLES.map((role, i) => {
          const roleResult = roleResults.find(r => r.id === role.id);
          const status = roleResult?.status;
          const isSelected = selectedRole === role.id;
          const isThinking = status === "thinking";
          const isDone = status === "done";

          let x: number, y: number;
          if (isStanding) {
            const arcStart = -Math.PI * 0.85;
            const arcEnd = -Math.PI * 0.15;
            const angle = arcStart + (i / (ROLES.length - 1)) * (arcEnd - arcStart);
            const standRadius = 120;
            x = Math.cos(angle) * standRadius;
            y = Math.sin(angle) * standRadius + 30;
          } else {
            const angle = (i / ROLES.length) * 2 * Math.PI - Math.PI / 2;
            x = Math.cos(angle) * radius;
            y = Math.sin(angle) * radius;
          }

          const Icon = role.icon;
          const orbSize = isSelected ? 48 : 40;

          return (
            <motion.div
              key={role.id}
              data-testid={`orb-${role.id}`}
              className="absolute cursor-pointer flex flex-col items-center"
              style={{
                left: "50%", top: "50%",
                transform: isStanding ? "none" : undefined,
                counterReset: isStanding ? undefined : "none",
              }}
              animate={{
                x: x - orbSize / 2,
                y: y - orbSize / 2 - 8,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              onClick={() => onSelectRole(role.id)}
            >
              <div style={{
                width: orbSize, height: orbSize,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${isSelected || isDone ? role.color : `${role.color}55`}`,
                background: isSelected ? `${role.color}30` : isDone ? `${role.color}15` : "rgba(5,10,20,0.7)",
                boxShadow: isSelected
                  ? `0 0 20px 6px ${role.color}50, 0 0 40px 10px ${role.color}25`
                  : isDone
                    ? `0 0 12px 3px ${role.color}30`
                    : isThinking
                      ? `0 0 10px 3px ${role.color}40`
                      : "none",
                animation: isThinking ? "chamberPulse 1.5s ease-in-out infinite" : "none",
                transition: "all 0.3s ease",
                position: "relative",
              }}>
                <Icon className="h-4 w-4" style={{ color: isSelected || isDone ? role.color : `${role.color}88` }} />
                {isDone && (
                  <div className="absolute -top-1 -right-1 rounded-full flex items-center justify-center" style={{ width: 14, height: 14, background: role.color }}>
                    <Check className="h-2.5 w-2.5 text-black" />
                  </div>
                )}
              </div>
              <span className="mt-1 text-center whitespace-nowrap" style={{
                fontSize: 8, letterSpacing: "0.1em",
                color: isSelected || isDone ? role.color : `${role.color}88`,
                fontFamily: "var(--font-mono)",
                counterReset: isStanding ? undefined : "chamberOrbitSpin",
                transform: isStanding ? "none" : `rotate(calc(-1 * var(--angle, 0deg)))`,
              }}>
                {role.label.toUpperCase()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PromptPodium({ inputText, onInputChange, onSubmit, isProcessing }: {
  inputText: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="w-full max-w-lg mx-auto mt-4 px-4">
      <div className="rounded-xl p-4 backdrop-blur-xl" style={{
        background: "rgba(5,10,20,0.8)",
        border: "1px solid rgba(212,165,116,0.3)",
        boxShadow: "0 0 20px 4px rgba(212,165,116,0.08)",
      }}>
        <Textarea
          data-testid="input-chamber-prompt"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Speak your question into the chamber..."
          disabled={isProcessing}
          rows={3}
          className="resize-none border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#D4A574]/40"
          style={{ color: "#E8DCC8" }}
        />
        <div className="flex justify-end mt-2">
          <Button
            data-testid="button-invoke-council"
            onClick={onSubmit}
            disabled={isProcessing || !inputText.trim()}
            className="rounded-full gap-2 text-xs tracking-widest"
            style={{
              background: isProcessing ? "rgba(212,165,116,0.2)" : "linear-gradient(135deg, #D4A574, #FFD700)",
              color: isProcessing ? "#D4A574" : "#0D1B3E",
              border: "1px solid rgba(212,165,116,0.4)",
            }}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isProcessing ? "CHANNELING..." : "INVOKE THE COUNCIL"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ result, role, isSelected, onClick }: {
  result: RoleResult;
  role: RoleDef;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = role.icon;
  return (
    <motion.div
      data-testid={`card-role-${role.id}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg p-3 cursor-pointer transition-all"
      style={{
        background: isSelected ? "rgba(212,165,116,0.08)" : "rgba(5,10,20,0.5)",
        borderLeft: `3px solid ${role.color}`,
        border: isSelected ? `1px solid ${role.color}40` : "1px solid rgba(212,165,116,0.1)",
        borderLeftWidth: 3,
        borderLeftColor: role.color,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: role.color }} />
          <span className="text-xs tracking-widest" style={{ color: role.color, fontFamily: "var(--font-mono)" }}>
            {role.label.toUpperCase()}
          </span>
        </div>
        {result.status === "thinking" && <Loader2 className="h-3 w-3 animate-spin" style={{ color: role.color }} />}
        {result.status === "done" && <Check className="h-3 w-3" style={{ color: role.color }} />}
      </div>
      <p data-testid={`text-role-output-${role.id}`} className="text-xs leading-relaxed" style={{ color: "#E8DCC8" }}>
        {result.output || "Awaiting response..."}
      </p>
    </motion.div>
  );
}

function ResultsPanel({ roleResults, synthesis, selectedRole, onSelectRole, onSaveRun, followUpText, onFollowUpChange, onFollowUp, chamberState }: {
  roleResults: RoleResult[];
  synthesis: string;
  selectedRole: string | null;
  onSelectRole: (id: string) => void;
  onSaveRun: () => void;
  followUpText: string;
  onFollowUpChange: (v: string) => void;
  onFollowUp: () => void;
  chamberState: ChamberState;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showSynthesis = chamberState === "standing" && synthesis;
  const showActions = chamberState === "standing" && synthesis;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 md:px-6" style={{ borderBottom: "1px solid rgba(212,165,116,0.15)" }}>
        <h2 className="text-sm tracking-[0.3em]" style={{ color: "#D4A574", fontFamily: "var(--font-serif)" }}>
          COUNCIL DELIBERATION
        </h2>
        {roleResults.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(212,165,116,0.1)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${(roleResults.filter(r => r.status === "done").length / 12) * 100}%`,
                background: "linear-gradient(90deg, #D4A574, #FFD700)",
              }} />
            </div>
            <span className="text-[10px]" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
              {roleResults.filter(r => r.status === "done").length}/12
            </span>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 md:px-6 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(212,165,116,0.2) transparent" }}>
        {roleResults.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <Sparkles className="h-8 w-8 mb-3" style={{ color: "#D4A574" }} />
            <p className="text-xs tracking-widest text-center" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
              INVOKE THE COUNCIL TO BEGIN
            </p>
          </div>
        )}
        <AnimatePresence>
          {roleResults.map((result) => {
            const role = ROLES.find(r => r.id === result.id)!;
            return (
              <RoleCard
                key={result.id}
                result={result}
                role={role}
                isSelected={selectedRole === result.id}
                onClick={() => onSelectRole(result.id)}
              />
            );
          })}
        </AnimatePresence>

        {showSynthesis && (
          <motion.div
            data-testid="panel-synthesis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl p-4 mt-4"
            style={{
              background: "rgba(255,215,0,0.05)",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 20px 4px rgba(255,215,0,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" style={{ color: "#FFD700" }} />
              <span className="text-xs tracking-[0.3em]" style={{ color: "#FFD700", fontFamily: "var(--font-mono)" }}>
                SYNTHESIS
              </span>
            </div>
            <p data-testid="text-synthesis" className="text-sm leading-relaxed" style={{ color: "#E8DCC8" }}>
              {synthesis}
            </p>
          </motion.div>
        )}

        {chamberState === "standing" && synthesis && (
          <motion.div
            data-testid="panel-chamber-agentzero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <AgentZeroTruthPanel
              text={[...roleResults.filter(r => r.status === "done").map(r => r.output), synthesis].join("\n")}
              mode="compact"
              label="AGENTZERO · COUNCIL ACCURACY"
            />
          </motion.div>
        )}

        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 pt-3"
          >
            <Button
              data-testid="button-save-run"
              onClick={onSaveRun}
              variant="outline"
              size="sm"
              className="w-full rounded-full gap-2 text-xs tracking-widest"
              style={{ borderColor: "rgba(212,165,116,0.3)", color: "#D4A574" }}
            >
              <Save className="h-3 w-3" />
              SAVE RUN
            </Button>
            <div className="flex gap-2">
              <Textarea
                data-testid="input-followup"
                value={followUpText}
                onChange={(e) => onFollowUpChange(e.target.value)}
                placeholder="Ask a follow-up..."
                rows={2}
                className="flex-1 resize-none border-0 bg-transparent text-xs focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg placeholder:text-[#D4A574]/30"
                style={{ color: "#E8DCC8", background: "rgba(5,10,20,0.5)", border: "1px solid rgba(212,165,116,0.15)" }}
              />
              <Button
                data-testid="button-followup"
                onClick={onFollowUp}
                disabled={!followUpText.trim()}
                size="sm"
                className="self-end rounded-full"
                style={{ background: "rgba(212,165,116,0.2)", color: "#D4A574", border: "1px solid rgba(212,165,116,0.3)" }}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ChamberEchoesPage() {
  useEffect(() => { document.title = "Chamber of Echoes — Ring of 12"; }, []);
  const [chamberState, setChamberState] = useState<ChamberState>("awaiting");
  const [roleResults, setRoleResults] = useState<RoleResult[]>([]);
  const [synthesis, setSynthesis] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [runHistory, setRunHistory] = useState<RunResult[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyExpanded, setApiKeyExpanded] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { toast } = useToast();
  const paywall = usePaywall("ring12", 1);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const handleInvoke = useCallback(async (text: string) => {
    if (!text.trim() || isProcessing) return;

    if (!paywall.canUse) {
      paywall.setShowPaywall(true);
      return;
    }

    clearTimeouts();
    setIsProcessing(true);
    setRoleResults([]);
    setSynthesis("");
    setSelectedRole(null);
    setChamberState("orbiting");

    try {
      const body: any = { inputText: text };
      if (apiKey.trim()) body.apiKey = apiKey.trim();
      const res = await apiRequest("POST", "/api/chamber/run", body);
      const data: RunResult = await res.json();

      setChamberState("converging");

      const allRoles = data.roles || [];
      allRoles.forEach((role, index) => {
        const thinkTimeout = setTimeout(() => {
          setRoleResults(prev => {
            const exists = prev.find(r => r.id === role.id);
            if (exists) return prev;
            return [...prev, { id: role.id, label: role.label, output: "", status: "thinking" }];
          });
        }, index * 400);
        timeoutsRef.current.push(thinkTimeout);

        const doneTimeout = setTimeout(() => {
          setRoleResults(prev => prev.map(r => r.id === role.id ? { ...r, output: role.output, status: "done" } : r));

          if (index === allRoles.length - 1) {
            setTimeout(() => {
              setChamberState("standing");
              setSynthesis(data.synthesis || "The council has spoken. Their wisdom converges on the path forward.");
              setIsProcessing(false);
              setRunHistory(prev => [...prev, data]);
              paywall.recordUse();
            }, 300);
          }
        }, index * 400 + 200);
        timeoutsRef.current.push(doneTimeout);
      });
    } catch (err: any) {
      let errorMsg = "Something went wrong. Please try again.";
      try {
        const parsed = JSON.parse(err.message.substring(err.message.indexOf("{")));
        if (parsed.error) errorMsg = parsed.error;
      } catch {
        if (err.message) errorMsg = err.message;
      }
      toast({
        title: "Chamber Error",
        description: errorMsg,
        variant: "destructive",
      });
      setChamberState("awaiting");
      setIsProcessing(false);
    }
  }, [isProcessing, clearTimeouts, apiKey, toast, paywall]);

  const handleFollowUp = useCallback(() => {
    if (!followUpText.trim()) return;
    const text = followUpText;
    setFollowUpText("");
    setInputText(text);
    handleInvoke(text);
  }, [followUpText, handleInvoke]);

  const handleSaveRun = useCallback(() => {
    const lastRun = runHistory[runHistory.length - 1];
    if (!lastRun) return;
    const blob = new Blob([JSON.stringify(lastRun, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chamber-run-${lastRun.id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [runHistory]);

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#050A14" }}>
      <StatusBar state={chamberState} audioEnabled={audioEnabled} onToggleAudio={() => setAudioEnabled(!audioEnabled)} />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="relative flex flex-col items-center justify-between lg:w-[55%] min-h-[500px] lg:min-h-0" style={{ flexShrink: 0 }}>
          <div className="absolute inset-0 z-0">
            <img src={chamberBg} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.85) 100%)" }} />
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <OrbRing
              state={chamberState}
              roleResults={roleResults}
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />
          </div>

          <div className="relative z-10 w-full pb-4">
            <div className="w-full max-w-lg mx-auto px-4 mb-2">
              <button
                data-testid="button-toggle-api-key"
                onClick={() => setApiKeyExpanded(!apiKeyExpanded)}
                className="flex items-center gap-2 text-xs tracking-widest w-full py-2 transition-colors"
                style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}
              >
                <Key className="h-3.5 w-3.5" />
                <span>Your OpenAI API Key</span>
                <span className="opacity-50 text-[10px] tracking-normal" style={{ fontFamily: "var(--font-sans)" }}>(Optional — override with your own key)</span>
                <span className="ml-auto">
                  {apiKeyExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </span>
              </button>
              {apiKeyExpanded && (
                <div className="rounded-lg p-3 mb-1" style={{
                  background: "rgba(5,10,20,0.8)",
                  border: "1px solid rgba(212,165,116,0.2)",
                }}>
                  <input
                    data-testid="input-api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-transparent border-0 outline-none text-sm"
                    style={{
                      color: "#E8DCC8",
                      borderBottom: "1px solid rgba(212,165,116,0.2)",
                      paddingBottom: "6px",
                    }}
                  />
                </div>
              )}
            </div>

            <PromptPodium
              inputText={inputText}
              onInputChange={setInputText}
              onSubmit={() => handleInvoke(inputText)}
              isProcessing={isProcessing}
            />
            <div className="flex justify-center gap-2 mt-2">
              <Badge
                data-testid="badge-mode"
                className="text-[10px] tracking-widest border"
                style={{
                  background: apiKey.trim() ? "rgba(34,197,94,0.15)" : "rgba(212,165,116,0.1)",
                  color: apiKey.trim() ? "#4ade80" : "#D4A574",
                  borderColor: apiKey.trim() ? "rgba(34,197,94,0.3)" : "rgba(212,165,116,0.2)",
                }}
              >
                {apiKey.trim() ? "YOUR KEY" : "AI POWERED"}
              </Badge>
              {!paywall.isOwner && (
                <Badge
                  data-testid="badge-uses-remaining-ring12"
                  className="text-[10px] tracking-widest border"
                  style={{
                    background: paywall.usesLeft > 0 ? "rgba(212,165,116,0.1)" : "rgba(255,50,50,0.1)",
                    color: paywall.usesLeft > 0 ? "#D4A574" : "#ff6b6b",
                    borderColor: paywall.usesLeft > 0 ? "rgba(212,165,116,0.2)" : "rgba(255,50,50,0.3)",
                  }}
                >
                  {paywall.hasSubscription || paywall.isPaid
                    ? "PAID ACCESS"
                    : `${paywall.usesLeft} FREE USE${paywall.usesLeft !== 1 ? "S" : ""} LEFT`}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:w-[45%] flex flex-col" style={{
          background: "rgba(5,10,20,0.9)",
          borderLeft: "1px solid rgba(212,165,116,0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <ResultsPanel
            roleResults={roleResults}
            synthesis={synthesis}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onSaveRun={handleSaveRun}
            followUpText={followUpText}
            onFollowUpChange={setFollowUpText}
            onFollowUp={handleFollowUp}
            chamberState={chamberState}
          />
        </div>
      </div>

      {paywall.showPaywall && (
        <PaywallModal
          product="ring12"
          totalUses={paywall.totalUses}
          freeLimit={paywall.freeLimit}
          onClose={() => paywall.setShowPaywall(false)}
          onMarkPaid={paywall.markPaid}
          onVerifyOwner={paywall.verifyOwnerCode}
          onRedeemDemo={paywall.redeemDemoCode}
        />
      )}
    </div>
  );
}