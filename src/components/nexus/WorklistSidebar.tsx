import { AlertTriangle, CheckCircle2, ClipboardList, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge, riskBarColor } from "./risk-badge";
import { riskLevel, type CaseAction, type CaseRecord } from "./types";

interface WorklistSidebarProps {
  cases: CaseRecord[];
  selectedId: string | undefined;
  actions: Record<string, CaseAction>;
  onSelect: (caseId: string) => void;
}

export function WorklistSidebar({ cases, selectedId, actions, onSelect }: WorklistSidebarProps) {
  const reviewCount = cases.filter((c) => c.requires_human_review).length;

  return (
    <aside className="flex flex-col border-r border-border bg-sidebar lg:overflow-y-auto">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Discharge Worklist
          </h2>
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {cases.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Sorted by 30-day readmission risk</p>
        {reviewCount > 0 && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-risk-medium-soft px-2 py-1 text-[11px] font-medium text-risk-medium-foreground">
            <ShieldAlert className="size-3" />
            {reviewCount} case{reviewCount === 1 ? "" : "s"} flagged for human review
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-2 p-3" aria-label="Discharge worklist">
        {cases.map((record) => {
          const level = riskLevel(record);
          const selected = record.case_id === selectedId;
          const action = actions[record.case_id];
          return (
            <button
              key={record.case_id}
              onClick={() => onSelect(record.case_id)}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-all",
                selected
                  ? "border-primary/40 bg-accent shadow-card ring-1 ring-primary/20"
                  : "border-transparent hover:border-border hover:bg-muted/60",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {record.name}
                </p>
                <span className="shrink-0 text-xs font-normal text-muted-foreground">
                  {record.age} y/o
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] break-all text-muted-foreground">
                {record.case_id}
              </p>
              <RiskBadge level={level} label={record.risk_tier} className="mt-2" />

              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", riskBarColor(level))}
                    style={{ width: `${Math.round(record.risk_score * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {record.risk_score.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {record.requires_human_review && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-risk-medium-foreground">
                    <AlertTriangle className="size-3" />
                    Human review
                  </span>
                )}
                {action === "approved" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
                    <CheckCircle2 className="size-3" />
                    Sent
                  </span>
                )}
                {action === "escalated" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-risk-high-soft px-2 py-0.5 text-[10px] font-semibold text-risk-high">
                    <ShieldAlert className="size-3" />
                    Escalated
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border px-5 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Demo dataset · <span className="font-mono">demo_export.json</span>
          <br />
          Real pipeline exports · no live backend calls
        </p>
      </div>
    </aside>
  );
}
