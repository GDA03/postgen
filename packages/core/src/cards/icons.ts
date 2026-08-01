// packages/core/src/cards/icons.ts

export const TECH_ICONS: Record<string, string> = {
  'TypeScript': 'TS',
  'JavaScript': 'JS',
  'Python': 'PY',
  'Rust': 'RS',
  'Go': 'GO',
  'Java': 'JV',
  'Next.js': 'NX',
  'React': 'RE',
  'Vue': 'VU',
  'Svelte': 'SV',
  'Angular': 'NG',
  'Express': 'EX',
  'NestJS': 'NE',
  'Prisma': 'PR',
  'TailwindCSS': 'TW',
  'Docker': 'DK',
};

export function getTechBadge(name: string): string {
  return TECH_ICONS[name] ?? name.slice(0, 2).toUpperCase();
}
