# Task Specification: Software Design Philosophy - Part 1

**Ticket ID:** CU-86ewuvbmf
**Status:** Draft
**Created:** 2026-03-05
**Scope:** Part 1 of 8-part series (this ticket only)

---

## Overview

Upload "Software Design Philosophy" as the first article in an 8-part engineering series. Transform the existing article content (saved at `spec/CU-86ewuvbmf/article.md`) into an engaging blog post with animated visual diagrams that bring abstract concepts to life. This is an opinion/educational piece — no quizzes or gamification, just clear writing with compelling visualizations.

**Goal:** Create a polished blog post that faithfully presents the article's ideas about changeability, locality, coupling, cohesion, and dependencies, enhanced with animated diagrams that make the concepts viscerally understandable.

---

## Acceptance Criteria

### 1. Blog Post Creation

- [ ] Create new Astro blog post at `src/pages/blog/software-design-philosophy-part-1.astro`
- [ ] Follow existing blog post pattern (reference: `the-llm-inflation-paradox.astro`)
- [ ] Include proper frontmatter with:
  - title: "Software Design Philosophy"
  - description: "Part 1 of 8: Understanding what makes software valuable and how to protect that value through good design"
  - author: "Adelphi Liong"
  - date: Current date
  - topic: "tech"
  - tags: ['software-design', 'engineering', 'architecture', 'best-practices']
  - shareMessage: "Why changeability is the most important property of software"

### 2. Content Structure

- [ ] Include series header indicating "Part 1 of 8: The AtomiCloud Engineering Series"
- [ ] Preserve ALL article content faithfully — this is an upload, not a rewrite
- [ ] Use appropriate heading hierarchy (h2 for major sections)
- [ ] Format the ASCII code block in the "Locality" section with proper monospace styling
- [ ] Series navigation links at top (table of contents) and bottom (prev/next) — link only to Part 1 for now (other parts don't exist yet), show other parts as plain text

### 3. Animated Diagrams (3 React Components)

All diagrams must be:

- Pure React + Tailwind CSS + CSS/JS animations (no external viz libraries)
- Mobile-responsive (stack vertically on small screens)
- Dark mode aware (use semantic color tokens)
- Animated — use CSS animations, transitions, or lightweight JS animation to illustrate the concepts dynamically

**Animation approach flexibility:** Use whatever technique works best per diagram — CSS keyframe animations, CSS transitions triggered by intersection observer (animate on scroll into view), short looping animations, or interactive state changes on click/hover. The goal is to make the concepts _feel_ real, not just look pretty.

#### Diagram 1: Locality — Global vs Local (`LocalityDiagram.tsx`)

- **Section:** "Locality: The Core Property"
- **Purpose:** Illustrate _why_ locality matters using the physics analogy from the article
- **Layout:** Two panels side-by-side (desktop) / stacked (mobile), each with a caption below
- **Left panel: "Without Locality (Global)"**
  - A field of dots scattered across the panel, all interconnected with faint lines
  - Highlight one dot (the "dot of interest")
  - Animation: to understand how this dot is affected, lines light up one-by-one spreading outward — first to its direct neighbors, then to _their_ neighbors, cascading until eventually ALL dots in the entire field are lit up. The point: you need to account for everything, up to infinity
  - Caption: "To understand one dot, you must account for every other dot — up to infinity"
- **Right panel: "With Locality (Field Abstraction)"**
  - Same dot of interest, but now it sits inside a bounded box (the "field")
  - A few other dots inside the same box, connected to the dot of interest
  - Dots outside the box are visible but grayed out / faded — they exist but are irrelevant
  - Animation: highlight the dot, only the dots _within the field_ light up. The boundary absorbs everything else. How the field itself is formed? An arrow or label pointing outward says "deferred" — that's someone else's problem
  - Caption: "You only need to know the field. How the field is formed is deferred elsewhere"
- **Colors:** Red/destructive tones for the global cascade, primary/green tones for the contained field

#### Diagram 2: Concepts Relationship Map (`ConceptsMap.tsx`)

- **Section:** "How These Ideas Relate"
- **Purpose:** Clean visual replacement for the mermaid diagram — help readers see the series roadmap at a glance
- **Requirements:**
  - Static flowchart (no fancy animations — clarity is the goal)
  - Flowchart showing: Changeability -> Locality -> Dependencies -> (Low Coupling + High Cohesion) -> [SOLID, Functional Thinking, DDD, Three-Layer Architecture, Wiring, Testing]
  - Layered top-to-bottom layout with arrows
  - Group labels matching the article's subgraph names (Goal, Core Property, Problem, Tension, Solutions)
  - Clean, readable at all sizes
  - Subtle entrance fade when scrolled into view is fine, but no progressive reveal or attention-grabbing animation

#### Diagram 3: Fragility vs Rigidity (`SymptomsVisualization.tsx`)

- **Section:** "Two Symptoms of Poor Locality"
- **Purpose:** Visualize the two failure modes as dependency web problems
- **Layout:** Two panels side-by-side (desktop) / stacked (mobile), each with a caption below
- **Left panel: "Fragility (Action at a Distance)"**
  - A web of dots connected by lines (dependency strings)
  - Animation: one dot changes (highlight/pulse), the change propagates _through the lines_ in multiple layers — first hop, second hop, third hop — until it reaches and breaks a dot far away that seems completely unrelated. The propagation should feel like a shockwave traveling through the web
  - The broken distant dot flashes red / shows a break indicator
  - Caption: "Change one thing, something far away breaks"
- **Right panel: "Rigidity (Hard to Change)"**
  - Same style web of dots connected by lines
  - Animation: one dot is the "thing we want to change" (highlight it, show it partially changed). But then its connected dots light up one-by-one — each one _also_ needs to change. Show the growing scope: the dot of interest can't change alone, it drags all its dependencies along
  - The growing cluster of "things that need changing" becomes visually overwhelming
  - Caption: "To change one thing, you must change everything connected to it"
- **Both panels:** Loop the animation (with a pause between loops) so readers can watch it play out multiple times

### 4. Mobile Responsiveness

- [ ] All diagrams stack vertically on screens < 768px
- [ ] Text remains readable at all viewport sizes
- [ ] No horizontal scrolling on mobile devices
- [ ] Animations work well on mobile (no performance issues)

### 5. Dark Mode Support

- [ ] All custom components use semantic color tokens from Tailwind
- [ ] Diagrams use theme-aware colors (not hardcoded)
- [ ] Test all visual elements in both light and dark modes

### 6. Component Architecture

- [ ] Create 3 components in `src/components/`:
  - `LocalityDiagram.tsx`
  - `ConceptsMap.tsx`
  - `SymptomsVisualization.tsx`
- [ ] Use React components with `client:load` directive
- [ ] Follow existing component patterns (see `CompressionDiagram.tsx`)
- [ ] Use `cn()` utility for conditional class names

### 7. Blog Post Registration

- [ ] Automatic discovery via `import.meta.glob` should work — no manual registration needed
- [ ] Ensure RSS feed includes new post automatically

---

## Technical Constraints

- No new external dependencies
- Use existing: React, Tailwind CSS, shadcn/ui components where appropriate
- All diagram components: pure React + Tailwind + CSS/JS animations (no D3.js, no chart libraries, no animation libraries like framer-motion)
- TypeScript for all components
- Animations should be performant — prefer CSS animations/transforms over JS-driven layout changes, use `will-change` sparingly, avoid layout thrashing

---

## Out of Scope

- Parts 2-8 of the series (separate tickets)
- Interactive quizzes or gamification (this is an opinion piece)
- Backend integration or dynamic data
- Custom OG image (can use default)
- Concept explorer / expandable cards

---

## References

- **Source article:** `spec/CU-86ewuvbmf/article.md`
- Existing blog post pattern: `src/pages/blog/the-llm-inflation-paradox.astro`
- Diagram component example: `src/components/CompressionDiagram.tsx`
- Blog post data structure: `src/lib/blog-posts.ts`
- UI components: `src/components/ui/` (Button, Card, Badge)
