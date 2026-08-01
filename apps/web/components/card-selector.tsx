// apps/web/components/card-selector.tsx
'use client';

import { useState } from 'react';
import type { ProjectContext } from '@postgen/shared';

interface CardSelectorProps {
  context: ProjectContext;
}

export function CardSelector({ context }: CardSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-dark');
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const templates = ['modern-dark', 'minimal'];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, template: selectedTemplate }),
      });
      if (!res.ok) throw new Error('Card generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setCardUrl(url);
    } catch (error) {
      console.error('Card generation error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}>🎨 Template Card</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {templates.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTemplate(t)}
            className={t === selectedTemplate ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {t}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
        {loading ? '⏳ Generating...' : '🖼️ Generate Card'}
      </button>

      {cardUrl && (
        <div style={{ marginTop: '16px' }}>
          <img src={cardUrl} alt="LinkedIn card" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
          <a
            href={cardUrl}
            download={`${context.name}-linkedin-card.png`}
            className="btn-secondary"
            style={{ display: 'inline-block', marginTop: '12px', textDecoration: 'none' }}
          >
            💾 Download Card
          </a>
        </div>
      )}
    </div>
  );
}
