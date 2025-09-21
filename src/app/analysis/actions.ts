'use server';

import { summarizeEmailContent } from '@/ai/flows/summarize-email-content';
import { enhanceFraudAlert } from '@/ai/flows/enhance-fraud-alerts-with-explanations';
import { correlatePhishingEmailAndFraudulentTransaction } from '@/ai/flows/correlate-phishing-email-and-fraudulent-transaction';

export async function analyzeEmailAction(emailContent: string) {
  try {
    const result = await summarizeEmailContent({ emailContent });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to analyze email.' };
  }
}

export async function analyzeFraudAction(
  transactionDetails: string,
  userProfile: string,
  anomalyScore: number
) {
  try {
    const result = await enhanceFraudAlert({
      transactionDetails,
      userProfile,
      anomalyScore,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to analyze transaction.' };
  }
}

export async function correlateThreatsAction(
  emailAnalysisReport: string,
  transactionDetails: string
) {
  try {
    const result = await correlatePhishingEmailAndFraudulentTransaction({
      emailAnalysisReport,
      transactionDetails,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to correlate threats.' };
  }
}
