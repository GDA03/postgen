// cli/src/config-manager.ts
import Conf from 'conf';
import type { PostGenConfig, AIProvider } from '@postgen/shared';
import { DEFAULT_CONFIG } from '@postgen/shared';

const config = new Conf<PostGenConfig>({
  projectName: 'postgen',
  defaults: DEFAULT_CONFIG,
});

export function getConfig(): PostGenConfig {
  const provider = (config.get('provider') as AIProvider) || 'gemini';
  
  // Vault lookup for provider specific keys
  let apiKey = config.get('apiKey');
  if (!apiKey) {
    if (provider === 'gemini') apiKey = config.get('geminiKey') || '';
    if (provider === 'openai') apiKey = config.get('openaiKey') || '';
    if (provider === 'anthropic') apiKey = config.get('anthropicKey') || '';
    if (provider === 'openrouter') apiKey = config.get('openrouterKey') || '';
  }

  return {
    provider,
    apiKey: apiKey || '',
    model: config.get('model'),
    baseUrl: config.get('baseUrl'),
    imageProvider: config.get('imageProvider'),
    imageModel: config.get('imageModel'),
    geminiKey: config.get('geminiKey'),
    openaiKey: config.get('openaiKey'),
    anthropicKey: config.get('anthropicKey'),
    openrouterKey: config.get('openrouterKey'),
  };
}

export function setConfig(key: keyof PostGenConfig, value: string): void {
  config.set(key, value);
  
  // If updating provider key specifically, also update vault key
  if (key === 'apiKey') {
    const currentProvider = config.get('provider') as AIProvider;
    if (currentProvider === 'gemini') config.set('geminiKey', value);
    if (currentProvider === 'openai') config.set('openaiKey', value);
    if (currentProvider === 'anthropic') config.set('anthropicKey', value);
    if (currentProvider === 'openrouter') config.set('openrouterKey', value);
  }
}

export function saveFullConfig(newConfig: Partial<PostGenConfig>): void {
  for (const [key, val] of Object.entries(newConfig)) {
    if (val !== undefined) {
      config.set(key as keyof PostGenConfig, val);
    }
  }
}

export function resetConfig(): void {
  config.clear();
}

export function getConfigPath(): string {
  return config.path;
}

export function listConfig(): Record<string, unknown> {
  const store = { ...config.store };
  // Obfuscate secret keys for visual safety
  const keysToMask: (keyof PostGenConfig)[] = ['apiKey', 'geminiKey', 'openaiKey', 'anthropicKey', 'openrouterKey'];
  for (const key of keysToMask) {
    if (typeof store[key] === 'string' && store[key]) {
      const str = store[key] as string;
      store[key] = str.length > 8 ? `${str.slice(0, 4)}...${str.slice(-4)}` : '****';
    }
  }
  return store;
}
