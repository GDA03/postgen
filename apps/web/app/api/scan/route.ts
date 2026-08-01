// apps/web/app/api/scan/route.ts
import { NextResponse } from 'next/server';
import { scanProject } from '@postgen/core';

export async function POST(request: Request) {
  try {
    const { projectPath, packagePath } = await request.json();

    if (!projectPath) {
      return NextResponse.json({ error: 'Project path is required' }, { status: 400 });
    }

    const context = await scanProject(projectPath, { package: packagePath });
    return NextResponse.json(context);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scan failed' },
      { status: 500 },
    );
  }
}
