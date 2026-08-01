// packages/core/src/cards/templates/modern-dark.ts
import type { ProjectContext } from '@postgen/shared';
import { formatNumber, LINKEDIN_IMAGE_WIDTH, LINKEDIN_IMAGE_HEIGHT } from '@postgen/shared';

export function modernDarkTemplate(context: ProjectContext): unknown {
  const techBadges = [...context.frameworks, ...context.languages.map((l) => l.name)]
    .slice(0, 6);

  return {
    type: 'div',
    props: {
      style: {
        width: LINKEDIN_IMAGE_WIDTH,
        height: LINKEDIN_IMAGE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '12px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '14px',
                    color: '#a78bfa',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  },
                  children: 'PROJECT SHOWCASE',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '48px', fontWeight: 700, lineHeight: 1.1 },
                  children: context.name,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '20px', color: '#cbd5e1', maxWidth: '80%' },
                  children: context.description || 'A software project',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
                  children: techBadges.map((tech) => ({
                    type: 'div',
                    props: {
                      key: tech,
                      style: {
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: 'rgba(167, 139, 250, 0.2)',
                        border: '1px solid rgba(167, 139, 250, 0.4)',
                        fontSize: '14px',
                        color: '#c4b5fd',
                      },
                      children: tech,
                    },
                  })),
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '24px', fontSize: '14px', color: '#94a3b8' },
                  children: [
                    { type: 'span', props: { children: `${formatNumber(context.structure.linesOfCode)} LOC` } },
                    { type: 'span', props: { children: `${context.structure.totalFiles} files` } },
                    ...(context.git ? [{ type: 'span', props: { children: `${context.git.totalCommits} commits` } }] : []),
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
