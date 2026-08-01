// packages/ai/src/providers.ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModelV1 } from 'ai';
import type { PostGenConfig } from '@postgen/shared';

const DEFAULT_MODELS: Record<string, string> = {
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
  openrouter: 'google/gemini-2.0-flash-001',
  '9router': 'gpt-4o',
};

export function createModel(config: PostGenConfig): LanguageModelV1 {
  const model = config.model ?? DEFAULT_MODELS[config.provider] ?? 'gpt-4o';

  switch (config.provider) {
    case 'gemini': {
      if (!config.apiKey) {
        throw new Error('Gemini API key not configured. Run: postgen config set apiKey <your-key>');
      }
      const googleProvider = createGoogleGenerativeAI({ apiKey: config.apiKey });
      return googleProvider(model) as unknown as LanguageModelV1;
    }

    case 'openai': {
      if (!config.apiKey) {
        throw new Error('OpenAI API key not configured. Run: postgen config set apiKey <your-key>');
      }
      const openaiProvider = createOpenAI({ apiKey: config.apiKey });
      return openaiProvider(model) as unknown as LanguageModelV1;
    }

    case 'anthropic': {
      if (!config.apiKey) {
        throw new Error('Anthropic API key not configured. Run: postgen config set apiKey <your-key>');
      }
      const anthropicProvider = createAnthropic({ apiKey: config.apiKey });
      return anthropicProvider(model) as unknown as LanguageModelV1;
    }

    case 'openrouter': {
      if (!config.apiKey) {
        throw new Error('OpenRouter API key not configured. Run: postgen config set apiKey <your-key>');
      }
      const orProvider = createOpenRouter({ apiKey: config.apiKey });
      return orProvider(model) as unknown as LanguageModelV1;
    }

    case '9router': {
      const baseUrl = config.baseUrl ?? 'http://localhost:9000/v1';
      const routerOpenAI = createOpenAI({
        apiKey: config.apiKey || '9router',
        baseURL: baseUrl,
      });
      return routerOpenAI(model) as unknown as LanguageModelV1;
    }

    case 'custom': {
      if (!config.baseUrl) {
        throw new Error('Custom provider requires baseUrl. Run: postgen config set baseUrl <url>');
      }
      const customOpenAI = createOpenAI({
        apiKey: config.apiKey || 'custom',
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
