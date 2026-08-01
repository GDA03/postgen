// packages/core/src/scanner/index.ts
import path from 'path';
import fs from 'fs-extra';
import { sanitizePath, type ProjectContext } from '@postgen/shared';
import { detectPackageJson } from './detectors/package-json.js';
import { detectReadme } from './detectors/readme.js';
import { detectGit } from './detectors/git.js';
import { detectStructure } from './detectors/structure.js';
import { detectFrameworks } from './detectors/framework.js';
import { detectMonorepo } from './detectors/monorepo.js';

export interface ScanOptions {
  package?: string;
}

export async function scanProject(
  projectPath: string,
  options: ScanOptions = {},
): Promise<ProjectContext> {
  const normalizedPath = sanitizePath(path.resolve(projectPath));

  if (!(await fs.pathExists(normalizedPath))) {
    throw new Error(`Project path does not exist: ${normalizedPath}`);
  }

  let scanTarget = normalizedPath;
  if (options.package) {
    scanTarget = path.join(normalizedPath, options.package);
    if (!(await fs.pathExists(scanTarget))) {
      throw new Error(`Monorepo package not found: ${options.package}`);
    }
  }

  const [pkgData, readme, git, structureData, monorepoInfo] = await Promise.all([
    detectPackageJson(scanTarget),
    detectReadme(scanTarget),
    detectGit(normalizedPath),
    detectStructure(scanTarget),
    detectMonorepo(normalizedPath),
  ]);

  const frameworks = pkgData
    ? detectFrameworks(pkgData.dependencies, pkgData.devDependencies)
    : [];

  const deployTarget = await detectDeployTarget(scanTarget);

  const context: ProjectContext = {
    name: pkgData?.name ?? path.basename(scanTarget),
    description: pkgData?.description ?? '',
    path: normalizedPath,
    packageManager: pkgData?.packageManager ?? 'unknown',
    version: pkgData?.version,
    license: pkgData?.license,
    isMonorepo: monorepoInfo.isMonorepo,
    monorepoPackages: monorepoInfo.isMonorepo ? monorepoInfo.packages : undefined,
    scannedPackage: options.package,
    languages: structureData.languages,
    frameworks,
    dependencies: pkgData?.dependencies ?? [],
    devDependencies: pkgData?.devDependencies ?? [],
    git,
    structure: structureData.structure,
    readme,
    hasDocker: await fs.pathExists(path.join(scanTarget, 'Dockerfile')),
    hasCi: await fs.pathExists(path.join(normalizedPath, '.github/workflows')),
    deployTarget,
  };

  return context;
}

async function detectDeployTarget(projectPath: string): Promise<string | undefined> {
  if (await fs.pathExists(path.join(projectPath, 'vercel.json'))) return 'vercel';
  if (await fs.pathExists(path.join(projectPath, 'netlify.toml'))) return 'netlify';
  if (await fs.pathExists(path.join(projectPath, 'fly.toml'))) return 'fly.io';
  if (await fs.pathExists(path.join(projectPath, 'render.yaml'))) return 'render';
  return undefined;
}

export { detectPackageJson } from './detectors/package-json.js';
export { detectReadme } from './detectors/readme.js';
export { detectGit } from './detectors/git.js';
export { detectStructure } from './detectors/structure.js';
export { detectFrameworks } from './detectors/framework.js';
export { detectMonorepo } from './detectors/monorepo.js';
