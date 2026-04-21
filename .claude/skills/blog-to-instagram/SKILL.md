---
name: blog-to-instagram
description: Convert published blog posts into Instagram carousel slides (1080x1080 PNGs). TRIGGER when: user mentions publishing/merging a blog post, converting blog to Instagram, creating carousel slides, or asks for social media content from a blog post.
---

# Blog to Instagram Carousel

## Step 1: Detect the Blog Post

Find the blog post to convert:

1. **User specifies a slug or path** — use it directly.
2. **No post specified** — check git log for recently merged blog posts:
   ```bash
   git log --oneline -10 -- src/pages/blog/
   ```
   If multiple, ask the user which one.

Read the full file. Extract: title, description, author, date, section headings, key points, quotes/statistics, and the narrative arc.

## Step 2: Plan the Carousel

Design 5-20 slides with this structure:

1. **Hook** — A bold statement or question (NOT the blog title) that makes someone swipe.
2. **Context** — 1-2 sentences on why this matters.
3. **Key Points** (3-6 slides) — One idea per slide. Each teases the next.
4. **Summary** — Core message in 1-2 lines.
5. **CTA** — Save, follow, comment. Include blog URL if applicable.

Write for zero-context readers. Short sentences, no unexplained jargon. Headings: 15 words max, body: 30 words max.

## Step 3: Update the Generation Script

Edit `scripts/generate-instagram-carousel.tsx` with the new slide content. Follow the existing patterns in the script (fonts, brand bar, color palette, Satori rendering).

Key patterns to follow:

- Every slide uses the same `C.bg` background
- Use the Okabe-Ito palette (`C.blue`, `C.orange`, `C.green`, `C.amber`) for accents
- Headings min 40px, body min 28px on 1080x1080 canvas
- All parent divs with multiple children need `display: flex`
- No conditional rendering — use empty strings instead of `null`/`undefined`

**Satori constraints:**

- **No inline underlines.** Every child of a multi-child `<div>` is a flex item — no inline text flow. `<p>` + `<span>` also fails. Use one text node per `<div>`; emphasize with color or font weight.
- **Centering text requires `justifyContent: 'center'` on every text div.** Parent `alignItems: 'center'` only centers the flex item's bounding box, not the text within it. When the user says to "center" or "centralize" text, the text div itself must have `justifyContent: 'center'`.

## Step 4: Run and Verify

```bash
bun run scripts/generate-instagram-carousel.tsx <slug>
```

Review every PNG for:

- No text overflow
- No critical content within ~80px of bottom or ~120px of top (Instagram overlays UI there)
- Filled, purposeful layout (no excessive whitespace)
- Narrative flow between slides

Tell the user where files are saved and how many slides. Offer to adjust content, design, or structure.

Do NOT commit the `instagram/` output folder — ensure it is in `.gitignore`.
