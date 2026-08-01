// cli/src/commands/config.ts
import chalk from 'chalk';
import { setConfig, resetConfig, getConfigPath, listConfig } from '../config-manager.js';
import { printSuccess, printError, printHeader } from '../ui/output.js';
import type { PostGenConfig } from '@postgen/shared';

export function configSetCommand(key: string, value: string): void {
  const validKeys = ['provider', 'apiKey', 'model', 'baseUrl', 'imageProvider', 'imageModel'];
  if (!validKeys.includes(key)) {
    printError(`Invalid config key: ${key}. Valid keys: ${validKeys.join(', ')}`);
    process.exit(1);
  }
  setConfig(key as keyof PostGenConfig, value);
  printSuccess(`Set ${key} = ${key === 'apiKey' ? '***' + value.slice(-4) : value}`);
}

export function configListCommand(): void {
  printHeader();
  const config = listConfig();
  console.log(chalk.dim(`Config file: ${getConfigPath()}\n`));

  for (const [key, value] of Object.entries(config)) {
    const displayValue = key === 'apiKey' && typeof value === 'string'
      ? '***' + value.slice(-4)
      : String(value ?? chalk.dim('(not set)'));
    console.log(`  ${chalk.cyan(key)}: ${displayValue}`);
  }
  console.log();
}

export function configResetCommand(): void {
  resetConfig();
  printSuccess('Configuration reset to defaults');
}
