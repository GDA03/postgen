// packages/ai/src/providers.ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModelV1 } from 'ai';
import type { PostGenConfig } from '@postgen/shared';

const DEFAULT_MODELS: Record<string, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  openrouter: 'google/gemini-2.5-flash',
};

export function createModel(config: PostGenConfig): LanguageModelV1 {
  if (!config.apiKey) {
    throw new Error(
      'API key not configured. Run: postgen config set apiKey <your-key>',
    );
  }

  const model = config.model ?? DEFAULT_MODELS[config.provider] ?? 'gpt-4o';

  switch (config.provider) {
    case 'gemini': {
      const googleProvider = createGoogleGenerativeAI({ apiKey: config.apiKey });
      return googleProvider(model) as unknown as LanguageModelV1;
    }

    case 'openai': {
      const openaiProvider = createOpenAI({ apiKey: config.apiKey });
      return openaiProvider(model) as unknown as LanguageModelV1;
    }

    case 'anthropic': {
      const anthropicProvider = createAnthropic({ apiKey: config.apiKey });
      return anthropicProvider(model) as unknown as LanguageModelV1;
    }

    case 'openrouter': {
      const orProvider = createOpenRouter({
        apiKey: config.apiKey,
      });
      return orProvider(model) as unknown as LanguageModelV1;
    }

    case 'custom': {
      if (!config.baseUrl) {
        throw new Error('Custom provider requires baseUrl. Run: postgen config set baseUrl <url>');
      }
      const customOpenAI = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
      });
      return customOpenAI(model) as unknown as LanguageModelV1;
    }

    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

export function getDefaultModel(provider: string): string {
  return DEFAULT_MODELS[provider] ?? 'gpt-4o';
}
