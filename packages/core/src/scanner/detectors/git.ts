// packages/core/src/scanner/detectors/git.ts
import path from 'path';
import fs from 'fs-extra';
import { simpleGit } from 'simple-git';
import type { GitInfo } from '@postgen/shared';

export async function detectGit(projectPath: string): Promise<GitInfo | null> {
  const gitDir = path.join(projectPath, '.git');
  if (!(await fs.pathExists(gitDir))) return null;

  try {
    const git = simpleGit(projectPath);

    const log = await git.log({ maxCount: 10 });
    const logAll = await git.log();
    const remotes = await git.getRemotes(true);

    const contributors = new Set(logAll.all.map((c) => c.author_email)).size;
    const remoteUrl = remotes.length > 0 ? (remotes[0].refs.fetch ?? null) : null;

    return {
      totalCommits: logAll.total,
      recentCommits: log.all.slice(0, 5).map((c) => ({
        message: c.message,
        date: c.date,
        author: c.author_name,
      })),
      contributors,
      firstCommitDate: logAll.all.length > 0 ? logAll.all[logAll.all.length - 1].date : '',
      lastCommitDate: logAll.all.length > 0 ? logAll.all[0].date : '',
      remoteUrl,
    };
  } catch {
    return null;
  }
}
