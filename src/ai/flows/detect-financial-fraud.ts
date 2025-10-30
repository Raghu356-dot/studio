'use server';

/**
 * @fileOverview A fraud detection AI agent.
 *
 * - detectFinancialFraud - A function that handles the fraud detection process.
 * - DetectFinancialFraudInput - The input type for the detectFinancialFraud function.
 * - DetectFinancialFraudOutput - The return type for the detectFinancialFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFinancialFraudInputSchema = z.object({
  transactionData: z
    .string()
    .describe('Financial or transactional data to review for fraud.'),
});
export type DetectFinancialFraudInput = z.infer<typeof DetectFinancialFraudInputSchema>;

const DetectFinancialFraudOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether or not the transaction is fraudulent.'),
  confidenceScore: z
    .number()
    .describe('The confidence score of the fraud detection, from 0 to 1.'),
  explanation: z
    .string()
    .describe('Explanation of why the transaction is considered fraudulent.'),
});
export type DetectFinancialFraudOutput = z.infer<typeof DetectFinancialFraudOutputSchema>;

export async function detectFinancialFraud(
  input: DetectFinancialFraudInput
): Promise<DetectFinancialFraudOutput> {
  return detectFinancialFraudFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFinancialFraudPrompt',
  input: {schema: DetectFinancialFraudInputSchema},
  output: {schema: DetectFinancialFraudOutputSchema},
  prompt: `You are an expert in fraud detection.

You will review the provided financial or transactional data and determine if there are any signs of fraud or data manipulation.

Based on your analysis, you will determine whether the transaction is fraudulent and provide a confidence score (0 to 1) along with an explanation.

Financial Data: {{{transactionData}}}`,
});

const detectFinancialFraudFlow = ai.defineFlow(
  {
    name: 'detectFinancialFraudFlow',
    inputSchema: DetectFinancialFraudInputSchema,
    outputSchema: DetectFinancialFraudOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
