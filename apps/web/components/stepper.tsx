// apps/web/components/stepper.tsx
'use client';

interface StepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  const steps = [
    { number: 1, label: 'Scan Project', icon: '🔍' },
    { number: 2, label: 'Style & Presets', icon: '🎨' },
    { number: 3, label: 'Studio & Export', icon: '🚀' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '12px 24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 17, 26, 0.6)',
      }}
    >
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isPassed = currentStep > step.number;

        return (
          <div
            key={step.number}
            onClick={() => onStepClick(step.number as 1 | 2 | 3)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              opacity: isActive || isPassed ? 1 : 0.4,
              transition: 'all 200ms ease',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isActive
                  ? 'var(--accent-gradient)'
                  : isPassed
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isActive ? 'none' : `1px solid ${isPassed ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                color: isActive ? '#fff' : isPassed ? 'var(--accent-cyan)' : 'var(--text-muted)',
              }}
            >
              {isPassed ? '✓' : step.number}
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step {step.number}
              </div>
              <div style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {step.icon} {step.label}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                style={{
                  width: '60px',
                  height: '2px',
                  background: isPassed ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  marginLeft: '16px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
