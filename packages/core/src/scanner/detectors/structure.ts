// packages/core/src/scanner/detectors/structure.ts
import fg from 'fast-glob';
import path from 'path';
import fs from 'fs-extra';
import {
  IGNORED_DIRS, LANGUAGE_EXTENSIONS, MAX_FILE_SIZE,
  type LanguageStat, type ProjectStructure,
} from '@postgen/shared';

export async function detectStructure(
  projectPath: string,
): Promise<{ structure: ProjectStructure; languages: LanguageStat[] }> {
  const ignorePatterns = IGNORED_DIRS.map((d) => `**/${d}/**`);

  const files = await fg('**/*', {
    cwd: projectPath,
    ignore: ignorePatterns,
    onlyFiles: true,
    dot: false,
  });

  const dirs = await fg('**/*', {
    cwd: projectPath,
    ignore: ignorePatterns,
    onlyDirectories: true,
    dot: false,
  });

  const langCounts: Record<string, { files: number; lines: number }> = {};
  let totalLoc = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const lang = LANGUAGE_EXTENSIONS[ext];
    if (!lang) continue;

    const fullPath = path.join(projectPath, file);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.size > MAX_FILE_SIZE) continue;

      const content = await fs.readFile(fullPath, 'utf-8');
      const lines = content.split('\n').length;
      totalLoc += lines;

      if (!langCounts[lang]) langCounts[lang] = { files: 0, lines: 0 };
      langCounts[lang].files++;
      langCounts[lang].lines += lines;
    } catch {
      // Skip unreadable files
    }
  }

  const totalLines = Object.values(langCounts).reduce((sum, l) => sum + l.lines, 0) || 1;
  const languages: LanguageStat[] = Object.entries(langCounts)
    .map(([name, stats]) => ({
      name,
      percentage: Math.round((stats.lines / totalLines) * 100),
      files: stats.files,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const tree = generateTree(projectPath, files);

  return {
    structure: {
      totalFiles: files.length,
      totalDirectories: dirs.length,
      linesOfCode: totalLoc,
      tree,
    },
    languages,
  };
}

function generateTree(basePath: string, files: string[]): string {
  const topLevel = new Set<string>();
  for (const file of files) {
    const parts = file.split('/');
    if (parts.length === 1) {
      topLevel.add(parts[0]);
    } else {
      topLevel.add(parts[0] + '/');
    }
  }
  const name = path.basename(basePath);
  const sorted = [...topLevel].sort();
  const lines = [`${name}/`];
  sorted.slice(0, 20).forEach((item, i) => {
    const prefix = i === sorted.length - 1 || i === 19 ? '└── ' : '├── ';
    lines.push(prefix + item);
  });
  if (sorted.length > 20) lines.push(`└── ... and ${sorted.length - 20} more`);
  return lines.join('\n');
}
