import type { APIRoute } from 'astro';
import { generateOgImage } from '../lib/generate-og-image';
import { getConfig } from '../lib/config';

/**
 * Generate the default Open Graph image for the site
 * This is built at compile time and served as a static asset
 */
export const GET: APIRoute = async () => {
  const config = getConfig();

  const png = await generateOgImage({
    title: config.app.name,
    subtitle: config.seo.defaultDescription,
    siteName: config.seo.siteName,
    themeColor: config.theme.primary,
  });

  return new Response(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
