// packages/core/src/cards/index.ts
import type { ProjectContext, TemplateCardOutput } from '@postgen/shared';
import { modernDarkTemplate } from './templates/modern-dark.js';
import { minimalTemplate } from './templates/minimal.js';
import { renderToPng } from './renderer.js';

const TEMPLATES: Record<string, (ctx: ProjectContext) => unknown> = {
  'modern-dark': modernDarkTemplate,
  'minimal': minimalTemplate,
};

export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATES);
}

export async function generateCard(
  context: ProjectContext,
  templateName: string = 'modern-dark',
): Promise<TemplateCardOutput> {
  const templateFn = TEMPLATES[templateName];
  if (!templateFn) {
    throw new Error(
      `Unknown template: ${templateName}. Available: ${Object.keys(TEMPLATES).join(', ')}`,
    );
  }

  const element = templateFn(context);
  return renderToPng(element);
}

export { modernDarkTemplate } from './templates/modern-dark.js';
export { minimalTemplate } from './templates/minimal.js';
