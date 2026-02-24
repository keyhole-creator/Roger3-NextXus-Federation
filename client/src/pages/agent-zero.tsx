import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentZeroTruthPanel } from "@/components/agentzero-truth-panel";

const SCORING_RULES = [
  { label: "No source citation", value: "-20%", color: "#F87171" },
  { label: "Hedging language", value: "-10%", color: "#FBBF24" },
  { label: "Absolute claim without evidence", value: "-30%", color: "#F87171" },
  { label: "Vague attribution", value: "-15%", color: "#FB923C" },
  { label: "Known false claim", value: "-50%", color: "#EF4444" },
  { label: "Verified fact", value: "+15%", color: "#34D399" },
];

function StatusBar({ hasText }: { hasText: boolean }) {
  return (
    <div
      className="relative z-30 flex items-center justify-between px-4 py-2 md:px-6"
      style={{ background: "rgba(5,10,20,0.85)", borderBottom: "1px solid rgba(212,165,116,0.2)" }}
    >
      <Link href="/" data-testid="link-back-home">
        <Button variant="ghost" size="sm" className="text-[#E8DCC8] hover:text-[#FFD700] hover:bg-transparent gap-1 px-2">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-xs tracking-widest">HOME</span>
        </Button>
      </Link>
      <div className="flex items-center gap-3">
        <Shield className="h-4 w-4" style={{ color: "#FFD700" }} />
        <span className="text-sm tracking-[0.3em] font-semibold" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
          AGENTZERO
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{
            background: hasText ? "#FFD700" : "#D4A574",
            boxShadow: hasText ? "0 0 8px 2px rgba(240,198,116,0.5)" : "none",
          }}
        />
        <span className="text-xs tracking-[0.25em]" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
          {hasText ? "ANALYZING" : "READY"}
        </span>
      </div>
    </div>
  );
}

export default function AgentZeroPage() {
  useEffect(() => { document.title = "AgentZero — Truth Verification"; }, []);
  const [inputText, setInputText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedText(inputText);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputText]);

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#050A14" }}>
      <StatusBar hasText={debouncedText.trim().length >= 5} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl tracking-[0.3em] font-semibold" style={{ color: "#FFD700", fontFamily: "var(--font-mono)" }}>
              TRUTH VERIFICATION
            </h1>
            <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: "#D4A574", opacity: 0.7 }}>
              AgentZero analyzes text for credibility signals — detecting hedging language, unsourced absolutes,
              vague attributions, and known false claims. Paste any text below to see a real-time truth score.
            </p>
          </motion.div>

          <div
            className="rounded-xl p-4 backdrop-blur-xl"
            style={{
              background: "rgba(5,10,20,0.8)",
              border: "1px solid rgba(212,165,116,0.3)",
              boxShadow: "0 0 20px 4px rgba(212,165,116,0.08)",
            }}
          >
            <Textarea
              data-testid="input-agentzero-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste any text, claim, or statement for truth verification..."
              rows={6}
              className="resize-none border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#D4A574]/40"
              style={{ color: "#E8DCC8" }}
            />
          </div>

          <AgentZeroTruthPanel text={debouncedText} mode="full" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="pt-4" style={{ borderTop: "1px solid rgba(212,165,116,0.1)" }}>
              <h3 className="text-xs tracking-widest mb-3" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
                SCORING METHODOLOGY
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SCORING_RULES.map((rule) => (
                  <div
                    key={rule.label}
                    className="rounded-lg p-2.5"
                    style={{
                      background: "rgba(5,10,20,0.6)",
                      border: "1px solid rgba(212,165,116,0.1)",
                    }}
                  >
                    <span className="text-xs font-semibold block" style={{ color: rule.color, fontFamily: "var(--font-mono)" }}>
                      {rule.value}
                    </span>
                    <span className="text-[10px] leading-tight block mt-0.5" style={{ color: "#E8DCC8", opacity: 0.7 }}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
