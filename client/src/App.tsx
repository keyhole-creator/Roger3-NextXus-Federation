import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Starfield } from "@/components/starfield";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CreatePage from "@/pages/create";
import ProfilePage from "@/pages/profile";
import ChamberPage from "@/pages/chamber";
import ChamberEchoesPage from "@/pages/chamber-echoes";
import RingOfSixPage from "@/pages/ring-of-six";
import AgentZeroPage from "@/pages/agent-zero";
import EchoCorePage from "@/pages/echo-core";
import ExeDomainPage from "@/pages/exe-domain";
import NextXusYamlPage from "@/pages/nextxus-yaml";
import GuideBot from "@/components/guide-bot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/profile/:id" component={ProfilePage} />
      <Route path="/chamber" component={ChamberEchoesPage} />
      <Route path="/chamber/:id" component={ChamberPage} />
      <Route path="/ring-of-six" component={RingOfSixPage} />
      <Route path="/agent-zero" component={AgentZeroPage} />
      <Route path="/echo-core" component={EchoCorePage} />
      <Route path="/exe/:domain" component={ExeDomainPage} />
      <Route path="/nextxus-yaml" component={NextXusYamlPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Starfield />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Toaster />
          <Router />
          <GuideBot />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
