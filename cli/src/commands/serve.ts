// cli/src/commands/serve.ts
import { printHeader } from '../ui/output.js';
import chalk from 'chalk';

interface ServeOptions {
  port?: number;
}

export async function serveCommand(options: ServeOptions): Promise<void> {
  printHeader();
  const port = options.port ?? 3000;

  console.log(chalk.cyan(`Starting PostGen Web UI on http://localhost:${port}`));
  console.log(chalk.dim('Press Ctrl+C to stop\n'));

  try {
    const { startWebServer } = await import('@postgen/web/server' as string);
    await startWebServer(port);
  } catch {
    console.log(chalk.yellow('Web UI not available directly in this build.'));
    console.log(chalk.dim('To run the Web UI, use `pnpm dev --filter=@postgen/web` or run `npx postgen generate ./your-project` for CLI usage.'));
  }
}
