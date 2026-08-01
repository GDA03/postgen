// apps/web/components/project-overview.tsx
'use client';

import type { ProjectContext } from '@postgen/shared';
import { formatNumber } from '@postgen/shared';

interface ProjectOverviewProps {
  context: ProjectContext;
}

export function ProjectOverview({ context }: ProjectOverviewProps) {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              📦 {context.name}
            </h2>
            {context.isMonorepo && <span className="badge-pill">Monorepo</span>}
            {context.deployTarget && <span className="badge-pill">Deploy: {context.deployTarget}</span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {context.description || 'No description provided in package.json'}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {formatNumber(context.structure.linesOfCode)} LOC
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {context.structure.totalFiles} files · {context.packageManager}
          </div>
        </div>
      </div>

      {/* Language Percentage Bar */}
      {context.languages.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Language Breakdown</span>
            <span>{context.languages.map((l) => `${l.name} (${l.percentage}%)`).join(' · ')}</span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden', display: 'flex' }}>
            {context.languages.map((l, i) => {
              const colors = ['#6366f1', '#a78bfa', '#38bdf8', '#ec4899', '#f59e0b'];
              return (
                <div
                  key={l.name}
                  style={{
                    width: `${l.percentage}%`,
                    height: '100%',
                    background: colors[i % colors.length],
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Framework Badges & Git Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {context.frameworks.map((f) => (
            <span key={f} className="badge-pill" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              ⚡ {f}
            </span>
          ))}
          {context.hasDocker && <span className="badge-pill">🐳 Docker</span>}
          {context.hasCi && <span className="badge-pill">⚙️ CI/CD</span>}
        </div>

        {context.git && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            📊 {context.git.totalCommits} commits · {context.git.contributors} contributor(s)
          </div>
        )}
      </div>
    </div>
  );
}
