// cli/src/__tests__/config-manager.test.ts
import { describe, it, expect } from 'vitest';

describe('Config Manager', () => {
  it('module can be imported', async () => {
    const mod = await import('../config-manager.js');
    expect(mod.getConfig).toBeDefined();
    expect(mod.setConfig).toBeDefined();
    expect(mod.resetConfig).toBeDefined();
    expect(mod.listConfig).toBeDefined();
  });
});
