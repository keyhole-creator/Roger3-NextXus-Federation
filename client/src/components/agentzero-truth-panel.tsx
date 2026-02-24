import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { evaluateText, getScoreColor, getScoreEmoji } from "@/lib/agentzero";

interface AgentZeroTruthPanelProps {
  text: string;
  mode?: "compact" | "full";
  label?: string;
}

export function AgentZeroTruthPanel({ text, mode = "full", label }: AgentZeroTruthPanelProps) {
  const evaluation = useMemo(() => {
    if (!text || text.trim().length < 5) return null;
    return evaluateText(text);
  }, [text]);

  if (!evaluation) return null;

  const aggregateColors = getScoreColor(evaluation.aggregateScore);

  return (
    <motion.div
      data-testid="panel-agentzero"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(5,10,20,0.8)",
        border: "1px solid rgba(212,165,116,0.2)",
        boxShadow: "0 0 20px 4px rgba(212,165,116,0.06)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(212,165,116,0.15)" }}>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: "#FFD700" }} />
          <span className="text-xs tracking-widest" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
            {label || "AGENTZERO TRUTH VERIFICATION"}
          </span>
        </div>
        <div
          data-testid="text-aggregate-score"
          className={`text-sm px-2.5 py-0.5 rounded-full ${aggregateColors.bg} ${aggregateColors.border} border`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className={aggregateColors.text}>
            {getScoreEmoji(evaluation.aggregateScore)} {evaluation.aggregateScore}%
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs leading-relaxed" style={{ color: "#E8DCC8" }}>
          {evaluation.summary}
        </p>
      </div>

      {mode === "full" && evaluation.claims.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          {evaluation.claims.map((claim, index) => {
            const claimColors = getScoreColor(claim.truthScore);
            const typeBg =
              claim.type === "factual" ? "rgba(59,130,246,0.15)" :
              claim.type === "opinion" ? "rgba(168,85,247,0.15)" :
              claim.type === "question" ? "rgba(34,197,94,0.15)" :
              "rgba(212,165,116,0.15)";
            const typeColor =
              claim.type === "factual" ? "#60A5FA" :
              claim.type === "opinion" ? "#A855F7" :
              claim.type === "question" ? "#22C55E" :
              "#D4A574";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-lg p-3"
                style={{
                  background: "rgba(5,10,20,0.5)",
                  border: "1px solid rgba(212,165,116,0.1)",
                  borderLeftWidth: 3,
                  borderLeftColor: claimColors.glow,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        background: typeBg,
                        color: typeColor,
                        border: `1px solid ${typeColor}40`,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {claim.type}
                    </span>
                  </div>
                  <span
                    data-testid={`text-claim-score-${index}`}
                    className={`text-xs ${claimColors.text}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {claim.truthScore}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#E8DCC8" }}>
                  {claim.statement}
                </p>
                {claim.flags.length > 0 && (
                  <div className="space-y-0.5">
                    {claim.flags.map((flag, fi) => (
                      <p key={fi} className="text-[10px]" style={{ color: "#D4A574", opacity: 0.7 }}>
                        {flag}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
