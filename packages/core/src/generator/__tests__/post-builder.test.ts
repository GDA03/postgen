// packages/core/src/generator/__tests__/post-builder.test.ts
import { describe, it, expect } from 'vitest';
import { buildLinkedInPost } from '../post-builder.js';
import type { ProjectContext, CaptionVariation } from '@postgen/shared';

const mockContext: ProjectContext = {
  name: 'test',
  description: '',
  path: '/test',
  packageManager: 'npm',
  isMonorepo: false,
  languages: [],
  frameworks: [],
  dependencies: [],
  devDependencies: [],
  git: null,
  structure: { totalFiles: 0, totalDirectories: 0, linesOfCode: 0, tree: '' },
  readme: null,
  hasDocker: false,
  hasCi: false,
};

const mockVariations: CaptionVariation[] = [
  { id: 1, caption: 'Test post content here', hook: 'Hook!', hashtags: ['#test'], charCount: 22, angle: 'storytelling' },
  { id: 2, caption: 'Technical deep dive', hook: 'Tech!', hashtags: ['#dev'], charCount: 19, angle: 'technical' },
];

describe('buildLinkedInPost', () => {
  it('creates LinkedInPost with variations', () => {
    const post = buildLinkedInPost(mockContext, mockVariations);
    expect(post.variations).toHaveLength(2);
    expect(post.selectedVariation).toBe(0);
    expect(post.generatedAt).toBeDefined();
  });

  it('calculates estimated read time', () => {
    const post = buildLinkedInPost(mockContext, mockVariations);
    expect(post.estimatedReadTime).toBeDefined();
  });
});
