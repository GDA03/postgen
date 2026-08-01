// apps/web/app/api/config/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import type { PostGenConfig, AIProvider } from '@postgen/shared';
import { DEFAULT_CONFIG } from '@postgen/shared';

function getConfigFilePath(): string {
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'postgen-nodejs', 'config.json');
  }
  return path.join(os.homedir(), '.config', 'postgen-nodejs', 'config.json');
}

function readStoredConfig(): Record<string, unknown> {
  try {
    const filePath = getConfigFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return {};
}

function writeStoredConfig(store: Record<string, unknown>): void {
  try {
    const filePath = getConfigFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

export async function GET() {
  try {
    const store = readStoredConfig();
    const provider = ((store.provider as string) || DEFAULT_CONFIG.provider) as AIProvider;
    let apiKey = (store.apiKey as string) || '';

    if (!apiKey) {
      if (provider === 'gemini') apiKey = (store.geminiKey as string) || '';
      if (provider === 'openai') apiKey = (store.openaiKey as string) || '';
      if (provider === 'anthropic') apiKey = (store.anthropicKey as string) || '';
      if (provider === 'openrouter') apiKey = (store.openrouterKey as string) || '';
    }

    const config: PostGenConfig = {
      provider,
      apiKey,
      model: store.model as string | undefined,
      baseUrl: store.baseUrl as string | undefined,
      geminiKey: store.geminiKey as string | undefined,
      openaiKey: store.openaiKey as string | undefined,
      anthropicKey: store.anthropicKey as string | undefined,
      openrouterKey: store.openrouterKey as string | undefined,
    };

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newConfig: Partial<PostGenConfig> = await request.json();
    const store = readStoredConfig();

    if (newConfig.provider) store.provider = newConfig.provider;
    if (newConfig.apiKey !== undefined) {
      store.apiKey = newConfig.apiKey;
      const prov = newConfig.provider || store.provider || 'gemini';
      if (prov === 'gemini') store.geminiKey = newConfig.apiKey;
      if (prov === 'openai') store.openaiKey = newConfig.apiKey;
      if (prov === 'anthropic') store.anthropicKey = newConfig.apiKey;
      if (prov === 'openrouter') store.openrouterKey = newConfig.apiKey;
    }

    if (newConfig.geminiKey !== undefined) store.geminiKey = newConfig.geminiKey;
    if (newConfig.openaiKey !== undefined) store.openaiKey = newConfig.openaiKey;
    if (newConfig.anthropicKey !== undefined) store.anthropicKey = newConfig.anthropicKey;
    if (newConfig.openrouterKey !== undefined) store.openrouterKey = newConfig.openrouterKey;

    if (newConfig.model !== undefined) store.model = newConfig.model;
    if (newConfig.baseUrl !== undefined) store.baseUrl = newConfig.baseUrl;

    writeStoredConfig(store);

    return NextResponse.json({ success: true, path: getConfigFilePath() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save config' }, { status: 500 });
  }
}
