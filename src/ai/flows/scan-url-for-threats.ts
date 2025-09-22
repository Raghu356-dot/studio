'use server';

/**
 * @fileOverview Scans a URL for potential threats like phishing and malware.
 *
 * - scanUrlForThreats - A function that handles the URL scanning process.
 * - ScanUrlForThreatsInput - The input type for the scanUrlForThreats function.
 * - ScanUrlForThreatsOutput - The return type for the scanUrlForThreats function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanUrlForThreatsInputSchema = z.object({
  url: z.string().url().describe('The URL to scan for threats.'),
});
export type ScanUrlForThreatsInput = z.infer<typeof ScanUrlForThreatsInputSchema>;

const ScanUrlForThreatsOutputSchema = z.object({
  isMalicious: z
    .boolean()
    .describe('Whether the URL is considered malicious or not.'),
  threatType: z
    .string()
    .describe(
      'The type of threat detected (e.g., Phishing, Malware, Benign).'
    ),
  summary: z
    .string()
    .describe(
      'A detailed summary of the findings from the URL scan, explaining the reasoning and specific red flags identified.'
    ),
});
export type ScanUrlForThreatsOutput = z.infer<typeof ScanUrlForThreatsOutputSchema>;

export async function scanUrlForThreats(
  input: ScanUrlForThreatsInput
): Promise<ScanUrlForThreatsOutput> {
  return scanUrlForThreatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanUrlForThreatsPrompt',
  input: {schema: ScanUrlForThreatsInputSchema},
  output: {schema: ScanUrlForThreatsOutputSchema},
  prompt: `You are a cybersecurity analyst specializing in web security. Analyze the provided URL and determine if it poses a threat.

  URL to Analyze: {{{url}}}

  Carefully examine the URL for the following red flags:
  1.  **Domain & TLD Analysis:** Is the domain trying to impersonate a known brand? Is the Top-Level Domain (TLD) unusual or commonly associated with malicious activity (e.g., .xyz, .club, .top)?
  2.  **Subdomain Analysis:** Look for misleading subdomains (e.g., 'paypal.secure-login.com' instead of 'paypal.com').
  3.  **Character & Path Analysis:** Check for character substitution (e.g., 'g00gle.com'), excessively long paths, or random-looking strings in the URL structure.
  4.  **Hypothesized Content:** Based on the URL structure, what is the likely purpose of this page (e.g., login form, marketing page, file download)?

  Based on your analysis:
  - If you find strong indicators of malicious intent, set isMalicious to true and specify the threatType (e.g., "Phishing", "Malware", "Scam").
  - If the URL appears safe, set isMalicious to false and set the threatType to "Benign".
  - Provide a detailed summary explaining your reasoning. Reference the specific red flags you identified (or lack thereof) and explain how they contribute to your conclusion.
  `,
});

const scanUrlForThreatsFlow = ai.defineFlow(
  {
    name: 'scanUrlForThreatsFlow',
    inputSchema: ScanUrlForThreatsInputSchema,
    outputSchema: ScanUrlForThreatsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
