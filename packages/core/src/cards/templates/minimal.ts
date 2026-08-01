// packages/core/src/cards/templates/minimal.ts
import type { ProjectContext } from '@postgen/shared';
import { LINKEDIN_IMAGE_WIDTH, LINKEDIN_IMAGE_HEIGHT } from '@postgen/shared';

export function minimalTemplate(context: ProjectContext): unknown {
  return {
    type: 'div',
    props: {
      style: {
        width: LINKEDIN_IMAGE_WIDTH,
        height: LINKEDIN_IMAGE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        background: '#ffffff',
        color: '#1a1a1a',
        fontFamily: 'Inter, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '64px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                    borderRadius: '2px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '52px', fontWeight: 700, textAlign: 'center' },
                  children: context.name,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '20px',
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '70%',
                  },
                  children: context.description || 'A software project',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '32px',
                    marginTop: '24px',
                    fontSize: '16px',
                    color: '#94a3b8',
                  },
                  children: [
                    { type: 'span', props: { children: context.frameworks.slice(0, 4).join(' · ') || context.languages[0]?.name || '' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
