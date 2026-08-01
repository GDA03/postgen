// cli/src/config-manager.ts
import Conf from 'conf';
import type { PostGenConfig, AIProvider } from '@postgen/shared';
import { DEFAULT_CONFIG } from '@postgen/shared';

const config = new Conf<PostGenConfig>({
  projectName: 'postgen',
  defaults: DEFAULT_CONFIG,
});

export function getConfig(): PostGenConfig {
  return {
    provider: config.get('provider') as AIProvider,
    apiKey: config.get('apiKey'),
    model: config.get('model'),
    baseUrl: config.get('baseUrl'),
    imageProvider: config.get('imageProvider'),
    imageModel: config.get('imageModel'),
  };
}

export function setConfig(key: keyof PostGenConfig, value: string): void {
  config.set(key, value);
}

export function resetConfig(): void {
  config.clear();
}

export function getConfigPath(): string {
  return config.path;
}

export function listConfig(): Record<string, unknown> {
  return config.store;
}
