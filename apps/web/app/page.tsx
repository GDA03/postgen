// apps/web/app/page.tsx
'use client';

import { useState } from 'react';
import { Stepper } from '../components/stepper';
import { OnboardingBanner } from '../components/onboarding-banner';
import { ProjectInput } from '../components/project-input';
import { ProjectOverview } from '../components/project-overview';
import { PresetsPicker } from '../components/presets-picker';
import { CaptionEditor } from '../components/caption-editor';
import { PostPreview } from '../components/post-preview';
import { CardSelector } from '../components/card-selector';
import { SettingsPanel } from '../components/settings-panel';
import { ToastContainer, type ToastMessage } from '../components/toast';
import type { ProjectContext, LinkedInPost, PostGenConfig, GenerationOptions } from '@postgen/shared';
import { DEFAULT_GENERATION_OPTIONS, DEFAULT_CONFIG } from '@postgen/shared';

type AppState = 'idle' | 'scanning' | 'generating' | 'done' | 'error';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<AppState>('idle');
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [post, setPost] = useState<LinkedInPost | null>(null);
  const [config, setConfig] = useState<PostGenConfig>({
    ...DEFAULT_CONFIG,
    provider: 'gemini',
  });
  const [options, setOptions] = useState<GenerationOptions>(DEFAULT_GENERATION_OPTIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleScan = async (projectPath: string) => {
    setState('scanning');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const ctx = await res.json();
      setContext(ctx);
      setState('idle');
      setCurrentStep(2);
      addToast(`Scanned ${ctx.name} successfully!`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Scan failed';
      addToast(msg, 'error');
      setState('error');
    }
  };

  const handleGenerate = async () => {
    if (!context) return;

    if (config.provider !== '9router' && !config.apiKey) {
      setShowSettings(true);
      addToast('Please configure your API key first', 'warning');
      return;
    }

    setState('generating');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, config, options }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const result = await res.json();
      setPost(result);
      setState('done');
      setCurrentStep(3);
      addToast(`Generated ${result.variations.length} caption variations!`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      addToast(msg, 'error');
      setState('error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span className="gradient-text">⚡ PostGen Studio</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Turn any software repository into engaging LinkedIn posts &amp; visual cards
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => setShowSettings(true)}>
            ⚙️ AI Provider ({config.provider})
          </button>
        </div>
      </header>

      {/* Stepper Navigator */}
      <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Onboarding Banner if Key Missing */}
      <OnboardingBanner config={config} onOpenSettings={() => setShowSettings(true)} />

      {/* Step 1: Project Scanner */}
      <ProjectInput onScan={handleScan} isLoading={state === 'scanning'} />

      {/* Scanned Project Overview Card */}
      {context && <ProjectOverview context={context} />}

      {/* Step 2: Generation Options & Presets Picker */}
      {context && (
        <PresetsPicker
          options={options}
          onOptionsChange={setOptions}
          onGenerate={handleGenerate}
          isGenerating={state === 'generating'}
        />
      )}

      {/* Step 3: Split-Screen Studio Workspace */}
      {post && context && (
        <div
          className="animate-fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
            gap: '24px',
            marginTop: '32px',
          }}
        >
          {/* Left Column: Caption Variations & Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <CaptionEditor post={post} onPostUpdate={setPost} onToast={addToast} />
          </div>

          {/* Right Column: Live LinkedIn Mockup & Card Studio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PostPreview post={post} />
            <CardSelector context={context} post={post} onToast={addToast} />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Floating Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
