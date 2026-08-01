// cli/src/ui/output.ts
import chalk from 'chalk';
import Table from 'cli-table3';
import type { LinkedInPost, CaptionVariation } from '@postgen/shared';

export function printHeader(): void {
  console.log();
  console.log(chalk.bold.cyan('  ⚡ PostGen') + chalk.dim(' — AI-Powered LinkedIn Post Generator'));
  console.log(chalk.dim('  ─'.repeat(30)));
  console.log();
}

export function printVariation(variation: CaptionVariation, _index: number): void {
  console.log(chalk.bold.yellow(`\n── Variation ${variation.id} (${variation.angle}) ──`));
  console.log(chalk.dim(`   ${variation.charCount} chars\n`));
  console.log(variation.caption);
  console.log();
}

export function printPostSummary(post: LinkedInPost): void {
  const table = new Table({
    head: [chalk.cyan('Property'), chalk.cyan('Value')],
    style: { head: [], border: [] },
  });

  table.push(
    ['Project', post.projectContext.name],
    ['Variations', String(post.variations.length)],
    ['Read Time', post.estimatedReadTime],
    ['Generated', post.generatedAt],
  );

  if (post.templateCard) {
    table.push(['Card', `${post.templateCard.width}×${post.templateCard.height} PNG`]);
  }

  console.log(table.toString());
}

export function printSuccess(message: string): void {
  console.log(chalk.green(`\n✅ ${message}`));
}

export function printError(message: string): void {
  console.error(chalk.red(`\n❌ ${message}`));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow(`\n⚠️  ${message}`));
}
