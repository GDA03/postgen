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
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}>👀 LinkedIn Preview</h3>

      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        maxWidth: '550px',
        margin: '0 auto',
        color: '#000000',
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '18px',
          }}>
            {post.projectContext.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>You</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Developer · Just now</div>
          </div>
        </div>

        <div style={{ fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {variation.caption}
        </div>

        <div style={{
          display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid #e5e5e5', fontSize: '13px', color: '#666',
        }}>
          <span>👍 Like</span>
          <span>💬 Comment</span>
          <span>🔄 Repost</span>
          <span>📤 Send</span>
        </div>
      </div>
    </div>
  );
}
