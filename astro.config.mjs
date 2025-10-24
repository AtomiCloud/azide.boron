import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { loadConfig } from './src/lib/config.ts';

// Load hierarchical configuration (config.yaml -> config.<landscape>.yaml -> env vars)
const config = loadConfig();

// Extract values for PWA configuration
const SITE_URL = config.site.url;
const APP_NAME = config.app.name;
const APP_SHORT_NAME = config.app.shortName;
const APP_DESCRIPTION = config.app.description;
const THEME_COLOR = config.theme.primary; // Use primary color as PWA theme
const BACKGROUND_COLOR = config.app.backgroundColor;

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // Pure static site - no adapter needed for Cloudflare Workers static assets
  image: {
    // Enable automatic responsive image sizing
    experimentalResponsiveImages: true,
    // Configure authorized remote image domains if needed
    // domains: ["example.com"],
    // remotePatterns: [{ protocol: "https" }],
  },

  integrations: [
    // React for interactive components
    react(),

    // Tailwind CSS for styling
    tailwind({
      applyBaseStyles: false, // We'll add our own base styles
    }),

    // Sitemap generation for SEO
    sitemap(),

    // PWA configuration
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: APP_NAME,
        short_name: APP_SHORT_NAME,
        description: APP_DESCRIPTION,
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//],
      },
    }),
  ],
});
