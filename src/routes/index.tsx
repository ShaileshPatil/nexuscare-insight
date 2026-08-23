import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cross, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AgentTrace } from "@/components/nexus/AgentTrace";
import { CoordinatorBrief } from "@/components/nexus/CoordinatorBrief";
import { SourcesPanel } from "@/components/nexus/SourcesPanel";
import { WorklistSidebar } from "@/components/nexus/WorklistSidebar";
import { fetchCases, type CaseAction } from "@/components/nexus/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discharge Worklist — NexusCare AI" },
      {
        name: "description",
        content:
          "NexusCare AI console for Humana care management coordinators: risk-sorted discharge worklist, agent reasoning traces, grounded coordinator briefs, and outreach actions.",
      },
      { property: "og:title", content: "Discharge Worklist — NexusCare AI" },
      {
        property: "og:description",
        content:
          "AI-assisted discharge coordination for Humana care managers: risk scoring, clinical extraction, cited briefs, and one-click outreach actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NexusCareApp,
});

function NexusCareApp() {
  const {
    data: cases,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["demo-cases"], queryFn: fetchCases, staleTime: Infinity });

  const sorted = useMemo(
    () => (cases ? [...cases].sort((a, b) => b.risk_score - a.risk_score) : []),
    [cases],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [actions, setActions] = useState<Record<string, CaseAction>>({});
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const selected = sorted.find((c) => c.case_id === selectedId) ?? sorted[0];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading <span className="font-mono">demo_export.json</span>…
        </p>
      </div>
    );
  }

  if (isError || !selected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-6 text-center">
        <p className="text-sm font-semibold text-foreground">Could not load the demo dataset</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "demo_export.json is missing or invalid."}
        </p>
      </div>
    );
  }

  const message = drafts[selected.case_id] ?? selected.outreach_message;

  const handleApprove = () => {
    setActions((prev) => ({ ...prev, [selected.case_id]: "approved" }));
    toast.success("Outreach approved & sent", {
      description: `${selected.name} · ${selected.case_id} — message queued for delivery within the playbook SLA.`,
    });
  };

  const handleEscalate = () => {
    setActions((prev) => ({ ...prev, [selected.case_id]: "escalated" }));
    toast.error("Case escalated to supervisor", {
      description: `${selected.name} · ${selected.case_id} — full agent trace and critic notes attached for review.`,
    });
  };

  const handleEditMessage = () => {
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(message.length, message.length);
    }, 350);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden">
      {/* App header */}
      <header className="flex items-center gap-3 bg-header px-5 py-3 text-header-foreground">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Cross className="size-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold tracking-tight">NexusCare AI</p>
          <p className="text-[11px] text-header-foreground/70">
            Humana Care Management Console · Post-Discharge Coordination
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden rounded-full border border-header-foreground/25 px-2.5 py-1 text-[11px] font-medium text-header-foreground/80 sm:inline-flex">
            Demo dataset · no live backend
          </span>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              SP
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">Shailesh P.</p>
              <p className="text-[10px] text-header-foreground/70">Care Coordinator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Three-panel workspace */}
      <div className="flex flex-1 flex-col lg:grid lg:min-h-0 lg:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <WorklistSidebar
          cases={sorted}
          selectedId={selected.case_id}
          actions={actions}
          onSelect={setSelectedId}
        />

        <main className="min-w-0 space-y-5 p-5 lg:overflow-y-auto" key={selected.case_id}>
          <AgentTrace trace={selected.agent_trace} />
          <CoordinatorBrief
            record={selected}
            message={message}
            onMessageChange={(value) =>
              setDrafts((prev) => ({ ...prev, [selected.case_id]: value }))
            }
            textareaRef={textareaRef}
          />
        </main>

        <div className="lg:min-h-0 lg:overflow-y-auto">
          <SourcesPanel
            record={selected}
            action={actions[selected.case_id]}
            onApprove={handleApprove}
            onEditMessage={handleEditMessage}
            onEscalate={handleEscalate}
          />
        </div>
      </div>
    </div>
  );
}
