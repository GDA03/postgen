// packages/core/src/scanner/__tests__/detectors.test.ts
import { describe, it, expect } from 'vitest';
import { detectFrameworks } from '../detectors/framework.js';

describe('detectFrameworks', () => {
  it('detects Next.js from dependencies', () => {
    const result = detectFrameworks(['next', 'react', 'react-dom'], []);
    expect(result).toContain('Next.js');
    expect(result).toContain('React');
  });

  it('detects frameworks from devDependencies', () => {
    const result = detectFrameworks([], ['tailwindcss', 'prisma']);
    expect(result).toContain('TailwindCSS');
    expect(result).toContain('Prisma');
  });

  it('returns empty for no frameworks', () => {
    const result = detectFrameworks(['lodash', 'chalk'], []);
    expect(result).toEqual([]);
  });
});
