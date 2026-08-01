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

  const promises = Array.from({ length: variationCount }, async (_, i) => {
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

      return {
        id: i + 1,
        caption,
        hook: output.hook,
        hashtags: output.hashtags,
        charCount: caption.length,
        angle: angles[i % angles.length],
      } satisfies CaptionVariation;
    } catch (error) {
      return {
        id: i + 1,
        caption: `[Generation failed for variation ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}]`,
        hook: '[Error]',
        hashtags: [],
        charCount: 0,
        angle: angles[i % angles.length],
      } satisfies CaptionVariation;
    }
  });

  return Promise.all(promises);
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
