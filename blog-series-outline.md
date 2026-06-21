# LLM posts — concept web (re-proposal)

> Standalone, cross-linked posts (no numbered series). Two **foundation** posts, then everything
> else grouped under your two pillars: **Autonomous Agents** (the practice) and **Probability
> Space Engineering** (the theory). Each pillar is one substantial post; split into two only if it
> runs long.

**Re-proposed count: 4 core posts** (+ optional micro-notes). Path to 6 if the pillars are split.

```
Foundations          1. Jagged Intelligence
                     2. How LLMs Actually Work        (the send-this primer)
Pillar A — practice  3. Autonomous Agents
Pillar B — theory    4. Probability Space Engineering
```

Hub link: **Probability Space Engineering** is the "why it works" most others point back to.

---

## 1. Jagged Intelligence _(foundation / frame)_

**Borrow the idea, add our implication.** Credit **Karpathy** — the term _jagged intelligence_
(LLMs superhuman on some tasks, then failing trivially simple ones; a jagged capability frontier,
not a smooth ladder). Don't re-derive it as if it's ours.

**Our implication (the new part):** if capability is a _surface_, the human-team mental model
(ladder, role-play, "treat it like a junior") is the wrong tool. You stop trying to make it act
human and instead **engineer around the surface** — which splits into two disciplines:
_Autonomous Agents_ (work the practice) and _Probability Space Engineering_ (work the theory).

**Covers:** Karpathy's jagged frontier (cited); why role prompts feel right but mislead; the
consequence — bad at _different_ things than a human, unpredictably (blind spots).
**Links to:** Autonomous Agents, Probability Space Engineering.

---

## 2. How LLMs Actually Work _(foundation / the explainer to send people)_

**Purpose, stated in the opener:** _"The short post you send to someone who doesn't get how LLMs
work."_ Accessible, no jargon, sendable. Not a deep theory post — that's #4.

**Covers:** it isn't a chat, it's **input → output**; the chat is just a view; **context vs
prompt**; context is far more than your messages (files, memory, tools) and lives in one fixed
**token budget**; a one-line bridge to the deeper model.
**Side notes / micro-posts it can link to:** _Context Rot_, _Context Pollution_ (why "just add
more context" backfires).
**Links to:** Probability Space Engineering (for the real mechanism).

---

## 3. Autonomous Agents _(Pillar A — the practice)_

**Thesis:** Stop steering an LLM three minutes at a time. Make the goal a file, loop on it, and
push your judgment to the edges — so an agent runs autonomously in the middle.

**Sections**

1. **The two failure modes.** Reliability (forgets, drifts, doesn't check) vs capability (bad
   reasoning, wrong assumptions) — and the two different fixes.
2. **Reliability → stateless loops.** Declarative (`goal.md`, end-state not keystrokes) +
   stateless (fresh context each loop); why looping beats collaborate/orchestrate/negotiate;
   the re-used prompt + the loop + `/goal`.
3. **Capability → specs.** Triage (interrogate the ticket) → spec (declare "done" + Definition
   of Done) → plan (decompose into verifiable slices). Condensed, genericized example.
4. **Push work to the edges.** The FP side-effects analogy; ticket → PR (plan / implementation /
   polish); human review at the boundary.
5. **The compounding harness.** First runs are mediocre (blind spots, not noise) → the evolution
   meta-loop: feedback → extract the rule → backtest → fold into the rules layer → the next run
   starts better. The system improves itself.

**Note:** the heaviest post — natural split is **3a Loops & Specs** / **3b The Compounding
Harness** if it runs long.
**Links to:** Probability Space Engineering (why these moves work), Jagged Intelligence, How LLMs Work.

---

## 4. Probability Space Engineering _(Pillar B — the theory)_

**Thesis:** Every model call **materializes one sample** from a _possibility space_ set by
`input + model`. Everything in _Autonomous Agents_ — and every optimization technique — is the
same act: **shaping that space** so it lands on the solution.

**Sections**

1. **The model.** solution / possibility / materialization; same input × 3 (space fixed, samples
   differ); shifting & shrinking the cloud; "algo in Ruby" vs "binary search"; the two knobs
   (input, model) + the model table.
2. **Context is a force.** More context isn't better — it reshapes the space (this is _why_ the
   stateless loop works). Context rot & pollution as the failure side.
3. **The operations catalog.** Each technique = shift / shrink the cloud, or shrink the solution
   space: fresh-context loops, implementer+reviewer (GAN), multi-reviewer, lint/dead-code
   pre-filtering, divide & conquer, **deterministic reduction** (write a rule → shrink the
   solution space). Side note: the **Ioannidis problem** (the good/bad ratio); benchmarks woven in.
4. **The callback.** Declarative, stateless, looping, a good spec — all of _Autonomous Agents_
   was probability-space engineering. Now you can see why.

**Note:** also heavy — natural split is **4a The Model** / **4b The Operations** if needed.
**Links to:** Autonomous Agents (the practice it explains), How LLMs Work, Jagged Intelligence.

---

## Optional micro-posts (small, focused, linkable)

- **Context Rot** ← How LLMs Work, Autonomous Agents, Probability Space Engineering
- **Context Pollution** ← How LLMs Work, Probability Space Engineering
- **The Ioannidis Problem** ← Probability Space Engineering
- **Inside the Loop (kloop)** — the production deep-dive (adversarial impl/reviewer, phased
  reviewers, propagation, randomization, the checkpointer) ← Autonomous Agents

---

## Counts at a glance

| Version                | Posts                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Lean (recommended)** | **4** — Jagged · How LLMs Work · Autonomous Agents · Probability Space Engineering |
| Split pillars          | 6 — foundations (2) + Agents (2) + PSE (2)                                         |
| + micro-notes          | as needed                                                                          |

## Open questions

1. **4 (pillars whole)** or **6 (pillars split)** to start?
2. Real vs genericized internal examples (PE-8653, Redis/Valkey, benchmarks)?
3. Confirm Karpathy as the _jagged intelligence_ attribution; anything else to credit?
4. Same blog author + `tech` topic; standalone posts (not under the Software Design series).
