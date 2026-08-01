// packages/core/src/scanner/detectors/readme.ts
import fs from 'fs-extra';
import path from 'path';
import { truncate } from '@postgen/shared';

const README_FILENAMES = ['README.md', 'readme.md', 'Readme.md', 'README.txt', 'README'];

export async function detectReadme(projectPath: string): Promise<string | null> {
  for (const filename of README_FILENAMES) {
    const filePath = path.join(projectPath, filename);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      return truncate(content, 3000);
    }
  }
  return null;
}
