'use server';

/**
 * @fileOverview Analyzes app usage patterns and suggests apps to lock and for how long.
 *
 * - analyzeAppUsageAndSuggestLocking - A function that analyzes app usage and suggests locking.
 * - AnalyzeAppUsageAndSuggestLockingInput - The input type for the analyzeAppUsageAndSuggestLocking function.
 * - AnalyzeAppUsageAndSuggestLockingOutput - The return type for the analyzeAppUsageAndSuggestLocking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAppUsageAndSuggestLockingInputSchema = z.object({
  usageStats: z
    .string()
    .describe(
      'A JSON string containing the user app usage statistics. It should include app names and usage duration.'
    ),
  pointBalance: z
    .number()
    .describe('The current point balance of the user in the app.'),
  entertainmentAppList: z
    .string()
    .describe(
      'A JSON string of the names of entertainment applications on the user device'
    ),
});
export type AnalyzeAppUsageAndSuggestLockingInput = z.infer<
  typeof AnalyzeAppUsageAndSuggestLockingInputSchema
>;

const AnalyzeAppUsageAndSuggestLockingOutputSchema = z.object({
  appsToLock: z
    .array(z.string())
    .describe('An array of app names that should be locked.'),
  lockDurationMinutes: z
    .number()
    .describe(
      'The suggested duration in minutes for which the apps should be locked.'
    ),
  reasoning: z
    .string()
    .describe(
      'The detailed reasoning behind the app locking suggestions, considering usage patterns and point balance.'
    ),
});
export type AnalyzeAppUsageAndSuggestLockingOutput = z.infer<
  typeof AnalyzeAppUsageAndSuggestLockingOutputSchema
>;

export async function analyzeAppUsageAndSuggestLocking(
  input: AnalyzeAppUsageAndSuggestLockingInput
): Promise<AnalyzeAppUsageAndSuggestLockingOutput> {
  return analyzeAppUsageAndSuggestLockingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAppUsageAndSuggestLockingPrompt',
  input: {schema: AnalyzeAppUsageAndSuggestLockingInputSchema},
  output: {schema: AnalyzeAppUsageAndSuggestLockingOutputSchema},
  prompt: `You are an AI assistant that analyzes app usage patterns and suggests which apps to lock to help users manage their time effectively.

Analyze the provided app usage statistics, current point balance, and list of entertainment apps to recommend which apps to lock and for how long.

App Usage Statistics: {{{usageStats}}}
Current Point Balance: {{{pointBalance}}}
Entertainment App List: {{{entertainmentAppList}}}

Consider the following:
- Apps with high usage duration that are in the entertainment app list are prime candidates for locking.
- The lock duration should be reasonable based on the user's point balance, as unlocking requires points.
- Provide clear reasoning for the suggested apps to lock and the lock duration.

Output should be structured as follows:
{
  "appsToLock": ["App1", "App2"],
  "lockDurationMinutes": 30,
  "reasoning": "Based on your usage, App1 and App2 are highly used entertainment apps. Locking them for 30 minutes can help reduce distraction."
}
`,
});

const analyzeAppUsageAndSuggestLockingFlow = ai.defineFlow(
  {
    name: 'analyzeAppUsageAndSuggestLockingFlow',
    inputSchema: AnalyzeAppUsageAndSuggestLockingInputSchema,
    outputSchema: AnalyzeAppUsageAndSuggestLockingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
