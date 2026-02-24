import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NextXusYamlPage() {
  const yamlUrl = "https://nextxusyaml.netlify.app/";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(5,10,20)" }}>
      <header className="sticky top-0 z-50 border-b border-cyan-500/15" style={{ backgroundColor: "rgba(5,10,20,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" data-testid="link-back-home">
              <Button variant="ghost" size="sm" className="rounded-full text-cyan-100 hover:text-white" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-5 w-px bg-cyan-500/20" />
            <h1
              className="font-serif text-lg tracking-tight text-white md:text-xl"
              style={{ textShadow: "0 0 25px rgba(0,255,200,0.35)" }}
              data-testid="text-yaml-title"
            >
              NextXus YAML Core
            </h1>
          </div>
          <a href={yamlUrl} target="_blank" rel="noopener noreferrer" data-testid="link-yaml-external">
            <Button variant="outline" size="sm" className="rounded-full" data-testid="button-yaml-external">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Open in new tab
            </Button>
          </a>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl px-4 py-6 md:px-6"
      >
        <p className="mb-4 text-sm text-cyan-100 leading-relaxed max-w-2xl" data-testid="text-yaml-description">
          The NextXus YAML Core is the Agent Zero calibration dashboard. It displays real-time logic, empathy, and action calibration scales, system intelligence metrics, and lets you export your brain state as a YAML file for long-term survival storage.
        </p>

        <div
          className="relative overflow-hidden rounded-2xl border border-cyan-500/20 shadow-lg"
          style={{ backgroundColor: "rgba(10,12,20,0.65)" }}
          data-testid="panel-yaml-iframe"
        >
          <iframe
            src={yamlUrl}
            title="NextXus YAML Core"
            className="w-full border-0"
            style={{ height: "calc(100vh - 200px)", minHeight: 500 }}
            allow="clipboard-write"
            data-testid="iframe-yaml"
          />
        </div>
      </motion.div>
    </div>
  );
}
