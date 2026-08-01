// packages/core/src/generator/prompts.ts
import type { ProjectContext, GenerationOptions } from '@postgen/shared';
import { LINKEDIN_MAX_CHARS, LINKEDIN_HOOK_CHARS } from '@postgen/shared';

export function buildCaptionPrompt(
  context: ProjectContext,
  options: GenerationOptions,
  variationIndex: number,
): string {
  const angles = ['storytelling', 'technical', 'concise', 'business-impact', 'personal-journey'];
  const angle = angles[variationIndex % angles.length];

  const lengthGuide = {
    short: `Keep it under 500 characters. Punchy and direct.`,
    medium: `Aim for 500-1500 characters. Good balance of story and detail.`,
    long: `Go up to ${LINKEDIN_MAX_CHARS} characters. Tell the full story with technical depth.`,
  };

  const toneGuide = {
    professional: 'Professional and polished. Industry-standard vocabulary.',
    casual: 'Conversational and approachable. Like talking to a friend.',
    technical: 'Deep technical detail. Code references and architecture discussion.',
    storytelling: 'Narrative arc. Problem → struggle → breakthrough → result.',
  };

  const techStack = context.frameworks.length > 0
    ? context.frameworks.join(', ')
    : context.languages.map((l) => l.name).join(', ');

  const recentWork = context.git?.recentCommits
    ?.slice(0, 5)
    .map((c) => `- ${c.message}`)
    .join('\n') ?? 'No git history available';

  const monorepoContext = context.isMonorepo && context.monorepoPackages
    ? `\nThis is a monorepo with packages: ${context.monorepoPackages.map((p) => p.name).join(', ')}`
    : '';

  return `You are an expert LinkedIn content creator who specializes in developer/tech content that gets high engagement.

## Project Context
- **Name:** ${context.name}
- **Description:** ${context.description || 'No description provided'}
- **Tech Stack:** ${techStack}
- **Languages:** ${context.languages.map((l) => `${l.name} (${l.percentage}%)`).join(', ')}
- **Total Files:** ${context.structure.totalFiles}
- **Lines of Code:** ${context.structure.linesOfCode}
- **Package Manager:** ${context.packageManager}${monorepoContext}
${context.git ? `- **Commits:** ${context.git.totalCommits}\n- **Contributors:** ${context.git.contributors}\n- **Age:** From ${context.git.firstCommitDate} to ${context.git.lastCommitDate}` : ''}
${context.deployTarget ? `- **Deploy Target:** ${context.deployTarget}` : ''}
${context.hasDocker ? '- **Dockerized:** Yes' : ''}

## Recent Commits (for context)
${recentWork}

## README Excerpt
${context.readme ? context.readme.slice(0, 1500) : 'No README available'}

## Project Structure
${context.structure.tree}

---

## Task
Generate a LinkedIn post with this specific **angle: ${angle}**

### Structure Required
1. **Hook** (first line, max ${LINKEDIN_HOOK_CHARS} chars) — must make people click "see more"
2. **Background Story** — why this was built, personal motivation
3. **Problem Statement** — the specific problem being solved
4. **Solution** — how the project solves it
5. **Tech Stack & Architecture** — key technologies with brief rationale (use bullet points)
6. **Key Features** — 3-5 standout features
7. **Call to Action** — invite engagement${context.git?.remoteUrl ? `, include repo link: ${context.git.remoteUrl}` : ''}
8. **Hashtags** — 5-10 relevant tech hashtags (with # prefix)

### Requirements
- Tone: ${toneGuide[options.tone]}
- ${lengthGuide[options.length]}
- Language: ${options.language === 'id' ? 'Indonesian (Bahasa Indonesia)' : options.language === 'auto' ? 'Match the language used in README/commits' : 'English'}
- Focus angle: ${angle}
- Use line breaks for readability (LinkedIn renders them well)
- Use emojis strategically (1-3 per section, not excessive)
- Don't use markdown formatting (no **, ##, etc.) — LinkedIn doesn't render them

Return ONLY the post content. The hook should be the very first line.`;
}
