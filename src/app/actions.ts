"use server";

import { analyzeEmail, type EmailAnalysisInput } from "@/ai/flows/email-analysis-flow";
import { assessUrlRisk, type AssessUrlRiskInput } from "@/ai/flows/url-risk-assessment";
import { analyzeTransaction, type AnalyzeTransactionInput } from "@/ai/flows/fraud-pattern-analysis";
import { correlateIncidentsAndAlert, type IncidentCorrelationInput } from "@/ai/flows/incident-correlation-and-alerting";

export async function analyzeEmailAction(input: EmailAnalysisInput) {
  return await analyzeEmail(input);
}

export async function assessUrlRiskAction(input: AssessUrlRiskInput) {
  return await assessUrlRisk(input);
}

export async function analyzeTransactionAction(input: AnalyzeTransactionInput) {
  return await analyzeTransaction(input);
}

export async function correlateIncidentsAction(input: IncidentCorrelationInput) {
  return await correlateIncidentsAndAlert(input);
}
