import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Zap, ChevronDown, ChevronUp, Shield, CreditCard, Gift } from "lucide-react";

interface PaywallModalProps {
  product: "ring6" | "ring12" | `exe_${string}`;
  totalUses: number;
  freeLimit: number;
  onClose: () => void;
  onMarkPaid: (type: "ring6" | "ring12" | "subscription" | `exe_${string}`) => void;
  onVerifyOwner: (code: string) => Promise<boolean>;
  onRedeemDemo: (code: string) => Promise<{ success: boolean; message: string }>;
}

const PRODUCT_INFO = {
  ring6: {
    name: "Ring of Six",
    price: "$1.99",
    paypalLink: "https://www.paypal.com/ncp/payment/TVJEHJ5PQFGFE",
  },
  ring12: {
    name: "Ring of 12 (Chamber of Echoes)",
    price: "$2.99",
    paypalLink: "https://www.paypal.com/ncp/payment/6DU5FJ2VG3GML",
  },
};

export function PaywallModal({ product, totalUses, freeLimit, onClose, onMarkPaid, onVerifyOwner, onRedeemDemo }: PaywallModalProps) {
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [ownerCode, setOwnerCode] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [demoCode, setDemoCode] = useState("");
  const [demoMessage, setDemoMessage] = useState("");
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const info = product.startsWith("exe_")
    ? { name: `Exe AI — ${product.replace("exe_", "").toUpperCase()}`, price: "$9.99", paypalLink: "https://www.paypal.com/ncp/payment/CBDEGBCTKL2WE" }
    : PRODUCT_INFO[product as "ring6" | "ring12"];

  const handleVerifyOwner = async () => {
    if (!ownerCode.trim()) return;
    setVerifying(true);
    setOwnerError("");
    const valid = await onVerifyOwner(ownerCode.trim());
    setVerifying(false);
    if (!valid) {
      setOwnerError("Invalid code");
    }
  };

  const handleRedeemDemo = async () => {
    if (!demoCode.trim()) return;
    setRedeeming(true);
    setDemoMessage("");
    const result = await onRedeemDemo(demoCode.trim());
    setRedeeming(false);
    setDemoSuccess(result.success);
    setDemoMessage(result.message);
    if (result.success) {
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid="paywall-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{
            background: "rgba(5,10,20,0.95)",
            border: "1px solid rgba(212,165,116,0.2)",
            boxShadow: "0 0 60px 10px rgba(212,165,116,0.1), 0 0 120px 20px rgba(255,215,0,0.05)",
          }}
        >
          <button
            data-testid="button-close-paywall"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10"
            style={{ color: "#D4A574", background: "rgba(212,165,116,0.1)" }}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{
                background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(212,165,116,0.05) 70%)",
                border: "2px solid rgba(255,215,0,0.3)",
                boxShadow: "0 0 20px 4px rgba(255,215,0,0.15)",
              }}>
                <Crown className="h-7 w-7" style={{ color: "#FFD700" }} />
              </div>
              <h2 className="text-lg tracking-[0.2em] mb-1" style={{ color: "#FFD700", fontFamily: "var(--font-serif)" }}>
                FREE USES EXHAUSTED
              </h2>
              <p className="text-xs" style={{ color: "#D4A574", fontFamily: "var(--font-mono)" }}>
                You've used {totalUses} of {freeLimit} free {info.name} session{freeLimit !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-xl p-4 mb-3" style={{
              background: "rgba(120,80,255,0.05)",
              border: "1px solid rgba(120,80,255,0.2)",
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4" style={{ color: "#a78bfa" }} />
                <span className="text-xs tracking-[0.15em]" style={{ color: "#a78bfa", fontFamily: "var(--font-mono)" }}>
                  HAVE A DEMO CODE?
                </span>
              </div>
              <p className="text-[10px] mb-2" style={{ color: "#E8DCC8", opacity: 0.7 }}>
                Enter a demo or promo code for 10 bonus uses
              </p>
              <div className="flex gap-2">
                <input
                  data-testid="input-demo-code"
                  type="text"
                  value={demoCode}
                  onChange={(e) => { setDemoCode(e.target.value.toUpperCase()); setDemoMessage(""); }}
                  placeholder="e.g. TRYFREE10"
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-transparent outline-none uppercase"
                  style={{
                    border: "1px solid rgba(120,80,255,0.2)",
                    color: "#E8DCC8",
                    fontFamily: "var(--font-mono)",
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRedeemDemo(); }}
                />
                <button
                  data-testid="button-redeem-demo"
                  onClick={handleRedeemDemo}
                  disabled={redeeming || !demoCode.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs tracking-widest"
                  style={{
                    background: "rgba(120,80,255,0.15)",
                    border: "1px solid rgba(120,80,255,0.3)",
                    color: "#a78bfa",
                    fontFamily: "var(--font-mono)",
                    opacity: redeeming || !demoCode.trim() ? 0.5 : 1,
                  }}
                >
                  {redeeming ? "..." : "REDEEM"}
                </button>
              </div>
              {demoMessage && (
                <p className="text-[10px] mt-1" style={{
                  color: demoSuccess ? "#4ade80" : "#ff6b6b",
                  fontFamily: "var(--font-mono)",
                }}>
                  {demoMessage}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="rounded-xl p-4" style={{
                background: "rgba(212,165,116,0.05)",
                border: "1px solid rgba(212,165,116,0.15)",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4" style={{ color: "#FFD700" }} />
                  <span className="text-xs tracking-[0.15em]" style={{ color: "#FFD700", fontFamily: "var(--font-mono)" }}>
                    PER-USE ACCESS
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: "#E8DCC8" }}>
                  {info.name} — <span style={{ color: "#FFD700" }}>{info.price}</span> per session
                </p>
                <a
                  data-testid={product === "ring6" ? "button-paypal-ring6" : "button-paypal-ring12"}
                  href={info.paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 rounded-full text-xs tracking-widest transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,165,116,0.2), rgba(255,215,0,0.2))",
                    border: "1px solid rgba(212,165,116,0.4)",
                    color: "#FFD700",
                  }}
                >
                  <CreditCard className="h-3 w-3 inline mr-2" />
                  PAY WITH PAYPAL
                </a>
              </div>

              <div className="rounded-xl p-4" style={{
                background: "rgba(255,215,0,0.03)",
                border: "1px solid rgba(255,215,0,0.2)",
                boxShadow: "0 0 15px 2px rgba(255,215,0,0.05)",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4" style={{ color: "#FFD700" }} />
                  <span className="text-xs tracking-[0.15em]" style={{ color: "#FFD700", fontFamily: "var(--font-mono)" }}>
                    UNLIMITED SUBSCRIPTION
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: "#E8DCC8" }}>
                  All councils, unlimited — <span style={{ color: "#FFD700" }}>$9.99/month</span>
                </p>
                <a
                  data-testid="button-paypal-monthly"
                  href="https://www.paypal.com/ncp/payment/WRG392UPYNKG4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 rounded-full text-xs tracking-widest transition-all"
                  style={{
                    background: "linear-gradient(135deg, #D4A574, #FFD700)",
                    color: "#0D1B3E",
                    border: "1px solid rgba(255,215,0,0.6)",
                  }}
                >
                  <CreditCard className="h-3 w-3 inline mr-2" />
                  SUBSCRIBE WITH PAYPAL
                </a>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <button
                data-testid={`button-paid-${product}`}
                onClick={() => onMarkPaid(product)}
                className="w-full py-2 rounded-full text-xs tracking-widest transition-all"
                style={{
                  background: "rgba(212,165,116,0.1)",
                  border: "1px solid rgba(212,165,116,0.25)",
                  color: "#D4A574",
                }}
              >
                I'VE ALREADY PAID (PER-USE)
              </button>
              <button
                data-testid="button-paid-subscription"
                onClick={() => onMarkPaid("subscription")}
                className="w-full py-2 rounded-full text-xs tracking-widest transition-all"
                style={{
                  background: "rgba(212,165,116,0.1)",
                  border: "1px solid rgba(212,165,116,0.25)",
                  color: "#D4A574",
                }}
              >
                I'VE ALREADY PAID (SUBSCRIPTION)
              </button>
            </div>

            <div style={{ borderTop: "1px solid rgba(212,165,116,0.1)" }} className="pt-3">
              <button
                onClick={() => setAdminExpanded(!adminExpanded)}
                className="flex items-center gap-2 text-[10px] tracking-widest w-full"
                style={{ color: "rgba(212,165,116,0.4)", fontFamily: "var(--font-mono)" }}
              >
                <Shield className="h-3 w-3" />
                ADMIN ACCESS
                {adminExpanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
              </button>

              <AnimatePresence>
                {adminExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 mt-2">
                      <input
                        data-testid="input-owner-code"
                        type="password"
                        value={ownerCode}
                        onChange={(e) => { setOwnerCode(e.target.value); setOwnerError(""); }}
                        placeholder="Enter owner code"
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-transparent outline-none"
                        style={{
                          border: "1px solid rgba(212,165,116,0.2)",
                          color: "#E8DCC8",
                          fontFamily: "var(--font-mono)",
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleVerifyOwner(); }}
                      />
                      <button
                        data-testid="button-verify-owner"
                        onClick={handleVerifyOwner}
                        disabled={verifying || !ownerCode.trim()}
                        className="px-3 py-1.5 rounded-lg text-xs tracking-widest"
                        style={{
                          background: "rgba(212,165,116,0.15)",
                          border: "1px solid rgba(212,165,116,0.3)",
                          color: "#D4A574",
                          fontFamily: "var(--font-mono)",
                          opacity: verifying || !ownerCode.trim() ? 0.5 : 1,
                        }}
                      >
                        {verifying ? "..." : "VERIFY"}
                      </button>
                    </div>
                    {ownerError && (
                      <p className="text-[10px] mt-1" style={{ color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>
                        {ownerError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
