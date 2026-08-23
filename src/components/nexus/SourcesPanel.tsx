import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Check,
  FileText,
  Link2,
  PencilLine,
  Send,
  ShieldAlert,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { riskLevel, type CaseAction, type CaseRecord, type RiskLevel } from "./types";

const CADENCE: Record<RiskLevel, string> = {
  high: "High-risk protocol · within 7 days",
  medium: "Medium-risk protocol · within 14 days",
  low: "Low-risk protocol · routine window",
};

interface SourcesPanelProps {
  record: CaseRecord;
  action: CaseAction | undefined;
  onApprove: () => void;
  onEditMessage: () => void;
  onEscalate: () => void;
}

export function SourcesPanel({
  record,
  action,
  onApprove,
  onEditMessage,
  onEscalate,
}: SourcesPanelProps) {
  const level = riskLevel(record);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const scheduling = record.agent_trace.find((n) => n.node === "Scheduling");

  return (
    <aside className="flex flex-col gap-5 border-l border-border bg-card p-5 lg:overflow-y-auto">
      {/* Sources & citations */}
      <section>
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Sources & Citations</h3>
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            {record.retrieved_citations.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Every brief claim is grounded in a playbook excerpt or the discharge summary.
        </p>
        <Accordion type="single" collapsible className="mt-3 space-y-2">
          {record.retrieved_citations.map((citation, i) => {
            const isDischarge = citation.source.toLowerCase().includes("discharge summary");
            const SourceIcon = isDischarge ? FileText : BookOpen;
            return (
              <AccordionItem
                key={citation.claim}
                value={`citation-${i}`}
                className="rounded-lg border border-border bg-background px-3 shadow-card"
              >
                <AccordionTrigger className="py-3 text-left hover:no-underline">
                  <span className="flex items-start gap-2 pr-2 text-xs leading-snug font-medium text-card-foreground">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded bg-accent text-[10px] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    {citation.claim}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="ml-6 space-y-2">
                    <p className="flex items-start gap-1.5 text-[11px] font-semibold text-primary">
                      <SourceIcon className="mt-0.5 size-3 shrink-0" />
                      {citation.source}
                    </p>
                    <blockquote className="border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground italic">
                      “{citation.excerpt}”
                    </blockquote>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Proposed appointment */}
      {scheduling && (
        <section className="rounded-xl border border-primary/25 bg-accent/40 p-4 shadow-card">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">Proposed Follow-Up</h3>
          </div>
          <span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-secondary-foreground uppercase">
            {CADENCE[level]}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-card-foreground/90">
            {scheduling.decision}
          </p>
        </section>
      )}

      {/* Actions */}
      <section className="rounded-xl border border-border bg-background p-4 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground">Coordinator Actions</h3>

        {action === "approved" && (
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-success-soft px-2.5 py-1.5 text-xs font-semibold text-success">
            <Check className="size-3.5" strokeWidth={3} />
            Approved & queued for delivery
          </p>
        )}
        {action === "escalated" && (
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-risk-high-soft px-2.5 py-1.5 text-xs font-semibold text-risk-high">
            <ShieldAlert className="size-3.5" />
            Escalated to supervisor
          </p>
        )}

        <div className="mt-3 flex flex-col gap-2">
          <Button
            onClick={onApprove}
            disabled={action === "approved"}
            className={cn(
              "w-full justify-start gap-2 bg-success text-success-foreground shadow-card",
              "hover:bg-success/90 disabled:opacity-60",
            )}
          >
            <Send className="size-4" />
            Approve & Send
          </Button>

          <Button
            variant="outline"
            onClick={onEditMessage}
            className="w-full justify-start gap-2 border-primary/40 text-primary hover:bg-accent hover:text-accent-foreground"
          >
            <PencilLine className="size-4" />
            Edit Message
          </Button>

          <AlertDialog open={escalateOpen} onOpenChange={setEscalateOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-destructive/40 text-destructive hover:bg-risk-high-soft hover:text-destructive"
              >
                <ShieldAlert className="size-4" />
                Escalate to Supervisor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-5 text-destructive" />
                  Escalate this case?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Case <span className="font-mono font-semibold">{record.case_id}</span> (
                  {record.name}, {record.age}) will be routed to the on-call supervisor with the
                  full agent trace, validation results, and critic notes attached. This pauses the
                  outreach SLA clock for this case.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onEscalate();
                    setEscalateOpen(false);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm escalation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Actions are simulated in this demo — no messages are transmitted and no backend is
          called.
        </p>
      </section>
    </aside>
  );
}
