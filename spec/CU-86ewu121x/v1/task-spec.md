# Task Spec: CU-86ewu121x - Upgrade all dependencies for Boron

**Version:** 1
**Status:** Draft
**Created:** 2026-03-03

## Summary

Upgrade all outdated dependencies in the Azide Boron PWA project to their latest compatible versions while maintaining application stability and functionality.

## Current State

- **Total Dependencies:** 25 (10 production, 15 dev)
- **Outdated Packages:** ~16-18
- **Lock File:** bun.lock

## Scope

### In Scope

1. **Safe Updates (Low Risk - Patch/Minor)**
   - @astrojs/rss: 4.0.13 → 4.0.15
   - astro: 5.15.1 → 5.18.0
   - lucide-react: 0.548.0 → 0.576.0
   - react: 19.2.0 → 19.2.4
   - react-dom: 19.2.0 → 19.2.4
   - react-icons: 5.5.0 → 5.6.0
   - tailwind-merge: 3.3.1 → 3.5.0
   - @astrojs/react: 4.4.0 → 4.4.2
   - @astrojs/sitemap: 3.6.0 → 3.7.0
   - @types/bun: latest
   - @types/react: 19.2.2 → 19.2.14
   - @types/react-dom: 19.2.2 → 19.2.3
   - @vite-pwa/astro: 1.1.1 → 1.2.0
   - js-yaml: 4.1.0 → 4.1.1
   - satori: 0.18.3 → 0.18.4
   - sharp: 0.34.4 → 0.34.5
   - workbox-window: 7.3.0 → 7.4.0
   - wrangler: 4.45.0 → 4.70.0

2. **Testing Requirements**
   - Build must succeed (`bun run build`)
   - Dev server must start without errors
   - PWA functionality must work (install prompt, offline support)
   - OG image generation must work
   - Deployment preview must work (`pls preview`)

### Out of Scope (Requires Separate Task)

1. **Tailwind CSS v4 Migration**
   - Current: v3.4.18
   - Available: v4.2.1
   - Reason: Major rewrite with breaking changes (CSS-based config)
   - Recommendation: Defer to dedicated migration task

2. **Satori Major Version Jump**
   - Current: 0.18.3
   - Latest: 0.24.1
   - Reason: Significant version jump may break OG image generation
   - Recommendation: Update to 0.18.4 (patch) only, investigate 0.24.x separately

## Acceptance Criteria

1. All specified dependencies updated to target versions
2. `bun install` completes without errors or peer dependency warnings
3. `bun run build` succeeds
4. Dev server starts and renders pages correctly
5. PWA install prompt appears and functions
6. OG images generate correctly
7. `pls preview` works for local deployment testing
8. No TypeScript errors
9. No console errors in browser

## Risks & Mitigations

| Risk                                     | Likelihood | Impact | Mitigation                               |
| ---------------------------------------- | ---------- | ------ | ---------------------------------------- |
| @vite-pwa/astro breaks PWA               | Low        | High   | Test PWA install/offline after update    |
| Wrangler update breaks deployment        | Low        | High   | Test `pls preview` before merging        |
| Satori breaks OG generation              | Low        | Medium | Test OG image generation, stay on 0.18.x |
| Minor breaking changes in minor versions | Low        | Medium | Full build and runtime testing           |

## Open Questions

1. Should we also update class-variance-authority, clsx, flexsearch if updates are available?
2. Should we update @vite-pwa/assets-generator if a newer version exists?
3. Do we need to regenerate the lockfile from scratch or just update in place?

## Definition of Done

- [ ] All dependencies in scope updated
- [ ] Lock file updated (bun.lock)
- [ ] Build passes
- [ ] Dev server works
- [ ] PWA functionality verified
- [ ] OG image generation verified
- [ ] Local deployment preview verified
- [ ] No new TypeScript errors
- [ ] No new console errors
