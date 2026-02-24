import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility, ArrowLeft, ChevronLeft, Loader2, Save, Send,
  Scale, Car, Stethoscope, Code, GraduationCap, Sprout, PenTool,
  Music, Newspaper, Palette, FlaskConical, Users, UserCog, Radio,
  Atom, HeartPulse, Globe, Rocket, Dna, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePaywall } from "@/hooks/use-paywall";
import { PaywallModal } from "@/components/paywall-modal";

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

const EXE_FACES: Record<string, string> = {
  law: exeFace1, auto: exeFace2, med: exeFace3, code: exeFace4,
  edu: exeFace5, farm: exeFace6, pen: exeFace7, music: exeFace8,
  airt: exeFace9, sci: exeFace10, soc: exeFace11, pa: exeFace12,
  coms: exeFace13, phy: exeFace14, psy: exeFace15, earth: exeFace16,
  space: exeFace17, bio: exeFace18, news: exeFace19, access: exeFace20,
};

const EXE_ICONS: Record<string, any> = {
  law: Scale, auto: Car, med: Stethoscope, code: Code,
  edu: GraduationCap, farm: Sprout, pen: PenTool, music: Music,
  airt: Palette, sci: FlaskConical, soc: Users, pa: UserCog,
  coms: Radio, phy: Atom, psy: HeartPulse, earth: Globe,
  space: Rocket, bio: Dna, news: Newspaper, access: Accessibility,
};

const EXE_LABELS: Record<string, string> = {
  law: "Law", auto: "Auto", med: "Med", code: "Code",
  edu: "Edu", farm: "Farm", pen: "Pen (Writer)", music: "Music",
  airt: "AiRT (Art)", sci: "Sci", soc: "Soc", pa: "PA",
  coms: "Coms", phy: "Phy (Physics)", psy: "Psy (Psychology)", earth: "Earth",
  space: "Space", bio: "Bio", news: "News (Investigative)", access: "Access (Accessibility)",
};

const EXE_DESCS: Record<string, string> = {
  law: "Legal analysis, contract review, compliance guidance",
  auto: "Automotive systems, diagnostics, automation tech",
  med: "Medical knowledge, clinical reasoning, health analysis",
  code: "Programming, architecture, debugging, code review",
  edu: "Curriculum design, pedagogy, learning methodology",
  farm: "Agriculture, soil science, crop management",
  pen: "Writing craft, editing, narrative and professional writing",
  music: "Composition, theory, production, sound design",
  airt: "Visual art, design principles, creative direction",
  sci: "Research methodology, scientific analysis",
  soc: "Social dynamics, cultural analysis, community systems",
  pa: "Productivity, scheduling, task management",
  coms: "PR, messaging strategy, media relations",
  phy: "Classical mechanics, quantum theory, applied physics",
  psy: "Cognition, behavioral analysis, therapeutic frameworks",
  earth: "Geology, climate science, environmental systems",
  space: "Astronomy, aerospace, cosmology, planetary science",
  bio: "Genetics, molecular biology, life sciences",
  news: "Investigative reporting, fact-checking, source verification",
  access: "Inclusive design, assistive tech, WCAG compliance",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  cached?: boolean;
}

export default function ExeDomainPage() {
  const { domain } = useParams<{ domain: string }>();
  const domainId = domain || "law";
  const Icon = EXE_ICONS[domainId] || Scale;
  const face = EXE_FACES[domainId] || exeFace1;
  const label = EXE_LABELS[domainId] || domainId.toUpperCase();
  const desc = EXE_DESCS[domainId] || "";

  useEffect(() => {
    document.title = `Exe AI — ${label}`;
  }, [label]);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const paywall = usePaywall(`exe_${domainId}` as any, 3);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    if (!paywall.canUse) {
      paywall.setShowPaywall(true);
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: question.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/exe/query", {
        domain: domainId,
        question: userMsg.content,
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
        cached: data.cached,
      };
      setMessages(prev => [...prev, assistantMsg]);
      paywall.recordUse();
    } catch (err: any) {
      let errorMsg = "The AI executor could not process your request. Please try again.";
      if (err instanceof Error && err.message) {
        try {
          const jsonStart = err.message.indexOf("{");
          if (jsonStart >= 0) {
            const parsed = JSON.parse(err.message.substring(jsonStart));
            if (parsed.error) errorMsg = parsed.error;
          }
        } catch {
          errorMsg = err.message.includes(":") ? err.message.split(":").slice(1).join(":").trim() : err.message;
        }
      }
      toast({ title: "Exe AI Error", description: errorMsg, variant: "destructive" });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = () => {
    if (messages.length === 0) return;
    const exportData = {
      domain: domainId,
      label,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exe-ai-${domainId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#050A14" }}>
      <div className="relative z-30 flex items-center justify-between px-4 py-3 md:px-6" style={{ background: "rgba(5,10,20,0.85)", borderBottom: "1px solid rgba(0,200,255,0.15)" }}>
        <Link href="/#exe" data-testid="link-back-home">
          <Button variant="ghost" size="sm" className="text-[#E8DCC8] hover:text-[#39FF14] hover:bg-transparent gap-1 px-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-xs tracking-widest">HOME</span>
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative size-8 overflow-hidden rounded-full border border-cyan-400/30" style={{ boxShadow: "0 0 10px rgba(100,200,255,0.2)" }}>
            <img src={face} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-center rounded-full" style={{ background: "linear-gradient(to top, rgba(10,12,20,0.6) 0%, transparent 50%)" }}>
              <Icon className="mb-0.5 h-3 w-3 text-cyan-300/80" aria-hidden="true" />
            </div>
          </div>
          <span className="text-sm tracking-[0.2em] font-semibold" style={{ color: "#39FF14", fontFamily: "var(--font-mono)", textShadow: "0 0 10px rgba(57,255,20,0.4)" }}>
            EXE AI — {label.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              data-testid="button-save-chat"
              variant="ghost"
              size="sm"
              onClick={handleSaveChat}
              className="text-[#D4A574] hover:text-[#FFD700] hover:bg-transparent gap-1 px-2"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs tracking-widest">SAVE</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <div className="relative size-24 overflow-hidden rounded-full border-2 border-cyan-400/30 mb-4" style={{
                boxShadow: "0 0 30px rgba(100,200,255,0.2), 0 0 60px rgba(57,255,20,0.1)",
              }}>
                <img src={face} alt={label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end justify-center rounded-full" style={{ background: "linear-gradient(to top, rgba(10,12,20,0.7) 0%, transparent 40%)" }}>
                  <Icon className="mb-2 h-6 w-6 text-cyan-300" aria-hidden="true" />
                </div>
              </div>
              <h1 className="text-xl font-serif tracking-wide mb-2" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57,255,20,0.4)" }} data-testid="text-exe-domain-title">
                {label}
              </h1>
              <p className="text-sm text-cyan-100 mb-6" data-testid="text-exe-domain-desc">{desc}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {getSuggestedQuestions(domainId).map((q, i) => (
                  <button
                    key={i}
                    data-testid={`button-suggested-q-${i}`}
                    onClick={() => setQuestion(q)}
                    className="px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
                    style={{
                      background: "rgba(57,255,20,0.05)",
                      border: "1px solid rgba(57,255,20,0.2)",
                      color: "#39FF14",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(100,200,255,0.2) transparent" }}>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    data-testid={`chat-msg-${msg.role}-${idx}`}
                    className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3"
                    style={{
                      background: msg.role === "user"
                        ? "rgba(57,255,20,0.08)"
                        : "rgba(100,200,255,0.05)",
                      border: msg.role === "user"
                        ? "1px solid rgba(57,255,20,0.2)"
                        : "1px solid rgba(100,200,255,0.15)",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-5 overflow-hidden rounded-full border border-cyan-400/30">
                          <img src={face} alt={label} className="h-full w-full object-cover" />
                        </div>
                        <span className="text-[10px] tracking-widest" style={{ color: "#39FF14", fontFamily: "var(--font-mono)" }}>
                          {label.toUpperCase()}
                        </span>
                        {msg.cached && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.2)" }}>
                            CACHED
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#E8DCC8" }}>
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl px-4 py-3 flex items-center gap-2" style={{
                  background: "rgba(100,200,255,0.05)",
                  border: "1px solid rgba(100,200,255,0.15)",
                }}>
                  <div className="size-5 overflow-hidden rounded-full border border-cyan-400/30">
                    <img src={face} alt={label} className="h-full w-full object-cover" />
                  </div>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#39FF14" }} />
                  <span className="text-xs tracking-widest" style={{ color: "#39FF14", fontFamily: "var(--font-mono)" }}>
                    ANALYZING...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid rgba(100,200,255,0.1)" }}>
          {!paywall.isOwner && (
            <div className="flex justify-center mb-2">
              <Badge
                data-testid="badge-exe-uses"
                className="text-[10px] tracking-widest border"
                style={{
                  background: paywall.usesLeft > 0 ? "rgba(57,255,20,0.08)" : "rgba(255,50,50,0.1)",
                  color: paywall.usesLeft > 0 ? "#39FF14" : "#ff6b6b",
                  borderColor: paywall.usesLeft > 0 ? "rgba(57,255,20,0.2)" : "rgba(255,50,50,0.3)",
                }}
              >
                {paywall.hasSubscription || paywall.isPaid
                  ? "PAID ACCESS"
                  : `${paywall.usesLeft} FREE USE${paywall.usesLeft !== 1 ? "S" : ""} LEFT`}
              </Badge>
            </div>
          )}
          <div className="rounded-xl p-3 backdrop-blur-xl max-w-2xl mx-auto" style={{
            background: "rgba(5,10,20,0.8)",
            border: "1px solid rgba(57,255,20,0.2)",
            boxShadow: "0 0 15px 2px rgba(57,255,20,0.06)",
          }}>
            <Textarea
              data-testid="input-exe-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask the ${label} executor...`}
              disabled={isLoading}
              rows={2}
              className="resize-none border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#39FF14]/30"
              style={{ color: "#E8DCC8" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-end mt-2">
              <Button
                data-testid="button-exe-submit"
                onClick={handleSubmit}
                disabled={isLoading || !question.trim()}
                className="rounded-full gap-2 text-xs tracking-widest"
                style={{
                  background: isLoading ? "rgba(57,255,20,0.15)" : "linear-gradient(135deg, #39FF14, #00D4FF)",
                  color: isLoading ? "#39FF14" : "#050A14",
                  border: "1px solid rgba(57,255,20,0.4)",
                }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isLoading ? "ANALYZING..." : "EXECUTE"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {paywall.showPaywall && (
        <PaywallModal
          product={`exe_${domainId}` as any}
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

function getSuggestedQuestions(domain: string): string[] {
  const suggestions: Record<string, string[]> = {
    law: ["What is fair use?", "Explain contract breach remedies", "How does GDPR affect US companies?"],
    auto: ["OBD-II code P0300 meaning?", "How do EVs handle regenerative braking?", "Common turbo failure causes"],
    med: ["Explain Type 2 diabetes management", "What is metabolic syndrome?", "How do mRNA vaccines work?"],
    code: ["Explain microservices vs monolith", "Best practices for API design", "How does garbage collection work?"],
    edu: ["How to apply Bloom's Taxonomy?", "Differentiated learning strategies", "Effective assessment rubrics"],
    farm: ["Cover crop selection for clay soil", "IPM for corn borers", "No-till vs conventional tillage"],
    pen: ["Show don't tell techniques", "Three-act structure breakdown", "How to write compelling dialogue"],
    music: ["Circle of fifths explained", "Mixing vocals techniques", "Modal interchange examples"],
    airt: ["Color theory for UI design", "Gestalt principles in layout", "Typography hierarchy rules"],
    sci: ["How to design an experiment", "P-value interpretation", "Peer review best practices"],
    soc: ["Social stratification theory", "Cultural capital explained", "Urbanization effects on community"],
    pa: ["GTD methodology overview", "Email management strategies", "Meeting productivity tips"],
    coms: ["Crisis communication plan", "Press release structure", "Social media strategy basics"],
    phy: ["Explain quantum entanglement", "Newton's laws applications", "Thermodynamics second law"],
    psy: ["CBT vs DBT differences", "Cognitive bias overview", "Attachment theory explained"],
    earth: ["Plate tectonics overview", "Climate feedback loops", "Rock cycle explained"],
    space: ["How do black holes form?", "Exoplanet detection methods", "Orbital mechanics basics"],
    bio: ["CRISPR mechanism explained", "DNA replication process", "Evolution by natural selection"],
    news: ["OSINT verification methods", "Source triangulation techniques", "How to spot disinformation"],
    access: ["WCAG 2.2 key changes", "Screen reader best practices", "Color contrast requirements"],
  };
  return suggestions[domain] || ["Ask me anything in this domain"];
}
