import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Binary, GitBranch, Flame, BookOpen, Waves,
  Sparkles, ChevronLeft, Save, Send, Loader2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePaywall } from "@/hooks/use-paywall";
import { PaywallModal } from "@/components/paywall-modal";
import { AgentZeroTruthPanel } from "@/components/agentzero-truth-panel";

interface MemberResult {
  id: string;
  name: string;
  provider: string;
  output: string;
  status: "pending" | "thinking" | "done" | "error";
}

interface RunResult {
  id: string;
  question: string;
  members: MemberResult[];
  synthesis: string;
  status: string;
}

interface MemberDef {
  id: string;
  name: string;
  color: string;
  icon: any;
  provider: string;
}

const MEMBERS: MemberDef[] = [
  { id: "oracle", name: "Oracle", color: "#FFD700", icon: Eye, provider: "OpenAI" },
  { id: "cipher", name: "Cipher", color: "#00D4FF", icon: Binary, provider: "DeepSeek" },
  { id: "nexus", name: "Nexus", color: "#A855F7", icon: GitBranch, provider: "Claude" },
  { id: "phoenix", name: "Phoenix", color: "#FF6B35", icon: Flame, provider: "Grok" },
  { id: "sage", name: "Sage", color: "#10B981", icon: BookOpen, provider: "Claude" },
  { id: "echo", name: "Echo", color: "#60A5FA", icon: Waves, provider: "OpenAI" },
];

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "#10B981",
  DeepSeek: "#00D4FF",
  Claude: "#A855F7",
  Grok: "#FF6B35",
};

type RingState = "idle" | "processing" | "complete";

const STATUS_LABELS: Record<RingState, string> = {
  idle: "AWAITING QUERY",
  processing: "CHANNELING WISDOM",
  complete: "WISDOM REVEALED",
};

function StatusBar({ state }: { state: RingState }) {
  return (
    <div className="relative z-30 flex items-center justify-between px-4 py-2 md:px-6" style={{ background: "rgba(5,10,20,0.85)", borderBottom: "1px solid rgba(212,165,116,0.2)" }}>
      <Link href="/" data-testid="link-back-home">
        <Button variant="ghost" size="sm" className="text-[#E8DCC8] hover:text-[#FFD700] hover:bg-transparent gap-1 px-2">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-xs tracking-widest">HOME</span>
        </Button>
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-sm tracking-[0.3em] font-semibold" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
          RING OF SIX
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{
          background: state === "idle" ? "#D4A574" : state === "complete" ? "#FFD700" : "#F0C674",
          boxShadow: state !== "idle" ? "0 0 8px 2px rgba(240,198,116,0.5)" : "none",
          animation: state === "processing" ? "pulse 1s infinite" : "none",
        }} />
        <span data-testid="text-ring-status" className="text-xs tracking-[0.25em]" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
          {STATUS_LABELS[state]}
        </span>
      </div>
    </div>
  );
}

function HexagonalRing({ state, memberResults, selectedMember, onSelectMember }: {
  state: RingState;
  memberResults: MemberResult[];
  selectedMember: string | null;
  onSelectMember: (id: string) => void;
}) {
  const radius = 120;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      <style>{`
        @keyframes ringPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes ringGlow {
          0%, 100% { box-shadow: 0 0 15px 4px var(--glow-color); }
          50% { box-shadow: 0 0 25px 8px var(--glow-color); }
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <polygon
            points={MEMBERS.map((_, i) => {
              const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
              const r = radius;
              return `${150 + Math.cos(angle) * r},${150 + Math.sin(angle) * r}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(212,165,116,0.12)"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
          <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(212,165,116,0.08)" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="absolute flex items-center justify-center">
        <div className="rounded-full flex items-center justify-center" style={{
          width: 70, height: 70,
          background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(212,165,116,0.05) 70%, transparent 100%)",
          border: "2px solid rgba(212,165,116,0.4)",
          boxShadow: state === "complete"
            ? "0 0 40px 12px rgba(255,215,0,0.2), 0 0 80px 20px rgba(212,165,116,0.1)"
            : "0 0 30px 8px rgba(255,215,0,0.12), 0 0 60px 15px rgba(212,165,116,0.06)",
        }}>
          <Sparkles className="h-6 w-6" style={{ color: "#FFD700" }} />
        </div>
      </div>

      {MEMBERS.map((member, i) => {
        const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const result = memberResults.find(r => r.id === member.id);
        const status = result?.status;
        const isSelected = selectedMember === member.id;
        const isThinking = status === "thinking";
        const isDone = status === "done";
        const isError = status === "error";
        const Icon = member.icon;
        const orbSize = isSelected ? 52 : 44;

        return (
          <motion.div
            key={member.id}
            data-testid={`orb-member-${member.id}`}
            className="absolute cursor-pointer flex flex-col items-center"
            style={{ left: "50%", top: "50%" }}
            animate={{
              x: x - orbSize / 2,
              y: y - orbSize / 2 - 10,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            onClick={() => onSelectMember(member.id)}
          >
            <div style={{
              width: orbSize, height: orbSize,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `2px solid ${isSelected || isDone ? member.color : `${member.color}55`}`,
              background: isSelected ? `${member.color}30` : isDone ? `${member.color}15` : isError ? "rgba(255,50,50,0.15)" : "rgba(5,10,20,0.7)",
              boxShadow: isSelected
                ? `0 0 20px 6px ${member.color}50, 0 0 40px 10px ${member.color}25`
                : isDone
                  ? `0 0 12px 3px ${member.color}30`
                  : isThinking
                    ? `0 0 10px 3px ${member.color}40`
                    : `0 0 6px 2px ${member.color}15`,
              animation: isThinking ? "ringPulse 1.5s ease-in-out infinite" : "none",
              transition: "all 0.3s ease",
              position: "relative",
            }}>
              <Icon className="h-4 w-4" style={{ color: isSelected || isDone ? member.color : `${member.color}88` }} />
              {isDone && (
                <div className="absolute -top-1 -right-1 rounded-full flex items-center justify-center" style={{ width: 14, height: 14, background: member.color }}>
                  <Check className="h-2.5 w-2.5 text-black" />
                </div>
              )}
            </div>
            <span className="mt-1 text-center whitespace-nowrap" style={{
              fontSize: 9, letterSpacing: "0.12em",
              color: isSelected || isDone ? member.color : `${member.color}88`,
              fontFamily: "var(--font-mono)",
            }}>
              {member.name.toUpperCase()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function QuestionInput({ question, onQuestionChange, onSubmit, isProcessing }: {
  question: string;
  onQuestionChange: (v: string) => void;
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
          data-testid="input-ring-question"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Ask the Ring of Six..."
          disabled={isProcessing}
          rows={3}
          className="resize-none border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#D4A574]/40"
          style={{ color: "#E8DCC8" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <div className="flex justify-end mt-2">
          <Button
            data-testid="button-summon-ring"
            onClick={onSubmit}
            disabled={isProcessing || !question.trim()}
            className="rounded-full gap-2 text-xs tracking-widest"
            style={{
              background: isProcessing ? "rgba(212,165,116,0.2)" : "linear-gradient(135deg, #D4A574, #FFD700)",
              color: isProcessing ? "#D4A574" : "#0D1B3E",
              border: "1px solid rgba(212,165,116,0.4)",
            }}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isProcessing ? "CHANNELING..." : "SUMMON THE RING"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ result, member, isSelected, onClick }: {
  result: MemberResult;
  member: MemberDef;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = member.icon;
  const providerColor = PROVIDER_COLORS[member.provider] || "#888";

  return (
    <motion.div
      data-testid={`card-member-${member.id}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg p-3 cursor-pointer transition-all"
      style={{
        background: isSelected ? "rgba(212,165,116,0.08)" : "rgba(5,10,20,0.5)",
        borderLeft: `3px solid ${member.color}`,
        border: isSelected ? `1px solid ${member.color}40` : "1px solid rgba(212,165,116,0.1)",
        borderLeftWidth: 3,
        borderLeftColor: member.color,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: member.color }} />
          <span className="text-xs tracking-widest" style={{ color: member.color, fontFamily: "var(--font-mono)" }}>
            {member.name.toUpperCase()}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{
            background: `${providerColor}20`,
            color: providerColor,
            border: `1px solid ${providerColor}40`,
            fontFamily: "var(--font-mono)",
          }}>
            {member.provider}
          </span>
        </div>
        {result.status === "thinking" && <Loader2 className="h-3 w-3 animate-spin" style={{ color: member.color }} />}
        {result.status === "done" && <Check className="h-3 w-3" style={{ color: member.color }} />}
        {result.status === "error" && <span className="text-[9px] text-red-400">ERROR</span>}
      </div>
      <p data-testid={`text-member-output-${member.id}`} className="text-xs leading-relaxed" style={{ color: "#E8DCC8" }}>
        {result.status === "error" ? (result.output || "Failed to respond.") : (result.output || "Awaiting response...")}
      </p>
    </motion.div>
  );
}

function ResultsPanel({ memberResults, synthesis, selectedMember, onSelectMember, onSaveRun, ringState }: {
  memberResults: MemberResult[];
  synthesis: string;
  selectedMember: string | null;
  onSelectMember: (id: string) => void;
  onSaveRun: () => void;
  ringState: RingState;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showSynthesis = ringState === "complete" && synthesis;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 md:px-6" style={{ borderBottom: "1px solid rgba(212,165,116,0.15)" }}>
        <h2 className="text-sm tracking-[0.3em]" style={{ color: "#D4A574", fontFamily: "var(--font-serif)" }}>
          COUNCIL RESPONSES
        </h2>
        {memberResults.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(212,165,116,0.1)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${(memberResults.filter(r => r.status === "done" || r.status === "error").length / 6) * 100}%`,
                background: "linear-gradient(90deg, #D4A574, #FFD700)",
              }} />
            </div>
            <span className="text-[10px]" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
              {memberResults.filter(r => r.status === "done" || r.status === "error").length}/6
            </span>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 md:px-6 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(212,165,116,0.2) transparent" }}>
        {memberResults.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <Sparkles className="h-8 w-8 mb-3" style={{ color: "#D4A574" }} />
            <p className="text-xs tracking-widest text-center" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
              SUMMON THE RING TO BEGIN
            </p>
          </div>
        )}
        <AnimatePresence>
          {memberResults.map((result) => {
            const member = MEMBERS.find(m => m.id === result.id)!;
            return (
              <MemberCard
                key={result.id}
                result={result}
                member={member}
                isSelected={selectedMember === result.id}
                onClick={() => onSelectMember(result.id)}
              />
            );
          })}
        </AnimatePresence>

        {showSynthesis && (
          <motion.div
            data-testid="panel-ring-synthesis"
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
            <p data-testid="text-ring-synthesis" className="text-sm leading-relaxed" style={{ color: "#E8DCC8" }}>
              {synthesis}
            </p>
          </motion.div>
        )}

        {ringState === "complete" && synthesis && (
          <motion.div
            data-testid="panel-ring6-agentzero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <AgentZeroTruthPanel
              text={[...memberResults.filter(r => r.status === "done").map(r => r.output), synthesis].join("\n")}
              mode="compact"
              label="AGENTZERO · COUNCIL ACCURACY"
            />
          </motion.div>
        )}

        {ringState === "complete" && synthesis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-3"
          >
            <Button
              data-testid="button-save-ring-run"
              onClick={onSaveRun}
              variant="outline"
              size="sm"
              className="w-full rounded-full gap-2 text-xs tracking-widest"
              style={{ borderColor: "rgba(212,165,116,0.3)", color: "#D4A574" }}
            >
              <Save className="h-3 w-3" />
              SAVE RUN
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function RingOfSixPage() {
  useEffect(() => { document.title = "Ring of Six — AI Wisdom Council"; }, []);
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [memberResults, setMemberResults] = useState<MemberResult[]>([]);
  const [synthesis, setSynthesis] = useState("");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [runHistory, setRunHistory] = useState<RunResult[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { toast } = useToast();
  const paywall = usePaywall("ring6", 3);

  const ringState: RingState = isProcessing ? "processing" : memberResults.some(r => r.status === "done") ? "complete" : "idle";

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const handleSummon = useCallback(async () => {
    if (!question.trim() || isProcessing) return;

    if (!paywall.canUse) {
      paywall.setShowPaywall(true);
      return;
    }

    clearTimeouts();
    setIsProcessing(true);
    setMemberResults([]);
    setSynthesis("");
    setSelectedMember(null);

    setMemberResults(MEMBERS.map(m => ({ id: m.id, name: m.name, provider: m.provider, output: "", status: "thinking" })));

    try {
      const res = await apiRequest("POST", "/api/ring-of-six", { question: question.trim() });
      const data: RunResult = await res.json();

      const allMembers = data.members || [];
      allMembers.forEach((member, index) => {
        const timeout = setTimeout(() => {
          setMemberResults(prev => prev.map(r =>
            r.id === member.id ? { ...r, output: member.output, status: member.status === "error" ? "error" : "done" } : r
          ));

          if (index === allMembers.length - 1) {
            const finalTimeout = setTimeout(() => {
              setSynthesis(data.synthesis || "The Ring has spoken.");
              setIsProcessing(false);
              setRunHistory(prev => [...prev, data]);
              paywall.recordUse();
            }, 300);
            timeoutsRef.current.push(finalTimeout);
          }
        }, index * 500);
        timeoutsRef.current.push(timeout);
      });
    } catch (err: any) {
      let errorMsg = "Something went wrong.";
      try {
        const parsed = JSON.parse(err.message.substring(err.message.indexOf("{")));
        if (parsed.error) errorMsg = parsed.error;
      } catch {
        if (err.message) errorMsg = err.message;
      }
      toast({ title: "Ring of Six Error", description: errorMsg, variant: "destructive" });
      setMemberResults([]);
      setIsProcessing(false);
    }
  }, [question, isProcessing, clearTimeouts, toast, paywall]);

  const handleSaveRun = useCallback(() => {
    const lastRun = runHistory[runHistory.length - 1];
    if (!lastRun) return;
    const blob = new Blob([JSON.stringify(lastRun, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ring-of-six-${lastRun.id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [runHistory]);

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#050A14" }}>
      <StatusBar state={ringState} />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="relative flex flex-col items-center justify-between lg:w-[55%] min-h-[500px] lg:min-h-0" style={{ flexShrink: 0 }}>
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full" style={{
              background: "radial-gradient(ellipse at center, rgba(212,165,116,0.06) 0%, rgba(5,10,20,0.95) 70%)",
            }} />
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <HexagonalRing
              state={ringState}
              memberResults={memberResults}
              selectedMember={selectedMember}
              onSelectMember={setSelectedMember}
            />
          </div>

          <div className="relative z-10 w-full pb-4">
            <QuestionInput
              question={question}
              onQuestionChange={setQuestion}
              onSubmit={handleSummon}
              isProcessing={isProcessing}
            />
            {!paywall.isOwner && (
              <div className="flex justify-center mt-2">
                <Badge
                  data-testid="badge-uses-remaining-ring6"
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
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-[45%] flex flex-col" style={{
          background: "rgba(5,10,20,0.6)",
          borderLeft: "1px solid rgba(212,165,116,0.1)",
        }}>
          <ResultsPanel
            memberResults={memberResults}
            synthesis={synthesis}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
            onSaveRun={handleSaveRun}
            ringState={ringState}
          />
        </div>
      </div>

      {paywall.showPaywall && (
        <PaywallModal
          product="ring6"
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
