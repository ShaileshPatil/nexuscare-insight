export interface ExtractedFact {
  label: string;
  value: string;
  red_flag?: boolean;
}

export interface Citation {
  claim: string;
  source: string;
  excerpt: string;
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  detail: string;
}

export interface ValidationResult {
  status: string;
  checks: ValidationCheck[];
}

export interface CriticResult {
  score: number;
  verdict: string;
  notes: string;
}

export interface TraceNode {
  node: string;
  decision: string;
  latency_ms: number;
}

export interface CaseRecord {
  case_id: string;
  name: string;
  age: number;
  risk_tier: string;
  risk_score: number;
  top_factors: string[];
  extracted_facts: ExtractedFact[];
  retrieved_citations: Citation[];
  brief_text: string;
  outreach_message: string;
  validation_result: ValidationResult;
  critic_result: CriticResult;
  requires_human_review: boolean;
  agent_trace: TraceNode[];
}

export type RiskLevel = "high" | "medium" | "low";

export function riskLevel(record: CaseRecord): RiskLevel {
  const tier = record.risk_tier.toLowerCase();
  if (tier.startsWith("high")) return "high";
  if (tier.startsWith("medium")) return "medium";
  return "low";
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export type CaseAction = "approved" | "escalated";

export async function fetchCases(): Promise<CaseRecord[]> {
  const res = await fetch("/demo_export.json");
  if (!res.ok) throw new Error(`Failed to load demo_export.json (${res.status})`);
  return (await res.json()) as CaseRecord[];
}
