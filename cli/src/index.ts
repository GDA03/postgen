// cli/src/index.ts
import { Command } from 'commander';
import { generateCommand } from './commands/generate.js';
import { cardCommand } from './commands/card.js';
import { configSetCommand, configListCommand, configResetCommand } from './commands/config.js';
import { serveCommand } from './commands/serve.js';

const program = new Command();

program
  .name('postgen')
  .description('AI-powered LinkedIn post generator from your project directory')
  .version('0.1.0');

program
  .command('generate')
  .alias('gen')
  .description('Generate a LinkedIn post from a project directory')
  .argument('<path>', 'Path to the project directory')
  .option('--tone <tone>', 'Post tone: professional, casual, technical, storytelling', 'professional')
  .option('--length <length>', 'Post length: short, medium, long', 'medium')
  .option('--lang <language>', 'Post language: en, id, auto', 'en')
  .option('--focus <focus>', 'Post focus: technical, business, personal', 'technical')
  .option('--variations <count>', 'Number of caption variations (1-5)', '3')
  .option('--text-only', 'Generate caption only (no image)')
  .option('--template <name>', 'Card template name', 'modern-dark')
  .option('--package <path>', 'Specific package in monorepo to scan')
  .option('-o, --output <dir>', 'Output directory for generated files', '.')
  .action((projectPath, options) => {
    generateCommand(projectPath, {
      ...options,
      variations: parseInt(options.variations, 10),
    });
  });

program
  .command('card')
  .description('Generate only a template card image')
  .argument('<path>', 'Path to the project directory')
  .option('--template <name>', 'Card template name', 'modern-dark')
  .option('--package <path>', 'Specific package in monorepo')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(cardCommand);

const configCmd = program
  .command('config')
  .description('Manage PostGen configuration');

configCmd
  .command('set')
  .description('Set a config value')
  .argument('<key>', 'Config key (provider, apiKey, model, baseUrl)')
  .argument('<value>', 'Config value')
  .action(configSetCommand);

configCmd
  .command('list')
  .description('List all config values')
  .action(configListCommand);

configCmd
  .command('reset')
  .description('Reset config to defaults')
  .action(configResetCommand);

program
  .command('serve')
  .description('Start the PostGen web dashboard')
  .option('-p, --port <port>', 'Port number', '3000')
  .action((options) => serveCommand({ port: parseInt(options.port, 10) }));

program
  .argument('[path]', 'Project path (shortcut for generate)')
  .action((projectPath) => {
    if (projectPath) {
      generateCommand(projectPath, { variations: 3 });
    } else {
      program.help();
    }
  });

program.parse();
