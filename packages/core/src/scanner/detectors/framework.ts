// packages/core/src/scanner/detectors/framework.ts

const FRAMEWORK_INDICATORS: Record<string, string[]> = {
  'Next.js': ['next'],
  'React': ['react', 'react-dom'],
  'Vue': ['vue'],
  'Svelte': ['svelte'],
  'Angular': ['@angular/core'],
  'Nuxt': ['nuxt'],
  'Express': ['express'],
  'Fastify': ['fastify'],
  'NestJS': ['@nestjs/core'],
  'Hono': ['hono'],
  'Prisma': ['prisma', '@prisma/client'],
  'Drizzle': ['drizzle-orm'],
  'TailwindCSS': ['tailwindcss'],
};

export function detectFrameworks(
  dependencies: string[],
  devDependencies: string[],
): string[] {
  const allDeps = new Set([...dependencies, ...devDependencies]);
  const frameworks: string[] = [];

  for (const [framework, indicators] of Object.entries(FRAMEWORK_INDICATORS)) {
    if (indicators.some((dep) => allDeps.has(dep))) {
      frameworks.push(framework);
    }
  }

  return frameworks;
}
