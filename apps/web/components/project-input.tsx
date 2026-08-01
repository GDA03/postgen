// apps/web/components/project-input.tsx
'use client';

import { useState } from 'react';

interface ProjectInputProps {
  onScan: (path: string) => void;
  isLoading: boolean;
}

export function ProjectInput({ onScan, isLoading }: ProjectInputProps) {
  const [path, setPath] = useState('');

  const recentPaths = ['.', 'c:\\Users\\alber\\Downloads\\Ngoding\\postgen'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) onScan(path.trim());
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            📁 Select Project Directory
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            PostGen scans your codebase, README, LOC, frameworks, and git history offline.
          </p>
        </div>

        <button
          type="button"
          className="chip-btn"
          onClick={() => {
            setPath('.');
            onScan('.');
          }}
          disabled={isLoading}
        >
          📍 Current Directory (.)
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter path, e.g. C:\Users\dev\my-project or ."
          value={path}
          onChange={(e) => setPath(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={!path.trim() || isLoading}
          style={{ whiteSpace: 'nowrap', minWidth: '150px' }}
        >
          {isLoading ? '⏳ Scanning...' : '🔍 Scan Project'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recent:</span>
        {recentPaths.map((p) => (
          <button
            key={p}
            type="button"
            className="chip-btn"
            style={{ fontSize: '12px', padding: '3px 10px' }}
            onClick={() => {
              setPath(p);
              onScan(p);
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
