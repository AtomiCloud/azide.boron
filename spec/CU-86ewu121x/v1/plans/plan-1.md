# Plan 1: Upgrade Dependencies and Verify

## Goal and Scope

Update all specified dependencies in package.json, regenerate the lock file, and verify all functionality works correctly.

## Files to Modify

- `package.json` - Update dependency versions
- `bun.lock` - Regenerate completely (will be created)

## Approach

1. **Update Dependencies**
   - Update all production dependencies to target versions
   - Update all dev dependencies to target versions
   - Remove existing bun.lock
   - Run `bun install` to regenerate lock file and node_modules

2. **Build Verification**
   - Run `bun run build` to compile the project
   - Check for TypeScript errors and build failures
   - Review build output for warnings

3. **Functional Testing**
   - Dev server starts and renders pages correctly
   - PWA install prompt appears and functions
   - OG images generate correctly
   - `pls preview` works for local deployment testing
   - No console errors in browser

## Target Versions

### Production Dependencies

- @astrojs/rss: 4.0.13 → 4.0.15
- astro: 5.15.1 → 5.18.0
- lucide-react: 0.548.0 → 0.576.0
- react: 19.2.0 → 19.2.4
- react-dom: 19.2.0 → 19.2.4
- react-icons: 5.5.0 → 5.6.0
- tailwind-merge: 3.3.1 → 3.5.0

### Dev Dependencies

- @astrojs/react: 4.4.0 → 4.4.2
- @astrojs/sitemap: 3.6.0 → 3.7.0
- @types/bun: 1.3.1 → 1.3.10
- @types/react: 19.2.2 → 19.2.14
- @types/react-dom: 19.2.2 → 19.2.3
- @vite-pwa/astro: 1.1.1 → 1.2.0
- js-yaml: 4.1.0 → 4.1.1
- satori: 0.18.3 → 0.18.4
- sharp: 0.34.4 → 0.34.5
- tailwindcss: 3.4.18 → 3.4.19
- workbox-window: 7.3.0 → 7.4.0
- wrangler: 4.45.0 → 4.70.0

### Excluded (Major Versions)

- tailwindcss v4 - Major rewrite, deferred
- satori 0.24.x - Significant jump, stay on 0.18.x

## Edge Cases to Handle

1. **Peer Dependency Warnings** - Verify they're false positives if any appear
2. **Minor Breaking Changes** - Handle any deprecation warnings or API changes
3. **PWA Functionality** - Ensure @vite-pwa/astro update doesn't break service worker

## Implementation Checklist

- [ ] All production dependencies updated to target versions
- [ ] All dev dependencies updated to target versions
- [ ] bun.lock regenerated from scratch
- [ ] bun install completes without errors
- [ ] Build succeeds without TypeScript errors
- [ ] Dev server starts and renders pages
- [ ] PWA functionality verified
- [ ] OG image generation verified
- [ ] No console errors
