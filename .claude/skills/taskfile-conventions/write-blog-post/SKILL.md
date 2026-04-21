---
name: write-blog-post
description: Convert pre-written content from a file into a published blog post. Creates a branch, transforms the content into a formatted Astro blog post, starts the dev server, and iterates with the user until satisfied. Use when the user has a file with content they want to turn into a blog post.
---

# Write Blog Post

Convert pre-written content from a file into a beautiful, interactive blog post for the Azide Boron blog.

## When to Use

Activate this skill when the user wants to:

- Turn a file of content into a blog post
- Import existing writing into the blog
- Convert a document/article into a published blog post
- Publish pre-written content

## Process Overview

### Step 0: Get the Source File

The user must provide a file path to the pre-written content. If not provided in the invocation, ask:

> "What file contains the content you'd like to turn into a blog post?"

Read the file and understand the content before proceeding.

### Step 1: Create a Branch

Before any work, create a new branch for the blog post:

```bash
git checkout -b blog/<slug-from-title>
```

Use a slug derived from the content's topic or working title. This keeps the work isolated.

### Step 2: Understand the Content

From the file, identify:

- **Topic**: What is the content about?
- **Audience**: Who is the target reader?
- **Key Message**: What's the main takeaway?
- **Main Points**: What specific points are covered?

Do NOT ask the user these questions — read the file and determine these yourself. Present a brief summary to the user for confirmation.

### Step 3: Detect Series Membership

Check whether the content is part of a multi-part series. Look for these signals in the source file:

- **Explicit markers**: "Part X of Y", "Part X", headings like "Part 2 of 8: ..."
- **Table of contents** linking to other parts
- **Navigation links** at the bottom (e.g., "Previous: Part 1 | Next: Part 3")
- **Series title or name** referenced throughout (e.g., "The AtomiCloud Engineering Series")

If the content is part of a series, extract:

- **Series name**: The overall series title
- **Current part number**: Which part this is (e.g., "Part 2")
- **Total parts**: Total number of parts (e.g., "of 8")
- **Previous part**: The slug/link to the previous part (if Part 2+, look for the link)
- **Next part**: The slug/link to the next part (if mentioned)

Then check if the previous part(s) already exist as published blog posts by searching `src/pages/blog/*.astro` for matching titles or slugs. This determines whether cross-linking is possible.

If the content IS part of a series:

- **Include in the description**: Prefix with "Part X of Y: " (e.g., "Part 2 of 8: Every dependency has two properties...")
- **Add an opening series note**: Use an italicized intro paragraph linking to the previous part, like:
  ```astro
  <p class="text-lg leading-relaxed mb-6">
    <em>Part 2 of 8 in the [Series Name]. <a href="/blog/previous-part-slug" class="text-primary hover:underline">Part 1</a> covered [brief topic]. This part covers [current topic].</em>
  </p>
  ```
- **Link to next part at the end**: If the next part exists as a blog post, add a closing link. If it doesn't exist yet, mention it without a live link.

If the content is NOT part of a series, skip all of the above — no series prefix, no series navigation.

Do NOT ask the user whether the content is part of a series — determine this yourself from the file.

**However, always confirm your findings with the user** before proceeding. Present the detected series info and ask:

> "I detected this is **Part X of Y** in the **[Series Name]** series. [Previous/next part details]. Does that look correct?"

If the user corrects you (e.g., the series name is different, the part number is wrong, or it's not actually part of a series), adjust accordingly.

### Step 4: Gather Metadata

Propose the following based on the content, then confirm with the user:

- **Title**: Compelling, SEO-friendly (50-60 characters)
- **Description**: Clear summary (120-160 characters)
- **Topic**: tech | marketing | entrepreneurship | productivity | health
- **Tags**: 3-5 relevant tags (lowercase, hyphenated)
- **Share Message**: A baity but neutral hook (50-100 characters) — see guidelines below

No need to ask for a cover image — the OG image is auto-generated from the blog post slug at `/blog/${slug}/og.png`. Skip any cover image step.

### Share Message Guidelines

Create a **baity but neutral** share message that hooks readers while maintaining a conversational tone:

- **Include a hook or curiosity gap** that makes people want to click
- **Sounds natural**, like you're casually sharing something intriguing with a friend
- **Teases the insight** without giving it away completely
- **Stays neutral in tone** — no excessive enthusiasm or hyperbole
- **Is concise** (50-100 characters)
- **Uses questions, contrasts, or surprising elements** to create interest

**Hook Techniques (Neutral Style):**

1. **Question Hook**: Pose an intriguing question
   - "Why does [common thing] actually work differently than you think?"
   - "What if [assumption] is backwards?"

2. **Contrast Hook**: Present an unexpected contrast
   - "The counterintuitive way [outcome] actually happens"
   - "[Common approach] vs what actually works"

3. **Surprising Insight**: Tease a non-obvious realization
   - "The overlooked factor in [topic]"
   - "What most people miss about [topic]"

4. **Problem/Solution Tease**: Hint at solving a pain point
   - "A different angle on [common problem]"
   - "Rethinking [topic] from first principles"

**Good Examples (Baity + Neutral):**

- "Why [common thing] might not work the way you think"
- "The surprising connection between [A] and [B]"
- "What I learned after [doing X]"
- "A counterintuitive take on [topic]"
- "[Topic]: the part most people overlook"
- "Rethinking how we approach [topic]"
- "The hidden tradeoff in [common practice]"
- "Why [assumption] doesn't hold up"

**Bad Examples:**

- "Amazing article about [topic] - must read!" (too enthusiastic)
- "This will blow your mind!" (overly hyped)
- "The ultimate guide to [topic]!" (generic clickbait)
- "[Topic] explained (you won't believe #3!)" (cheap clickbait)
- "SHOCKING truth about [topic]" (excessive caps/drama)

**The Goal**: Create curiosity and interest without sounding like a used car salesman. Think "hmm, that's interesting" rather than "OMG YOU NEED TO READ THIS!!!"

### Step 5: Determine Author

Run to get git username:

```bash
git config user.name
```

Then ask the user:

> "I detected the git author as **[git name]**. Would you like to publish under this name, or as **Adelphi Liong**?"

Use whichever they choose. Use today's date (YYYY-MM-DD format).

### Step 6: Create the Blog Post File

Generate slug from title (lowercase, spaces to hyphens, remove special chars).

Transform the source content into a properly formatted Astro blog post using the template below. Key transformation rules:

- **Preserve the original voice and message** — do not rewrite the content in your own words
- **Add structure**: Break long walls of text into sections with H2/H3 headings
- **Enhance readability**: Add Cards for key points, Badges for important terms, blockquotes for emphasis
- **Add an engaging opening hook** if the original content starts flat — but keep it true to the author's style
- **Add a Key Takeaways section** at the end, distilling the main points
- **Add a CTA section** if the content has a natural call-to-action
- **Keep paragraphs short** (2-4 sentences) — split long paragraphs

Create file: `src/pages/blog/[slug].astro`

## Template Structure

```astro
---
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { getBlogPost } from '../../lib/blog-posts';

export const frontmatter = {
  title: 'Post Title Here',
  description: 'Brief description here',
  author: 'Author Name',
  date: '2025-01-28',
  topic: 'tech' as const,
  tags: ['tag1', 'tag2', 'tag3'],
  shareMessage: 'Why [topic] might not work the way you think',
};

const post = getBlogPost('post-slug')!;
---

<BlogPostLayout post={post}>
  <!-- Opening Hook -->
  <p class="text-lg">
    Engaging opening paragraph that hooks the reader...
  </p>

  <!-- Main Section with Cards -->
  <h2 class="text-3xl font-bold mt-12 mb-6">Section Title</h2>

  <p class="mb-4">
    Content with inline <Badge client:load variant="secondary">highlighted terms</Badge>
  </p>

  <div class="grid md:grid-cols-2 gap-6 my-8">
    <Card client:load>
      <CardHeader>
        <CardTitle className="text-xl">Key Point Title</CardTitle>
        <CardDescription>Brief overview</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Detailed explanation of the point...
        </p>
      </CardContent>
    </Card>

    <Card client:load>
      <CardHeader>
        <CardTitle className="text-xl">Another Point</CardTitle>
        <CardDescription>Brief overview</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          More details here...
        </p>
      </CardContent>
    </Card>
  </div>

  <!-- Blockquote for Emphasis -->
  <blockquote class="border-l-4 border-primary pl-4 my-8 italic text-lg text-muted-foreground">
    "Important quote or key insight that stands out"
  </blockquote>

  <!-- Another Section -->
  <h2 class="text-3xl font-bold mt-12 mb-6">Another Section</h2>

  <p class="mb-4">More content...</p>

  <!-- Lists -->
  <ul class="list-disc list-inside space-y-2 my-6">
    <li>Point one with details</li>
    <li>Point two with explanation</li>
    <li>Point three with context</li>
  </ul>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8 my-12">
    <h3 class="text-2xl font-bold mb-4">Ready to Take Action?</h3>
    <p class="mb-6 text-muted-foreground">
      Encouraging text that leads to action...
    </p>
    <Button client:load size="lg" className="gap-2">
      Get Started
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Button>
  </div>

  <!-- Key Takeaways -->
  <h2 class="text-3xl font-bold mt-12 mb-6">Key Takeaways</h2>

  <div class="space-y-4">
    <Card client:load className="border-l-4 border-primary">
      <CardContent className="pt-6">
        <p class="font-semibold mb-2">Takeaway Point 1</p>
        <p class="text-sm text-muted-foreground">Brief explanation of this key point</p>
      </CardContent>
    </Card>

    <Card client:load className="border-l-4 border-primary">
      <CardContent className="pt-6">
        <p class="font-semibold mb-2">Takeaway Point 2</p>
        <p class="text-sm text-muted-foreground">Explanation of another key insight</p>
      </CardContent>
    </Card>
  </div>
</BlogPostLayout>
```

## Content Quality Standards

When transforming content into blog posts, prioritize these non-functional requirements:

### 1. Rigorous & Research-Backed

- **Cite credible sources**: If the source content references academic papers, industry research, or authoritative publications, preserve and format those citations
- **Provide evidence**: Keep data, statistics, or expert opinions from the original
- **Include references**: Add a "References" section at the end if the source content has citations
- **Use Badge components** to highlight research citations: `<Badge client:load variant="outline">Source: Nature 2024</Badge>`

Example citation format:

```astro
<p class="mb-4">
  Recent studies show that AI-assisted writing increases productivity by 40%
  <Badge client:load variant="outline" className="ml-2">MIT Study 2024</Badge>
</p>
```

### 2. Unique & Original

- **Preserve the author's voice**: Do not rewrite the content in a generic tone — keep what makes it unique
- **Original insights**: Retain the author's original observations and conclusions
- **Unique examples**: Keep specific, concrete examples from the source content
- **Challenge assumptions**: If the source content challenges conventional wisdom, highlight that

### 3. Insightful & Thought-Provoking

- **Second-order thinking**: If the source content goes beyond obvious observations, make that structure visible
- **Hidden connections**: Use Card components to spotlight non-obvious relationships
- **Counterintuitive points**: Highlight phenomena that contradict expectations using visual components

Use Card components to spotlight key insights:

```astro
<Card client:load className="bg-primary/5 border-primary">
  <CardHeader>
    <CardTitle className="text-xl">Key Insight</CardTitle>
  </CardHeader>
  <CardContent>
    <p class="text-muted-foreground">
      The surprising observation that changes how we think about [topic]...
    </p>
  </CardContent>
</Card>
```

### 4. Click-Baity & Engaging (Ethically)

- **Compelling hook**: If the source content opens flat, add a hook that's true to the author's style
- **Curiosity gaps**: Use subheadings that tease what's coming next
- **Scroll-stopping subheadings**: Make H2/H3 headings intriguing enough to keep reading

### 5. Narrative & Story-Driven

- **Story arc**: Preserve the original narrative structure (setup, tension, resolution)
- **Concrete scenarios**: Keep specific examples and case studies from the source
- **Tension and conflict**: Highlight problems, challenges, or paradoxes with blockquotes or Cards

### Content Quality Checklist

Before finalizing, verify:

- [ ] Author's original voice and message are preserved
- [ ] At least 2-3 credible sources cited (if present in source content)
- [ ] Unique angle or perspective maintained from the original
- [ ] At least one "aha!" insight highlighted with a visual component
- [ ] Opening hook that grabs attention within first 2 sentences
- [ ] Clear narrative arc with tension and resolution
- [ ] Concrete examples and scenarios (not just abstract concepts)
- [ ] Title delivers on its promise
- [ ] Ending provides satisfying closure and actionable takeaways

## SEO & Design Requirements

### Typography

- Opening: `text-lg` class
- H2: `text-3xl font-bold mt-12 mb-6`
- H3: `text-2xl font-bold mt-8 mb-4`
- Paragraphs: `mb-4` spacing
- Lists: `space-y-2 my-6`

### Responsive Design

- Cards grid: `md:grid-cols-2` (stacks on mobile)
- All components are fluid width
- Text remains readable on small screens

### Dark/Light Mode

- Use semantic colors:
  - `text-foreground`, `text-muted-foreground`
  - `bg-card`, `bg-muted`, `bg-background`
  - `border-border`
  - `text-primary`, `bg-primary`

### Spacing

- Sections: `mt-12` top margin
- Components: `my-8` vertical margin
- Content: proper `mb-4` or `space-y-*`

## Interactive Elements by Topic

**Tech**: Code blocks, comparison cards, step-by-step guides
**Marketing**: Strategy cards, metrics highlights, campaign examples
**Entrepreneurship**: Timelines, lessons learned, founder insights
**Productivity**: Habit cards, process flows, actionable checklists
**Health**: Research highlights, protocol cards, evidence-based tips

## Important Notes

- Always use `client:load` for React components
- Keep paragraphs short (2-4 sentences) — split long paragraphs from source content
- Use proper heading hierarchy
- Social share buttons auto-added by layout
- Reading time auto-calculated
- Post auto-appears on homepage

## Dev Server Management

The agent is responsible for ensuring exactly ONE `pls dev` process is running throughout the blog post workflow.

**Before starting any work**, check if a dev server is already running:

```bash
lsof -i :4321
```

- If a server is already running on port 4321, do nothing — it is ready to use.
- If no server is running, start one yourself in the background:

```bash
pls dev
```

The blog post will be available at `http://localhost:4321/blog/[slug]` once the server is running.

## Iteration Loop

After creating the initial blog post:

1. Tell the user the file path and the preview URL: `http://localhost:4321/blog/[slug]`
2. Ask the user to review and provide feedback
3. Make edits based on feedback
4. Repeat until the user is satisfied

## Lint Check

Run `pls lint` at these points in the workflow:

1. **After creating the blog post file** — before presenting it to the user for review
2. **After each round of edits** — before asking the user to review again
3. **Before committing** — must pass to proceed

```bash
pls lint
```

If linting fails, fix the issues yourself and re-run until it passes. Do not present lint errors to the user — resolve them automatically.

## After Finalization

Once the user is satisfied with the blog post:

1. Ensure `pls lint` passes
2. Commit the changes (see Commit & PR section below)
3. Create a PR (see Commit & PR section below)
4. The blog post will automatically:
   - Appear on homepage
   - Be included in search index
   - Have OG image generated
   - Be sorted by date
   - Be filterable by topic and tags

## Commit & PR

Once the user confirms they are happy with the blog post, commit and create a PR.

### Step 1: Commit

Use the `/commit-changes` skill conventions:

1. Run `pls lint` — must pass before committing
2. Run `git status` and `git diff` to review changes
3. Stage the new blog post file: `git add src/pages/blog/<slug>.astro`
4. Commit using Conventional Commits format:

```bash
git commit -m "$(cat <<'EOF'
feat(blog): add <short title slug>

<1-2 sentence summary of the blog post topic>
EOF
)"
```

**Important**:

- NO `--no-verify` flag
- NO co-authored-by tags
- NO `-i` (interactive) flag

### Step 2: Push

Push the branch to remote:

```bash
git push -u origin blog/<slug>
```

### Step 3: Create PR

Create a PR using `gh pr create` with:

```bash
gh pr create --title "feat(blog): add <post title>" --body "$(cat <<'EOF'
## Summary
- Add new blog post: "<Post Title>"
- Topic: <topic> | Tags: <tag1>, <tag2>, <tag3>

## Preview
Visit http://localhost:4321/blog/<slug> to preview (requires `pls dev`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 4: Confirm

Share the PR URL with the user and let them know the blog post is ready for review.

### Step 5: Babysit the PR

After creating the PR, if the user asks to babysit it, use the **babysit-pr** skill (`/babysit-pr`) to:

1. Fetch all review comments from the PR
2. Address each comment — fixing code issues or replying to false positives
3. Commit fixes, push, and reply to each comment
4. Report back to the user with a summary

This ensures the PR receives proper attention even if the user steps away.
