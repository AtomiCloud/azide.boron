/**
 * Font caching system for OG image generation
 * Loads Google Fonts once and caches them in memory to avoid repeated network requests
 */

// In-memory cache for loaded fonts
const fontCache = new Map<string, ArrayBuffer>();

/**
 * Load a Google Font with caching and timeout handling
 */
export async function loadGoogleFont(font: string, weight = 400, timeout = 10000): Promise<ArrayBuffer> {
  const cacheKey = `${font}-${weight}`;

  // Return cached font if available
  if (fontCache.has(cacheKey)) {
    const cachedFont = fontCache.get(cacheKey);
    if (cachedFont) {
      return cachedFont;
    }
  }

  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const cssResponse = await fetch(API, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const css = await cssResponse.text();
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

    if (!resource || !resource[1]) {
      throw new Error(`Failed to parse font URL from CSS for ${font} ${weight}`);
    }

    // Download the actual font file with timeout
    const fontController = new AbortController();
    const fontTimeoutId = setTimeout(() => fontController.abort(), timeout);

    const fontResponse = await fetch(resource[1], {
      signal: fontController.signal,
    });

    clearTimeout(fontTimeoutId);

    const fontData = await fontResponse.arrayBuffer();

    // Cache the font for future use
    fontCache.set(cacheKey, fontData);

    return fontData;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout loading font ${font} ${weight} after ${timeout}ms`);
    } else {
      console.error(`Error loading font ${font} ${weight}:`, error);
    }
    throw new Error(`Failed to load font: ${font} ${weight}`);
  }
}

/**
 * Preload fonts to avoid delays during OG image generation
 * This should be called during application startup
 */
export async function preloadFonts(): Promise<void> {
  try {
    console.log('Preloading fonts for OG image generation...');
    await Promise.all([loadGoogleFont('Inter', 400), loadGoogleFont('Inter', 600), loadGoogleFont('Inter', 800)]);
    console.log('Fonts preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload fonts:', error);
    // Don't throw - fonts will be loaded on-demand
  }
}

/**
 * Clear the font cache (useful for testing or memory management)
 */
export function clearFontCache(): void {
  fontCache.clear();
}

/**
 * Get the current cache size
 */
export function getFontCacheSize(): number {
  return fontCache.size;
}
