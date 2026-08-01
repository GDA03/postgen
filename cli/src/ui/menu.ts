// cli/src/ui/menu.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getAvailableTemplates } from '@postgen/core';
import { generateCommand } from '../commands/generate.js';
import { cardCommand } from '../commands/card.js';
import { serveCommand } from '../commands/serve.js';
import { configListCommand, configSetCommand } from '../commands/config.js';
import { printHeader } from './output.js';

export async function showInteractiveMenu(): Promise<void> {
  printHeader();

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🚀 Generate LinkedIn Post (Caption + Card)', value: 'generate' },
        { name: '🖼️  Generate Card Image Only', value: 'card' },
        { name: '🌐 Launch Local Web Dashboard', value: 'serve' },
        { name: '⚙️  Manage AI Provider & Config', value: 'config' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'generate': {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectPath',
          message: 'Enter path to your project directory:',
          default: '.',
        },
        {
          type: 'list',
          name: 'tone',
          message: 'Select post tone:',
          choices: ['professional', 'casual', 'technical', 'storytelling'],
          default: 'professional',
        },
        {
          type: 'list',
          name: 'length',
          message: 'Select post length:',
          choices: ['short', 'medium', 'long'],
          default: 'medium',
        },
        {
          type: 'list',
          name: 'lang',
          message: 'Select post language:',
          choices: [
            { name: 'English', value: 'en' },
            { name: 'Indonesian (Bahasa)', value: 'id' },
            { name: 'Auto-detect', value: 'auto' },
          ],
          default: 'en',
        },
        {
          type: 'number',
          name: 'variations',
          message: 'Number of caption variations (1-5):',
          default: 3,
        },
        {
          type: 'list',
          name: 'template',
          message: 'Select card template:',
          choices: getAvailableTemplates(),
          default: 'modern-dark',
        },
      ]);

      await generateCommand(answers.projectPath, {
        tone: answers.tone,
        length: answers.length,
        lang: answers.lang,
        variations: answers.variations,
        template: answers.template,
      });
      break;
    }

    case 'card': {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectPath',
          message: 'Enter path to your project directory:',
          default: '.',
        },
        {
          type: 'list',
          name: 'template',
          message: 'Select card template:',
          choices: getAvailableTemplates(),
          default: 'modern-dark',
        },
      ]);

      await cardCommand(answers.projectPath, { template: answers.template });
      break;
    }

    case 'serve': {
      await serveCommand();
      break;
    }

    case 'config': {
      const configAction = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Config options:',
          choices: [
            { name: '📋 View current config', value: 'list' },
            { name: '🔑 Set API Key / Provider', value: 'set' },
          ],
        },
      ]);

      if (configAction.choice === 'list') {
        configListCommand();
      } else {
        const setAnswers = await inquirer.prompt([
          {
            type: 'list',
            name: 'provider',
            message: 'Select AI Provider:',
            choices: ['gemini', 'openai', 'anthropic', 'openrouter', 'custom'],
          },
          {
            type: 'password',
            name: 'apiKey',
            message: 'Enter API Key:',
          },
          {
            type: 'input',
            name: 'model',
            message: 'Model override (optional, press enter to skip):',
          },
        ]);

        configSetCommand('provider', setAnswers.provider);
        configSetCommand('apiKey', setAnswers.apiKey);
        if (setAnswers.model?.trim()) {
          configSetCommand('model', setAnswers.model.trim());
        }
      }
      break;
    }

    case 'exit':
    default:
      console.log(chalk.dim('Goodbye!'));
      process.exit(0);
  }
}
