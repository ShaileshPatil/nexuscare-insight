import { useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  Gauge,
  Loader2,
  PenLine,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TraceNode } from "./types";

type StepStatus = "pending" | "active" | "done";

const STEP_ICONS = [Gauge, ScanSearch, PenLine, ShieldCheck, CalendarClock];

const STATUS_CHIP: Record<StepStatus, { label: string; className: string }> = {
  pending: {
    label: "Queued",
    className: "bg-muted text-muted-foreground",
  },
  active: {
    label: "Running",
    className: "bg-accent text-accent-foreground",
  },
  done: {
    label: "Done",
    className: "bg-success-soft text-success",
  },
};

export function AgentTrace({ trace }: { trace: TraceNode[] }) {
  const [statuses, setStatuses] = useState<StepStatus[]>(() => trace.map(() => "pending"));
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setStatuses(trace.map(() => "pending"));
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 350;
    trace.forEach((step, i) => {
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => prev.map((s, j) => (j === i ? "active" : s)));
        }, elapsed),
      );
      elapsed += Math.min(550 + step.latency_ms * 0.28, 1600);
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => prev.map((s, j) => (j === i ? "done" : s)));
        }, elapsed),
      );
      elapsed += 160;
    });
    return () => timers.forEach(clearTimeout);
  }, [trace, runId]);

  const allDone = statuses.length > 0 && statuses.every((s) => s === "done");

  return (
    <section aria-label="Agent reasoning trace" className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-card-foreground">
            Agent Reasoning Trace
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Five-node pipeline · timings from the recorded export
          </p>
        </div>
        <button
          onClick={() => setRunId((n) => n + 1)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Replay trace
        </button>
      </div>

      <ol className="mt-5 flex items-start gap-0">
        {trace.map((step, i) => {
          const status = statuses[i] ?? "pending";
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          const chip = STATUS_CHIP[status];
          return (
            <li key={step.node} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    status === "done" && "border-success bg-success text-success-foreground",
                    status === "active" && "border-primary bg-accent text-primary",
                    status === "pending" && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {status === "done" ? (
                    <Check className="size-5 animate-pop-in" strokeWidth={3} />
                  ) : status === "active" ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-4.5" />
                  )}
                </div>
                <p className="mt-2 w-full truncate px-1 text-xs font-semibold text-card-foreground">
                  {step.node}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
                    chip.className,
                    status === "active" && "animate-pulse",
                  )}
                >
                  {status === "done" && <Check className="size-2.5" strokeWidth={3} />}
                  {chip.label}
                </span>
                <p
                  className={cn(
                    "mt-1.5 line-clamp-3 w-full px-1 text-[11px] leading-snug text-muted-foreground transition-opacity duration-500",
                    status === "done" ? "opacity-100" : "opacity-40",
                  )}
                >
                  {step.decision}
                </p>
                <span className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground/80">
                  {(step.latency_ms / 1000).toFixed(2)}s
                </span>
              </div>
              {i < trace.length - 1 && (
                <div
                  aria-hidden
                  className={cn(
                    "mt-5 h-0.5 w-6 shrink-0 rounded-full transition-colors duration-500 sm:w-8",
                    status === "done" ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div
        className={cn(
          "mt-4 rounded-md px-3 py-2 text-center text-xs font-medium transition-all duration-500",
          allDone
            ? "bg-success-soft text-success opacity-100"
            : "bg-muted text-muted-foreground opacity-70",
        )}
      >
        {allDone
          ? "Pipeline complete — brief, outreach draft, and proposed schedule ready for coordinator review."
          : "Replaying recorded agent trace for this case…"}
      </div>
    </section>
  );
}
