---
name: write-blog-post
description: Help non-programmers write interactive, SEO-friendly blog posts with rich formatting, Cards, Badges, Buttons, and infographic-style layouts. Automatically adds posts to homepage with cover images. Use when user wants to create or write a new blog post.
---

# Blog Post Writer

Guide non-programmers through creating beautiful, interactive blog posts for the Azide Boron blog.

## When to Use

Activate this skill when the user wants to:

- Write a new blog post
- Create blog content
- Publish an article
- Add a post to the blog

## Process Overview

### Step 1: Understand the Content

Ask the user:

- **Topic**: What do they want to write about?
- **Audience**: Who is the target reader?
- **Key Message**: What's the main takeaway?
- **Main Points**: What specific points should be covered?

### Step 2: Plan the Structure

Based on their input, suggest a structure:

- Opening paragraph (engaging hook)
- 3-5 main sections with headings
- Key insights as Card components
- Important terms as Badges
- Call-to-action with Button components
- Key takeaways section at the end

### Step 3: Gather Metadata

Help craft:

- **Title**: Compelling, SEO-friendly (50-60 characters)
- **Description**: Clear summary (120-160 characters)
- **Topic**: tech | marketing | entrepreneurship | productivity | health
- **Tags**: 3-5 relevant tags (lowercase, hyphenated)

**Important**: Once title is decided, ask:

> "Please provide a URL to a cover image for this blog post. This will be displayed on the homepage card."

### Step 4: Get Author Info

Run to get git username:

```bash
git config user.name
```

Use this as the author. Use today's date (YYYY-MM-DD format).

### Step 5: Create the Blog Post File

Generate slug from title (lowercase, spaces to hyphens, remove special chars).

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
  coverImage: 'https://example.com/image.jpg',
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
- Keep paragraphs short (2-4 sentences)
- Use proper heading hierarchy
- Social share buttons auto-added by layout
- Reading time auto-calculated
- Post auto-appears on homepage

## After Creation

1. Show user the file path
2. Tell them to refresh http://localhost:4321/
3. Offer to preview the blog post at http://localhost:4321/blog/[slug]
4. Ask if they want adjustments

The blog post will automatically:

- Appear on homepage
- Be included in search index
- Have OG image generated
- Be sorted by date
- Be filterable by topic and tags
