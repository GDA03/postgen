// packages/core/src/cards/__tests__/renderer.test.ts
import { describe, it, expect } from 'vitest';
import { getAvailableTemplates } from '../index.js';

describe('Card Templates', () => {
  it('lists available templates', () => {
    const templates = getAvailableTemplates();
    expect(templates).toContain('modern-dark');
    expect(templates).toContain('minimal');
    expect(templates).toHaveLength(2);
  });
});
