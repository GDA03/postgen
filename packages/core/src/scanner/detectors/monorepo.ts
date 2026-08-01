// packages/core/src/scanner/detectors/monorepo.ts
import fs from 'fs-extra';
import path from 'path';
import type { MonorepoPackage } from '@postgen/shared';

export interface MonorepoInfo {
  isMonorepo: boolean;
  packages: MonorepoPackage[];
}

export async function detectMonorepo(projectPath: string): Promise<MonorepoInfo> {
  const pnpmWorkspace = path.join(projectPath, 'pnpm-workspace.yaml');
  if (await fs.pathExists(pnpmWorkspace)) {
    const packages = await findWorkspacePackages(projectPath);
    return { isMonorepo: packages.length > 1, packages };
  }

  const pkgPath = path.join(projectPath, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    if (pkg.workspaces) {
      const packages = await findWorkspacePackages(projectPath);
      return { isMonorepo: packages.length > 1, packages };
    }
  }

  if (await fs.pathExists(path.join(projectPath, 'lerna.json'))) {
    const packages = await findWorkspacePackages(projectPath);
    return { isMonorepo: packages.length > 1, packages };
  }

  return { isMonorepo: false, packages: [] };
}

async function findWorkspacePackages(rootPath: string): Promise<MonorepoPackage[]> {
  const packages: MonorepoPackage[] = [];
  const possibleDirs = ['packages', 'apps', 'libs', 'services'];

  for (const dir of possibleDirs) {
    const dirPath = path.join(rootPath, dir);
    if (!(await fs.pathExists(dirPath))) continue;

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgJsonPath = path.join(dirPath, entry.name, 'package.json');
      if (await fs.pathExists(pkgJsonPath)) {
        const pkg = await fs.readJson(pkgJsonPath);
        packages.push({
          name: pkg.name ?? entry.name,
          path: path.join(dir, entry.name),
          description: pkg.description,
        });
      }
    }
  }

  return packages;
}
