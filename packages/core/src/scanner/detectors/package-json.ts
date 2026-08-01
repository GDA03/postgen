// packages/core/src/scanner/detectors/package-json.ts
import fs from 'fs-extra';
import path from 'path';
import type { PackageManager } from '@postgen/shared';

export interface PackageJsonData {
  name: string;
  description: string;
  version?: string;
  license?: string;
  packageManager: PackageManager;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

export async function detectPackageJson(projectPath: string): Promise<PackageJsonData | null> {
  const pkgPath = path.join(projectPath, 'package.json');
  if (!(await fs.pathExists(pkgPath))) return null;

  const pkg = await fs.readJson(pkgPath);

  const packageManager = detectPackageManager(projectPath, pkg);

  return {
    name: pkg.name ?? path.basename(projectPath),
    description: pkg.description ?? '',
    version: pkg.version,
    license: pkg.license,
    packageManager,
    dependencies: Object.keys(pkg.dependencies ?? {}),
    devDependencies: Object.keys(pkg.devDependencies ?? {}),
    scripts: pkg.scripts ?? {},
  };
}

function detectPackageManager(projectPath: string, pkg: Record<string, unknown>): PackageManager {
  if (typeof pkg.packageManager === 'string') {
    if (pkg.packageManager.startsWith('pnpm')) return 'pnpm';
    if (pkg.packageManager.startsWith('yarn')) return 'yarn';
    if (pkg.packageManager.startsWith('npm')) return 'npm';
  }
  if (fs.pathExistsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.pathExistsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.pathExistsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  return 'npm';
}
