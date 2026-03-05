# Task Specification: Reduce to Only Working Contacts

**Ticket:** CU-86ewu0ya9
**Title:** Reduce to only working contacts

## Overview

Refactor the Footer component to dynamically display only social media links that are configured in the config files. Currently, all 10 social icons are always displayed, even if they have placeholder or empty values. We need to add support for Bluesky and Reddit, and only show icons when a URL is actually configured.

## Current State

- **File:** `src/components/Footer.tsx`
- **Current behavior:** All 10 social media icons are always rendered (Twitter, GitHub, Discord, YouTube, TikTok, LinkedIn, Instagram, Telegram, Email, WhatsApp)
- **Config location:** `config.yaml` (base), `config.{landscape}.yaml` (overrides)

## Requirements

### 1. Dynamic Social Link Rendering

The Footer component should:

- Only render social media icons that have a non-empty URL in the config
- Skip rendering entirely if the config value is empty, null, or undefined
- Maintain the existing icon styling and layout

### 2. Add New Social Platforms

Add support for:

- **Bluesky** - New social config field `social.bluesky`
- **Reddit** - New social config field `social.reddit`

### 3. Config Schema Updates

Update the TypeScript config interface in `src/lib/config.ts`:

- Add optional `bluesky?: string` to social config
- Add optional `reddit?: string` to social config

### 4. Base Config Cleanup

In `config.yaml`, the base configuration should have empty values (or be omitted) for non-essential platforms, allowing landscape-specific configs to opt-in:

```yaml
social:
  twitter: '' # Only if active
  github: 'https://github.com/atomicloud' # Keep if active
  discord: '' # Only if active
  youtube: '' # Only if active
  tiktok: '' # Only if active
  linkedin: '' # Only if active
  instagram: '' # Only if active
  telegram: '' # Only if active
  email: 'hello@example.com' # Keep for contact
  whatsapp: '' # Only if active
  bluesky: '' # New - only if active
  reddit: '' # New - only if active
```

## Acceptance Criteria

1. Footer only displays social icons when `config.social.{platform}` has a non-empty string value
2. Bluesky and Reddit icons are supported and displayed when configured
3. Existing icon styling (spacing, colors, hover effects) is preserved
4. Config TypeScript types include the new optional fields
5. No console errors when optional fields are missing from config

## Edge Cases

- If NO social links are configured, the social section should be hidden or show gracefully
- If config.social is undefined, handle gracefully
- Icons should maintain consistent sizing and alignment when some are hidden

## Technical Notes

- The Footer component uses `lucide-react` icons - may need to use generic link icons or SVGs for Bluesky/Reddit if not in Lucide
- Config is loaded via `src/lib/config.ts` using hierarchical YAML loading
- The footer is used in `src/layouts/Layout.astro`
