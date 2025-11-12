"use server";

import { analyzeEmail, type EmailAnalysisInput } from "@/ai/flows/email-analysis-flow";
import { assessUrlRisk, type AssessUrlRiskInput } from "@/ai/flows/url-risk-assessment";
import { analyzeTransaction, type AnalyzeTransactionInput } from "@/ai/flows/fraud-pattern-analysis";
import { correlateIncidentsAndAlert, type IncidentCorrelationInput } from "@/ai/flows/incident-correlation-and-alerting";
import { analyzeFile, type MalwareAnalysisInput } from "@/ai/flows/malware-analysis-flow";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

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

export async function analyzeFileAction(input: MalwareAnalysisInput) {
    return await analyzeFile(input);
}

export async function addToBlocklist(url: string) {
    console.log(`BLOCKING URL: ${url}`);
    const firebase = initializeFirebase();
    if (!firebase) {
      throw new Error("Firebase not initialized");
    }
    await addDoc(collection(firebase.firestore, "blocklist"), {
      url,
      reason: "High risk URL detected by AI agent",
      timestamp: serverTimestamp(),
    });
    return { success: true, url };
  }