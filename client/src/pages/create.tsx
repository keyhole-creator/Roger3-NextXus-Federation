import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  Copy,
  Download,
  Fingerprint,
  Heart,
  ListChecks,
  Lock,
  MessageSquare,
  Quote,
  Shield,
  Sparkles,
  ThumbsUp,
  Timer,
  User,
  Mic,
  Volume2,
  Upload,
  Clapperboard,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

// Assets
import aiIdleVideo from "@/assets/videos/ai-face-idle.mp4";
import aiTalkingVideo from "@/assets/videos/ai-face-talking.mp4";
import nebulaBg from "@/assets/images/nebula-bg.png";

const schema = z.object({
  displayName: z.string().min(2, "Please enter a name"),
  pronouns: z.string().optional(),
  tagline: z.string().max(140).optional(),

  voiceNotes: z.string().min(30, "Give at least a couple sentences"),
  boundaries: z.string().min(30, "Add a few boundaries"),

  threeBeliefs: z.string().min(30, "Add at least 3 beliefs"),
  threeRegrets: z.string().min(10).optional(),

  memory1: z.string().min(30, "Tell one story"),
  memory2: z.string().min(10).optional(),

  verifierRules: z.string().min(30, "Add a few verifier rules"),
  futureAudience: z.string().min(10).optional(),
});

type FormValues = z.infer<typeof schema>;
type ContinuationProfile = ReturnType<typeof buildProfile>;

// Targeted Look Definition
type TargetedLook = {
  id: string;
  label: string;
  description: string;
  videoSrc: string;
  status: "active" | "pending";
};

const TARGETED_LOOKS: TargetedLook[] = [
  {
    id: "idle",
    label: "Neutral / Listening",
    description: "Baseline state. Slight breathing, blinking, attentive.",
    videoSrc: aiIdleVideo,
    status: "active",
  },
  {
    id: "speaking_neutral",
    label: "Speaking (Neutral)",
    description: "Mouthing generic words ('peas and carrots'). Standard delivery.",
    videoSrc: aiTalkingVideo,
    status: "active",
  },
  {
    id: "speaking_emphatic",
    label: "Speaking (Emphatic)",
    description: "Stronger head movements for important points.",
    videoSrc: "",
    status: "pending",
  },
  {
    id: "thinking",
    label: "Processing / Thinking",
    description: "Looking away slightly, eyes narrowing.",
    videoSrc: "",
    status: "pending",
  },
  {
    id: "nodding",
    label: "Agreement / Nodding",
    description: "Slow nod to indicate understanding.",
    videoSrc: "",
    status: "pending",
  },
];

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(filename: string, data: unknown) {
  downloadText(filename, JSON.stringify(data, null, 2), "application/json");
}

function downloadYaml(filename: string, data: unknown) {
  const yaml = yamlDump(data, {
    noRefs: true,
    lineWidth: 100,
  });
  downloadText(filename, yaml, "text/yaml");
}

function parseYaml(text: string) {
  const parsed = yamlLoad(text);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
}

function buildProfile(values: FormValues) {
  const now = new Date();
  return {
    version: "roger-3-continuation-profile@0.2",
    createdAt: now.toISOString(),
    identity: {
      displayName: values.displayName,
      pronouns: values.pronouns || null,
      tagline: values.tagline || null,
    },
    voice: {
      notes: values.voiceNotes,
      samplePhrases: [],
    },
    valuesAndBoundaries: {
      beliefs: values.threeBeliefs,
      regrets: values.threeRegrets || null,
      boundaries: values.boundaries,
    },
    memories: [
      {
        id: "memory-1",
        story: values.memory1,
        source: "self-report",
        confidence: 0.7,
      },
      values.memory2
        ? {
            id: "memory-2",
            story: values.memory2,
            source: "self-report",
            confidence: 0.6,
          }
        : null,
    ].filter(Boolean),
    verifier: {
      rules: values.verifierRules,
      futureAudience: values.futureAudience || null,
      contract: {
        cite: true,
        qualify: true,
        refuse: true,
      },
    },
  };
}

// Simulated "Speaking" State Hook
function useAISpeaking(trigger: any) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Speak briefly when the step changes or trigger updates
    setIsSpeaking(true);
    const timer = setTimeout(() => setIsSpeaking(false), 3500); // Talk for 3.5s
    return () => clearTimeout(timer);
  }, [trigger]);

  return isSpeaking;
}

export default function CreatePage() {
  useEffect(() => { document.title = "Build Your Sim — Roger 3.0"; }, []);
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<
    "identity" | "voice" | "values" | "memories" | "verifier"
  >("identity");
  
  // Look Selector State
  const [selectedLookId, setSelectedLookId] = useState<string>("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      pronouns: "",
      tagline: "",
      voiceNotes: "",
      boundaries: "",
      threeBeliefs: "",
      threeRegrets: "",
      memory1: "",
      memory2: "",
      verifierRules: "",
      futureAudience: "",
    },
    mode: "onBlur",
  });

  // AI Avatar State
  const isSpeaking = useAISpeaking(tab);

  // Determine current video source based on auto-state OR manual override
  const currentVideoSrc = useMemo(() => {
    // If user explicitly selected a specific look in the library, show that (preview mode)
    // But for the main interaction flow, we switch between idle/speaking automatically
    if (selectedLookId !== "idle" && selectedLookId !== "speaking_neutral") {
       // If a pending look is selected, fall back to idle (since we don't have video yet)
       return aiIdleVideo; 
    }
    
    // Normal auto-behavior
    if (isSpeaking) return aiTalkingVideo;
    return aiIdleVideo;
  }, [isSpeaking, selectedLookId]);

  const order = useMemo(
    () =>
      ["identity", "voice", "values", "memories", "verifier"] as const,
    [],
  );

  const tabIndex = order.indexOf(tab);
  const progress = Math.round(((tabIndex + 1) / order.length) * 100);

  function next() {
    const nextTab = order[Math.min(order.length - 1, tabIndex + 1)];
    setTab(nextTab);
  }

  function back() {
    const prevTab = order[Math.max(0, tabIndex - 1)];
    setTab(prevTab);
  }

  function exportJsonNow() {
    const values = form.getValues();
    const profile = buildProfile(values);
    downloadJson(`${values.displayName || "continuation"}.profile.json`, profile);
    toast.success("Exported profile JSON");
  }

  function exportYamlNow() {
    const values = form.getValues();
    const profile = buildProfile(values);
    downloadYaml(`${values.displayName || "continuation"}.profile.yaml`, profile);
    toast.success("Exported profile YAML");
  }

  async function onImportYaml(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const parsed = parseYaml(text) as any;
    if (!parsed) {
      toast.error("That file doesn't look like valid YAML");
      return;
    }

    const v: Partial<FormValues> = {
      displayName: parsed?.identity?.displayName ?? "",
      pronouns: parsed?.identity?.pronouns ?? "",
      tagline: parsed?.identity?.tagline ?? "",
      voiceNotes: parsed?.voice?.notes ?? "",
      boundaries: parsed?.valuesAndBoundaries?.boundaries ?? "",
      threeBeliefs: parsed?.valuesAndBoundaries?.beliefs ?? "",
      threeRegrets: parsed?.valuesAndBoundaries?.regrets ?? "",
      memory1: parsed?.memories?.[0]?.story ?? "",
      memory2: parsed?.memories?.[1]?.story ?? "",
      verifierRules: parsed?.verifier?.rules ?? "",
      futureAudience: parsed?.verifier?.futureAudience ?? "",
    };

    form.reset(v as FormValues);
    toast.success("Imported YAML into the interview");
  }

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const profile = buildProfile(values);
      const res = await apiRequest("POST", "/api/profiles", {
        displayName: values.displayName,
        pronouns: values.pronouns || null,
        tagline: values.tagline || null,
        voiceNotes: values.voiceNotes,
        boundaries: values.boundaries,
        beliefs: values.threeBeliefs,
        regrets: values.threeRegrets || null,
        memory1: values.memory1,
        memory2: values.memory2 || null,
        verifierRules: values.verifierRules,
        futureAudience: values.futureAudience || null,
        profileData: profile,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast.success("Profile created");
      setLocation(`/profile/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to save profile");
    },
  });

  function onSubmit(values: FormValues) {
    createMutation.mutate(values);
  }

  return (
    <div
      className="flex min-h-dvh flex-col bg-background text-foreground lg:flex-row"
      style={{
        backgroundImage: `url(${nebulaBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* LEFT SIDE: AI AVATAR */}
      <div className="relative flex w-full flex-col justify-between border-r border-primary/20 bg-black/60 p-6 backdrop-blur-md lg:h-dvh lg:w-[45%] lg:p-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80 lg:to-transparent" />

        <div className="relative z-10">
          <Link href="/" data-testid="link-home">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              data-testid="button-home"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Exit Session
            </Button>
          </Link>
        </div>

        <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-6">
          <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[2rem] border-2 border-primary/40 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)] ring-1 ring-primary/20">
            {/* Video Layer */}
            <video
              key={currentVideoSrc}
              src={currentVideoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-90 transition-opacity duration-500"
            />

            {/* Overlay UI elements on the video */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/40 px-4 py-2 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-primary/50"}`} />
                <span className="text-xs font-mono tracking-widest text-primary/80">
                  {isSpeaking ? "SPEAKING" : "LISTENING"}
                </span>
              </div>
              <Volume2 className="h-4 w-4 text-primary/60" />
            </div>
          </div>

          {/* Look Selector / Library */}
          <div className="w-full max-w-sm rounded-xl border border-primary/20 bg-black/40 p-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary/80">
               <Clapperboard className="h-3 w-3" />
               VISUAL STATE TARGET
            </div>
            
            <Select value={selectedLookId} onValueChange={setSelectedLookId}>
              <SelectTrigger className="w-full border-primary/20 bg-primary/5 text-primary">
                <SelectValue placeholder="Select Look" />
              </SelectTrigger>
              <SelectContent className="border-primary/20 bg-black text-primary">
                {TARGETED_LOOKS.map((look) => (
                  <SelectItem 
                    key={look.id} 
                    value={look.id}
                    className="focus:bg-primary/20 focus:text-primary"
                    disabled={look.status === "pending"}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                       <span>{look.label}</span>
                       {look.status === "pending" && (
                         <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/40 h-4 px-1">Pending</Badge>
                       )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-2 text-[10px] text-primary/50 px-1">
               {TARGETED_LOOKS.find(l => l.id === selectedLookId)?.description}
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-serif text-3xl font-light tracking-tight text-white lg:text-4xl">
              {tab === "identity" && "Let's establish who you are."}
              {tab === "voice" && "I need to learn your voice."}
              {tab === "values" && "What defines your compass?"}
              {tab === "memories" && "Tell me what shaped you."}
              {tab === "verifier" && "Set the rules of truth."}
            </h2>
            <p className="mt-3 text-lg text-primary/80">
              {tab === "identity" && "I'm listening. Tell me your name and how you want to be known."}
              {tab === "voice" && "Speak naturally. I'll analyze your cadence and tone."}
              {tab === "values" && "Values are behavior. How do you decide when it's hard?"}
              {tab === "memories" && "These stories will become my source of truth."}
              {tab === "verifier" && "I need to know when to refuse and when to cite."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-mono text-primary/40">
           <Mic className="h-4 w-4 animate-pulse" />
           <span>AUDIO INPUT ACTIVE</span>
           <span className="ml-auto">SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>
      </div>

      {/* ElevenLabs Conversational AI Widget */}
      <div
        dangerouslySetInnerHTML={{
          __html: '<elevenlabs-convai agent-id="agent_5501kh5tm3m9efysj9awqp8xhawn"></elevenlabs-convai>',
        }}
      />

      {/* RIGHT SIDE: INTERFACE */}
      <div className="relative flex w-full flex-col overflow-y-auto bg-background/80 p-6 backdrop-blur-xl lg:h-dvh lg:w-[55%] lg:p-12">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/50">
                {tabIndex + 1}
              </span>
              <span className="text-sm font-medium tracking-widest text-primary/60">
                PHASE {tabIndex + 1} / 5
              </span>
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-1 bg-primary/10" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {tab === "identity" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary/80">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Roger / Mom / Dr. Amina"
                              className="border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pronouns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary/80">Pronouns</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="she/her, he/him..."
                              className="border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Directive / Tagline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Truth-first builder. Gentle, direct."
                            className="border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 text-primary/80">
                      <Fingerprint className="h-4 w-4" />
                      <span className="text-sm font-bold">IDENTITY PROTOCOL</span>
                    </div>
                    <p className="mt-1 text-xs text-primary/50">
                      This establishes the root persona. It is not a legal entity.
                    </p>
                  </div>
                </div>
              )}

              {tab === "voice" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <FormField
                    control={form.control}
                    name="voiceNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Voice Pattern Analysis</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder="Type how you speak. Don't be formal. Use your slang, your pauses, your rhythm."
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="boundaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Refusal Parameters</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="What will you NEVER say? What questions will you always refuse?"
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {tab === "values" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <FormField
                    control={form.control}
                    name="threeBeliefs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Core Belief System</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="1. Belief A because... 2. Belief B because..."
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="threeRegrets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Critical Lessons / Regrets</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="What warnings do you leave behind?"
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {tab === "memories" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <FormField
                    control={form.control}
                    name="memory1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Key Memory Injection #1</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="A defining moment. Be specific: smells, sounds, feelings."
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memory2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Key Memory Injection #2</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Another pivotal story."
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {tab === "verifier" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm font-bold">VERIFIER MIDDLEWARE CONFIG</span>
                    </div>
                    <p className="mt-1 text-xs text-destructive/70">
                      These rules override personality. They prevent hallucination.
                    </p>
                  </div>
                
                  <FormField
                    control={form.control}
                    name="verifierRules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Truth Contract Rules</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="- Never invent dates. - If unsure, say 'I don't know'. - Cite memories as sources."
                            className="resize-none border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="futureAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Target Audience Access</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Grandchildren, Students, Public..."
                            className="border-primary/20 bg-black/40 text-lg text-white focus:border-primary/60 focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-2">
                   <Button
                    type="button"
                    variant="ghost"
                    className="text-primary/60 hover:text-primary hover:bg-primary/10"
                    onClick={back}
                    disabled={tabIndex === 0}
                  >
                    PREV
                  </Button>
                  
                  {tabIndex < order.length - 1 ? (
                    <Button
                      type="button"
                      className="rounded-full bg-primary text-black hover:bg-primary/90 font-bold px-8 py-6"
                      onClick={next}
                    >
                      CONTINUE
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="rounded-full bg-primary text-black hover:bg-primary/90 font-bold px-8 py-6"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      INITIALIZE
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                   <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".yaml,.yml,text/yaml"
                        className="hidden"
                        onChange={(e) => onImportYaml(e.target.files?.[0] ?? null)}
                      />
                      <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                        <Upload className="h-3 w-3" />
                        IMPORT YAML
                      </div>
                   </label>
                   <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary/40 hover:text-primary"
                      onClick={exportYamlNow}
                   >
                     EXPORT DRAFT
                   </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
