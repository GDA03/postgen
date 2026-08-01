// cli/src/utils/server.ts
import net from 'net';
import { exec, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function findAvailablePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve) => {
    function tryPort(port: number) {
      const server = net.createServer();
      server.once('listen', () => {
        server.close(() => resolve(port));
      });
      server.once('error', () => {
        tryPort(port + 1);
      });
      server.listen(port, '127.0.0.1');
    }
    tryPort(startPort);
  });
}

export function openBrowser(url: string): void {
  const startCommand =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(startCommand, () => {
    // Ignore errors opening browser
  });
}

export function findWebDir(): string | null {
  // 1. Monorepo path relative to CLI
  const monorepoPath = path.resolve(import.meta.dirname, '../../apps/web');
  if (fs.existsSync(path.join(monorepoPath, 'package.json'))) {
    return monorepoPath;
  }

  // 2. Relative to working directory
  const localAppsWeb = path.resolve(process.cwd(), 'apps/web');
  if (fs.existsSync(path.join(localAppsWeb, 'package.json'))) {
    return localAppsWeb;
  }

  return null;
}
