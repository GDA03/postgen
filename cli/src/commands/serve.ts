// cli/src/commands/serve.ts
import chalk from 'chalk';
import { spawn } from 'child_process';
import { printHeader, printError, printSuccess } from '../ui/output.js';
import { createSpinner } from '../ui/spinner.js';
import { findAvailablePort, openBrowser, findWebDir } from '../utils/server.js';

interface ServeOptions {
  port?: number;
}

export async function serveCommand(options: ServeOptions = {}): Promise<void> {
  printHeader();

  const webDir = findWebDir();
  if (!webDir) {
    printError('Could not locate @postgen/web directory.');
    console.log(chalk.dim('Please ensure you are running inside the PostGen project workspace.'));
    process.exit(1);
  }

  const spinner = createSpinner('Finding available port...');
  spinner.start();

  const port = options.port ?? (await findAvailablePort(3000));
  spinner.succeed(`Selected port: ${chalk.bold.cyan(port)} (automatically detected available port)`);

  const serverSpinner = createSpinner(`Starting PostGen Web UI on http://localhost:${port}...`);
  serverSpinner.start();

  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npmCmd, ['next', 'dev', '-p', String(port)], {
    cwd: webDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port) },
  });

  let serverStarted = false;

  child.stdout?.on('data', (data: Buffer) => {
    const output = data.toString();
    if (!serverStarted && (output.includes('Ready in') || output.includes('http://localhost') || output.includes('Local:'))) {
      serverStarted = true;
      serverSpinner.succeed(chalk.bold.green(`PostGen Web UI is live at http://localhost:${port}`));
      console.log(chalk.dim('\n  Press Ctrl+C to stop the web server.\n'));
      openBrowser(`http://localhost:${port}`);
    }
  });

  child.stderr?.on('data', (data: Buffer) => {
    const output = data.toString();
    // Next.js logs some info to stderr, only treat actual errors
    if (!serverStarted && output.includes('Ready in')) {
      serverStarted = true;
      serverSpinner.succeed(chalk.bold.green(`PostGen Web UI is live at http://localhost:${port}`));
      console.log(chalk.dim('\n  Press Ctrl+C to stop the web server.\n'));
      openBrowser(`http://localhost:${port}`);
    }
  });

  // Timeout fallback in case stdout matcher missed
  setTimeout(() => {
    if (!serverStarted) {
      serverStarted = true;
      serverSpinner.succeed(chalk.bold.green(`PostGen Web UI launched at http://localhost:${port}`));
      console.log(chalk.dim('\n  Press Ctrl+C to stop the web server.\n'));
      openBrowser(`http://localhost:${port}`);
    }
  }, 4000);

  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
}
