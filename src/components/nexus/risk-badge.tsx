import { cn } from "@/lib/utils";
import type { RiskLevel } from "./types";

const SOFT_STYLES: Record<RiskLevel, string> = {
  high: "border-risk-high/30 bg-risk-high-soft text-risk-high",
  medium: "border-risk-medium/40 bg-risk-medium-soft text-risk-medium-foreground",
  low: "border-risk-low/30 bg-risk-low-soft text-risk-low",
};

const SOLID_STYLES: Record<RiskLevel, string> = {
  high: "border-transparent bg-risk-high text-risk-high-foreground",
  medium: "border-transparent bg-risk-medium text-risk-medium-foreground",
  low: "border-transparent bg-risk-low text-risk-low-foreground",
};

const DOT_STYLES: Record<RiskLevel, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
};

export function RiskBadge({
  level,
  label,
  solid = false,
  className,
}: {
  level: RiskLevel;
  label: string;
  solid?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        solid ? SOLID_STYLES[level] : SOFT_STYLES[level],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", solid ? "bg-current" : DOT_STYLES[level])} />
      {label}
    </span>
  );
}

export function riskBarColor(level: RiskLevel): string {
  return DOT_STYLES[level];
}
