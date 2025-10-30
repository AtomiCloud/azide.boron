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

## Content Quality Standards

When creating blog posts, prioritize these non-functional requirements to ensure exceptional quality:

### 1. Rigorous & Research-Backed

- **Cite credible sources**: Reference academic papers, industry research, or authoritative publications
- **Provide evidence**: Back up claims with data, statistics, or expert opinions
- **Include references**: Add inline citations or a "References" section at the end
- **Verify facts**: Cross-check information before including it
- **Use Badge components** to highlight research citations: `<Badge client:load variant="outline">Source: Nature 2024</Badge>`

Example citation format:

```astro
<p class="mb-4">
  Recent studies show that AI-assisted writing increases productivity by 40%
  <Badge client:load variant="outline" className="ml-2">MIT Study 2024</Badge>
</p>
```

### 2. Unique & Original

- **Fresh perspective**: Avoid rehashing common takes; find a novel angle
- **Original insights**: Share observations that aren't widely discussed
- **Unique examples**: Use specific, concrete examples rather than generic scenarios
- **Personal research**: Consider conducting small experiments or surveys
- **Challenge assumptions**: Question conventional wisdom where appropriate

### 3. Insightful & Thought-Provoking

- **Second-order thinking**: Go beyond obvious observations
- **Hidden connections**: Reveal non-obvious relationships between concepts
- **"Aha!" moments**: Structure content to deliver surprising realizations
- **Counterintuitive points**: Highlight phenomena that contradict expectations
- **Deep implications**: Explore the broader consequences of the topic

Use Card components to spotlight key insights:

```astro
<Card client:load className="bg-primary/5 border-primary">
  <CardHeader>
    <CardTitle className="text-xl">💡 Key Insight</CardTitle>
  </CardHeader>
  <CardContent>
    <p class="text-muted-foreground">
      The surprising observation that changes how we think about [topic]...
    </p>
  </CardContent>
</Card>
```

### 4. Click-Baity & Engaging (Ethically)

- **Compelling hook**: Open with a surprising fact, provocative question, or vivid scenario
- **Curiosity gaps**: Tease interesting information that gets revealed later
- **Pattern interrupts**: Break expectations to maintain attention
- **Progressive disclosure**: Build tension by revealing information gradually
- **Payoff**: Ensure the content delivers on the promise of the title
- **Scroll-stopping subheadings**: Make H2/H3 headings intriguing enough to keep reading

**Opening hook strategies:**

- Start with a counterintuitive statement
- Begin with a mini-story or anecdote
- Ask a provocative question
- Present a surprising statistic
- Describe a relatable problem vividly

### 5. Narrative & Story-Driven

- **Story arc**: Structure with beginning (setup), middle (tension), end (resolution)
- **Concrete scenarios**: Use specific examples and case studies
- **Character elements**: Feature real people or personified concepts
- **Tension and conflict**: Highlight problems, challenges, or paradoxes
- **Visual storytelling**: Use descriptive language that paints mental pictures
- **Emotional resonance**: Connect with readers' experiences and feelings

**Narrative techniques:**

- Use "Before/After" frameworks
- Tell origin stories of ideas or technologies
- Create hypothetical scenarios readers can visualize
- Use metaphors and analogies to make abstract concepts concrete
- Include micro-stories within sections (2-3 sentence anecdotes)

**Story structure template:**

```astro
<!-- Act 1: Setup -->
<p class="text-lg">
  [Hook: Surprising observation or relatable problem]
</p>

<!-- Act 2: Investigation -->
<h2>The Hidden Pattern</h2>
<p>[Explore the phenomenon with research and examples]</p>

<!-- Act 3: Implications -->
<h2>What This Means For You</h2>
<p>[Connect insights to reader's life]</p>

<!-- Resolution: Key Takeaways -->
<h2>Key Takeaways</h2>
[Distill the lessons learned]
```

### Content Quality Checklist

Before publishing, verify:

- [ ] At least 2-3 credible sources cited
- [ ] Unique angle or perspective not commonly discussed
- [ ] At least one "aha!" insight that surprises readers
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
