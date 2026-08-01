// packages/core/src/cards/renderer.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { LINKEDIN_IMAGE_WIDTH, LINKEDIN_IMAGE_HEIGHT, type TemplateCardOutput } from '@postgen/shared';

let cachedFont: ArrayBuffer | null = null;

async function getFontData(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;

  try {
    const url = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
    const cssResponse = await fetch(url);
    const css = await cssResponse.text();

    const fontUrlMatch = css.match(/src: url\((.+?)\)/);
    if (fontUrlMatch?.[1]) {
      const fontResponse = await fetch(fontUrlMatch[1]);
      cachedFont = await fontResponse.arrayBuffer();
      return cachedFont;
    }
  } catch {
    // Ignore fetch error, fallback below
  }

  // Minimal fallback font buffer (empty or mock font for test environments)
  return new ArrayBuffer(0);
}

export async function renderToPng(element: unknown): Promise<TemplateCardOutput> {
  const fontData = await getFontData();

  const svg = await satori(element as React.ReactNode, {
    width: LINKEDIN_IMAGE_WIDTH,
    height: LINKEDIN_IMAGE_HEIGHT,
    fonts: [
      {
        name: 'Inter',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: LINKEDIN_IMAGE_WIDTH },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return {
    imageBuffer: Buffer.from(pngBuffer),
    format: 'png',
    width: LINKEDIN_IMAGE_WIDTH,
    height: LINKEDIN_IMAGE_HEIGHT,
  };
}
