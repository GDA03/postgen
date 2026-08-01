// packages/core/src/scanner/__tests__/scanner.test.ts
import { describe, it, expect } from 'vitest';
import path from 'path';
import { scanProject } from '../index.js';

describe('scanProject', () => {
  it('throws for non-existent path', async () => {
    await expect(scanProject('/nonexistent/path/for/postgen/test')).rejects.toThrow('does not exist');
  });

  it('scans a real project directory', async () => {
    const rootPath = path.resolve(process.cwd());
    const result = await scanProject(rootPath);

    expect(result.name).toBeDefined();
    expect(result.path).toBeDefined();
    expect(result.structure.totalFiles).toBeGreaterThan(0);
  });
});
