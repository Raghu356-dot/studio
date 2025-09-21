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
      'A summary of the correlation between the phishing email and the fraudulent transaction, including the likelihood of a connection and potential impact.'
    ),
  recommendedActions: z
    .string()
    .describe(
      'Recommended actions based on the correlation analysis, such as freezing accounts or initiating further investigation.'
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
  prompt: `You are a cybersecurity expert tasked with correlating phishing email events with fraudulent transactions.

  Analyze the provided information to determine the likelihood of a connection between the phishing email and the fraudulent transaction.  Assess the potential impact of the combined threat.

  Provide a concise summary of your findings and recommend actions to mitigate the threat.

  Email Analysis Report: {{{emailAnalysisReport}}}
  Transaction Details: {{{transactionDetails}}}

  Correlation Summary:
  Recommended Actions: `,
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
