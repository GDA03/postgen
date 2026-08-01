// cli/src/utils/server.ts
import net from 'net';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const PREFERRED_PORTS = [7678, 7679, 7680, 9876];

export async function findAvailablePort(customPort?: number): Promise<number> {
  if (customPort) return customPort;

  for (const port of PREFERRED_PORTS) {
    const isFree = await isPortAvailable(port);
    if (isFree) return port;
  }
  return PREFERRED_PORTS[0];
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
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
