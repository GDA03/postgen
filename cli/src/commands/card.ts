// cli/src/commands/card.ts
import path from 'path';
import fs from 'fs/promises';
import { scanProject, generateCard, getAvailableTemplates } from '@postgen/core';
import { createSpinner } from '../ui/spinner.js';
import { printHeader, printSuccess, printError } from '../ui/output.js';

interface CardCommandOptions {
  template?: string;
  output?: string;
  package?: string;
}

export async function cardCommand(
  projectPath: string,
  cmdOptions: CardCommandOptions,
): Promise<void> {
  printHeader();

  const resolvedPath = path.resolve(projectPath);
  const templateName = cmdOptions.template ?? 'modern-dark';

  const available = getAvailableTemplates();
  if (!available.includes(templateName)) {
    printError(`Unknown template: ${templateName}. Available: ${available.join(', ')}`);
    process.exit(1);
  }

  const scanSpinner = createSpinner('Scanning project...');
  scanSpinner.start();
  const context = await scanProject(resolvedPath, { package: cmdOptions.package });
  scanSpinner.succeed(`Scanned: ${context.name}`);

  const cardSpinner = createSpinner(`Generating ${templateName} card...`);
  cardSpinner.start();
  const card = await generateCard(context, templateName);

  const outputDir = cmdOptions.output ?? '.';
  const cardPath = path.join(outputDir, `${context.name}-linkedin-card.png`);
  await fs.writeFile(cardPath, card.imageBuffer);
  cardSpinner.succeed(`Card saved: ${cardPath} (${card.width}×${card.height})`);

  printSuccess('Template card generated!');
}
