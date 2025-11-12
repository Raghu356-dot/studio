'use server';

/**
 * @fileOverview A fraud pattern analysis AI agent.
 *
 * - analyzeTransaction - A function that handles the transaction analysis process.
 * - AnalyzeTransactionInput - The input type for the analyzeTransaction function.
 * - AnalyzeTransactionOutput - The return type for the analyzeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTransactionInputSchema = z.object({
  transactionData: z
    .string()
    .describe('Financial transaction data in JSON format.'),
});
export type AnalyzeTransactionInput = z.infer<typeof AnalyzeTransactionInputSchema>;

const AnalyzeTransactionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is likely fraudulent.'),
  fraudExplanation: z
    .string()
    .describe('Explanation of why the transaction is considered fraudulent.'),
  confidenceScore: z
    .number()
    .describe('Confidence score (0-1) indicating the likelihood of fraud.'),
});
export type AnalyzeTransactionOutput = z.infer<typeof AnalyzeTransactionOutputSchema>;

export async function analyzeTransaction(input: AnalyzeTransactionInput): Promise<AnalyzeTransactionOutput> {
  return analyzeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTransactionPrompt',
  input: {schema: AnalyzeTransactionInputSchema},
  output: {schema: AnalyzeTransactionOutputSchema},
  prompt: `You are an expert in fraud detection. Analyze the provided transaction data to identify potential fraud.

Transaction Data: {{{transactionData}}}

Based on the data, determine if the transaction is fraudulent, explain your reasoning, and provide a confidence score.
Set isFraudulent to true if fraud is detected, false otherwise.  The confidenceScore MUST be between 0 and 1.
`,
});

const analyzeTransactionFlow = ai.defineFlow(
  {
    name: 'analyzeTransactionFlow',
    inputSchema: AnalyzeTransactionInputSchema,
    outputSchema: AnalyzeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
