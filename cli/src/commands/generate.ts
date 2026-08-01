// cli/src/commands/generate.ts
import path from 'path';
import fs from 'fs/promises';
import { scanProject, generatePost, generateCard } from '@postgen/core';
import type { GenerationOptions, Tone, PostLength, Language, Focus } from '@postgen/shared';
import { DEFAULT_GENERATION_OPTIONS } from '@postgen/shared';
import { getConfig } from '../config-manager.js';
import { createSpinner } from '../ui/spinner.js';
import { printHeader, printVariation, printPostSummary, printSuccess, printError, printWarning } from '../ui/output.js';
import clipboard from 'clipboardy';

interface GenerateCommandOptions {
  tone?: Tone;
  length?: PostLength;
  lang?: Language;
  focus?: Focus;
  variations?: number;
  textOnly?: boolean;
  template?: string;
  package?: string;
  output?: string;
}

export async function generateCommand(
  projectPath: string,
  cmdOptions: GenerateCommandOptions,
): Promise<void> {
  printHeader();

  const config = getConfig();
  if (!config.apiKey) {
    printError('API key not configured. Run: postgen config set apiKey <your-key>');
    printWarning('Also set your provider: postgen config set provider <gemini|openai|anthropic|openrouter>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(projectPath);

  const scanSpinner = createSpinner('Scanning project...');
  scanSpinner.start();

  let context;
  try {
    context = await scanProject(resolvedPath, { package: cmdOptions.package });
    scanSpinner.succeed(`Scanned: ${context.name} (${context.structure.totalFiles} files, ${context.languages.length} languages)`);
  } catch (error) {
    scanSpinner.fail('Failed to scan project');
    printError(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  const options: GenerationOptions = {
    ...DEFAULT_GENERATION_OPTIONS,
    tone: cmdOptions.tone ?? DEFAULT_GENERATION_OPTIONS.tone,
    length: cmdOptions.length ?? DEFAULT_GENERATION_OPTIONS.length,
    language: cmdOptions.lang ?? DEFAULT_GENERATION_OPTIONS.language,
    focus: cmdOptions.focus ?? DEFAULT_GENERATION_OPTIONS.focus,
    variations: cmdOptions.variations ?? DEFAULT_GENERATION_OPTIONS.variations,
    includeTemplateCard: !cmdOptions.textOnly,
    includeAiImage: false,
    templateName: cmdOptions.template,
  };

  const genSpinner = createSpinner(`Generating ${options.variations} caption variation(s)...`);
  genSpinner.start();

  let post;
  try {
    post = await generatePost(context, config, options);
    genSpinner.succeed(`Generated ${post.variations.length} variation(s)`);
  } catch (error) {
    genSpinner.fail('Failed to generate captions');
    printError(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  for (const variation of post.variations) {
    printVariation(variation, variation.id);
  }

  if (!cmdOptions.textOnly) {
    const cardSpinner = createSpinner('Generating template card...');
    cardSpinner.start();

    try {
      const card = await generateCard(context, cmdOptions.template ?? 'modern-dark');
      post.templateCard = card;

      const outputDir = cmdOptions.output ?? '.';
      const cardPath = path.join(outputDir, `${context.name}-linkedin-card.png`);
      await fs.writeFile(cardPath, card.imageBuffer);
      cardSpinner.succeed(`Card saved: ${cardPath}`);
    } catch (error) {
      cardSpinner.fail(`Card generation failed (continuing without card): ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  try {
    await clipboard.write(post.variations[0].caption);
    printSuccess('Variation 1 copied to clipboard! Paste it into LinkedIn.');
  } catch {
    printWarning('Could not copy to clipboard. Copy manually from above.');
  }

  printPostSummary(post);
}
