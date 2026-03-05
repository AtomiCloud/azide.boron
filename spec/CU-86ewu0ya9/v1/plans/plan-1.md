# Implementation Plan 1: Dynamic Social Links with Bluesky & Reddit Support

## Goal

Refactor the Footer component to conditionally render social media icons based on configuration, and add support for Bluesky and Reddit platforms.

## Files to Modify

1. **`src/lib/config.ts`** - Update TypeScript interface
   - Make all social fields optional (add `?` to each)
   - Add `bluesky?: string` field
   - Add `reddit?: string` field

2. **`src/components/Footer.tsx`** - Refactor social link rendering
   - Filter social links array to only include entries with non-empty URLs
   - Add Bluesky icon (from `react-icons/fa6` - `FaBluesky` available in newer versions, or use custom SVG)
   - Add Reddit icon (`FaReddit` from `react-icons/fa6`)
   - Handle conditional rendering so icons only show when configured

3. **`config.yaml`** - Clean up base configuration
   - Set empty values for inactive platforms (or omit them entirely)
   - Add empty `bluesky:` and `reddit:` entries

## Approach

### Config Changes

Change the `social` interface from:

```typescript
social: {
  twitter: string;
  github: string;
  // ... all required
}
```

To:

```typescript
social: {
  twitter?: string;
  github?: string;
  // ... all optional
  bluesky?: string;
  reddit?: string;
}
```

### Footer Component Changes

Replace the static `socialLinks` array with a filtered version:

- Build array of all possible social platforms with their icons
- Filter to only include items where `config.social[platform]` is truthy
- Handle special cases: email (needs `mailto:` prefix), whatsapp (needs `https://wa.me/` prefix)
- Add Bluesky and Reddit to the array

For Bluesky icon: Check if `FaBluesky` exists in current `react-icons/fa6` version. If not available, use a simple SVG or generic link icon as fallback.

For Reddit icon: Use `FaReddit` from `react-icons/fa6` (should be available).

### Visual Handling

When no social links are configured:

- The social icons section should simply not render (empty div is fine)
- The rest of the footer (links, copyright) should display normally

## Edge Cases to Handle

1. **Empty/undefined config.social** - Use optional chaining to avoid errors
2. **All social links empty** - Social section should render empty (no icons)
3. **Partial configuration** - Only configured icons should appear
4. **Missing react-icons** - Handle if Bluesky icon not available in current version
5. **Email format** - Ensure `mailto:` prefix only added when email is configured
6. **WhatsApp format** - Ensure `https://wa.me/` prefix only added when number is configured

## Testing Strategy

1. **Test with full config** - All icons should display correctly
2. **Test with empty config** - No social icons should render
3. **Test with partial config** - Only configured icons render
4. **Test Bluesky/Reddit** - New platforms display when configured
5. **Test email link** - Verify `mailto:` prefix works correctly
6. **Test WhatsApp link** - Verify `https://wa.me/` prefix works correctly

## Integration Points

None - this plan is self-contained within the Footer component and config system.

## Implementation Checklist

From task-spec.md:

- [ ] Footer only displays social icons when `config.social.{platform}` has a non-empty string value
- [ ] Bluesky and Reddit icons are supported and displayed when configured
- [ ] Existing icon styling (spacing, colors, hover effects) is preserved
- [ ] Config TypeScript types include the new optional fields
- [ ] No console errors when optional fields are missing from config
