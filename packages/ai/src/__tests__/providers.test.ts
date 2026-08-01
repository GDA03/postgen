// packages/ai/src/__tests__/providers.test.ts
import { describe, it, expect } from 'vitest';
import { createModel, getDefaultModel } from '../providers.js';

describe('getDefaultModel', () => {
  it('returns gemini default', () => {
    expect(getDefaultModel('gemini')).toBe('gemini-2.5-flash');
  });
  it('returns openai default', () => {
    expect(getDefaultModel('openai')).toBe('gpt-4o');
  });
  it('returns fallback for unknown', () => {
    expect(getDefaultModel('unknown')).toBe('gpt-4o');
  });
});

describe('createModel', () => {
  it('throws when no API key is set', () => {
    expect(() => createModel({ provider: 'gemini', apiKey: '' }))
      .toThrow('API key not configured');
  });

  it('throws for custom provider without baseUrl', () => {
    expect(() => createModel({ provider: 'custom', apiKey: 'test-key' }))
      .toThrow('Custom provider requires baseUrl');
  });
});
