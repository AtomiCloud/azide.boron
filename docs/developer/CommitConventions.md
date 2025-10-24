# Commit Conventions

This project follows **Conventional Commits** format for all commit messages.

## Format

```
<type>(<scope>): <subject>

<body>
```

### Components

- **type**: Category of change (required)
- **scope**: Area affected (optional but recommended)
- **subject**: Brief description, 50 chars max, lowercase, no period
- **body**: Detailed explanation (optional)

## Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(blog): add automatic post discovery` |
| `fix` | Bug fix | `fix(search): resolve prefix matching` |
| `docs` | Documentation only | `docs(readme): update setup instructions` |
| `style` | Code style/formatting | `style(components): format with prettier` |
| `refactor` | Code refactoring | `refactor(pwa): simplify install logic` |
| `perf` | Performance improvement | `perf(search): optimize index loading` |
| `test` | Adding/updating tests | `test(blog): add post discovery tests` |
| `chore` | Build/tooling changes | `chore(deps): upgrade dependencies` |
| `ci` | CI/CD changes | `ci(deploy): add staging environment` |

## Common Scopes

- `blog` - Blog post system
- `search` - Search functionality
- `pwa` - Progressive Web App features
- `seo` - SEO and meta tags
- `config` - Configuration files
- `deps` - Dependencies
- `ci` - Continuous Integration

## Rules

### Required
1. **Always run `pls lint`** before committing
2. Use conventional commit format
3. Subject line: lowercase, no period, max 50 chars
4. Body: wrap at 72 characters

### Prohibited
- L No `--no-verify` flag (respect git hooks)
- L No co-authored-by tags
- L No interactive mode (`-i` flag)
- L No force push to main/master
- L Don't commit secrets (.env, credentials.json, etc.)

## Examples

### Simple Commit
```bash
feat(blog): add tags system with hashtag display
```

### With Body
```bash
feat(search): implement FlexSearch with fuzzy matching

Replaced simple string matching with FlexSearch for intelligent
full-text search. Includes tokenization, stemming, and typo tolerance.
Search is now instant with no debounce needed.
```

### Bug Fix
```bash
fix(pwa): correct Safari browser detection

Updated user agent regex to properly detect iOS Safari vs Chrome iOS.
Install button now shows appropriate instructions for each browser.
```

### Documentation
```bash
docs(skills): add blog post writer skill documentation
```

### Chore
```bash
chore(deps): upgrade flexsearch to v0.8.212
```

## Pre-Commit Workflow

1. Make changes
2. Run `pls lint`
3. Fix any linting errors
4. Review `git diff`
5. Stage files: `git add <files>`
6. Commit with proper format
7. Verify with `git log -1`

## Multi-line Commits

Use heredoc for clean formatting:

```bash
git commit -m "$(cat <<'EOF'
feat(blog): add automatic post discovery

Replaced manual blog post array with import.meta.glob() to
automatically scan and load posts from astro files.
EOF
)"
```

## Tips

**Good Subjects:**
-  `fix(search): add prefix matching support`
-  `feat(pwa): implement Safari install instructions`
-  `docs(readme): update deployment steps`

**Bad Subjects:**
- L `Fixed bug` (not specific)
- L `Updated files` (not descriptive)
- L `WIP` (not meaningful)
- L `Fix search.` (has period)
- L `FEAT: Add search` (not lowercase)
