// apps/web/components/onboarding-banner.tsx
'use client';

import type { PostGenConfig } from '@postgen/shared';

interface OnboardingBannerProps {
  config: PostGenConfig;
  onOpenSettings: () => void;
}

export function OnboardingBanner({ config, onOpenSettings }: OnboardingBannerProps) {
  const isConfigured = config.provider === '9router' || Boolean(config.apiKey);

  if (isConfigured) return null;

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        padding: '16px 24px',
        marginBottom: '24px',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 17, 26, 0.7) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>💡</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#f59e0b' }}>
            Set Up AI Provider to Start Generating
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Choose Gemini (free/fast), 9Router (local endpoint), OpenAI, Anthropic, or OpenRouter.
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={onOpenSettings} style={{ padding: '8px 18px', fontSize: '13px' }}>
        ⚙️ Quick Setup
      </button>
    </div>
  );
}
