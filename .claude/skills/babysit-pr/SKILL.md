---
name: babysit-pr
description: Babysit a pull request by monitoring for review comments and addressing them. Fetches all inline review comments and general comments, fixes each one, commits the fixes, pushes, and replies to each comment acknowledging the resolution. Use when you have a PR that needs review triage.
---

# Babysit PR

Monitor a pull request for review comments and address them.

## When to Use

Activate this skill when the user wants to:

- Babysit a PR and address all review comments
- Triage review feedback on a pull request
- Monitor and resolve PR review comments automatically
- Reply to reviewer comments with fix acknowledgments

## Process Overview

### Step 1: Get PR Number

If no PR number is provided in the invocation, ask:

> "Which PR should I babysit? Please provide the PR number or URL."

Otherwise, extract the PR number from the arguments.

### Step 2: Fetch All Comments

Use `gh api` to fetch:

1. **PR comments** (general comments):

   ```bash
   gh api repos/{owner}/{repo}/pulls/{pr_number}/comments
   ```

2. **Review comments** (inline comments on specific lines):

   ```bash
   gh pr view {pr_number} --json comments --jq '.comments[].body'
   ```

3. **Reviews** (formal reviews with state):

   ```bash
   gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews
   ```

4. **Review comments with file paths** (for inline code comments):
   ```bash
   gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --jq '.[] | select(.path) | {id, path, line, body}'
   ```

### Step 3: Analyze Comments

For each comment:

1. **Determine if action is needed**: Is it a suggestion, request, question, or just informational?
2. **Categorize severity**: Is it a blocker (must fix), suggestion (should fix), or false positive (acknowledge only)?
3. **Identify affected files**: Which files need to be modified?

### Step 4: Address Each Comment

For each actionable comment:

1. **Read the affected code**: Understand the current state
2. **Apply the fix**: Make the necessary code changes
3. **Verify**: Run `pls lint` to ensure the fix passes all checks
4. **Commit**: Create a focused commit addressing the comment

For false positives or non-actionable comments:

1. **Reply with explanation**: Acknowledge the comment and explain why no change is needed

### Step 5: Reply to Comments

After pushing fixes, reply to each review comment:

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies \
  -f body="Fixed in {commit_sha} — {brief description of what was done}."
```

### Step 6: Verify No New Comments

After pushing, wait briefly and check for any new comments that may have been triggered by CI bots or follow-up reviews. If new comments appear, repeat Steps 3-5.

## Commit Message Format

Use conventional commits for babysit fixes:

- `fix: address PR review — {brief summary}`
- `style: resolve lint issue from PR review`
- `docs: clarify based on PR feedback`

## Verification

After all comments are addressed:

1. Run `pls lint` — must pass
2. Confirm all replies are posted
3. Report summary to user: how many comments were addressed, how many were false positives

## Important Notes

- **Always verify before fixing**: Read the code and understand the context before making changes. Not all review suggestions are correct.
- **Preserve existing behavior**: Fixes should not introduce new issues or change behavior beyond what the review comment requests.
- **Be concise in replies**: Keep reply messages short and reference the specific commit that fixes the issue.
- **Check for CI status**: If CI fails due to the fixes, address those failures too.
