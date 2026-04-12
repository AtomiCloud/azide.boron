/// <reference types="astro/client" />
/// <reference types="vite/client" />

declare module 'virtual:pwa-info' {
  export interface PwaInfo {
    webManifest?: { linkTag?: string };
    registerSW?: string;
  }
  export const pwaInfo: PwaInfo | undefined;
}
