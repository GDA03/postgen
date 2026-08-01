// apps/web/app/api/card/route.ts
import { NextResponse } from 'next/server';
import { generateCard } from '@postgen/core';
import type { ProjectContext } from '@postgen/shared';

export async function POST(request: Request) {
  try {
    const { context, template } = await request.json() as {
      context: ProjectContext;
      template?: string;
    };

    const card = await generateCard(context, template ?? 'modern-dark');

    return new NextResponse(new Uint8Array(card.imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${context.name}-linkedin-card.png"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Card generation failed' },
      { status: 500 },
    );
  }
}
