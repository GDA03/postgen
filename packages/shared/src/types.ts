// packages/shared/src/types.ts

// ---- Project Scanner Types ----

export interface LanguageStat {
  name: string;
  percentage: number;
  files: number;
}

export interface GitCommit {
  message: string;
  date: string;
  author: string;
}

export interface GitInfo {
  totalCommits: number;
  recentCommits: GitCommit[];
  contributors: number;
  firstCommitDate: string;
  lastCommitDate: string;
  remoteUrl: string | null;
}

export interface MonorepoPackage {
  name: string;
  path: string;
  description?: string;
}

export interface ProjectStructure {
  totalFiles: number;
  totalDirectories: number;
  linesOfCode: number;
  tree: string;
}

export type PackageManager =
  | 'npm' | 'yarn' | 'pnpm'
  | 'cargo' | 'pip' | 'go' | 'maven'
  | 'unknown';

export interface ProjectContext {
  name: string;
  description: string;
  path: string;
  packageManager: PackageManager;
  version?: string;
  license?: string;
  isMonorepo: boolean;
  monorepoPackages?: MonorepoPackage[];
  scannedPackage?: string;
  languages: LanguageStat[];
  frameworks: string[];
  dependencies: string[];
  devDependencies: string[];
  git: GitInfo | null;
  structure: ProjectStructure;
  readme: string | null;
  hasDocker: boolean;
  hasCi: boolean;
  deployTarget?: string;
}

// ---- Caption Generation Types ----

export type Tone = 'professional' | 'casual' | 'technical' | 'storytelling';
export type PostLength = 'short' | 'medium' | 'long';
export type Language = 'en' | 'id' | 'auto';
export type Focus = 'technical' | 'business' | 'personal';

export interface GenerationOptions {
  tone: Tone;
  length: PostLength;
  language: Language;
  focus: Focus;
  variations: number;
  includeTemplateCard: boolean;
  includeAiImage: boolean;
  templateName?: string;
  monorepoPackage?: string;
}

export interface CaptionVariation {
  id: number;
  caption: string;
  hook: string;
  hashtags: string[];
  charCount: number;
  angle: string;
}

export interface TemplateCardOutput {
  imageBuffer: Buffer;
  format: 'png';
  width: number;
  height: number;
}

export interface AiImageOutput {
  imageBuffer: Buffer;
  format: 'png';
  url?: string;
}

export interface LinkedInPost {
  projectContext: ProjectContext;
  variations: CaptionVariation[];
  selectedVariation: number;
  estimatedReadTime: string;
  templateCard?: TemplateCardOutput;
  aiImage?: AiImageOutput;
  generatedAt: string;
}

// ---- Config Types ----

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter' | '9router' | 'custom';

export interface PostGenConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  imageProvider?: 'gemini' | 'openai' | 'none';
  imageModel?: string;
  geminiKey?: string;
  openaiKey?: string;
  anthropicKey?: string;
  openrouterKey?: string;
}

export const DEFAULT_CONFIG: PostGenConfig = {
  provider: 'gemini',
  apiKey: '',
  model: undefined,
  baseUrl: undefined,
  imageProvider: 'none',
  imageModel: undefined,
};

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  tone: 'professional',
  length: 'medium',
  language: 'en',
  focus: 'technical',
  variations: 3,
  includeTemplateCard: true,
  includeAiImage: false,
};
