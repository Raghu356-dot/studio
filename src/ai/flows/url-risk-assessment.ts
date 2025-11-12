'use server';

/**
 * @fileOverview URL Risk Assessment AI agent.
 *
 * - assessUrlRisk - A function that handles the URL risk assessment process.
 * - AssessUrlRiskInput - The input type for the assessUrlRisk function.
 * - AssessUrlRiskOutput - The return type for the assessUrlRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { addToBlocklist } from '@/app/actions';

const AssessUrlRiskInputSchema = z.object({
  url: z.string().url().describe('The URL to assess for risk.'),
});
export type AssessUrlRiskInput = z.infer<typeof AssessUrlRiskInputSchema>;

const AssessUrlRiskOutputSchema = z.object({
  riskLevel: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe('The risk level of the URL.'),
  reasoning: z.string().describe('The reasoning behind the risk assessment.'),
  isBlocked: z.boolean().describe('Whether the URL was automatically added to the blocklist.')
});
export type AssessUrlRiskOutput = z.infer<typeof AssessUrlRiskOutputSchema>;

const blockUrlTool = ai.defineTool(
    {
        name: 'blockUrl',
        description: 'Adds a URL to the blocklist. Use this for HIGH risk URLs.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({ success: z.boolean(), url: z.string() }),
    },
    async ({url}) => {
        return await addToBlocklist(url);
    }
)

export async function assessUrlRisk(input: AssessUrlRiskInput): Promise<AssessUrlRiskOutput> {
  const result = await assessUrlRiskFlow(input);
  let isBlocked = false;

  // Since we are now using the prompt directly, we get back a structured response with candidates.
  // We need to check for tool calls within those candidates.
  const toolRequest = result.candidates[0].toolRequests?.[0];

  if (toolRequest?.name === 'blockUrl' && toolRequest.input.url) {
    const toolResponse = await blockUrlTool(toolRequest.input);
    isBlocked = toolResponse.success;
  }
  
  const output = result.candidates[0].message.part.json;
  
  return {
    riskLevel: output.riskLevel,
    reasoning: output.reasoning,
    isBlocked: isBlocked
  };
}

const prompt = ai.definePrompt({
  name: 'assessUrlRiskPrompt',
  input: {schema: AssessUrlRiskInputSchema},
  output: {schema: AssessUrlRiskOutputSchema},
  tools: [blockUrlTool],
  prompt: `You are a cybersecurity expert assessing the risk of a given URL.

  Analyze the URL and provide a risk level (LOW, MEDIUM, or HIGH) and the reasoning behind your assessment.

  If the risk level is HIGH, you MUST use the blockUrl tool to add the URL to the blocklist.

  URL: {{{url}}}
  `,
});

const assessUrlRiskFlow = ai.defineFlow(
  {
    name: 'assessUrlRiskFlow',
    inputSchema: AssessUrlRiskInputSchema,
    // Note: The output is now the raw model response, which might include tool requests.
    // We are not using the AssessUrlRiskOutputSchema here directly.
  },
  async input => {
    // By calling the prompt directly, we get a structured request that genkit understands.
    const request = await prompt.render({input});

    // We then pass this structured request to ai.generate().
    const llmResponse = await ai.generate(request);

    return llmResponse;
  }
);
