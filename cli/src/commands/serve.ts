// cli/src/commands/serve.ts
import chalk from 'chalk';
import { spawn } from 'child_process';
import { printHeader, printError } from '../ui/output.js';
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

  const port = await findAvailablePort(options.port);

  const serverSpinner = createSpinner(`Starting PostGen Web UI on http://localhost:${port}...`);
  serverSpinner.start();

  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npmCmd, ['next', 'dev', '-p', String(port)], {
    cwd: webDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, PORT: String(port) },
  });

  let serverStarted = false;

  const handleStart = () => {
    if (!serverStarted) {
      serverStarted = true;
      serverSpinner.succeed(chalk.bold.green(`PostGen Web UI is live at http://localhost:${port}`));
      console.log(chalk.dim('\n  Press Ctrl+C to stop the web server.\n'));
      openBrowser(`http://localhost:${port}`);
    }
  };

  child.stdout?.on('data', (data: Buffer) => {
    const output = data.toString();
    if (output.includes('Ready in') || output.includes('http://localhost') || output.includes('Local:')) {
      handleStart();
    }
  });

  child.stderr?.on('data', (data: Buffer) => {
    const output = data.toString();
    if (output.includes('Ready in')) {
      handleStart();
    }
  });

  // Fallback timer: open browser after 2.5 seconds max
  setTimeout(handleStart, 2500);

  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
}
