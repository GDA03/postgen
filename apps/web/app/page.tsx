// apps/web/app/page.tsx
'use client';

import { useState } from 'react';
import { ProjectInput } from '../components/project-input';
import { PostPreview } from '../components/post-preview';
import { CaptionEditor } from '../components/caption-editor';
import { CardSelector } from '../components/card-selector';
import { SettingsPanel } from '../components/settings-panel';
import type { ProjectContext, LinkedInPost, PostGenConfig, GenerationOptions } from '@postgen/shared';
import { DEFAULT_GENERATION_OPTIONS, DEFAULT_CONFIG } from '@postgen/shared';

type AppState = 'idle' | 'scanning' | 'generating' | 'done' | 'error';

export default function HomePage() {
  const [state, setState] = useState<AppState>('idle');
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [post, setPost] = useState<LinkedInPost | null>(null);
  const [config, setConfig] = useState<PostGenConfig>(DEFAULT_CONFIG);
  const [options] = useState<GenerationOptions>(DEFAULT_GENERATION_OPTIONS);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const handleScan = async (projectPath: string) => {
    setState('scanning');
    setError('');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const ctx = await res.json();
      setContext(ctx);
      setState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
      setState('error');
    }
  };

  const handleGenerate = async () => {
    if (!context || !config.apiKey) return;
    setState('generating');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, config, options }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const result = await res.json();
      setPost(result);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setState('error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '12px' }}>
          <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⚡ PostGen
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
          Generate LinkedIn posts from your project in seconds
        </p>
        <button
          className="btn-secondary"
          onClick={() => setShowSettings(!showSettings)}
          style={{ marginTop: '16px' }}
        >
          ⚙️ Settings
        </button>
      </header>

      {showSettings && (
        <div className="fade-in" style={{ marginBottom: '32px' }}>
          <SettingsPanel config={config} onConfigChange={setConfig} />
        </div>
      )}

      <ProjectInput onScan={handleScan} isLoading={state === 'scanning'} />

      {error && (
        <div className="glass-card fade-in" style={{ padding: '16px', marginTop: '24px', borderColor: '#ef4444' }}>
          <p style={{ color: '#f87171' }}>❌ {error}</p>
        </div>
      )}

      {context && state !== 'scanning' && (
        <div className="glass-card fade-in" style={{ padding: '24px', marginTop: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--accent-secondary)' }}>
            📦 {context.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{context.description || 'No description'}</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-muted)' }}>
            <span>📁 {context.structure.totalFiles} files</span>
            <span>📝 {context.structure.linesOfCode} LOC</span>
            <span>🔧 {context.frameworks.join(', ') || 'No framework detected'}</span>
            {context.git && <span>📊 {context.git.totalCommits} commits</span>}
          </div>

          {config.apiKey ? (
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={state === 'generating'}
              style={{ marginTop: '20px' }}
            >
              {state === 'generating' ? '⏳ Generating...' : '🚀 Generate LinkedIn Post'}
            </button>
          ) : (
            <p style={{ marginTop: '16px', color: '#f59e0b' }}>
              ⚠️ Configure your API key in Settings first
            </p>
          )}
        </div>
      )}

      {post && state === 'done' && (
        <div className="fade-in" style={{ marginTop: '32px', display: 'grid', gap: '24px' }}>
          <CaptionEditor post={post} onPostUpdate={setPost} />
          <PostPreview post={post} />
          {context && <CardSelector context={context} />}
        </div>
      )}
    </div>
  );
}
