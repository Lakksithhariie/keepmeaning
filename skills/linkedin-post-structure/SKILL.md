---
name: linkedin-post-structure
description: >
  Governs all structural decisions for LinkedIn posts — hook engineering, 
  body patterns, line-break logic, post-type selection, CTA design, and 
  length optimization. Use in combination with linkedin-voice for all 
  LinkedIn post generation tasks. Auto-load when building or formatting 
  any LinkedIn post.
---

# LinkedIn Post Structure System

Structure is not formatting. Structure is the architecture of attention.
A post can be perfectly formatted and completely unread. This skill ensures 
every structural decision — from the first word to the last line — serves 
one goal: keeping a real person reading long enough to be changed by it.

> **The 3-second rule:** On LinkedIn, a reader decides whether to click 
> "see more" within 3 seconds of the first line appearing in their feed. 
> Everything else in this skill serves that 3-second window, and what 
> happens after you've earned the click.

---

## Part 1 — The LinkedIn Feed Rendering Model

Before writing structure, understand how LinkedIn actually displays posts.
Structure decisions must account for platform rendering, not just readability.

### 1.1 — The Fold (The "See More" Cutoff)

LinkedIn truncates posts in the feed after approximately **210–220 characters**
(desktop) or **150–170 characters** (mobile). The exact cut depends on font 
rendering, but the rule is:

**The first 3 lines of your post are all that exists for most readers.**

Everything after the fold is invisible until the reader chooses to click 
"see more." This means:
- The hook is not the first sentence. The hook IS the entire fold.
- Never put the actual point of the post after the fold — put the reason 
  to care before the fold.
- Never use the fold space for setup, context, or background. The fold is 
  for provocation, tension, or payoff-teasing.

### 1.2 — Paragraph Rendering

LinkedIn renders line breaks as full visual paragraph breaks. 
Single line breaks create real whitespace. This is not like email or 
long-form writing — each line carries its own visual weight.

Rules for paragraph rendering:
- **Max 3 lines per paragraph block** before a break. Two is better. 
  One is fine when used with intention.
- **Never two paragraph blocks of equal visual weight back to back** 
  without varying the line count. Symmetry reads as AI or template.
- **Blank lines are structural punctuation.** Use them the way a speaker 
  uses a pause — for emphasis, transition, and breath, not just separation.

### 1.3 — Mobile-First Rendering

Over 60% of LinkedIn traffic is mobile. On mobile:
- Lines wrap shorter
- Bullets render smaller
- Images dominate more of the screen
- The fold hits even sooner

Mobile structure rules:
- Keep the first line under 60 characters if possible (fits one mobile line)
- Avoid long unbroken paragraphs — they become walls on mobile
- If using a list, keep each bullet under 80 characters
- Don't rely on formatting tricks (bold, bullets) to carry meaning — the 
  words must work even if formatting is stripped

---

## Part 2 — Hook Engineering

The hook is the only non-negotiable part of a LinkedIn post. Everything 
else can be rebuilt. A broken hook means a post no one reads.

### 2.1 — The 6 Hook Types

There are 6 proven hook architectures for LinkedIn. Each has a specific 
trigger mechanism and ideal use case.

---

**Hook Type 1 — The Hard Claim**

States a strong, specific opinion or finding with zero setup.

Structure: `[Specific claim that could be challenged]`

Examples:
> "Cold email sequences are destroying your pipeline, not building it."

> "The best LinkedIn posts I've read in 2025 were all under 150 words."

> "Most product managers don't actually manage products. They manage meetings."

When to use: When you have a genuinely held opinion that a real percentage 
of your audience would push back on. Do NOT use if the claim is safe or 
universally agreed-upon — then it's an observation, not a hook.

---

**Hook Type 2 — The Specific Statistic or Result**

Opens with a number that creates immediate curiosity or credibility.

Structure: `[Number] + [context that makes the number surprising or significant]`

Examples:
> "34 founder intake calls. 31 had the exact same bottleneck."

> "We cut our onboarding from 14 steps to 4. Activation went up 38%."

> "6 weeks. 2 engineers. 1 complete rebuild. Here's what actually happened."

When to use: When you have real data, real results, or real observations 
that have been counted. NEVER fabricate numbers — readers sense invented 
specificity. If you don't have a real number, use Hook Type 3 or 5 instead.

---

**Hook Type 3 — The Relatable Tension**

Opens with a scenario or feeling that the target reader has experienced 
but hasn't seen named clearly.

Structure: `[Name a frustration, pattern, or tension the reader recognizes immediately]`

Examples:
> "You spend 3 hours writing a post. It gets 12 likes. A photo of someone's 
> notebook gets 400."

> "The hardest part of building in public isn't vulnerability. 
> It's consistency when nothing's happening."

> "Everyone says 'build relationships, not just followers.' 
> Nobody explains what that looks like at 8am on a Tuesday."

When to use: When you want to build immediate solidarity with the reader 
before teaching or sharing. Works best for Archetype C (Builder/Sharer) 
and Archetype A (Practitioner) voices.

---

**Hook Type 4 — The Counterintuitive Reveal**

Opens with something that contradicts the reader's assumption.

Structure: `[What people expect] + [the contradiction]` — compressed to one line.

Examples:
> "The hire that scaled our team fastest had zero industry experience."

> "We stopped doing weekly 1:1s. Engagement scores went up."

> "Our worst-performing month taught me more than our best year."

When to use: When the insight you're sharing genuinely runs against 
conventional wisdom. The reveal must be real — manufactured 
counterintuitiveness reads as clickbait and erodes trust.

---

**Hook Type 5 — The Story Entry Point**

Drops the reader mid-story, in a specific moment, with sensory or 
emotional concreteness.

Structure: `[Specific scene, moment, or line of dialogue — no setup]`

Examples:
> "It was 11:30pm when I got the Slack message that our biggest client 
> was pausing the contract."

> "The investor said: 'The deck is great. The business isn't fundable yet.' 
> I drove home in silence."

> "My co-founder and I hadn't agreed on something this fundamental in 
> two years of working together. It happened on a Tuesday over lunch."

When to use: When you have a story worth telling and the emotional stakes 
are high enough to sustain a narrative post. Don't use story entry for 
low-stakes tactical posts — it sets expectations you can't meet.

---

**Hook Type 6 — The Pattern Interrupt**

A structurally unusual opening — unexpected brevity, a question that's 
genuinely worth answering, or a format surprise.

Structure: Anything that breaks what the reader expects to see next in 
their feed.

Examples:
> "I was wrong."
(Then explain about what, specifically.)

> "Nobody asked for my opinion on this. Here it is anyway."
(Then give a specific, uncommonly direct take.)

> "Two numbers changed how I think about content strategy:
> 3 seconds.
> 3 months."
(Then explain what each one means.)

When to use: Sparingly. Pattern interrupts lose their power with repetition. 
Use no more than 1 in every 5–6 posts, or readers habituate to the pattern 
and it stops working.

---

### 2.2 — Hook Failure Modes

These are hooks that look like hooks but don't work.

**The Setup Hook (Forbidden)**
> "I want to share something that's been on my mind lately..."
> "Today I'm going to talk about something important..."
> "Before I get into the meat of this post, some context..."

These delay the hook — they are anti-hooks. Delete any line that begins 
a post without delivering immediate value or tension.

**The Vague Curiosity Hook (Forbidden)**
> "Something surprising happened last week."
> "I learned something I didn't expect."
> "This changed how I think about everything."

These tease without delivering. The promise is too vague to compel a click. 
Replace with specificity: *what* happened, *what* was learned, *what* 
specifically changed.

**The Relatability Trap**
> "Raise your hand if you've ever felt overwhelmed by your task list 🙋"
> "We've all been there — staring at a blank screen, not knowing where to start."

These feel warm but function as filler. They attract readers who agree 
with everything and engage no one with something to think about. 
Reserve for community-building posts, not insight posts.

---

## Part 3 — Body Architecture

After the hook earns the click, the body must deliver on the promise 
the hook made — and only that promise. The body has three jobs:

1. **Fulfill the hook's implicit contract** — give the reader what 
   the first line made them expect
2. **Deliver the core insight, story, or argument** with enough 
   specificity that it couldn't have been written by someone else
3. **Build toward the ending** without padding, throat-clearing, 
   or repeating what's already been said

### 3.1 — The 5 Body Patterns

Each pattern suits a different type of post. Match the pattern to the 
content, not to what looks good.

---

**Body Pattern 1 — The Proof Stack**

Used with Hook Types 1, 2, and 4. After a strong claim or statistic, 
build the body as a sequence of evidence layers.

Structure:
Hook (claim or stat)
↓
Evidence Layer 1: The direct proof (what happened, what was measured)
↓
Evidence Layer 2: Why this happened (the underlying mechanism)
↓
Evidence Layer 3: What it means (the implication for the reader)
↓
Ending: Opinion or question (not a summary)

Rules for Proof Stack:
- Each layer must be more specific than the previous
- Layer 3 must connect to the reader's situation, not just the author's
- Never add a 4th evidence layer — it dilutes the previous three
- The ending should not repeat the hook — advance it

---

**Body Pattern 2 — The Narrative Arc**

Used with Hook Type 5 (Story Entry). After dropping mid-scene, build 
the story chronologically but skip uneventful segments.

Structure:
Hook (scene/moment)
↓
Context (minimum necessary backstory — 1-2 lines max)
↓
The Complication (what went wrong, got hard, or surprised you)
↓
The Turn (decision point, realization, or unexpected result)
↓
The Landing (what it means — NOT "the lesson is...")

Rules for Narrative Arc:
- Context must be minimal — backstory kills narrative momentum
- The Complication is the heart of the story — give it the most space
- The Turn must be specific (a number, a conversation, a date, a decision)
- The Landing is an implication, not a moral — never write "the lesson here is"
- Total story length: 150–250 words for feed posts. More than 250 requires 
  the story to genuinely earn every line.

---

**Body Pattern 3 — The Structured List**

Used when content is genuinely enumerable — steps, tools, patterns, 
mistakes, observations. NOT for every post.

Structure:
Hook (claim or tension)
↓
1-2 lines of earned context (why this list exists)
↓
List items (3-7 items maximum)
↓
1-2 lines after the list (synthesis or hardest item to accept)

Rules for Structured List:
- Each list item must be a complete thought, not a one-word label
- List items should be 1-3 lines each — long enough to be useful, 
  short enough not to lose rhythm
- If you have more than 7 items, it's not a list post — it's a thread 
  or an article. Cut ruthlessly to the most important items.
- Add the post-list synthesis. Posts that end on a bullet feel unfinished 
  and readers don't know what to do with the information.
- Never write a list post that could be titled "X things about Y" and 
  have zero specificity in the items.

---

**Body Pattern 4 — The Contrast Frame**

Used when the core insight involves comparing two approaches, mindsets, 
or outcomes.

Structure:
Hook (the contrast stated directly)
↓
Side A: The common/wrong/worse approach (described specifically, not
dismissively — show why people choose it)
↓
Side B: The better/correct/surprising approach (with proof or example)
↓
The Bridge: Why the gap between A and B exists
↓
Ending: What to do with this (not preachy — practical)

Rules for Contrast Frame:
- Side A must be treated with respect — if you mock the wrong approach, 
  you alienate everyone who does it (your target reader)
- Side B must have evidence — contrast without proof is just preference
- The Bridge is the most valuable part and most often skipped. 
  The *reason* for the gap is the insight, not the gap itself.
- Total length: 120–200 words works well for contrast posts

---

**Body Pattern 5 — The Observation + Implication**

Used for shorter, sharper posts built on a single observation. 
No story, no list — just clean thinking.

Structure:
Hook (the observation)
↓
The Mechanism (1-3 lines: why this is true / what causes it)
↓
The Implication (1-2 lines: what this means for how you operate)
↓
Optional: A single sentence that reframes the observation at a higher level

Rules for Observation + Implication:
- This is the hardest pattern to execute well and the easiest to do 
  badly. Generic observations produce zero-value posts.
- The observation must be specific enough that not everyone has noticed it.
- The mechanism is what separates expert thinking from common sense. 
  Don't skip it.
- Total length: 80–150 words. Longer than that and it should be a 
  different pattern.

---

### 3.2 — Body Anti-Patterns (Never Use)

**The Padding Paragraph**
Any paragraph that restates what was already said without adding new 
information. Common form:
> "As I mentioned above, this is why [restate the hook in different words]."
> "So to recap what we've covered so far..."
Delete immediately.

**The Unsolicited Biography**
Inserting credentials mid-post:
> "As someone who has worked with over 200 clients across 14 industries 
> for the past 8 years..."
If credentials are needed, they belong in the hook or not at all. 
Mid-body credentialing reads as insecurity and breaks narrative flow.

**The Hedging Paragraph**
> "Of course, this won't apply to everyone. Every situation is different. 
> Your mileage may vary."
This destroys the authority of the post. If you want to acknowledge nuance, 
do it once and briefly. Don't write a paragraph of disclaimers.

**The Transition Sentence**
> "Now let's talk about [next point]."
> "Moving on to the next section..."
> "With that said, let's dive into..."
These are verbal furniture. The transition IS the content that follows. 
Remove the sentence, let the content speak for itself.

---

## Part 4 — Ending Architecture

The ending is the second most important structural element after the hook. 
A post that ends weakly wastes everything that came before it.

### 4.1 — The 5 Ending Types

**Ending Type 1 — The Reframe**
Take the hook's premise and reveal it at a higher altitude than where 
it started. Not a summary — an elevation.

> Hook was about: "Cold email is dying"
> Reframe ending: "The real issue isn't cold email. It's that we've been 
> using a relationship tool for a volume game. When the volume stops working, 
> we blame the tool."

**Ending Type 2 — The Direct Question**
Ask one specific, answerable question that continues the conversation. 
NOT a generic "What do you think?" — a question specific enough that 
readers actually have a different answer to give.

> "Have you tested removing the nurture sequence entirely? Genuinely curious 
> what your open rates looked like before and after."

> "What's the most useful piece of feedback you've gotten that you almost 
> ignored?"

**Ending Type 3 — The Hard Admission**
End with something you don't know, haven't figured out, or are still 
uncertain about. This is counterintuitively authoritative — it signals 
honesty.

> "I don't have a clean answer to the pricing side of this. Still working 
> through it. Will share when I do."

> "The one thing I haven't solved: how to maintain this discipline during 
> a bad week. Open to how others handle it."

**Ending Type 4 — The Implication Statement**
End with a consequence the reader should be sitting with — not a lesson 
or a call to action, but a thought that lingers.

> "If this pattern holds, the next wave of B2B tools won't be sold on 
> features. They'll be sold on time-to-first-value. That changes everything 
> about how you demo."

**Ending Type 5 — The Quiet Ending**
For narrative posts: end the story without explaining what it means. 
Trust the reader to feel the weight.

> "She signed the contract three months later. Different terms. 
> Better fit. No sequence required."

---

### 4.2 — Ending Failures (Never Use)

**The Motivational Kicker**
Any variation of:
> "Believe in yourself."
> "Keep going. It's worth it."
> "You've got this."
These are filler. They dilute the value of the post that came before them.

**The Generic CTA**
> "If you found this helpful, like and share."
> "Follow me for more content like this."
> "Drop a comment below."
These are spam-era CTAs. Modern LinkedIn readers see through them 
immediately. If you must drive an action, make it specific to the post.

**The Summary Ending**
> "So in summary: do X, avoid Y, and remember Z."
Summaries belong in long-form content. LinkedIn posts are short enough 
that readers haven't forgotten your opening. Summarizing insults their 
memory and creates structural repetition.

---

## Part 5 — Post Length Guidelines

Length is a structural decision, not a personal preference. 
Match length to post type.

| Post Type | Ideal Word Count | Why |
|---|---|---|
| Hard Claim / Opinion | 80–150 words | Brevity signals confidence |
| Story / Narrative | 150–250 words | Stories need room to breathe |
| Structured List (3-5 items) | 150–220 words | Items need substance |
| Observation + Implication | 60–120 words | Sharpness is the value |
| Contrast Frame | 120–200 words | Both sides need fair treatment |
| Case Study / Result Share | 200–300 words | Evidence needs context |

**Never exceed 300 words for a feed post** unless the story genuinely 
cannot be told in less. Posts over 300 words need to earn every additional 
line — cut ruthlessly on the second pass.

**Never go under 60 words** unless using Pattern Interrupt (Hook Type 6). 
Posts under 60 words feel like tweets, not LinkedIn content, and are 
algorithmically deprioritized.

---

## Part 6 — Formatting Rules

### 6.1 — Line Break Doctrine

Use line breaks:
- After the hook (always)
- Between body sections when shifting topic or tone
- Before a list item
- Before the ending

Never use line breaks:
- Mid-sentence to create fake drama
- After every single sentence uniformly — this is an AI formatting signature
- To make a short post look longer than it is

### 6.2 — Bullet and Numbering Rules

Use bullets when:
- You have 3+ parallel items that don't flow naturally as prose
- Each item is genuinely discrete (not just grammatically parallel)
- The reader benefits from being able to scan, not just read

Use numbers when:
- Order matters (steps, ranked items, sequence)
- You want to reference specific items by number later in the post

**Never use bullets as a substitute for thinking.** A post that is 
all bullets has avoided the harder work of connecting ideas. 
Bullets show what. Prose shows why and how.

### 6.3 — Emphasis Rules

LinkedIn supports bold and italic natively (via Unicode in some clients, 
markdown in others). Use sparingly:
- **Bold** for the single most important phrase in a section — not for 
  decoration, not for multiple phrases
- *Italic* for book/tool titles or to indicate spoken emphasis 
  (i.e., the word you'd stress in speech)
- Never bold entire sentences — it defeats the purpose of emphasis
- Never bold in every paragraph — when everything is emphasized, 
  nothing is

### 6.4 — Emoji Rules

LinkedIn users have strong opinions about emojis. Apply the author's 
archetype rules:
- **Practitioner / Challenger archetypes:** 0 emojis in post body. 
  1 max in the hook if it naturally fits.
- **Builder/Sharer archetype:** 1–3 emojis used for genuine tone 
  (not decoration). Never at the end of every bullet.
- **Strategist archetype:** 0 emojis. None. The writing carries the weight.

Never use emojis:
- As bullet point replacements (▶️, ✅, 🔥 before every item)
- At the end of every paragraph
- To add false energy to a flat sentence

---

## Part 7 — Post-Type Quick Reference

Use this to select the right structure for any incoming post request.

POST_TYPE_MAP = {
"opinion_piece": { hook: "Hard Claim", body: "Proof Stack", ending: "Reframe" },
"personal_story": { hook: "Story Entry", body: "Narrative Arc", ending: "Quiet / Implication" },
"tactical_list": { hook: "Specific Stat", body: "Structured List", ending: "Synthesis + Question" },
"contrarian_take": { hook: "Counterintuitive",body: "Contrast Frame", ending: "Implication" },
"observation": { hook: "Relatable Tension",body: "Obs+Implication", ending: "Hard Admission / Question" },
"result_share": { hook: "Specific Stat", body: "Proof Stack", ending: "Implication / Question" },
"mistake_confession": { hook: "Pattern Interrupt",body: "Narrative Arc", ending: "Hard Admission" },
"industry_commentary": { hook: "Hard Claim", body: "Proof Stack", ending: "Implication / Reframe" },
"tool_or_process_share": { hook: "Specific Stat", body: "Structured List", ending: "Question" },
"build_in_public_update": { hook: "Specific Stat", body: "Narrative Arc", ending: "Question / Hard Admission" }
}

---

## Part 8 — Structure Agent Instructions

When generating a LinkedIn post, run the following sequence in order:

STEP 1: Identify the post type from POST_TYPE_MAP (or infer from topic)
STEP 2: Select the corresponding hook type — generate 2 variants,
pick the more specific one
STEP 3: Choose body pattern — apply the pattern rules strictly
STEP 4: Select ending type — match to the emotional contract the hook created
STEP 5: Check word count against length guidelines
STEP 6: Apply formatting rules (line breaks, bullets, emphasis, emojis)
STEP 7: Run the voice audit from linkedin-voice skill before outputting

Do not skip Step 7. Structure without voice is a template, not a post.

---

## Part 9 — Structure + Voice Integration Reminders

Structure is the skeleton. Voice is the flesh. Neither works without 
the other. Specific rules for integration:

- A Proof Stack body written in Challenger voice sounds completely 
  different from a Proof Stack in Builder voice. Apply the voice 
  archetype AFTER selecting the body pattern, not before.
- Never let the structural pattern override natural voice. If the 
  Narrative Arc calls for a "quiet ending" but the author's voice 
  is direct and punchy, end directly and punchily. The pattern is 
  a guide, not a cage.
- The hook's tone sets a contract with the reader. If the hook is 
  sharp and provocative, the body must match that energy. 
  A hard claim followed by a gentle, hedged body is structurally 
  incoherent — readers feel cheated.

---

## Additional Resources

- For voice, tone, and anti-AI writing rules → `/linkedin-voice`
- For content pillars, post ideas, and content calendars → `/linkedin-content-strategy`
- For editing and AI-proofing existing drafts → `/linkedin-editor`