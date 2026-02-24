export interface EvaluatedClaim {
  statement: string;
  truthScore: number;
  type: "factual" | "opinion" | "question" | "command";
  flags: string[];
}

export interface EvaluationResult {
  claims: EvaluatedClaim[];
  aggregateScore: number;
  summary: string;
}

const HEDGING_WORDS = [
  "possibly", "might", "maybe", "perhaps", "could be", "likely",
  "probably", "seemingly", "appears to", "suggests", "it seems",
  "allegedly", "reportedly", "supposedly", "i think", "i believe",
  "in my opinion", "i feel", "from my perspective",
];

const ABSOLUTE_MARKERS = [
  "always", "never", "every", "none", "all", "nobody", "everyone",
  "certainly", "definitely", "undoubtedly", "without question",
  "guaranteed", "proven", "100%", "impossible", "must be", "is always",
  "will always", "can never", "no one ever", "absolutely",
];

const SOURCE_INDICATORS = [
  "according to", "research shows", "studies show", "data indicates",
  "published in", "cited by", "as reported", "evidence suggests",
  "peer-reviewed", "meta-analysis", "source:", "reference:",
  "based on", "documented in", "verified by", "confirmed by",
  "statistics show", "survey found", "experiment demonstrated",
  "https://", "http://", "doi:", "isbn:",
];

const OPINION_MARKERS = [
  "i think", "i believe", "in my opinion", "i feel", "personally",
  "from my view", "it seems to me", "my take is", "i'd say",
  "should", "ought to", "best", "worst", "greatest", "terrible",
  "amazing", "horrible", "beautiful", "ugly", "love", "hate",
  "prefer", "favorite", "overrated", "underrated",
];

const VAGUE_MARKERS = [
  "some people say", "they say", "everyone knows", "it's common knowledge",
  "obviously", "clearly", "it goes without saying", "needless to say",
  "many experts", "some studies", "recent research", "scientists say",
];

const KNOWN_FACTS: Record<string, { claim: string; status: "verified" | "disputed" | "false" }> = {
  "earth is flat": { claim: "Earth is flat", status: "false" },
  "earth is round": { claim: "Earth is approximately spherical", status: "verified" },
  "vaccines cause autism": { claim: "Vaccines cause autism", status: "false" },
  "water boils at 100": { claim: "Water boils at 100°C at sea level", status: "verified" },
  "speed of light": { claim: "Speed of light is approximately 299,792,458 m/s", status: "verified" },
  "humans use 10% of brain": { claim: "Humans only use 10% of their brains", status: "false" },
  "great wall visible from space": { claim: "Great Wall of China is visible from space", status: "false" },
  "goldfish 3 second memory": { claim: "Goldfish have 3-second memory", status: "false" },
  "lightning never strikes twice": { claim: "Lightning never strikes the same place twice", status: "false" },
  "we only have 5 senses": { claim: "Humans only have 5 senses", status: "false" },
};

function containsAny(text: string, markers: string[]): string[] {
  const lower = text.toLowerCase();
  return markers.filter((m) => lower.includes(m));
}

function isQuestion(text: string): boolean {
  return text.trim().endsWith("?") || /^(who|what|where|when|why|how|is|are|do|does|can|will|should|would|could)\b/i.test(text.trim());
}

function isCommand(text: string): boolean {
  return /^(tell me|explain|describe|show|list|give me|help me|find|analyze|compare|calculate)/i.test(text.trim());
}

function parseClaims(text: string): string[] {
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|||")
    .replace(/\n+/g, "|||")
    .split("|||")
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  if (sentences.length === 0 && text.trim().length > 3) {
    return [text.trim()];
  }

  return sentences;
}

function checkKnownFacts(statement: string): { found: boolean; status?: "verified" | "disputed" | "false"; claim?: string } {
  const lower = statement.toLowerCase();
  for (const [key, fact] of Object.entries(KNOWN_FACTS)) {
    if (lower.includes(key)) {
      return { found: true, status: fact.status, claim: fact.claim };
    }
  }
  return { found: false };
}

function classifyType(statement: string): "factual" | "opinion" | "question" | "command" {
  if (isQuestion(statement)) return "question";
  if (isCommand(statement)) return "command";
  const opinionHits = containsAny(statement, OPINION_MARKERS);
  if (opinionHits.length >= 2) return "opinion";
  return "factual";
}

export function evaluateClaim(statement: string): EvaluatedClaim {
  let score = 100;
  const flags: string[] = [];
  const type = classifyType(statement);

  if (type === "question") {
    return { statement, truthScore: 100, type, flags: ["Questions are not scored for truth"] };
  }
  if (type === "command") {
    return { statement, truthScore: 100, type, flags: ["Commands/requests are not scored for truth"] };
  }

  const sourceHits = containsAny(statement, SOURCE_INDICATORS);
  if (sourceHits.length === 0) {
    score -= 20;
    flags.push("No source citation detected (-20%)");
  } else {
    flags.push(`Source reference found: "${sourceHits[0]}"`);
  }

  const hedgingHits = containsAny(statement, HEDGING_WORDS);
  if (hedgingHits.length > 0) {
    score -= 10;
    flags.push(`Hedging language: "${hedgingHits[0]}" (-10%)`);
  }

  const absoluteHits = containsAny(statement, ABSOLUTE_MARKERS);
  if (absoluteHits.length > 0 && sourceHits.length === 0) {
    score -= 30;
    flags.push(`Absolute claim without evidence: "${absoluteHits[0]}" (-30%)`);
  } else if (absoluteHits.length > 0) {
    score -= 10;
    flags.push(`Absolute claim (has source): "${absoluteHits[0]}" (-10%)`);
  }

  const vagueHits = containsAny(statement, VAGUE_MARKERS);
  if (vagueHits.length > 0) {
    score -= 15;
    flags.push(`Vague attribution: "${vagueHits[0]}" (-15%)`);
  }

  if (type === "opinion") {
    score -= 5;
    flags.push("Statement classified as opinion (-5%)");
  }

  const factCheck = checkKnownFacts(statement);
  if (factCheck.found) {
    if (factCheck.status === "false") {
      score -= 50;
      flags.push(`Known false claim: "${factCheck.claim}" (-50%)`);
    } else if (factCheck.status === "disputed") {
      score -= 25;
      flags.push(`Disputed claim: "${factCheck.claim}" (-25%)`);
    } else if (factCheck.status === "verified") {
      score += 15;
      flags.push(`Verified fact: "${factCheck.claim}" (+15%)`);
    }
  }

  if (statement.length < 15 && type === "factual") {
    score -= 15;
    flags.push("Statement too brief for thorough evaluation (-15%)");
  }

  return {
    statement,
    truthScore: Math.max(0, Math.min(100, score)),
    type,
    flags,
  };
}

export function evaluateText(text: string): EvaluationResult {
  const claims = parseClaims(text);
  const evaluated = claims.map(evaluateClaim);

  const scorable = evaluated.filter((e) => e.type === "factual" || e.type === "opinion");
  const aggregateScore =
    scorable.length > 0
      ? Math.round(scorable.reduce((sum, e) => sum + e.truthScore, 0) / scorable.length)
      : 100;

  let summary: string;
  if (aggregateScore >= 80) {
    summary = "High credibility — claims appear well-supported";
  } else if (aggregateScore >= 60) {
    summary = "Moderate credibility — some claims need better sourcing";
  } else if (aggregateScore >= 40) {
    summary = "Low credibility — multiple flags detected, consider refining";
  } else {
    summary = "Very low credibility — significant issues found, refine before proceeding";
  }

  return { claims: evaluated, aggregateScore, summary };
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; glow: string } {
  if (score >= 80) return { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40", glow: "rgba(52,211,153,0.3)" };
  if (score >= 60) return { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/40", glow: "rgba(250,204,21,0.3)" };
  if (score >= 40) return { text: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/40", glow: "rgba(251,146,60,0.3)" };
  return { text: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/40", glow: "rgba(248,113,113,0.3)" };
}

export function getScoreEmoji(score: number): string {
  if (score >= 80) return "✅";
  if (score >= 60) return "⚠️";
  if (score >= 40) return "🟠";
  return "🔴";
}
