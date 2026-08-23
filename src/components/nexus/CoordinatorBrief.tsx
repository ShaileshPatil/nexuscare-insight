import type { RefObject } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  FlaskConical,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge, riskBarColor } from "./risk-badge";
import { riskLevel, type CaseRecord } from "./types";

interface CoordinatorBriefProps {
  record: CaseRecord;
  message: string;
  onMessageChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function CoordinatorBrief({
  record,
  message,
  onMessageChange,
  textareaRef,
}: CoordinatorBriefProps) {
  const level = riskLevel(record);
  const scorePct = Math.round(record.risk_score * 100);
  const redFlagCount = record.extracted_facts.filter((f) => f.red_flag).length;

  return (
    <div className="space-y-5">
      {/* Brief header */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
            Coordinator Brief — {record.name}
          </h2>
          <RiskBadge level={level} label={record.risk_tier} solid />
          {record.requires_human_review && (
            <span className="inline-flex items-center gap-1 rounded-full border border-risk-medium/40 bg-risk-medium-soft px-2.5 py-0.5 text-[11px] font-semibold text-risk-medium-foreground">
              <ShieldAlert className="size-3" />
              Human review required
            </span>
          )}
          <div className="ml-auto flex items-center gap-2.5">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              30-day risk
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", riskBarColor(level))}
                style={{ width: `${scorePct}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums text-card-foreground">
              {record.risk_score.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">{record.brief_text}</p>
      </section>

      {/* Factors + facts */}
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-up">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">Contributing Risk Factors</h3>
            <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
              {record.top_factors.length}
            </span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {record.top_factors.map((factor) => (
              <li key={factor} className="flex items-start gap-2.5 text-sm leading-snug">
                <CircleDot className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span className="text-card-foreground/90">{factor}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-up">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">Extracted Clinical Facts</h3>
            {redFlagCount > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-risk-high-soft px-2 py-0.5 text-[11px] font-semibold text-risk-high">
                <AlertTriangle className="size-3" />
                {redFlagCount} red flag{redFlagCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <dl className="mt-3 space-y-2">
            {record.extracted_facts.map((fact) => (
              <div
                key={fact.label}
                className={cn(
                  "rounded-md border px-3 py-2",
                  fact.red_flag
                    ? "border-risk-high/40 border-l-4 bg-risk-high-soft/60"
                    : "border-border bg-muted/40",
                )}
              >
                <dt
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase",
                    fact.red_flag ? "text-risk-high" : "text-muted-foreground",
                  )}
                >
                  {fact.red_flag && <AlertTriangle className="size-3" />}
                  {fact.label}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 text-sm leading-snug",
                    fact.red_flag ? "font-medium text-risk-high" : "text-card-foreground/90",
                  )}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Outreach message */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <MessageSquareText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Drafted Outreach Message</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            <Bot className="size-3" />
            AI draft · editable
          </span>
          <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
            {message.length} chars
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={7}
          className="mt-3 w-full resize-y rounded-lg border border-input bg-background p-3.5 text-sm leading-relaxed text-foreground shadow-inner transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          aria-label="Drafted outreach message"
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Edits stay local to this demo console — nothing is sent until you approve.
        </p>
      </section>

      {/* Automated QA */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <CheckCircle2 className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Automated Validation & Critic</h3>
          <span
            className={cn(
              "ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              record.validation_result.status === "passed"
                ? "bg-success-soft text-success"
                : "bg-risk-medium-soft text-risk-medium-foreground",
            )}
          >
            {record.validation_result.status === "passed" ? "All checks passed" : "Passed with warnings"}
          </span>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {record.validation_result.checks.map((check) => (
            <li
              key={check.name}
              title={check.detail}
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-xs",
                check.passed
                  ? "border-border bg-muted/40"
                  : "border-risk-medium/40 bg-risk-medium-soft/60",
              )}
            >
              {check.passed ? (
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
              ) : (
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-risk-medium" />
              )}
              <div>
                <p className="font-semibold text-card-foreground">{check.name}</p>
                <p className="mt-0.5 leading-snug text-muted-foreground">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
          <p className="text-xs">
            <span className="font-semibold text-card-foreground">
              Critic verdict: {record.critic_result.verdict}
            </span>
            <span className="ml-2 font-mono text-[11px] tabular-nums text-muted-foreground">
              score {record.critic_result.score.toFixed(2)}
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {record.critic_result.notes}
          </p>
        </div>
      </section>
    </div>
  );
}
