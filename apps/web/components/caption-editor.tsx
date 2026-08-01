// apps/web/components/caption-editor.tsx
'use client';

import { useState } from 'react';
import type { LinkedInPost } from '@postgen/shared';

interface CaptionEditorProps {
  post: LinkedInPost;
  onPostUpdate: (post: LinkedInPost) => void;
}

export function CaptionEditor({ post, onPostUpdate }: CaptionEditorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentVariation = post.variations[selectedIdx];
  if (!currentVariation) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentVariation.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--accent-secondary)' }}>✏️ Caption Editor</h3>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {currentVariation.charCount} / 3000 chars
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {post.variations.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setSelectedIdx(i)}
            className={i === selectedIdx ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {v.angle}
          </button>
        ))}
      </div>

      <textarea
        className="input-field"
        value={currentVariation.caption}
        onChange={(e) => {
          const updated = { ...post };
          updated.variations = [...post.variations];
          updated.variations[selectedIdx] = {
            ...currentVariation,
            caption: e.target.value,
            charCount: e.target.value.length,
          };
          onPostUpdate(updated);
        }}
        style={{ minHeight: '300px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
      />

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button className="btn-primary" onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}
