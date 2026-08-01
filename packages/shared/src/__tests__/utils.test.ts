// packages/shared/src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { truncate, sanitizePath, formatNumber, estimateReadTime, getFileExtension } from '../utils.js';

describe('truncate', () => {
  it('returns string as-is if under maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world this is long', 10)).toBe('hello w...');
  });
  it('handles exact length', () => {
    expect(truncate('exact', 5)).toBe('exact');
  });
});

describe('sanitizePath', () => {
  it('normalizes backslashes to forward slashes', () => {
    expect(sanitizePath('C:\\Users\\project')).toBe('C:/Users/project');
  });
  it('removes trailing slashes', () => {
    expect(sanitizePath('/home/user/project/')).toBe('/home/user/project');
  });
});

describe('formatNumber', () => {
  it('formats millions', () => {
    expect(formatNumber(1_500_000)).toBe('1.5M');
  });
  it('formats thousands', () => {
    expect(formatNumber(2_500)).toBe('2.5K');
  });
  it('returns small numbers as-is', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('estimateReadTime', () => {
  it('returns < 1 min for short text', () => {
    expect(estimateReadTime('hello world')).toBe('< 1 min read');
  });
  it('returns correct minutes for longer text', () => {
    const longText = Array(400).fill('word').join(' ');
    expect(estimateReadTime(longText)).toBe('2 min read');
  });
});

describe('getFileExtension', () => {
  it('returns extension with dot', () => {
    expect(getFileExtension('file.ts')).toBe('.ts');
  });
  it('returns empty for no extension', () => {
    expect(getFileExtension('Makefile')).toBe('');
  });
  it('handles multiple dots', () => {
    expect(getFileExtension('test.spec.ts')).toBe('.ts');
  });
});
