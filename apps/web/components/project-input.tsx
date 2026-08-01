// apps/web/components/project-input.tsx
'use client';

import { useState } from 'react';

interface ProjectInputProps {
  onScan: (path: string) => void;
  isLoading: boolean;
}

export function ProjectInput({ onScan, isLoading }: ProjectInputProps) {
  const [path, setPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.trim()) onScan(path.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
      <input
        type="text"
        className="input-field"
        placeholder="Enter your project path, e.g., C:\Users\dev\my-project"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="btn-primary"
        disabled={!path.trim() || isLoading}
        style={{ whiteSpace: 'nowrap', minWidth: '140px' }}
      >
        {isLoading ? '⏳ Scanning...' : '🔍 Scan Project'}
      </button>
    </form>
  );
}
