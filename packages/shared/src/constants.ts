// packages/shared/src/constants.ts

export const SUPPORTED_FRAMEWORKS = [
  'Next.js', 'React', 'Vue', 'Svelte', 'Angular', 'Nuxt',
  'Express', 'Fastify', 'NestJS', 'Hono',
  'FastAPI', 'Django', 'Flask',
  'Spring Boot', 'Gin', 'Actix',
  'Prisma', 'Drizzle', 'TypeORM',
  'TailwindCSS', 'Bootstrap',
] as const;

export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.js': 'JavaScript', '.jsx': 'JavaScript',
  '.py': 'Python',
  '.rs': 'Rust',
  '.go': 'Go',
  '.java': 'Java',
  '.kt': 'Kotlin',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.cs': 'C#',
  '.cpp': 'C++', '.cc': 'C++',
  '.c': 'C',
  '.swift': 'Swift',
  '.dart': 'Dart',
};

export const IGNORED_DIRS = [
  'node_modules', '.git', 'dist', 'build', '.next',
  '__pycache__', '.venv', 'venv', 'target',
  'vendor', '.turbo', 'coverage', '.cache',
];

export const IGNORED_FILES = [
  '.DS_Store', 'Thumbs.db', '.env', '.env.local',
];

export const MAX_FILE_SIZE = 100 * 1024; // 100KB — skip larger files for analysis

export const SENSITIVE_FILES = [
  '.env', '.env.local', '.env.production',
  'credentials.json', 'service-account.json',
  'id_rsa', 'id_ed25519',
];

export const LINKEDIN_MAX_CHARS = 3000;
export const LINKEDIN_HOOK_CHARS = 210;
export const LINKEDIN_IMAGE_WIDTH = 1200;
export const LINKEDIN_IMAGE_HEIGHT = 628;
