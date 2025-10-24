---
name: commit-changes
description: Create a git commit following Conventional Commits format. Always runs 'pls lint' before committing to ensure code quality. Use when user wants to commit, save changes, or create a commit.
---

# Commit Changes

Safely commit changes with linting and proper commit message formatting.

## When to Use

Activate when the user wants to:

- Commit changes
- Save work to git
- Create a commit
- "Commit this"
- "Save my changes"

## Commit Message Format

Use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature or bug fix)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling
- **ci**: CI/CD changes

### Examples

```
feat(blog): add automatic blog post discovery from frontmatter

fix(search): resolve FlexSearch prefix matching issue

docs(readme): update installation instructions

refactor(pwa): simplify install button logic for Safari

chore(deps): upgrade flexsearch to latest version
```

## Process

### Step 1: Check Status

Run git status to see what's changed:

```bash
git status
```

### Step 2: Run Linter

**REQUIRED**: Always run linter before committing:

```bash
pls lint
```

If linting fails:

1. Show the errors to the user
2. Ask if they want to:
   - Fix the errors first
   - Commit anyway (not recommended)
   - Cancel the commit

### Step 3: Review Changes

Show the diff to understand what's being committed:

```bash
git diff
```

For staged changes:

```bash
git diff --staged
```

### Step 4: Analyze Changes

Based on the diff, determine:

- **Type**: feat, fix, docs, etc.
- **Scope**: What part of the code (blog, search, pwa, etc.)
- **Subject**: Brief description (50 chars max, no period)
- **Body** (optional): More detailed explanation

### Step 5: Stage Files

If files aren't staged, ask user which files to stage:

```bash
git add <files>
```

Or stage all changes:

```bash
git add .
```

### Step 6: Create Commit

Use heredoc for clean formatting:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<body if needed>
EOF
)"
```

**Important**:

- NO --no-verify flag (respect git hooks)
- NO co-authored-by tags
- NO interactive mode (-i flag)

### Step 7: Confirm Success

After committing:

```bash
git log -1 --oneline
```

Show the user the commit was created successfully.

## Safety Checks

### Before Committing

✅ **DO:**

- Run `pls lint` first
- Check `git status`
- Review `git diff`
- Stage appropriate files
- Write clear, descriptive messages
- Use conventional commit format

❌ **DON'T:**

- Skip linting
- Commit secrets (.env, credentials, etc.)
- Use --no-verify
- Use --amend (unless explicitly requested)
- Force push to main/master
- Commit without user's explicit request

### Error Handling

If commit fails:

1. Check if pre-commit hooks modified files
2. Show the error message to user
3. Suggest next steps:
   - Review the changes
   - Stage the hook's modifications
   - Try committing again

## Examples

### Example 1: New Feature

```bash
# User says: "commit my blog post changes"

# 1. Check status
git status

# 2. Run linter
pls lint

# 3. Review changes
git diff

# 4. Stage files
git add src/pages/blog/ src/lib/blog-posts.ts

# 5. Commit
git commit -m "$(cat <<'EOF'
feat(blog): add automatic post discovery from frontmatter

Replaced manual blog post array with import.meta.glob() to automatically
scan and load blog posts from astro files. Posts now include frontmatter
metadata directly in each file.
EOF
)"
```

### Example 2: Bug Fix

```bash
# User says: "commit the search fix"

# 1. Lint
pls lint

# 2. Stage
git add src/pages/index.astro src/lib/blog-posts.ts

# 3. Commit
git commit -m "$(cat <<'EOF'
fix(search): add forward tokenization for prefix matching

FlexSearch now properly matches partial queries like "kube" finding
"kubernetes" by using tokenize: 'forward' on all indexed fields.
EOF
)"
```

### Example 3: Simple Fix

```bash
# User says: "commit"

# For small changes, can use short format:
git commit -m "fix(pwa): correct Safari browser detection logic"
```

## Tips

**Scope Selection:**

- Use the main area affected: blog, search, pwa, config, ci, etc.
- Can omit scope for very general changes
- Keep it short and clear

**Subject Line:**

- Start with lowercase verb
- No period at the end
- Maximum 50 characters
- Be specific but concise

**Body:**

- Optional for small changes
- Required for complex changes
- Explain WHY, not just what
- Wrap at 72 characters

## After Committing

Optionally show:

```bash
git log --oneline -5
```

Ask user if they want to:

- Push changes
- Create more commits
- Continue working
