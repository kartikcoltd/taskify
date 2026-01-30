// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests tasks with point rewards based on a user-provided prompt describing their goals for the day.
 *
 * - suggestTasks - An async function that takes a prompt as input and returns a list of suggested tasks with point rewards.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The output type for the suggestTasks function, representing a list of tasks with descriptions and point values.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  prompt: z.string().describe('A description of the user\u2019s goals for the day.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.array(
  z.object({
    task: z.string().describe('A task suggested by the AI based on the prompt.'),
    points: z.number().describe('The point reward associated with completing the task.'),
  })
);
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const suggestTasksPrompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are a personal assistant that suggests daily tasks with point rewards.

  Based on the user's goals for the day, suggest tasks with point rewards. The point rewards should be between 10 and 100.

  Goals: {{{prompt}}}
  Tasks:`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await suggestTasksPrompt(input);
    return output!;
  }
);
