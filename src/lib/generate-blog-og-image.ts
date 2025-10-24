import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { BlogOgImageTemplate, type BlogOgImageProps } from './og-template-blog';
import { loadGoogleFont } from './font-cache';

// Load logo from public directory and convert to base64 data URL
function loadLogo(): string {
  try {
    const logoPath = join(process.cwd(), 'public', 'logo.svg');
    const logoSvg = readFileSync(logoPath, 'utf-8');
    const base64Logo = Buffer.from(logoSvg).toString('base64');
    return `data:image/svg+xml;base64,${base64Logo}`;
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
}

export interface GenerateBlogOgImageOptions extends BlogOgImageProps {
  width?: number;
  height?: number;
}

/**
 * Generate a blog-specific Open Graph image using Satori and Sharp
 * Returns a PNG buffer suitable for serving as an image response
 */
export async function generateBlogOgImage(options: GenerateBlogOgImageOptions): Promise<Buffer> {
  const { width = 1200, height = 630, ...templateProps } = options;

  try {
    // Load logo as base64 data URL
    const logoDataUrl = loadLogo();

    // Load fonts (cached after first load)
    const [interRegular, interSemiBold, interBold] = await Promise.all([
      loadGoogleFont('Inter', 400),
      loadGoogleFont('Inter', 600),
      loadGoogleFont('Inter', 800),
    ]);

    // Generate SVG using Satori
    const svg = await satori(
      BlogOgImageTemplate({
        ...templateProps,
        logo: logoDataUrl,
      }),
      {
        width,
        height,
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interSemiBold,
            weight: 600,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interBold,
            weight: 800,
            style: 'normal',
          },
        ],
      },
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({
        compressionLevel: 9,
        quality: 90,
      })
      .toBuffer();

    return pngBuffer;
  } catch (error) {
    console.error('Error generating blog OG image:', error);
    throw error;
  }
}
