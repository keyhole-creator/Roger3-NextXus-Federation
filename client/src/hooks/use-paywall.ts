import { useState, useCallback } from "react";

type ProductType = "ring6" | "ring12" | `exe_${string}`;

const STORAGE_KEYS = {
  ring6_uses: "roger3_ring6_uses",
  ring12_uses: "roger3_ring12_uses",
  paid_ring6: "roger3_paid_ring6",
  paid_ring12: "roger3_paid_ring12",
  subscription: "roger3_subscription",
  owner: "roger3_owner",
  demo_bonus: "roger3_demo_bonus",
  demo_code: "roger3_demo_code",
};

function getStorageInt(key: string): number {
  try {
    return parseInt(localStorage.getItem(key) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function getStorageBool(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function usePaywall(product: ProductType, freeLimit: number) {
  const usesKey = product.startsWith("exe_") ? `roger3_${product}_uses` : product === "ring6" ? STORAGE_KEYS.ring6_uses : STORAGE_KEYS.ring12_uses;
  const paidKey = product.startsWith("exe_") ? `roger3_${product}_paid` : product === "ring6" ? STORAGE_KEYS.paid_ring6 : STORAGE_KEYS.paid_ring12;

  const [uses, setUses] = useState(() => getStorageInt(usesKey));
  const [isPaid, setIsPaid] = useState(() => getStorageBool(paidKey));
  const [hasSubscription, setHasSubscription] = useState(() => getStorageBool(STORAGE_KEYS.subscription));
  const [isOwner, setIsOwner] = useState(() => getStorageBool(STORAGE_KEYS.owner));
  const [demoBonus, setDemoBonus] = useState(() => getStorageInt(STORAGE_KEYS.demo_bonus));
  const [showPaywall, setShowPaywall] = useState(false);

  const totalLimit = freeLimit + demoBonus;
  const usesLeft = Math.max(0, totalLimit - uses);
  const canUse = isOwner || hasSubscription || isPaid || usesLeft > 0;

  const recordUse = useCallback(() => {
    const newUses = uses + 1;
    setUses(newUses);
    try {
      localStorage.setItem(usesKey, String(newUses));
    } catch {}
  }, [uses, usesKey]);

  const markPaid = useCallback((type: "ring6" | "ring12" | "subscription" | `exe_${string}`) => {
    try {
      if (type === "subscription") {
        localStorage.setItem(STORAGE_KEYS.subscription, "true");
        setHasSubscription(true);
      } else if (type.startsWith("exe_")) {
        localStorage.setItem(`roger3_${type}_paid`, "true");
        setIsPaid(true);
      } else {
        const key = type === "ring6" ? STORAGE_KEYS.paid_ring6 : STORAGE_KEYS.paid_ring12;
        localStorage.setItem(key, "true");
        setIsPaid(true);
      }
    } catch {}
    setShowPaywall(false);
  }, []);

  const verifyOwnerCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/verify-owner?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem(STORAGE_KEYS.owner, "true");
        setIsOwner(true);
        setShowPaywall(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const redeemDemoCode = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const existingCode = localStorage.getItem(STORAGE_KEYS.demo_code);
      if (existingCode === code) {
        return { success: false, message: "Code already redeemed" };
      }
      const res = await fetch(`/api/redeem-demo?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        const newBonus = demoBonus + (data.bonusUses || 10);
        localStorage.setItem(STORAGE_KEYS.demo_bonus, String(newBonus));
        localStorage.setItem(STORAGE_KEYS.demo_code, code);
        setDemoBonus(newBonus);
        setShowPaywall(false);
        return { success: true, message: data.message || `${data.bonusUses || 10} bonus uses added!` };
      }
      return { success: false, message: data.message || "Invalid code" };
    } catch {
      return { success: false, message: "Could not verify code" };
    }
  }, [demoBonus]);

  return {
    canUse,
    usesLeft,
    totalUses: uses,
    freeLimit: totalLimit,
    recordUse,
    showPaywall,
    setShowPaywall,
    markPaid,
    isOwner,
    hasSubscription,
    isPaid,
    demoBonus,
    verifyOwnerCode,
    redeemDemoCode,
    product,
  };
}
