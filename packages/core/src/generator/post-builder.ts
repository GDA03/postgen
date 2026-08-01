// packages/core/src/generator/post-builder.ts
import { generateObject } from 'ai';
import { z } from 'zod';
import type { LanguageModelV1 } from 'ai';
import type { ProjectContext, GenerationOptions, CaptionVariation, LinkedInPost } from '@postgen/shared';
import { estimateReadTime, LINKEDIN_MAX_CHARS } from '@postgen/shared';
import { buildCaptionPrompt } from './prompts.js';

const CaptionSchema = z.object({
  caption: z.string().describe('The full LinkedIn post caption text'),
  hook: z.string().describe('The first line / hook of the post (max 210 chars)'),
  hashtags: z.array(z.string()).describe('Array of hashtags with # prefix'),
});

export async function generateVariations(
  model: LanguageModelV1,
  context: ProjectContext,
  options: GenerationOptions,
): Promise<CaptionVariation[]> {
  const variationCount = Math.min(Math.max(options.variations, 1), 5);
  const angles = ['storytelling', 'technical', 'concise', 'business-impact', 'personal-journey'];
  const results: CaptionVariation[] = [];

  // Sequential execution to prevent hitting concurrent rate-limits on Free API tiers
  for (let i = 0; i < variationCount; i++) {
    const prompt = buildCaptionPrompt(context, options, i);

    try {
      const result = await generateObject({
        model,
        schema: CaptionSchema,
        prompt,
      });

      const output = result.object;
      if (!output) {
        throw new Error('AI returned no output');
      }

      const caption = output.caption.slice(0, LINKEDIN_MAX_CHARS);

      results.push({
        id: i + 1,
        caption,
        hook: output.hook,
        hashtags: output.hashtags,
        charCount: caption.length,
        angle: angles[i % angles.length],
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      let userFriendlyMsg = errMsg;

      if (errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate-limit') || errMsg.includes('429')) {
        userFriendlyMsg = `Quota or Rate Limit reached for this model. Try switching model to "gemini-1.5-flash" in Settings, or use 9Router / OpenAI.`;
      }

      results.push({
        id: i + 1,
        caption: `[Generation paused for variation ${i + 1}: ${userFriendlyMsg}]`,
        hook: '[Rate Limit / Quota Reached]',
        hashtags: [],
        charCount: 0,
        angle: angles[i % angles.length],
      });

      // Stop trying subsequent variations if quota is exhausted
      if (userFriendlyMsg.includes('Quota')) break;
    }
  }

  return results;
}

export function buildLinkedInPost(
  context: ProjectContext,
  variations: CaptionVariation[],
): LinkedInPost {
  const selectedVariation = 0;
  const selectedCaption = variations[selectedVariation]?.caption ?? '';

  return {
    projectContext: context,
    variations,
    selectedVariation,
    estimatedReadTime: estimateReadTime(selectedCaption),
    generatedAt: new Date().toISOString(),
  };
}
