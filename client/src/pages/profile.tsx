import { useMemo, useEffect } from "react";
import { Link, useParams } from "wouter";
import {
  ChevronLeft,
  Copy,
  Download,
  FileText,
  Fingerprint,
  Lock,
  Shield,
  Sparkles,
  Upload,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { dump as yamlDump } from "js-yaml";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";

function safeStringify(obj: any) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "{}";
  }
}

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProfilePage() {
  useEffect(() => { document.title = "View Profile — Roger 3.0"; }, []);
  const params = useParams<{ id: string }>();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profiles", params.id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!params.id,
  });

  const profileData = profile?.profileData as any;

  const json = useMemo(() => safeStringify(profileData || {}), [profileData]);
  const yaml = useMemo(() => {
    try {
      return yamlDump(profileData || {}, { noRefs: true, lineWidth: 100 });
    } catch {
      return "{}\n";
    }
  }, [profileData]);

  async function copyJson() {
    await navigator.clipboard.writeText(json);
    toast.success("Copied profile JSON");
  }

  async function copyYaml() {
    await navigator.clipboard.writeText(yaml);
    toast.success("Copied profile YAML");
  }

  function exportJson() {
    const name = profileData?.identity?.displayName || "continuation";
    downloadText(`${name}.profile.json`, json, "application/json");
    toast.success("Exported JSON");
  }

  function exportYaml() {
    const name = profileData?.identity?.displayName || "continuation";
    downloadText(`${name}.profile.yaml`, yaml, "text/yaml");
    toast.success("Exported YAML");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const missing = !profileData?.identity?.displayName;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/create" data-testid="link-back-create">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                data-testid="button-back-create"
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                Interview
              </Button>
            </Link>
            <div className="hidden h-7 w-px bg-border md:block" aria-hidden="true" />
            <div>
              <div
                className="font-serif text-base leading-none tracking-tight"
                data-testid="text-profile-title"
              >
                Continuation profile
              </div>
              <div className="mt-1 text-[11px] leading-none text-muted-foreground">
                Preview   export   verifier contract
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={copyYaml}
              data-testid="button-copy-profile-yaml"
            >
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
              Copy YAML
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={copyJson}
              data-testid="button-copy-profile-json"
            >
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
              Copy JSON
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={exportYaml}
              data-testid="button-export-profile-yaml"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              YAML
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={exportJson}
              data-testid="button-export-profile-json"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              JSON
            </Button>

            <Link href={`/chamber/${params.id}`} data-testid="link-chamber">
              <Button size="sm" className="rounded-full bg-primary text-black hover:bg-primary/90 font-bold" data-testid="button-chamber">
                Enter Chamber
              </Button>
            </Link>

            <Link href="/" data-testid="link-home">
              <Button size="sm" variant="secondary" className="rounded-full" data-testid="button-home">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {missing ? (
          <Card className="noise rounded-3xl border bg-card/60 p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-2xl border bg-background/60 shadow-2xs">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div
                  className="font-serif text-2xl tracking-tight"
                  data-testid="text-empty-title"
                >
                  Profile not found
                </div>
                <p
                  className="mt-2 text-sm text-muted-foreground"
                  data-testid="text-empty-desc"
                >
                  This profile doesn't exist or couldn't be loaded. Create one via
                  the guided interview.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link href="/create" data-testid="link-empty-create">
                    <Button className="rounded-full" data-testid="button-empty-create">
                      Start the interview
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="noise rounded-3xl border bg-card/60 p-6 shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                    data-testid="badge-profile"
                  >
                    PROFILE
                  </Badge>
                  <h1
                    className="mt-3 font-serif text-3xl tracking-tight"
                    data-testid="text-name"
                  >
                    {profileData.identity.displayName}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground" data-testid="text-tagline">
                    {profileData.identity.tagline || "\u2014"}
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl border bg-background/60 shadow-2xs">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <Separator className="my-5" />

              <div className="grid gap-4">
                <div className="rounded-2xl border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground">
                    <Fingerprint className="h-4 w-4" aria-hidden="true" />
                    VOICE
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground" data-testid="text-voice">
                    {profileData.voice?.notes}
                  </div>
                </div>

                <div className="rounded-2xl border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground">
                    <User className="h-4 w-4" aria-hidden="true" />
                    VALUES & BOUNDARIES
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground" data-testid="text-values">
                    {profileData.valuesAndBoundaries?.beliefs}
                  </div>
                  <div
                    className="mt-3 text-sm text-muted-foreground"
                    data-testid="text-boundaries"
                  >
                    {profileData.valuesAndBoundaries?.boundaries}
                  </div>
                </div>

                <div className="rounded-2xl border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    MEMORIES
                  </div>
                  <div className="mt-2 grid gap-3">
                    {(profileData.memories || []).map((m: any) => (
                      <div key={m.id} className="rounded-xl border bg-card/50 p-3">
                        <div className="text-xs text-muted-foreground">
                          {m.source}   confidence {m.confidence}
                        </div>
                        <div
                          className="mt-1 text-sm text-muted-foreground"
                          data-testid={`text-memory-${m.id}`}
                        >
                          {m.story}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    VERIFIER
                  </div>
                  <div
                    className="mt-2 text-sm text-muted-foreground"
                    data-testid="text-verifier"
                  >
                    {profileData.verifier?.rules}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="noise rounded-3xl border bg-card/60 p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                  PROFILE YAML
                </div>
                <Badge variant="secondary" className="rounded-full" data-testid="badge-yaml">
                  durable
                </Badge>
              </div>

              <pre
                className="mt-4 max-h-[560px] overflow-auto rounded-2xl border bg-background/60 p-4 text-xs leading-relaxed text-foreground/90"
                data-testid="text-profile-yaml"
              >
                <code className="font-mono">{yaml}</code>
              </pre>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                  onClick={copyYaml}
                  data-testid="button-copy-yaml-bottom"
                >
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  Copy YAML
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                  onClick={exportYaml}
                  data-testid="button-export-yaml-bottom"
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Export YAML
                </Button>
              </div>

              <div className="mt-4 rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  YAML is meant to last: easy to store, print, and migrate.
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
