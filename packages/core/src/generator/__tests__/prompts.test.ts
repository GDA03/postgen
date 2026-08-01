// packages/core/src/generator/__tests__/prompts.test.ts
import { describe, it, expect } from 'vitest';
import { buildCaptionPrompt } from '../prompts.js';
import type { ProjectContext } from '@postgen/shared';
import { DEFAULT_GENERATION_OPTIONS } from '@postgen/shared';

const mockContext: ProjectContext = {
  name: 'test-project',
  description: 'A test project',
  path: '/test/path',
  packageManager: 'pnpm',
  isMonorepo: false,
  languages: [{ name: 'TypeScript', percentage: 80, files: 20 }],
  frameworks: ['Next.js', 'React'],
  dependencies: ['next', 'react'],
  devDependencies: ['typescript'],
  git: {
    totalCommits: 42,
    recentCommits: [{ message: 'feat: add auth', date: '2024-01-01', author: 'dev' }],
    contributors: 1,
    firstCommitDate: '2024-01-01',
    lastCommitDate: '2024-06-01',
    remoteUrl: 'https://github.com/user/test-project',
  },
  structure: { totalFiles: 50, totalDirectories: 10, linesOfCode: 5000, tree: 'test/' },
  readme: '# Test Project\nA simple test.',
  hasDocker: false,
  hasCi: true,
};

describe('buildCaptionPrompt', () => {
  it('includes project name and tech stack', () => {
    const prompt = buildCaptionPrompt(mockContext, DEFAULT_GENERATION_OPTIONS, 0);
    expect(prompt).toContain('test-project');
    expect(prompt).toContain('Next.js, React');
  });

  it('includes git info', () => {
    const prompt = buildCaptionPrompt(mockContext, DEFAULT_GENERATION_OPTIONS, 0);
    expect(prompt).toContain('42');
    expect(prompt).toContain('feat: add auth');
  });

  it('varies angle based on index', () => {
    const prompt0 = buildCaptionPrompt(mockContext, DEFAULT_GENERATION_OPTIONS, 0);
    const prompt1 = buildCaptionPrompt(mockContext, DEFAULT_GENERATION_OPTIONS, 1);
    expect(prompt0).toContain('storytelling');
    expect(prompt1).toContain('technical');
  });

  it('includes monorepo context when applicable', () => {
    const monoContext: ProjectContext = {
      ...mockContext,
      isMonorepo: true,
      monorepoPackages: [{ name: 'web', path: 'apps/web' }],
    };
    const prompt = buildCaptionPrompt(monoContext, DEFAULT_GENERATION_OPTIONS, 0);
    expect(prompt).toContain('monorepo');
    expect(prompt).toContain('web');
  });
});
