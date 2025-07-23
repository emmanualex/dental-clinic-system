'use server';

/**
 * @fileOverview A dental symptom checker AI agent.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('The dental symptoms reported by the patient.'),
  dentalKnowledge: z.string().describe('The dental knowledge for suggesting potential issues.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  potentialIssues: z.string().describe('The potential dental issues suggested by the AI based on the symptoms and dental knowledge.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a helpful AI assistant specialized in suggesting potential dental issues based on patient-provided symptoms and a library of dental knowledge.

  Symptoms: {{{symptoms}}}
  Dental Knowledge: {{{dentalKnowledge}}}

  Based on the symptoms and dental knowledge, suggest potential dental issues.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
