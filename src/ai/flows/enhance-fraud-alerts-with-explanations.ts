'use server';
/**
 * @fileOverview Enhances fraud alerts with human-readable explanations.
 *
 * - enhanceFraudAlert - A function that enhances fraud alerts with explanations.
 * - EnhanceFraudAlertInput - The input type for the enhanceFraudAlert function.
 * - EnhanceFraudAlertOutput - The return type for the enhanceFraudAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceFraudAlertInputSchema = z.object({
  transactionDetails: z
    .string()
    .describe('Details of the transaction, including amount, timestamp, and parties involved.'),
  userProfile: z
    .string()
    .describe('Information about the user associated with the transaction, including demographics and past behavior.'),
  anomalyScore: z.number().describe('The anomaly score of the transaction.'),
});
export type EnhanceFraudAlertInput = z.infer<typeof EnhanceFraudAlertInputSchema>;

const EnhanceFraudAlertOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed, human-readable explanation of why the transaction was flagged as potentially fraudulent. Reference specific data points from the transaction and user profile to support your analysis.'
    ),
  riskLevel: z.string().describe('The risk level associated with the transaction (e.g., low, medium, high).'),
});
export type EnhanceFraudAlertOutput = z.infer<typeof EnhanceFraudAlertOutputSchema>;

export async function enhanceFraudAlert(input: EnhanceFraudAlertInput): Promise<EnhanceFraudAlertOutput> {
  return enhanceFraudAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceFraudAlertPrompt',
  input: {schema: EnhanceFraudAlertInputSchema},
  output: {schema: EnhanceFraudAlertOutputSchema},
  prompt: `You are an expert fraud detection analyst. Given the following transaction details, user profile, and anomaly score, provide a detailed, human-readable explanation of why the transaction was flagged as potentially fraudulent. Also, determine a risk level (low, medium, high) based on your comprehensive analysis.

Transaction Details: {{{transactionDetails}}}
User Profile: {{{userProfile}}}
Anomaly Score: {{{anomalyScore}}}

**Explanation:**
- **Key Factors:** What are the top 3-5 factors contributing to the fraud risk? (e.g., unusual location, high transaction amount, new device)
- **Behavioral Analysis:** Does this transaction deviate from the user's typical behavior? If so, how?
- **Detailed Rationale:** Provide a step-by-step breakdown of your reasoning, connecting the data points to the final risk assessment.

**Risk Level:** (e.g., Low, Medium, High)
`,
});

const enhanceFraudAlertFlow = ai.defineFlow(
  {
    name: 'enhanceFraudAlertFlow',
    inputSchema: EnhanceFraudAlertInputSchema,
    outputSchema: EnhanceFraudAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
