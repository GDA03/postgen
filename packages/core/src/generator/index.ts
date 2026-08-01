// packages/core/src/generator/index.ts
import type { PostGenConfig, ProjectContext, GenerationOptions, LinkedInPost } from '@postgen/shared';
import { createModel } from '@postgen/ai';
import { generateVariations, buildLinkedInPost } from './post-builder.js';

export async function generatePost(
  context: ProjectContext,
  config: PostGenConfig,
  options: GenerationOptions,
): Promise<LinkedInPost> {
  const model = createModel(config);
  const variations = await generateVariations(model, context, options);
  return buildLinkedInPost(context, variations);
}

export { buildCaptionPrompt } from './prompts.js';
export { generateVariations, buildLinkedInPost } from './post-builder.js';
