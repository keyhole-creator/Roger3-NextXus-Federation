import { useState } from "react";
import { X, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import botImage from "@assets/C32000EC-22D1-4326-856B-06D3E8A2F403_1771133195187.gif";

const TOUR_STEPS = [
  {
    title: "Welcome to Roger 3.0",
    text: "I'm your guide bot. Let me walk you through what this system does. Tap Next to continue.",
  },
  {
    title: "Sim AI — Free",
    text: "Sim AI creates a personal simulation of how you think, speak, and decide. It maps your mind through a guided interview. Completely free.",
  },
  {
    title: "Exe AI — 20 Domains",
    text: "Exe AI gives you specialized AI executors across 20 fields — law, medicine, code, music, psychology, and more. $9.99 per domain or $199.99 for all 20.",
  },
  {
    title: "Legacy — 200-Year Survival",
    text: "Legacy exports your profile as YAML — a format that survives without any company or app. Designed for 200-year durability. Included in the $500 tier.",
  },
  {
    title: "AI Wisdom Councils",
    text: "The Ring of Six is a 6-voice strategic council ($1.99/use). The Chamber of Echoes is a 12-voice deep analysis council ($2.99/use). Or go unlimited at $9.99/month.",
  },
  {
    title: "The Triune",
    text: "Adam analyzes. Eve empathizes. Mark strategizes. Together they form the Triune — three AI minds that balance logic, emotion, and action.",
  },
  {
    title: "AgentZero",
    text: "AgentZero is the truth verification layer. It scores AI outputs for accuracy and catches contradictions. Keeps your AI honest over time.",
  },
  {
    title: "EchoCore",
    text: "EchoCore is a downloadable AI memory system. It saves your conversation context so your AI doesn't forget everything between sessions. Free to download.",
  },
  {
    title: "Coaching",
    text: "Book a 1-on-1 session with the creator. Tuesdays and Thursdays, 10AM-8PM, 1 hour via Zoom. Pay with PayPal.",
  },
  {
    title: "That's the Tour!",
    text: "You've seen everything Roger 3.0 offers. Scroll down to explore, or click 'Build profile' to start your Sim AI. Welcome to the Federation.",
  },
];

export default function GuideBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <div className="fixed bottom-5 right-5 z-50" data-testid="guide-bot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="mb-3 w-72 rounded-2xl border border-blue-500/30 shadow-2xl"
            style={{
              backgroundColor: "rgba(8,12,24,0.95)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 40px rgba(0,150,255,0.15)",
            }}
            data-testid="guide-bot-panel"
          >
            <div className="flex items-center justify-between border-b border-blue-500/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <img
                  src={botImage}
                  alt="Guide Bot"
                  className="h-7 w-7 rounded-full"
                />
                <span
                  className="text-sm font-medium text-white"
                  style={{
                    textShadow: "0 0 8px rgba(57,255,20,0.4)",
                  }}
                >
                  Guide Bot
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-cyan-100 transition hover:text-white"
                data-testid="button-guide-close"
                aria-label="Close guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div
                className="text-xs font-medium tracking-wider text-fuchsia-300/80"
              >
                {step + 1} / {TOUR_STEPS.length}
              </div>
              <h4
                className="mt-1 text-base font-medium text-white"
                data-testid="text-guide-title"
              >
                {current.title}
              </h4>
              <p
                className="mt-2 text-sm leading-relaxed text-cyan-100"
                data-testid="text-guide-text"
              >
                {current.text}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-blue-500/20 px-4 py-3">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cyan-100 transition hover:text-white"
                data-testid="button-guide-restart"
              >
                <RotateCcw className="h-3 w-3" />
                Restart
              </button>
              {isLast ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setStep(0);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white transition"
                  style={{
                    background: "linear-gradient(135deg, rgba(57,255,20,0.3), rgba(0,150,255,0.3))",
                    border: "1px solid rgba(57,255,20,0.3)",
                  }}
                  data-testid="button-guide-done"
                >
                  Got it!
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition"
                  style={{
                    background: "linear-gradient(135deg, rgba(57,255,20,0.2), rgba(0,150,255,0.2))",
                    border: "1px solid rgba(57,255,20,0.2)",
                  }}
                  data-testid="button-guide-next"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative h-14 w-14 rounded-full border-2 border-blue-500/40 shadow-lg transition-all hover:scale-105 hover:border-cyan-400/60"
        style={{
          backgroundColor: "rgba(8,12,24,0.9)",
          boxShadow: "0 0 25px rgba(0,150,255,0.25), 0 0 50px rgba(57,255,20,0.1)",
        }}
        data-testid="button-guide-bot"
        aria-label="Open guide bot"
      >
        <img
          src={botImage}
          alt="Guide Bot"
          className="h-full w-full rounded-full object-cover p-0.5"
        />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-sm">
          ?
        </span>
      </button>
    </div>
  );
}