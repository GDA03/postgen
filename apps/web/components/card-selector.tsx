// apps/web/components/card-selector.tsx
'use client';

import { useState, useEffect } from 'react';
import type { ProjectContext, LinkedInPost } from '@postgen/shared';

interface CardSelectorProps {
  context: ProjectContext;
  post: LinkedInPost;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export function CardSelector({ context, post, onToast }: CardSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern-dark');
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const templates = [
    { id: 'modern-dark', name: '🌙 Modern Dark' },
    { id: 'minimal', name: '☀️ Minimal White' },
  ];

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
      onToast('Card image generated successfully!', 'success');
    } catch (error) {
      console.error('Card generation error:', error);
      onToast('Failed to generate card image', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [selectedTemplate]);

  const handleMasterExport = async () => {
    const variation = post.variations[post.selectedVariation] ?? post.variations[0];
    if (variation) {
      await navigator.clipboard.writeText(variation.caption);
    }
    if (cardUrl) {
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `${context.name}-linkedin-card.png`;
      link.click();
    }
    onToast('⚡ Caption copied & Card downloaded!', 'success');
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            🖼️ LinkedIn Visual Card Studio
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            1200×628px high-resolution project showcase card for LinkedIn posts.
          </p>
        </div>

        <button className="btn-primary" onClick={handleMasterExport} disabled={!cardUrl}>
          ⚡ Copy Caption & Download Card
        </button>
      </div>

      {/* Template Theme Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={t.id === selectedTemplate ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Card Preview Container */}
      {loading ? (
        <div
          style={{
            height: '240px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          ⏳ Rendering card with Satori & Resvg...
        </div>
      ) : cardUrl ? (
        <div>
          <img
            src={cardUrl}
            alt="LinkedIn Card Preview"
            style={{
              width: '100%',
              maxHeight: '360px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            }}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <a
              href={cardUrl}
              download={`${context.name}-linkedin-card.png`}
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              💾 Download Image PNG (1200×628)
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
