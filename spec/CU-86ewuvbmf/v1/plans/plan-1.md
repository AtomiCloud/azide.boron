# Implementation Plan: Software Design Philosophy - Part 1

**Ticket:** CU-86ewuvbmf
**Spec Version:** 1
**Scope:** Create blog post with 3 animated diagrams

---

## Goal

Upload the "Software Design Philosophy" article as a polished blog post with animated diagrams that make abstract concepts viscerally understandable. The diagrams should bring locality, concept relationships, and fragility/rigidity symptoms to life through CSS animations.

---

## Files to Create/Modify

### Create

1. `src/pages/blog/software-design-philosophy-part-1.astro` — Blog post page
2. `src/components/LocalityDiagram.tsx` — Global vs Local animation
3. `src/components/ConceptsMap.tsx` — Static flowchart with entrance fade
4. `src/components/SymptomsVisualization.tsx` — Fragility vs Rigidity animations

### No modifications needed

- Blog posts auto-discovered via `import.meta.glob` in `src/lib/blog-posts.ts`

---

## Implementation Approach

### Step 1: Create LocalityDiagram.tsx

**Purpose:** Visualize why locality matters using the physics analogy.

**Approach:**

- Two-panel layout: side-by-side on desktop, stacked on mobile
- Use CSS Grid with `grid-cols-1 md:grid-cols-2`
- Each panel has a caption below

**Left Panel (Without Locality):**

- Scatter ~15-20 dots randomly across a bounded area
- Draw faint connecting lines between all dots (use absolute positioning)
- Highlight one "dot of interest" with primary color
- **Animation:** Use CSS `@keyframes` with `animation-delay` to cascade the highlight through connections:
  - First frame: highlight the dot of interest
  - Subsequent frames: progressively light up neighbors in waves
  - Use `nth-child` delays to create the cascade effect
- Color: destructive/red tones for the cascade

**Right Panel (With Locality):**

- Same dot of interest, but inside a visible boundary box (border)
- 3-4 dots inside the box connected to the center dot
- Other dots outside the box are visible but faded (`opacity-30`)
- **Animation:** Only dots inside the boundary light up
- Label/arrow pointing outward: "deferred"
- Color: primary/green tones

**Implementation Details:**

- Use `useState` + `useEffect` with Intersection Observer to trigger animation when scrolled into view
- Or use CSS animation with `animation-play-state: paused` and a class toggle on mount
- Loop the animation with a 2-second pause between cycles

### Step 2: Create ConceptsMap.tsx

**Purpose:** Clean visual flowchart showing the series roadmap.

**Approach:**

- Static flowchart (no fancy progressive reveal)
- Use flexbox/grid for layered top-to-bottom layout
- Five layers: Goal → Core Property → Problem → Tension → Solutions
- Use CSS arrows (or SVG) between layers

**Structure:**

```
Changeability (Goal)
       ↓
Locality (Core Property)
       ↓
Dependencies (Problem)
       ↓
Low Coupling ←→ High Cohesion (Tension)
       ↓
[SOLID, Functional, DDD, 3-Layer, Wiring, Testing] (Solutions)
```

**Styling:**

- Group labels (Goal, Core Property, etc.) as small text above each layer
- Solutions can be in a flex row with gap
- Subtle fade-in animation on mount (optional, via CSS transition on opacity)

**Implementation:**

- Pure React + Tailwind, no external libraries
- Use semantic colors: primary for main flow, muted for labels

### Step 3: Create SymptomsVisualization.tsx

**Purpose:** Visualize fragility (action at a distance) and rigidity (hard to change).

**Approach:**

- Two-panel layout: side-by-side on desktop, stacked on mobile
- Same dot/line web style as LocalityDiagram for consistency

**Left Panel (Fragility):**

- Web of ~12 dots connected by lines
- One dot changes (pulse animation)
- **Animation:** Change propagates like a shockwave:
  - First hop dots light up (delay 0.2s)
  - Second hop dots light up (delay 0.4s)
  - Third hop dots light up (delay 0.6s)
  - Final distant dot "breaks" (flashes red, shows X or crack icon)
- Loop with pause between cycles

**Right Panel (Rigidity):**

- Same web style
- One dot highlighted as "thing to change"
- **Animation:** Connected dots light up one-by-one, showing growing scope
  - Visual cluster of "must also change" grows
  - The cluster becomes visually overwhelming
- Loop with pause between cycles

**Implementation:**

- Use CSS animations with staggered delays
- Consider using `data-hop` attributes to track distance from source
- Use `cn()` utility for conditional classes

### Step 4: Create Blog Post

**File:** `src/pages/blog/software-design-philosophy-part-1.astro`

**Frontmatter:**

```astro
export const frontmatter = {
  title: 'Software Design Philosophy',
  description: 'Part 1 of 8: Understanding what makes software valuable and how to protect that value through good design',
  author: 'Adelphi Liong',
  date: '2026-03-05',
  topic: 'tech' as const,
  tags: ['software-design', 'engineering', 'architecture', 'best-practices'],
  shareMessage: 'Why changeability is the most important property of software',
};
```

**Content Structure:**

1. Series header: "Part 1 of 8: The AtomiCloud Engineering Series"
2. Table of contents at top (link Part 1, others as plain text)
3. Article content from `spec/CU-86ewuvbmf/article.md` with diagrams inserted at appropriate points:
   - LocalityDiagram → After "Locality: The Core Property" section
   - ConceptsMap → After "How These Ideas Relate" section (replaces mermaid diagram)
   - SymptomsVisualization → After "Two Symptoms of Poor Locality" section
4. Series navigation at bottom (prev/next)

**Component Usage:**

```astro
<LocalityDiagram client:load />
<ConceptsMap client:load />
<SymptomsVisualization client:load />
```

**ASCII Code Block:**

- Format the code block in "Locality" section with `<pre class="...">` and monospace styling
- Use appropriate padding and overflow handling for mobile

---

## Edge Cases

1. **Mobile responsiveness:** All diagrams must stack vertically below 768px
2. **Dark mode:** All colors must use semantic tokens (primary, destructive, muted, etc.)
3. **Animation performance:** Use CSS transforms and opacity (GPU-accelerated), avoid layout thrashing
4. **Reduced motion:** Consider `prefers-reduced-motion` media query to disable animations
5. **Long content:** Blog post is long; ensure readability at all viewport sizes

---

## Testing Strategy

1. **Visual testing:** Manually verify all diagrams in both light/dark modes
2. **Mobile testing:** Test at 375px, 414px, 768px viewports
3. **Animation testing:** Verify animations loop correctly and pause between cycles
4. **Build testing:** Run `bun run build` to verify no errors
5. **Blog discovery:** Verify post appears on homepage and RSS feed

---

## Integration Points

- Blog post auto-discovered via `import.meta.glob` — no manual registration
- Components use existing `cn()` utility and semantic color tokens
- Follow existing patterns from `CompressionDiagram.tsx` and `the-llm-inflation-paradox.astro`

---

## Checklist (from task-spec)

### Blog Post Creation

- [ ] Create `src/pages/blog/software-design-philosophy-part-1.astro`
- [ ] Proper frontmatter with all required fields
- [ ] Series header indicating "Part 1 of 8"
- [ ] Preserve ALL article content faithfully
- [ ] Format ASCII code block with monospace styling
- [ ] Series navigation links (top TOC + bottom prev/next)

### Animated Diagrams

- [ ] `LocalityDiagram.tsx` — Global vs Local with cascading animation
- [ ] `ConceptsMap.tsx` — Static flowchart with subtle entrance
- [ ] `SymptomsVisualization.tsx` — Fragility vs Rigidity with looping animations

### Quality Requirements

- [ ] All diagrams mobile-responsive (stack < 768px)
- [ ] Dark mode support with semantic color tokens
- [ ] Performant animations (CSS transforms, opacity)
- [ ] Components use `cn()` utility

---

## Notes

- Source article at `spec/CU-86ewuvbmf/article.md` contains all content
- Reference `the-llm-inflation-paradox.astro` for blog post structure
- Reference `CompressionDiagram.tsx` for component styling patterns
- No external animation libraries — pure React + Tailwind + CSS
