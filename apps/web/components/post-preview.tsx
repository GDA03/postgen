// apps/web/components/post-preview.tsx
'use client';

import type { LinkedInPost } from '@postgen/shared';

interface PostPreviewProps {
  post: LinkedInPost;
}

export function PostPreview({ post }: PostPreviewProps) {
  const variation = post.variations[post.selectedVariation] ?? post.variations[0];
  if (!variation) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          👀 Live LinkedIn Preview
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {post.estimatedReadTime}
        </span>
      </div>

      {/* LinkedIn Post Container */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          color: '#000000',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Profile Header */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            {post.projectContext.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>You</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Software Developer · Just now 🌐</div>
          </div>
        </div>

        {/* Post Text Body */}
        <div
          style={{
            fontSize: '14px',
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            color: '#1e293b',
            wordBreak: 'break-word',
          }}
        >
          {variation.caption}
        </div>

        {/* Social Engagement Mockup Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          <span style={{ cursor: 'pointer' }}>👍 Like</span>
          <span style={{ cursor: 'pointer' }}>💬 Comment</span>
          <span style={{ cursor: 'pointer' }}>🔄 Repost</span>
          <span style={{ cursor: 'pointer' }}>📤 Send</span>
        </div>
      </div>
    </div>
  );
}
