// apps/web/app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generatePost } from '@postgen/core';
import type { PostGenConfig, GenerationOptions, ProjectContext } from '@postgen/shared';

export async function POST(request: Request) {
  try {
    const { context, config, options } = await request.json() as {
      context: ProjectContext;
      config: PostGenConfig;
      options: GenerationOptions;
    };

    if (!config.apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const post = await generatePost(context, config, options);
    const serializable = {
      ...post,
      templateCard: undefined,
      aiImage: undefined,
    };
    return NextResponse.json(serializable);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 },
    );
  }
}
