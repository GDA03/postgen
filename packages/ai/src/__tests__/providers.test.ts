// packages/ai/src/__tests__/providers.test.ts
import { describe, it, expect } from 'vitest';
import { createModel, getDefaultModel } from '../providers.js';

describe('getDefaultModel', () => {
  it('returns gemini default', () => {
    expect(getDefaultModel('gemini')).toBe('gemini-2.0-flash');
  });
  it('returns openai default', () => {
    expect(getDefaultModel('openai')).toBe('gpt-4o');
  });
  it('returns 9router default', () => {
    expect(getDefaultModel('9router')).toBe('gpt-4o');
  });
  it('returns fallback for unknown', () => {
    expect(getDefaultModel('unknown')).toBe('gpt-4o');
  });
});

describe('createModel', () => {
  it('throws when no API key is set for gemini', () => {
    expect(() => createModel({ provider: 'gemini', apiKey: '' }))
      .toThrow('Gemini API key not configured');
  });

  it('creates model for 9router without requiring API key', () => {
    const model = createModel({ provider: '9router', apiKey: '' });
    expect(model).toBeDefined();
  });

  it('throws for custom provider without baseUrl', () => {
    expect(() => createModel({ provider: 'custom', apiKey: 'test-key' }))
      .toThrow('Custom provider requires baseUrl');
  });
});
