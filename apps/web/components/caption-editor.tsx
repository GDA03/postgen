// apps/web/components/caption-editor.tsx
'use client';

import { useState } from 'react';
import type { LinkedInPost } from '@postgen/shared';

interface CaptionEditorProps {
  post: LinkedInPost;
  onPostUpdate: (post: LinkedInPost) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export function CaptionEditor({ post, onPostUpdate, onToast }: CaptionEditorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentVariation = post.variations[selectedIdx] ?? post.variations[0];
  if (!currentVariation) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentVariation.caption);
    onToast('Caption copied to clipboard!', 'success');
  };

  const getReachStatus = (chars: number) => {
    if (chars >= 300 && chars <= 1400) return { label: '🟢 Ideal Reach (300-1400 chars)', color: '#22c55e' };
    if (chars > 1400 && chars <= 2500) return { label: '🟡 Good Length (1400-2500 chars)', color: '#f59e0b' };
    if (chars > 2500 && chars <= 3000) return { label: '⚠️ Approaching Limit (2500-3000 chars)', color: '#f97316' };
    if (chars > 3000) return { label: '🔴 Exceeds LinkedIn Limit (>3000 chars)', color: '#ef4444' };
    return { label: 'ℹ️ Short Post (<300 chars)', color: '#38bdf8' };
  };

  const reachInfo = getReachStatus(currentVariation.charCount);

  const handleHashtagClick = (tag: string) => {
    if (currentVariation.caption.includes(tag)) {
      // Remove hashtag
      const updatedCaption = currentVariation.caption.replace(tag, '').replace(/\s+/g, ' ').trim();
      updateCaption(updatedCaption);
      onToast(`Removed ${tag}`, 'info');
    } else {
      // Append hashtag
      const updatedCaption = `${currentVariation.caption.trim()}\n\n${tag}`;
      updateCaption(updatedCaption);
      onToast(`Added ${tag}`, 'success');
    }
  };

  const updateCaption = (newText: string) => {
    const updated = { ...post };
    updated.variations = [...post.variations];
    updated.variations[selectedIdx] = {
      ...currentVariation,
      caption: newText,
      charCount: newText.length,
    };
    onPostUpdate(updated);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            ✏️ Caption Editor & Variations
          </h3>
          <span style={{ fontSize: '12px', color: reachInfo.color, fontWeight: 500 }}>
            {reachInfo.label}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={handleCopy} style={{ padding: '8px 16px', fontSize: '13px' }}>
            📋 Copy
          </button>
        </div>
      </div>

      {/* Variation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {post.variations.map((v, i) => (
          <button
            key={v.id}
            onClick={() => {
              setSelectedIdx(i);
              onPostUpdate({ ...post, selectedVariation: i });
            }}
            className={i === selectedIdx ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Variation {v.id} ({v.angle})
          </button>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        className="input-field"
        value={currentVariation.caption}
        onChange={(e) => updateCaption(e.target.value)}
        style={{ minHeight: '320px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.65, fontSize: '14px' }}
      />

      {/* Interactive Hashtags Bar */}
      {currentVariation.hashtags.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Interactive Hashtags (click to add/remove from caption):
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {currentVariation.hashtags.map((tag) => {
              const isIncluded = currentVariation.caption.includes(tag);
              return (
                <button
                  key={tag}
                  className="chip-btn"
                  onClick={() => handleHashtagClick(tag)}
                  style={{
                    background: isIncluded ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isIncluded ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    color: isIncluded ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}
                >
                  {isIncluded ? '✓ ' : '+ '} {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
