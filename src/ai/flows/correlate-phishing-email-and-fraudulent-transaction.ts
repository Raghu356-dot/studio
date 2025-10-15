'use server';

/**
 * @fileOverview Correlates phishing email events with fraudulent transactions to understand the scope of an attack.
 *
 * - correlatePhishingEmailAndFraudulentTransaction - A function that handles the correlation process.
 * - CorrelatePhishingEmailAndFraudulentTransactionInput - The input type for the correlatePhishingEmailAndFraudulentTransaction function.
 * - CorrelatePhishingEmailAndFraudulentTransactionOutput - The return type for the correlatePhishingEmailAndFraudulentTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrelatePhishingEmailAndFraudulentTransactionInputSchema = z.object({
  emailAnalysisReport: z
    .string()
    .describe('The analysis report of the phishing email, including risk score and identified threats.'),
  transactionDetails: z
    .string()
    .describe('Details of the fraudulent transaction, including amount, timestamp, and involved accounts.'),
});
export type CorrelatePhishingEmailAndFraudulentTransactionInput = z.infer<
  typeof CorrelatePhishingEmailAndFraudulentTransactionInputSchema
>;

const CorrelatePhishingEmailAndFraudulentTransactionOutputSchema = z.object({
  correlationSummary: z
    .string()
    .describe(
      'A detailed summary of the correlation between the phishing email and the fraudulent transaction. Explain the likelihood of a connection, the evidence found, and the potential impact of the combined threat.'
    ),
  recommendedActions: z
    .string()
    .describe(
      'A comprehensive list of recommended actions based on the correlation analysis. Prioritize actions and provide clear, step-by-step instructions for mitigation, such as freezing accounts, blocking senders, or initiating a wider investigation.'
    ),
});
export type CorrelatePhishingEmailAndFraudulentTransactionOutput = z.infer<
  typeof CorrelatePhishingEmailAndFraudulentTransactionOutputSchema
>;

export async function correlatePhishingEmailAndFraudulentTransaction(
  input: CorrelatePhishingEmailAndFraudulentTransactionInput
): Promise<CorrelatePhishingEmailAndFraudulentTransactionOutput> {
  return correlatePhishingEmailAndFraudulentTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correlatePhishingEmailAndFraudulentTransactionPrompt',
  input: {schema: CorrelatePhishingEmailAndFraudulentTransactionInputSchema},
  output: {schema: CorrelatePhishingEmailAndFraudulentTransactionOutputSchema},
  prompt: `You are an expert cybersecurity investigator. Analyze the provided information to find a connection between a phishing email and a fraudulent transaction. Format your output using markdown.

  Email Analysis Report:
  {{{emailAnalysisReport}}}

  Fraudulent Transaction Details:
  {{{transactionDetails}}}

  For the **correlationSummary**, provide a short, structured summary including:
  - **Likelihood of Connection:** (e.g., High, Medium, Low)
  - **Supporting Evidence:** Use a bulleted list for 1-2 key pieces of evidence (e.g., matching timestamps).
  - **Potential Impact:** (e.g., financial loss, data breach)

  For the **recommendedActions**, list 2-3 clear, actionable steps in a bulleted list:
  - **Immediate:** (e.g., Freeze account, Block sender)
  - **Follow-up:** (e.g., Initiate wider investigation)
  `,
});

const correlatePhishingEmailAndFraudulentTransactionFlow = ai.defineFlow(
  {
    name: 'correlatePhishingEmailAndFraudulentTransactionFlow',
    inputSchema: CorrelatePhishingEmailAndFraudulentTransactionInputSchema,
    outputSchema: CorrelatePhishingEmailAndFraudulentTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
