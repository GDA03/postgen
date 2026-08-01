// apps/web/components/settings-panel.tsx
'use client';

import type { PostGenConfig, AIProvider } from '@postgen/shared';

interface SettingsPanelProps {
  config: PostGenConfig;
  onConfigChange: (config: PostGenConfig) => void;
  onClose: () => void;
}

export function SettingsPanel({ config, onConfigChange, onClose }: SettingsPanelProps) {
  const providers: { id: AIProvider; label: string; defaultBaseUrl?: string }[] = [
    { id: 'gemini', label: 'Google Gemini (Fast & Recommended)' },
    { id: '9router', label: '9Router (Local AI Endpoint)', defaultBaseUrl: 'http://localhost:9000/v1' },
    { id: 'openai', label: 'OpenAI (GPT-4o)' },
    { id: 'anthropic', label: 'Anthropic (Claude 3.5)' },
    { id: 'openrouter', label: 'OpenRouter (Multi-model)' },
    { id: 'custom', label: 'Custom OpenAI-Compatible API' },
  ];

  const handleProviderSelect = (provider: AIProvider) => {
    const selected = providers.find((p) => p.id === provider);
    onConfigChange({
      ...config,
      provider,
      baseUrl: selected?.defaultBaseUrl ?? config.baseUrl,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          background: 'rgba(15, 17, 26, 0.95)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ⚙️ AI Provider & Model Settings
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              AI Provider
            </label>
            <select
              className="input-field"
              value={config.provider}
              onChange={(e) => handleProviderSelect(e.target.value as AIProvider)}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {config.provider !== '9router' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                API Key
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter your API Key"
                value={config.apiKey}
                onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                🔒 Stored locally in your browser session. Never uploaded anywhere else.
              </p>
            </div>
          )}

          {(config.provider === '9router' || config.provider === 'custom') && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Base Endpoint URL
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="http://localhost:9000/v1"
                value={config.baseUrl ?? (config.provider === '9router' ? 'http://localhost:9000/v1' : '')}
                onChange={(e) => onConfigChange({ ...config, baseUrl: e.target.value || undefined })}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Model Override (Optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder={config.provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o'}
              value={config.model ?? ''}
              onChange={(e) => onConfigChange({ ...config, model: e.target.value || undefined })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
            ✅ Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
