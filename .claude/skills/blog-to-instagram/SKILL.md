---
name: blog-to-instagram
description: Convert published blog posts into Instagram carousel slides (1080x1080 PNGs). TRIGGER when: the user mentions merging a blog post to main, publishing a blog post, converting a blog post to Instagram, creating carousel posts from a blog, or wants to turn blog content into social media content. Also trigger if the user says something like "make instagram posts", "create carousel", "turn this into reels content", "social media version", or "instagram slides" after working on a blog post.
---

# Blog to Instagram Carousel

Convert a blog post into an engaging Instagram carousel that hooks scrollers and drives engagement.

## When to Use

Activate this skill when the user:

- Mentions merging or finishing a blog post and wants social content from it
- Asks to convert a blog post into Instagram posts or carousel slides
- Wants to create social media content from blog content
- Says things like "make it instagram-ready", "create a carousel", "turn the blog post into posts"

## Step 1: Detect the Blog Post

Find the blog post to convert. Use the most specific method available:

1. **If the user specifies a slug or file path** — use that directly.
2. **If no post specified** — check git log for recently merged blog posts:
   ```bash
   git log --oneline -10 -- src/pages/blog/
   ```
   Identify the most recently added or modified `.astro` blog file. If multiple, ask the user which one they want.

Read the full blog post file and extract:

- Title, description, author, date (from frontmatter)
- All section headings (H2, H3)
- Key points under each heading
- Any quotes, statistics, or bold claims
- The overall narrative arc

## Step 2: Plan the Carousel Structure

Design 5-10 slides that tell the blog post's story in a way that makes a random Instagram scroller want to keep swiping. Think about what makes someone stop mid-scroll and engage.

**Slide structure (follow this order):**

1. **Hook Slide** — A bold, curiosity-inducing statement or question. NOT the blog title. Something that makes someone think "wait, what?" and swipe. Use the blog's most counterintuitive, surprising, or provocative point as the hook. The goal is to create a curiosity gap.

2. **Context Slide** — Briefly set up why this topic matters. 1-2 sentences. Make the reader feel like this affects them personally.

3. **Key Point Slides** (3-6 slides) — One idea per slide. Each slide should:
   - State the point clearly and concisely
   - Use simple language (no jargon)
   - Feel like a revelation, not a lecture
   - End with a subtle tease of what's next (creates swipe momentum)

4. **Summary/Takeaway Slide** — Distill the core message into 1-2 punchy lines.

5. **CTA Slide** — Call to action:
   - "Liked this? Hit save for later"
   - "Follow for more [topic] insights"
   - "Drop a comment — what's your experience with [topic]?"
   - Include the blog URL if applicable

**Content writing rules:**

- Write for someone who has never heard of this topic — assume zero context
- Use short sentences. Fragment sentences are fine. Even one word.
- Each slide should have 15 words or fewer for headings, 30 words or fewer for body text
- No jargon, no acronyms, no technical terms unless immediately explained
- Every slide should make you want to see the next one — create tension, then promise resolution

## Step 3: Generate the PNG Images

**Before writing any code, activate the frontend-design skill** (`/document-skills:frontend-design`) to guide the visual design of the carousel. Use its principles for typography, color, layout, and spatial composition to create a distinctive, non-generic aesthetic. Avoid overused fonts like Inter, Roboto, and Arial — choose a distinctive display font for headings paired with a refined body font.

### Design Rules

1. **Consistent background color** — ALL slides in a carousel MUST use the same background color. No exceptions. The hook slide, content slides, summary, and CTA all share one unified background throughout.

Create a script that uses Satori (already a project dependency) and Sharp (already a project dependency) to render each slide as a 1080x1080 PNG.

### Visual Design

The frontend-design skill handles the visual aesthetic (typography, color, layout, spatial composition). Commit to a bold, cohesive direction and execute it with precision.

**Accessibility baseline** — Use the **Okabe-Ito palette** for accent colors (safe for all types of color vision deficiency): `#d55e00` orange, `#56b4e9` sky, `#009e73` green, `#cc79a7` purple, `#e69f00` amber, `#0072b2` blue. Ensure all text meets WCAG AA contrast against its background.

**Typography** — Choose a distinctive display font for headings (avoid Inter, Roboto, Arial). Pair it with a refined body font. Load both from Google Fonts.

### Slide Background Rules

1. **All slides use the same background** — The hook, every content slide, the summary, and the CTA all share one unified background color. No exceptions.
2. **Never alternate** between light and dark slides
3. **CTA slide** — same background as all other slides (do NOT use a colored background)

### Creating the Generation Script

Write a standalone script at `scripts/generate-instagram-carousel.ts` that:

1. Accepts the blog post slug as an argument
2. Reads the blog post from `src/pages/blog/[slug].astro`
3. Extracts frontmatter and content
4. Generates slide JSX for each slide in the carousel
5. Renders each slide using Satori (1080x1080)
6. Converts SVG to PNG using Sharp
7. Saves PNGs to `instagram/<slug>/slide-01.png`, `slide-02.png`, etc.

Use the existing `loadGoogleFont` function from `src/lib/font-cache.ts` (copy it or import it — it handles font loading and caching).

**Font loading** — Load the chosen heading and body fonts from Google Fonts. Use the same `loadFont` pattern from the existing `scripts/generate-instagram-carousel.tsx` (fetch Google Fonts CSS, parse font URL, download as ArrayBuffer). Load appropriate weights for each font family.

**Important Satori constraints:**

- ALL parent divs with multiple children MUST have explicit `display: flex` (or `display: contents` / `display: none`)
- No conditional rendering — use empty strings instead of `null` or `undefined`
- No `margin: auto` — use explicit flexbox alignment instead
- Text must have explicit `width` or be inside a flex container with explicit sizing
- `position: absolute` is supported for overlay elements

## Step 4: Run the Script and Deliver

1. Run the generation script:

   ```bash
   bun run scripts/generate-instagram-carousel.ts <slug>
   ```

2. Verify the output:
   - Check that all PNG files were created in `instagram/<slug>/`
   - Verify each image is 1080x1080px by running:
     ```bash
     for f in instagram/<slug>/slide-*.png; do echo "$(basename "$f"): $(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | grep pixel | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')"; done
     ```
   - Spot-check readability by viewing the images (use the Read tool on PNG files)

   - **Font size consistency check** — Read the generation script (`scripts/generate-instagram-carousel.tsx`) and audit all `fontSize` values. Verify they follow a consistent hierarchy:
     - **Display**: 68px (hook slide only)
     - **Accent labels**: 44px (highlighted terms like EXPLICIT, FLEXIBLE)
     - **Headings**: 40px (slide headings and key statements)
     - **Sub-headings**: 36px (numbered items, important points)
     - **Body**: 30px (main body text)
     - **Small**: 24px (transition lines, secondary info, muted text)
     - No other font sizes should appear. If any value falls outside this set, fix it.

   - **Safe zone check** — Instagram overlays UI elements on the bottom and top of carousels. Verify that no critical content sits within ~80px of the bottom edge or ~120px of the top edge (where the Instagram username/timestamp bar appears). If text is too close to these zones, increase padding.

3. **Quality checklist** — After generating all slides, view every PNG and verify ALL of the following:
   - **Frontend-design skill was used** — Confirm the visual aesthetic is distinctive and non-generic (no Inter/Roboto/Arial, intentional color choices, bold typography). If it looks like a default template, the design skill was not properly applied.
   - **Consistent background** — Every single slide must have the exact same background color. Spot-check by flipping between slides — there should be no visual jarring from background changes.
   - **Minimal color palette** — Each slide uses at most 2-3 colors. The same 2-3 colors are used consistently across ALL slides. If a slide introduces a new accent color that doesn't appear elsewhere, fix it.
   - **Mobile-readable font sizes** — Instagram is viewed on phones. Verify that:
     - Headings are legible without zooming (minimum 40px equivalent on the 1080x1080 canvas)
     - Body text is readable (minimum 28px equivalent on the 1080x1080 canvas)
     - Font weight is at least 400 for body, 600+ for headings — thin fonts are hard to read on screens
   - **No excessive white space** — Each slide should feel filled and purposeful. Content should be centered and use the available space well. If a slide looks empty or has large blank areas, either enlarge the content, add supporting visuals, or consolidate slides.

4. Tell the user:
   - Where the files are saved
   - How many slides were generated
   - A brief summary of the carousel narrative (hook → key points → CTA)

5. Ask the user to review the slides and offer to adjust:
   - Content (rewrite hooks, rephrase points)
   - Design (colors, layout, fonts)
   - Structure (add/remove slides, reorder)

## Step 5: Iterate

If the user wants changes, update the slide content or design and regenerate. Common adjustments:

- "Make the hook punchier" — rewrite the hook slide
- "This slide is too text-heavy" — cut it down or split into two
- "I don't like the colors" — adjust the palette
- "Can you add a slide about [X]?" — insert a new content slide
- "Make it more clickbaity" — strengthen the curiosity gaps on each slide
- "The CTA doesn't fit our brand" — rewrite the call to action

Do NOT commit the instagram output folder — these are generated assets for manual upload, not part of the codebase. Add `instagram/` to `.gitignore` if not already there.
