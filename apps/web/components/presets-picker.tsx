// apps/web/components/presets-picker.tsx
'use client';

import type { GenerationOptions, Tone, PostLength, Language, Focus } from '@postgen/shared';

interface PresetsPickerProps {
  options: GenerationOptions;
  onOptionsChange: (options: GenerationOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PresetsPicker({ options, onOptionsChange, onGenerate, isGenerating }: PresetsPickerProps) {
  const presets = [
    {
      id: 'viral-story',
      title: '📖 Viral Storytelling',
      desc: 'Narrative arc, problem → struggle → breakthrough. Best for personal reach.',
      tone: 'storytelling' as Tone,
      length: 'medium' as PostLength,
      lang: 'en' as Language,
      focus: 'personal' as Focus,
    },
    {
      id: 'tech-dive',
      title: '⚡ Technical Deep Dive',
      desc: 'Architecture rationale, code structure, stack breakdown. Best for developers.',
      tone: 'technical' as Tone,
      length: 'long' as PostLength,
      lang: 'en' as Language,
      focus: 'technical' as Focus,
    },
    {
      id: 'bahasa-showcase',
      title: '🇮🇩 Showcase Bahasa Indonesia',
      desc: 'Indonesian narrative with tech specs. Best for local dev community.',
      tone: 'casual' as Tone,
      length: 'medium' as PostLength,
      lang: 'id' as Language,
      focus: 'technical' as Focus,
    },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    onOptionsChange({
      ...options,
      tone: preset.tone,
      length: preset.length,
      language: preset.lang,
      focus: preset.focus,
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
        🎯 Step 2: Choose Post Style & Presets
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Select a 1-click preset or customize post tone, language, and length.
      </p>

      {/* 1-Click Presets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {presets.map((p) => (
          <div
            key={p.id}
            className="preset-card"
            onClick={() => applyPreset(p)}
            style={{
              borderColor: options.tone === p.tone && options.language === p.lang ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: options.tone === p.tone && options.language === p.lang ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {p.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Manual Fine-Tuning Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tone</label>
          <select
            className="input-field"
            value={options.tone}
            onChange={(e) => onOptionsChange({ ...options, tone: e.target.value as Tone })}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="storytelling">Storytelling</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Length</label>
          <select
            className="input-field"
            value={options.length}
            onChange={(e) => onOptionsChange({ ...options, length: e.target.value as PostLength })}
          >
            <option value="short">Short (&lt; 500 chars)</option>
            <option value="medium">Medium (500-1500 chars)</option>
            <option value="long">Long (1500-3000 chars)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Language</label>
          <select
            className="input-field"
            value={options.language}
            onChange={(e) => onOptionsChange({ ...options, language: e.target.value as Language })}
          >
            <option value="en">English</option>
            <option value="id">Indonesian (Bahasa)</option>
            <option value="auto">Auto Detect</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Variations</label>
          <select
            className="input-field"
            value={options.variations}
            onChange={(e) => onOptionsChange({ ...options, variations: parseInt(e.target.value, 10) })}
          >
            <option value={1}>1 Variation</option>
            <option value={3}>3 Variations (Recommended)</option>
            <option value={5}>5 Variations</option>
          </select>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={onGenerate}
        disabled={isGenerating}
        style={{ width: '100%', padding: '14px', fontSize: '16px' }}
      >
        {isGenerating ? '⏳ Generating Captions with AI...' : '🚀 Generate LinkedIn Post Variations'}
      </button>
    </div>
  );
}
