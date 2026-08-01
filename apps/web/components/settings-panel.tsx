// apps/web/components/settings-panel.tsx
'use client';

import type { PostGenConfig, AIProvider } from '@postgen/shared';

interface SettingsPanelProps {
  config: PostGenConfig;
  onConfigChange: (config: PostGenConfig) => void;
}

export function SettingsPanel({ config, onConfigChange }: SettingsPanelProps) {
  const providers: AIProvider[] = ['gemini', 'openai', 'anthropic', 'openrouter', 'custom'];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '20px' }}>⚙️ AI Provider Settings</h3>

      <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Provider
          </label>
          <select
            className="input-field"
            value={config.provider}
            onChange={(e) => onConfigChange({ ...config, provider: e.target.value as AIProvider })}
          >
            {providers.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            API Key
          </label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter your API key"
            value={config.apiKey}
            onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            🔒 Stored locally in your browser. Never sent to any server except the AI provider.
          </p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Model (optional)
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., gemini-2.5-flash, gpt-4o"
            value={config.model ?? ''}
            onChange={(e) => onConfigChange({ ...config, model: e.target.value || undefined })}
          />
        </div>

        {config.provider === 'custom' && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Base URL
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="https://your-openai-compatible-api.com/v1"
              value={config.baseUrl ?? ''}
              onChange={(e) => onConfigChange({ ...config, baseUrl: e.target.value || undefined })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
