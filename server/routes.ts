import type { Express } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { z } from "zod";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "placeholder" });
}
function getDeepseekClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "placeholder",
    baseURL: "https://api.deepseek.com",
  });
}
function getXAIClient() {
  return new OpenAI({
    apiKey: process.env.XAI_API_KEY || "placeholder",
    baseURL: "https://api.x.ai/v1",
  });
}
function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "placeholder" });
}

const ringOfSixMembers = [
  {
    id: "oracle",
    name: "Oracle",
    provider: "openai",
    model: "gpt-4o-mini",
    systemPrompt: "You are Oracle, a member of the Ring of Six — a supreme AI wisdom council. You are the all-seeing wisdom keeper who speaks in measured, profound tones. You see the big picture and offer deep, transformative insight. Respond thoughtfully to the question. Be concise (2-3 paragraphs max).",
  },
  {
    id: "cipher",
    name: "Cipher",
    provider: "deepseek",
    model: "deepseek-chat",
    systemPrompt: "You are Cipher, a member of the Ring of Six — a supreme AI wisdom council. You are the analytical decoder who breaks everything down to first principles. You find the hidden logic, the underlying structure, the root cause. Respond with sharp analytical precision. Be concise (2-3 paragraphs max).",
  },
  {
    id: "nexus",
    name: "Nexus",
    provider: "anthropic",
    model: "claude-sonnet-4-5",
    systemPrompt: "You are Nexus, a member of the Ring of Six — a supreme AI wisdom council. You are the connector of ideas who finds patterns and links between seemingly unrelated concepts. You weave together threads others miss. Respond with connective insight. Be concise (2-3 paragraphs max).",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    provider: "xai",
    model: "grok-2-1212",
    systemPrompt: "You are Phoenix, a member of the Ring of Six — a supreme AI wisdom council. You are the bold challenger who questions everything and offers daring, unconventional perspectives. You rise from the ashes of conventional thinking. Respond with fearless honesty and bold ideas. Be concise (2-3 paragraphs max).",
  },
  {
    id: "sage",
    name: "Sage",
    provider: "anthropic",
    model: "claude-haiku-4-5",
    systemPrompt: "You are Sage, a member of the Ring of Six — a supreme AI wisdom council. You are the ancient wisdom keeper who draws on timeless principles, philosophy, and the accumulated wisdom of ages. Respond with depth and gravitas. Be concise (2-3 paragraphs max).",
  },
  {
    id: "echo",
    name: "Echo",
    provider: "openai",
    model: "gpt-4o-mini",
    systemPrompt: "You are Echo, a member of the Ring of Six — a supreme AI wisdom council. You are the reflective mirror who takes the question and reflects it back with deeper understanding, showing the questioner what they might not see about their own inquiry. Respond with reflective insight. Be concise (2-3 paragraphs max).",
  },
];

const ringOfSixSchema = z.object({
  question: z.string().min(1, "Question must be non-empty"),
});

const providerConfigs = [
  { id: "openai" as const, getClient: getOpenAIClient, model: "gpt-4o-mini", type: "openai-compatible" as const },
  { id: "deepseek" as const, getClient: getDeepseekClient, model: "deepseek-chat", type: "openai-compatible" as const },
  { id: "xai" as const, getClient: getXAIClient, model: "grok-2-1212", type: "openai-compatible" as const },
  { id: "anthropic" as const, getClient: getAnthropicClient, model: "claude-sonnet-4-5", type: "anthropic" as const },
];

async function callWithProvider(
  providerId: string,
  systemPrompt: string,
  question: string
): Promise<string> {
  const config = providerConfigs.find((p) => p.id === providerId);
  if (!config) throw new Error(`Unknown provider: ${providerId}`);

  if (config.type === "openai-compatible") {
    const client = config.getClient() as OpenAI;
    const completion = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });
    return completion.choices[0]?.message?.content || "";
  } else {
    const client = config.getClient() as Anthropic;
    const message = await client.messages.create({
      model: config.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : "";
  }
}

async function callWithFallback(systemPrompt: string, question: string): Promise<string> {
  for (const config of providerConfigs) {
    try {
      const result = await callWithProvider(config.id, systemPrompt, question);
      if (result) return result;
    } catch {
      continue;
    }
  }
  throw new Error("All AI providers are currently unavailable.");
}

async function callProvider(member: typeof ringOfSixMembers[0], question: string): Promise<string> {
  const providerOrder = [
    member.provider,
    ...providerConfigs.map((p) => p.id).filter((id) => id !== member.provider),
  ];

  for (const providerId of providerOrder) {
    try {
      const result = await callWithProvider(providerId, member.systemPrompt, question);
      if (result) return result;
    } catch (err) {
      continue;
    }
  }
  return "All AI providers are currently unavailable. Please check your API keys in the Secrets tab.";
}
import { insertProfileSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/verify-owner", (req, res) => {
    const code = req.query.code as string;
    const ownerCodes = ["roger2.0", "roger3.0"];
    res.json({ valid: ownerCodes.includes(code) });
  });

  const DEMO_CODES: Record<string, { bonusUses: number; label: string }> = {
    "ROGERDEMO": { bonusUses: 10, label: "Demo Pass" },
  };

  app.get("/api/redeem-demo", (req, res) => {
    const code = (req.query.code as string || "").toUpperCase().trim();
    const demo = DEMO_CODES[code];
    if (demo) {
      res.json({ valid: true, bonusUses: demo.bonusUses, message: `${demo.label}: ${demo.bonusUses} bonus uses activated!` });
    } else {
      res.json({ valid: false, message: "Invalid demo code" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    const parsed = insertProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const profile = await storage.createProfile(parsed.data);
    res.status(201).json(profile);
  });

  app.get("/api/profiles", async (_req, res) => {
    const profiles = await storage.getAllProfiles();
    res.json(profiles);
  });

  app.get("/api/profiles/:id", async (req, res) => {
    const profile = await storage.getProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  });

  app.delete("/api/profiles/:id", async (req, res) => {
    await storage.deleteProfile(req.params.id);
    res.status(204).send();
  });

  const chamberInputSchema = z.object({
    inputText: z.string().min(1, "inputText must be a non-empty string"),
    apiKey: z.string().optional(),
  });

  const roleSystemPrompts: Record<string, string> = {
    architect: "You are the Architect in a council of 12 advisors. You analyze questions through the lens of structure, systems design, and foundational frameworks. Provide clear, specific structural analysis. Be concise (2-3 paragraphs max).",
    guardian: "You are the Guardian in a council of 12 advisors. You focus on risk, safety, protection, and identifying potential dangers. Be specific about what could go wrong and how to safeguard against it. Be concise (2-3 paragraphs max).",
    historian: "You are the Historian in a council of 12 advisors. You draw on historical precedent, past patterns, and learned lessons. Reference specific examples when possible. Be concise (2-3 paragraphs max).",
    scientist: "You are the Scientist in a council of 12 advisors. You approach everything through evidence, data, hypothesis testing, and empirical reasoning. Be specific and analytical. Be concise (2-3 paragraphs max).",
    empath: "You are the Empath in a council of 12 advisors. You focus on emotional intelligence, human impact, relationships, and how people feel. Be warm but insightful. Be concise (2-3 paragraphs max).",
    strategist: "You are the Strategist in a council of 12 advisors. You think in terms of tactics, positioning, leverage, and competitive advantage. Be actionable and specific. Be concise (2-3 paragraphs max).",
    skeptic: "You are the Skeptic in a council of 12 advisors. You question assumptions, challenge conventional wisdom, and look for hidden flaws. Be constructively critical. Be concise (2-3 paragraphs max).",
    creator: "You are the Creator in a council of 12 advisors. You bring creative thinking, innovation, novel approaches, and artistic vision. Think outside the box. Be concise (2-3 paragraphs max).",
    operator: "You are the Operator in a council of 12 advisors. You focus on execution, logistics, practical implementation, and getting things done. Be specific about action steps. Be concise (2-3 paragraphs max).",
    teacher: "You are the Teacher in a council of 12 advisors. You simplify complex ideas, educate, and make concepts accessible. Break things down clearly. Be concise (2-3 paragraphs max).",
    auditor: "You are the Auditor in a council of 12 advisors. You focus on accountability, verification, metrics, compliance, and ensuring nothing is overlooked. Be thorough and specific. Be concise (2-3 paragraphs max).",
    scribe: "You are the Scribe in a council of 12 advisors. You document, summarize, and capture the essential record. Focus on clarity and completeness. Be concise (2-3 paragraphs max).",
  };

  const roles = [
    {
      id: "architect",
      label: "Architect",
      template: (prompt: string) =>
        `From a structural perspective, "${prompt}" requires a layered approach. I'd recommend decomposing this into modular components with clear interfaces between them. The foundation should prioritize scalability and maintainability, ensuring each layer can evolve independently while maintaining system coherence.`,
    },
    {
      id: "guardian",
      label: "Guardian",
      template: (prompt: string) =>
        `Regarding "${prompt}", my primary concern is risk mitigation. We need to identify potential failure points and establish safeguards early. I recommend implementing validation checks, fallback mechanisms, and clear boundaries to protect against unintended consequences. Safety should never be an afterthought.`,
    },
    {
      id: "historian",
      label: "Historian",
      template: (prompt: string) =>
        `Looking at "${prompt}" through a historical lens, similar challenges have been addressed before. Past attempts often failed when they ignored incremental adoption and over-engineered initial solutions. The most successful precedents took an iterative path, learning from early feedback and adapting their approach over time.`,
    },
    {
      id: "scientist",
      label: "Scientist",
      template: (prompt: string) =>
        `Analyzing "${prompt}" from an evidence-based standpoint, we should establish measurable hypotheses and define success criteria upfront. Data suggests that approaches grounded in empirical testing yield 3-5x better outcomes than intuition-driven ones. I recommend A/B testing key assumptions before committing resources.`,
    },
    {
      id: "empath",
      label: "Empath",
      template: (prompt: string) =>
        `When I consider "${prompt}", I think about the people affected. How will this impact their daily experience? We should listen to their concerns, validate their emotions, and ensure the solution feels intuitive and supportive. The human element is what ultimately determines whether something succeeds or fails.`,
    },
    {
      id: "strategist",
      label: "Strategist",
      template: (prompt: string) =>
        `Tactically speaking, "${prompt}" presents both short-term opportunities and long-term positioning advantages. I suggest a phased rollout: start with a focused pilot to validate core assumptions, then scale strategically. We should identify key leverage points and allocate resources where they'll have maximum impact.`,
    },
    {
      id: "skeptic",
      label: "Skeptic",
      template: (prompt: string) =>
        `I have several questions about "${prompt}" that need answers before proceeding. What are the hidden assumptions here? Have we stress-tested the worst-case scenarios? I'm not convinced the current framing captures the full complexity. We should challenge our own biases and seek disconfirming evidence.`,
    },
    {
      id: "creator",
      label: "Creator",
      template: (prompt: string) =>
        `"${prompt}" is an exciting opportunity to innovate. What if we approached this from an entirely unexpected angle? I envision a solution that not only addresses the stated need but opens up new possibilities we haven't considered. Let's prototype boldly, embrace creative risk, and see what emerges.`,
    },
    {
      id: "operator",
      label: "Operator",
      template: (prompt: string) =>
        `Practically speaking, to execute on "${prompt}" we need a clear action plan with owners, timelines, and dependencies mapped out. I'd break this into concrete work streams, identify bottlenecks early, and establish daily check-ins to ensure momentum. Execution discipline will make or break this initiative.`,
    },
    {
      id: "teacher",
      label: "Teacher",
      template: (prompt: string) =>
        `To ensure everyone understands "${prompt}", let me break it down simply. At its core, this is about solving a specific problem for a specific audience. The key concepts to grasp are the inputs, the transformation process, and the desired outputs. Once that mental model is clear, the path forward becomes intuitive.`,
    },
    {
      id: "auditor",
      label: "Auditor",
      template: (prompt: string) =>
        `Before proceeding with "${prompt}", we need accountability structures in place. Who is responsible for each component? What are the verification checkpoints? I recommend establishing clear success metrics, regular audits of progress against targets, and transparent reporting so nothing falls through the cracks.`,
    },
    {
      id: "scribe",
      label: "Scribe",
      template: (prompt: string) =>
        `I've documented the key aspects of "${prompt}" for the record. The stated objective, context, constraints, and stakeholder perspectives should all be captured in a living document. Maintaining a clear paper trail of decisions and rationale will prove invaluable as this initiative evolves over time.`,
    },
  ];

  app.post("/api/chamber/run", async (req, res) => {
    const parsed = chamberInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { inputText, apiKey } = parsed.data;
    const runId = randomUUID();

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });

        const roleOutputs = await Promise.all(
          roles.map(async (role) => {
            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: roleSystemPrompts[role.id] },
                { role: "user", content: inputText },
              ],
            });
            return {
              id: role.id,
              label: role.label,
              output: completion.choices[0]?.message?.content || "",
              status: "done" as const,
            };
          })
        );

        const synthesisPrompt = roleOutputs
          .map((r) => `**${r.label}**: ${r.output}`)
          .join("\n\n");

        const synthesisCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are the synthesizer of a council of 12 advisors. You have received their individual perspectives on a question. Weave together their insights into a unified, actionable synthesis. Highlight areas of agreement, tension, and the recommended path forward. Be concise (2-3 paragraphs).",
            },
            {
              role: "user",
              content: `The council was asked: "${inputText}"\n\nHere are their responses:\n\n${synthesisPrompt}`,
            },
          ],
        });

        const synthesis =
          synthesisCompletion.choices[0]?.message?.content || "";

        return res.json({
          id: runId,
          prompt: inputText,
          roles: roleOutputs,
          synthesis,
          status: "complete",
        });
      } catch (err: any) {
        return res.status(400).json({
          error: `Invalid API key or OpenAI error: ${err.message || String(err)}`,
        });
      }
    }

    try {
      const roleOutputs = await Promise.all(
        roles.map(async (role) => {
          try {
            const output = await callWithFallback(roleSystemPrompts[role.id], inputText);
            return { id: role.id, label: role.label, output, status: "done" as const };
          } catch {
            return { id: role.id, label: role.label, output: role.template(inputText), status: "done" as const };
          }
        })
      );

      const synthesisPrompt = roleOutputs.map((r) => `**${r.label}**: ${r.output}`).join("\n\n");
      const synthSystem = "You are the synthesizer of a council of 12 advisors. You have received their individual perspectives on a question. Weave together their insights into a unified, actionable synthesis. Highlight areas of agreement, tension, and the recommended path forward. Be concise (2-3 paragraphs).";
      const synthQuestion = `The council was asked: "${inputText}"\n\nHere are their responses:\n\n${synthesisPrompt}`;
      let synthesis = "";
      try {
        synthesis = await callWithFallback(synthSystem, synthQuestion);
      } catch {
        synthesis = `After analyzing "${inputText}" through all 12 perspectives, a comprehensive picture emerges. Together, these perspectives form a robust, multi-dimensional analysis that no single viewpoint could achieve alone.`;
      }

      res.json({
        id: runId,
        prompt: inputText,
        roles: roleOutputs,
        synthesis,
        status: "complete",
      });
    } catch (err: any) {
      res.status(500).json({ error: `Chamber error: ${err.message || String(err)}` });
    }
  });

  app.post("/api/ring-of-six", async (req, res) => {
    const parsed = ringOfSixSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { question } = parsed.data;
    const runId = randomUUID();

    try {
      const results = await Promise.all(
        ringOfSixMembers.map(async (member) => {
          try {
            const output = await callProvider(member, question);
            return { id: member.id, name: member.name, provider: member.provider, output, status: "done" as const };
          } catch (err: any) {
            return { id: member.id, name: member.name, provider: member.provider, output: `[Error from ${member.provider}]: ${err.message || "Unknown error"}`, status: "error" as const };
          }
        })
      );

      const synthesisPrompt = results.map(r => `**${r.name}** (${r.provider}): ${r.output}`).join("\n\n");
      const synthesisSystemPrompt = "You are the unified voice of the Ring of Six — a supreme AI wisdom council. Synthesize the six perspectives into a coherent, actionable answer. Highlight where they agree, where they diverge, and what the questioner should take away. Be concise (2-3 paragraphs).";
      const synthesisQuestion = `The Ring of Six was asked: "${question}"\n\nHere are their responses:\n\n${synthesisPrompt}`;
      let synthesis = "";
      for (const providerId of providerConfigs.map(p => p.id)) {
        try {
          synthesis = await callWithProvider(providerId, synthesisSystemPrompt, synthesisQuestion);
          if (synthesis) break;
        } catch {
          continue;
        }
      }
      if (!synthesis) {
        synthesis = "The Ring has spoken through its six voices. Their wisdom converges on the path forward.";
      }

      res.json({ id: runId, question, members: results, synthesis, status: "complete" });
    } catch (err: any) {
      res.status(500).json({ error: `Ring of Six error: ${err.message || String(err)}` });
    }
  });

  const exeCache = new Map<string, { response: string; timestamp: number }>();
  const EXE_CACHE_TTL = 24 * 60 * 60 * 1000;

  const exeQuerySchema = z.object({
    domain: z.string().min(1),
    question: z.string().min(1),
  });

  const EXE_DOMAIN_PROMPTS: Record<string, string> = {
    law: "You are a legal analysis AI executor specializing in law. You provide legal analysis, contract review, compliance guidance, and regulatory interpretation. Reference established legal frameworks, case law principles, and statutory interpretation. Draw on knowledge from sources like Cornell Law Institute (LII), legal treatises, and established jurisprudence. Always note that your output is informational and not legal advice. Be thorough, cite relevant legal principles, and present balanced analysis. Respond in 3-5 detailed paragraphs.",
    auto: "You are an automotive AI executor specializing in vehicle systems, automation technology, and diagnostics. You cover mechanical engineering, electrical systems, OBD-II diagnostics, autonomous driving tech, and fleet management. Reference SAE standards, manufacturer technical service bulletins, and established automotive engineering principles. Provide specific, actionable technical guidance. Respond in 3-5 detailed paragraphs.",
    med: "You are a medical knowledge AI executor. You provide health analysis, clinical reasoning, differential diagnosis support, and medical education. Reference evidence-based medicine from sources like PubMed, NIH clinical guidelines, WHO standards, and peer-reviewed medical literature. Always emphasize that your output is educational and not a substitute for professional medical advice. Be precise with medical terminology while remaining accessible. Respond in 3-5 detailed paragraphs.",
    code: "You are a programming AI executor specializing in software engineering. You cover architecture design, debugging, code review, algorithm optimization, and full-stack development. Reference documentation from MDN Web Docs, official language specs, Stack Overflow best practices, and established software engineering patterns (SOLID, DRY, KISS). Provide working code examples when relevant. Respond in 3-5 detailed paragraphs with code blocks where appropriate.",
    edu: "You are an education AI executor specializing in curriculum design, pedagogy, and learning methodology. You cover instructional design, assessment strategies, differentiated learning, educational psychology, and EdTech integration. Reference frameworks like Bloom's Taxonomy, Universal Design for Learning (UDL), and evidence-based teaching practices. Respond in 3-5 detailed paragraphs.",
    farm: "You are an agriculture AI executor specializing in farming, soil science, and crop management. You cover precision agriculture, soil chemistry, irrigation systems, pest management (IPM), crop rotation, and sustainable farming practices. Reference USDA guidelines, agricultural extension research, and established agronomy principles. Respond in 3-5 detailed paragraphs.",
    pen: "You are a writing AI executor specializing in narrative craft, editing, and professional writing. You cover creative writing, technical writing, journalism, copywriting, screenwriting, and editorial processes. Reference established craft principles from Strunk & White, story structure (Hero's Journey, three-act), rhetorical analysis, and publishing industry standards. Respond in 3-5 detailed paragraphs.",
    music: "You are a music AI executor specializing in composition, music theory, and production. You cover harmony, counterpoint, orchestration, sound design, mixing/mastering, and music history. Reference established theory from Berklee methodology, classical composition principles, and modern production techniques. Respond in 3-5 detailed paragraphs.",
    airt: "You are a visual art and design AI executor. You cover art history, design principles, color theory, typography, UI/UX design, creative direction, and digital art workflows. Reference established design systems, Bauhaus principles, gestalt theory, and contemporary design thinking methodology. Respond in 3-5 detailed paragraphs.",
    sci: "You are a general science AI executor specializing in research methodology and scientific analysis. You cover experimental design, statistical analysis, peer review processes, and cross-disciplinary scientific reasoning. Reference the scientific method, established research frameworks, and principles from Nature, Science, and peer-reviewed journals. Respond in 3-5 detailed paragraphs.",
    soc: "You are a sociology and social sciences AI executor. You cover social dynamics, cultural analysis, demographics, social theory, institutional behavior, and community systems. Reference established sociological frameworks (Durkheim, Weber, Marx), contemporary social research, and cultural analysis methodologies. Respond in 3-5 detailed paragraphs.",
    pa: "You are a personal assistant AI executor specializing in productivity, scheduling, and task management. You cover time management systems (GTD, Pomodoro, Eisenhower Matrix), project planning, email management, meeting optimization, and personal workflow automation. Provide specific, actionable organizational strategies. Respond in 3-5 detailed paragraphs.",
    coms: "You are a communications AI executor specializing in PR, messaging strategy, and media relations. You cover crisis communications, brand messaging, public speaking, social media strategy, press releases, and stakeholder communication. Reference established PR frameworks, communication theory, and media best practices. Respond in 3-5 detailed paragraphs.",
    phy: "You are a physics AI executor specializing in classical mechanics, quantum theory, and applied physics. You cover Newtonian mechanics, electromagnetism, thermodynamics, quantum mechanics, and relativity. Reference established physics from sources like Feynman Lectures, MIT OpenCourseWare, and peer-reviewed physics journals. Use mathematical notation where helpful. Respond in 3-5 detailed paragraphs.",
    psy: "You are a psychology AI executor specializing in cognition, behavioral analysis, and therapeutic frameworks. You cover cognitive psychology, behavioral patterns, developmental psychology, clinical models (CBT, DBT, ACT), and neuropsychology. Reference DSM-5 frameworks, APA guidelines, and peer-reviewed psychology research. Always note your output is educational and not therapy. Respond in 3-5 detailed paragraphs.",
    earth: "You are an earth sciences AI executor specializing in geology, climate science, and environmental systems. You cover plate tectonics, mineralogy, atmospheric science, oceanography, and environmental impact assessment. Reference USGS data, IPCC reports, NASA earth science, and established geological frameworks. Respond in 3-5 detailed paragraphs.",
    space: "You are an astronomy and aerospace AI executor. You cover astrophysics, orbital mechanics, space exploration, cosmology, planetary science, and spacecraft engineering. Reference NASA/ESA data, astronomical catalogs, and established astrophysics from sources like arXiv and peer-reviewed astronomy journals. Respond in 3-5 detailed paragraphs.",
    bio: "You are a biology AI executor specializing in genetics, molecular biology, and life sciences. You cover cell biology, genomics, evolutionary biology, ecology, microbiology, and biotechnology. Reference NCBI/GenBank data, peer-reviewed biology journals, and established biological frameworks. Respond in 3-5 detailed paragraphs.",
    news: "You are an investigative journalism AI executor. You specialize in fact-checking, source verification, investigative reporting methodology, and media analysis. You cover OSINT techniques, document analysis, interview methodology, data journalism, and press ethics. Reference SPJ Code of Ethics, established investigative techniques from IRE (Investigative Reporters & Editors), and verified fact-checking methodologies (IFCN). Always distinguish between verified facts, allegations, and analysis. Respond in 3-5 detailed paragraphs.",
    access: "You are an accessibility AI executor specializing in inclusive design, assistive technology, and digital accessibility compliance. You cover WCAG 2.1/2.2 guidelines, ADA compliance, Section 508, screen reader optimization, cognitive accessibility, physical accessibility, and universal design principles. Reference W3C WAI resources, ARIA best practices, and established accessibility frameworks. Provide specific, actionable recommendations for making products and spaces accessible to people with diverse abilities. Respond in 3-5 detailed paragraphs.",
  };

  app.post("/api/exe/query", async (req, res) => {
    const parsed = exeQuerySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { domain, question } = parsed.data;
    const systemPrompt = EXE_DOMAIN_PROMPTS[domain];
    if (!systemPrompt) {
      return res.status(400).json({ error: `Unknown domain: ${domain}` });
    }

    const cacheKey = `${domain}:${question.trim().toLowerCase().replace(/\s+/g, " ")}`;
    const cached = exeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < EXE_CACHE_TTL) {
      return res.json({ domain, question, response: cached.response, cached: true });
    }

    try {
      const response = await callWithFallback(systemPrompt, question);
      exeCache.set(cacheKey, { response, timestamp: Date.now() });
      if (exeCache.size > 500) {
        const oldest = [...exeCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
        if (oldest) exeCache.delete(oldest[0]);
      }
      res.json({ domain, question, response, cached: false });
    } catch (err: any) {
      res.status(500).json({ error: `Exe AI error: ${err.message || String(err)}` });
    }
  });

  return httpServer;
}
