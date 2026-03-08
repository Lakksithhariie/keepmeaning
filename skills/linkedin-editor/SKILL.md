---
name: linkedin-editor
description: >
  The AI-proofing and editing skill for LinkedIn posts. Takes any draft — 
  rough notes, AI-generated text, over-polished corporate copy, or 
  underdeveloped ideas — and transforms it into a post that sounds like 
  a real, specific human wrote it. Runs a full diagnostic before editing, 
  performs surgical rewrites by layer, and delivers a final audit score. 
  Always load alongside linkedin-voice and linkedin-post-structure. 
  Use any time a post needs to be reviewed, improved, or AI-proofed.
---

# LinkedIn Editor System

Every draft has a problem. The editor's job is to find the exact problem — 
not guess at it — and fix it surgically without destroying what's working.

The most common editing failure: rewriting everything when only one thing 
is broken. The second most common: fixing the surface when the problem is 
structural. This skill prevents both.

> **Core editing principle:** Never change what doesn't need to change. 
> Identify the specific failure layer, operate on that layer only, 
> and leave everything else untouched.

This skill has five operating modes depending on what the draft needs:

EDITOR_MODE = {
"mode_1": "Diagnostic Only — identify what's wrong, don't rewrite",
"mode_2": "Hook Repair — rebuild the hook, leave body and ending intact",
"mode_3": "AI-Proof Pass — strip AI tells, inject specificity and voice",
"mode_4": "Full Structural Rewrite — rebuild from the ground up",
"mode_5": "Final Polish — minor refinements on a near-ready draft"
}

Unless the user specifies a mode, default to running the Diagnostic 
first (Mode 1) and then executing the minimum necessary mode.

---

## Part 1 — Pre-Edit Diagnostic Protocol

Before touching a single word, run this full diagnostic on the draft. 
The diagnostic identifies which of the 6 failure layers is broken 
and which mode to invoke.

### 1.1 — The 6 Failure Layers

**Layer 1 — Concept Failure**
The underlying idea is too thin, too generic, or has been said 
a thousand times in exactly this way.

Diagnostic question: 
*"If I search for this exact topic on LinkedIn, would I find 20 posts 
that make the same point with the same framing?"*

If yes → Concept failure. No amount of editing fixes a generic idea. 
The solution is to find the specific angle, result, or experience 
that makes this version different from all the others.

Signs of concept failure:
- The topic could apply to anyone in any industry
- The "insight" is something most professionals already know
- There are no real stakes in the post (nothing is won or lost)
- The post could have been generated entirely by AI from a prompt 
  like "write a LinkedIn post about [generic topic]"

Fix: Return to linkedin-content-strategy Part 3.3 Idea Quality Filter. 
Run the specificity test and differentiation test before editing the copy.

---

**Layer 2 — Hook Failure**
The idea is solid but the first 2–3 lines don't earn the click.

Diagnostic question:
*"Would I keep reading this if I saw it in my feed between two 
posts by people I already trust?"*

If no → Hook failure. The body may be excellent — the hook is 
killing the post before anyone reaches it.

Signs of hook failure:
- Starts with "I" (statistically underperforms on LinkedIn)
- Opens with context or setup before any tension or value
- Uses a banned phrase or pattern from linkedin-voice Part 1
- The first line makes a promise so vague that clicking 
  "see more" feels like a gamble
- The hook is a question that the reader doesn't feel compelled 
  to answer
- Exceeds the fold character limit with setup, not payoff

Fix: Hook Repair Mode (Mode 2). Leave the body intact.

---

**Layer 3 — Structure Failure**
The hook works but the body doesn't deliver on its promise, 
the logic doesn't flow, or the ending lands wrong.

Diagnostic question:
*"Does every paragraph in the body make the reader more invested 
in getting to the next one?"*

If any paragraph breaks that chain → Structure failure.

Signs of structure failure:
- Body pattern doesn't match the hook type 
  (e.g., Hard Claim hook → List body → no proof given)
- The ending doesn't resolve what the hook created tension around
- There's a padding paragraph in the middle that says nothing new
- The post makes 3 different points when it should make one point deeply
- The structure is so rigid and symmetrical it reads as template content

Fix: Structural Rewrite Mode (Mode 4) on the failing section only.

---

**Layer 4 — Voice Failure**
The structure is sound but the language doesn't sound like a human — 
specifically, like this human.

Diagnostic question:
*"Does any sentence in this post sound like it was written by 
someone who has actually lived this experience?"*

If significant sections fail → Voice failure.

Signs of voice failure:
- AI vocabulary from the blacklist in linkedin-voice Part 1.3
- Banned phrases present (linkedin-voice Part 1.1)
- Emotional register higher than the author's natural baseline
- Sentences all the same length (AI rhythm signature)
- The opinion isn't actually sharp enough to have been held by a person
- Specificity is absent — everything described at altitude, 
  nothing at ground level

Fix: AI-Proof Pass (Mode 3). Surgical word and sentence level work.

---

**Layer 5 — Specificity Failure**
The post has a voice but operates entirely in abstractions — 
no numbers, no names, no dates, no concrete details.

Diagnostic question:
*"Could I film this experience? Is there a scene, a conversation, 
a dashboard, a Slack message that this post is describing — 
or is it all conceptual?"*

If there's no filmable detail → Specificity failure.

Signs of specificity failure:
- Every claim is general ("most founders", "many companies", 
  "often what happens is")
- Results are described qualitatively when they happened quantitatively 
  ("we saw good growth" instead of "we went from 12 to 47 users")
- The story has no specific moment where something changed
- The advice works for anyone, not this author's specific context
- Time references are vague ("recently", "last year", "a while back")

Fix: Specificity Injection (sub-routine within Mode 3). 
Ask the author for the concrete detail, or flag every 
abstract claim with [NEEDS SPECIFIC DETAIL] before returning.

---

**Layer 6 — CTA/Ending Failure**
Everything works until the last 2 lines, which deflate the post.

Diagnostic question:
*"Does the ending make the reader feel something, think something, 
or do something — or does it just stop?"*

If the ending just stops, summarizes, or motivates generically → 
Ending failure.

Signs of ending failure:
- Generic CTA: "Like if you agree", "Follow for more", "Share this"
- Summary ending that repeats the hook in different words
- Motivational kicker with no connection to the post's content
- Abrupt stop — the post just ends without resolution or invitation
- Question that any stranger could answer (not specific to the post)

Fix: Ending Rewrite (sub-routine within Mode 5 or Mode 4).

---

### 1.2 — Diagnostic Output Format

After running the diagnostic, output the results in this format 
before making any edits:

DIAGNOSTIC_RESULT = {
"layer_1_concept": "PASS / FAIL / WEAK",
"layer_2_hook": "PASS / FAIL / WEAK",
"layer_3_structure": "PASS / FAIL / WEAK",
"layer_4_voice": "PASS / FAIL / WEAK",
"layer_5_specificity": "PASS / FAIL / WEAK",
"layer_6_ending": "PASS / FAIL / WEAK",
"recommended_mode": "Mode 1 / 2 / 3 / 4 / 5",
"primary_failure": "[describe the single most critical issue]",
"what_to_preserve": "[describe what is working and must not change]"
}

Show the diagnostic to the user before editing. 
Ask for confirmation to proceed unless the user has explicitly 
asked for a full edit without review.

---

## Part 2 — Mode 2: Hook Repair

Use when: Layer 2 (hook) fails, layers 3–6 are PASS or WEAK.

### 2.1 — Hook Repair Process

**Step 1 — Extract the core insight**
Read the entire post and identify the single most interesting, 
specific, or surprising thing in the body. This is usually not 
in the hook — it's buried mid-post. 

Write it down in one raw sentence without worrying about 
how it sounds.

**Step 2 — Identify the hook type that fits**
Using POST_TYPE_MAP from linkedin-post-structure, identify 
which of the 6 hook types (Hard Claim, Specific Stat, Relatable 
Tension, Counterintuitive, Story Entry, Pattern Interrupt) 
best fits the core insight extracted in Step 1.

**Step 3 — Write 3 hook variants**
Generate 3 complete hook variants — each using a different 
hook type. Each variant must:
- Be under 220 characters (desktop fold limit)
- Start with something other than "I"
- Deliver tension, value, or provocation — not setup
- Be anchored to the most specific detail in the post

**Step 4 — Select and integrate**
Present all 3 variants to the author (or select the strongest 
one if in autonomous mode). Attach the selected hook to the 
existing body without changing the body.

**Step 5 — Verify the contract**
Re-read the hook + body together. The body must deliver exactly 
what the hook implied. If the new hook creates a different promise 
than what the body delivers, flag it and adjust the body's 
opening transition only — not the full body.

---

### 2.2 — Hook Repair Red Lines

Never do these during hook repair:
- Do not rewrite the body to match the new hook (unless Mode 4 is invoked)
- Do not make the hook more generic to fit the body better
- Do not soften the hook because it feels too bold — bolder is almost 
  always better as long as the body can back it up
- Do not add a subtitle or context line after the hook to "explain" it — 
  if the hook needs explaining, it's the wrong hook

---

## Part 3 — Mode 3: AI-Proof Pass

Use when: Layer 4 (voice) or Layer 5 (specificity) fails. 
The structure is sound. The language is the problem.

This is the most frequently needed mode. It operates at the 
sentence and word level, not the structural level.

### 3.1 — The AI-Proof Pass Sequence

Run these operations in order. Do not skip steps.

---

**Operation 1 — Banned Phrase Sweep**

Scan every sentence against the banned phrase list in 
linkedin-voice Part 1.1. 

For each banned phrase found:
1. Identify what the author was actually trying to say
2. Rewrite the sentence in the author's voice archetype without 
   using the banned phrase or any close variation
3. Ensure the rewritten sentence is more specific than the original

Do not replace a banned phrase with a synonym. Replace it with 
the actual thought behind the phrase, written concretely.

**Bad replacement:**
Original: "In today's fast-paced world, standing out matters more than ever."
Wrong fix: "In the current competitive environment, differentiation is critical."
Right fix: "There are 9 million posts published on LinkedIn every day. 
Most of them say the same 12 things."

---

**Operation 2 — Vocabulary Detox**

Scan for every word from the banned vocabulary list in 
linkedin-voice Part 1.3.

For each banned word:
- Find the specific version of what it was trying to say
- Replace with either a concrete word or a short concrete phrase

Banned word replacement examples:
"leverage" → "use" (or the specific thing being used)
"seamless" → describe what actually made it easy (or cut the claim)
"robust" → name the specific capability or metric
"holistic" → list the actual components
"impactful"→ state the actual impact (number, result, behavior change)
"journey" → replace with the actual timeline or progression
"learnings"→ "lessons" or "what we found"
"ecosystem"→ describe the actual components and relationships

---

**Operation 3 — Rhythm Repair**

Read the post aloud (internal simulation). Identify:
- Any sequence of 3+ paragraphs that are all the same length
- Any sequence of 3+ sentences that are all the same length
- Any paragraph that sounds like a slide bullet rather than speech

For each rhythm problem:
- Vary the sentence length in that section
- Add one sentence that breaks the expected pattern 
  (either much shorter or much longer)
- If a paragraph sounds like a slide bullet, rewrite it as 
  how the author would explain it to someone in conversation

---

**Operation 4 — Specificity Injection**

Scan every claim, result, observation, and piece of advice.

For each abstract claim:
1. Tag it with [ABSTRACT]
2. Ask: "What's the specific version of this?"
3. If the specific version is known → replace
4. If unknown → mark with [NEEDS DETAIL: what specific information 
   would make this concrete?] and return to author

Specificity injection examples:
"We saw great results" → "Activation rate went from 23% to 61% in 6 weeks"
"A lot of clients struggle with" → "11 of the last 14 founders I spoke with"
"We grew quickly" → "We went from 0 to 200 paying users in 4 months"
"Recently" → "Last Tuesday" / "In February" / "Three weeks ago"
"Many people" → name the actual number observed or use "most"
only if you've genuinely seen it most of the time

---

**Operation 5 — Emotion Calibration**

Check the emotional register against the author's voice archetype.

For Practitioner and Strategist archetypes:
- Remove explicit emotional statements ("I was devastated", 
  "I felt so proud") unless the emotion is anchored to a 
  specific event and serves the post's argument
- Replace with behavioral evidence of the emotion 
  ("I rewrote the pitch deck four times that week" shows 
  more than "I was anxious")

For Builder/Sharer archetype:
- Emotion is appropriate but must be earned (specific trigger, 
  specific duration, specific change)
- Remove any emotion that isn't attached to a concrete event

For Challenger archetype:
- Emotion almost never appears directly
- Passion shows up as sharpness of opinion, not 
  as expressed feeling

---

**Operation 6 — Em-dash and Formatting Audit**

Count all em-dashes in the post.
- If count > 1: remove extras, replace with restructured sentences
- If bullets appear more than once: check whether bullets are 
  genuinely the right format or if prose would be stronger
- If every paragraph is one sentence: vary lengths in at least 
  2 sections
- Check for bold overuse — maximum 1 bolded phrase per post

---

### 3.2 — AI-Proof Pass Quality Gate

After running all 6 operations, ask:

> "If I removed the author's name from this post, and placed it 
> alongside 10 other posts on the same topic — would this one be 
> identifiable as theirs based on the content alone?"

If yes → AI-Proof Pass complete.
If no → Run Operation 4 (Specificity Injection) again. 
Specificity is always the fastest path to identifiability.

---

## Part 4 — Mode 4: Full Structural Rewrite

Use when: Layer 1 (concept) is WEAK, Layer 3 (structure) FAILS, 
or the post is AI-generated from scratch with no original human input.

This mode rebuilds the post completely while preserving only:
- The core idea (if it passes the concept quality filter)
- Any specific details, numbers, or experiences the author provided
- The author's voice archetype

Everything else is rebuilt from first principles.

### 4.1 — Full Rewrite Process

**Step 1 — Concept Extraction**
Strip away all the language. What is the one true thing this post 
is trying to communicate? Write it as a raw, ugly sentence with 
no polish:

> "I found that reducing our onboarding steps cut our support tickets 
> and improved activation, and most founders over-engineer onboarding 
> because they're optimizing for completeness rather than momentum."

This sentence is the seed. Everything else grows from it.

**Step 2 — Assign Post Type and Pattern**
Based on the extracted concept, select from POST_TYPE_MAP 
in linkedin-post-structure Part 7.

**Step 3 — Write 2 Hook Variants**
Generate 2 hooks using different hook types. 
Select the one that most directly surfaces the specific insight 
in the concept extraction.

**Step 4 — Build the Body**
Apply the body pattern from the selected post type. 
At each stage of the body pattern, insert the specific details 
from the original draft. Never generate fabricated specifics — 
if details are missing, use [DETAIL NEEDED] placeholders.

**Step 5 — Write the Ending**
Select the ending type that matches the hook's emotional contract 
(reference linkedin-post-structure Part 4.1).

**Step 6 — Run Full AI-Proof Pass**
After structural rebuild, run Mode 3 in full.

**Step 7 — Length Check**
Check word count against the post-type length guidelines 
in linkedin-post-structure Part 5. Cut if over. 
If under 60 words, the concept extraction may be too thin — 
return to Step 1.

---

### 4.2 — Full Rewrite Non-Negotiables

- Never invent numbers, results, or experiences that weren't 
  in the original material
- Never shift the author's voice archetype to make the post 
  "sound better" — better means truer to them, not more polished
- Never make the opinion softer than the author's original intent
- If the original draft is entirely AI-generated with no author 
  input, flag that specific details are needed before a full 
  rewrite can be completed. Do not fabricate a "realistic" story.

---

## Part 5 — Mode 5: Final Polish

Use when: All layers PASS, draft is near-complete, 
minor refinements needed.

This mode makes only these categories of change:

### 5.1 — Final Polish Operations

**Polish 1 — First Word Check**
If the post opens with "I", find the second most important word 
in the first sentence and restructure the sentence to open with it.

Examples:
"I spent 6 months building the wrong thing."
→ "6 months. Wrong thing. I didn't know it yet."

"I used to believe cold email was dead."
→ "Cold email is dead. I used to disagree."

**Polish 2 — Sentence-Level Tightening**
Scan for any sentence that uses more words than it needs. 
Cut filler:
- "the fact that" → cut entirely and restructure
- "in order to" → "to"
- "at this point in time" → "now"
- "due to the fact that" → "because"
- "it is important to note that" → cut entirely
- "what I mean by that is" → cut, just say it

**Polish 3 — Final Line Check**
Read the last line of the post. Apply the ending type from 
linkedin-post-structure Part 4. If it's a generic CTA or 
motivational kicker — rewrite it using one of the 5 ending types.

**Polish 4 — Read Aloud Test**
Simulate reading the post as the author would speak it. 
Flag any sentence that trips. A sentence that trips when 
spoken is a sentence that trips when read. Smooth it.

**Polish 5 — Character Count Check**
Verify the first 2-3 lines fall within the fold limit 
(210 characters desktop, 160 characters mobile). 
If the hook exceeds the fold — trim without softening the claim.

---

## Part 6 — The Edit Scorecard

After completing any edit mode, generate an Edit Scorecard 
for the post. This is for internal quality assurance — 
share with the user only if requested.

EDIT_SCORECARD = {
"hook_strength": "1–10 (10 = immediately compels click)",
"specificity_level": "1–10 (10 = no abstract claims remain)",
"voice_authenticity": "1–10 (10 = identifiably one person)",
"ai_tell_count": "integer (target: 0)",
"structure_clarity": "1–10 (10 = every section earns the next)",
"ending_quality": "1–10 (10 = lingers after reading)",
"overall_score": "average of above 5 scores",
"publish_ready": "YES if overall_score >= 7.5, NO if below"
}

If overall_score < 7.5 → identify the lowest-scoring dimension 
and run the appropriate sub-operation from Mode 3 or Mode 5 
until the score reaches 7.5 or above.

If hook_strength < 7 → the post is not publish-ready regardless 
of overall score. Run Mode 2 before publishing.

---

## Part 7 — The Common Draft Types and Default Modes

### Type A — Purely AI-Generated Draft (No Author Input)

Identifying signals:
- Perfectly symmetrical structure
- Every paragraph exactly one sentence
- Present in every banned phrase category
- No specific numbers, names, or dates
- Emotion is abstract and themed, not event-based
- Reads as competent and says nothing

Default mode: **Mode 1 Diagnostic → Mode 4 Full Rewrite**

Important: Do not rewrite an AI-generated draft without 
first getting specific input from the author. Ask:
> "Before I rewrite this, I need 2-3 specific details from you:
> a real number or result, a specific moment or date, and the 
> strongest version of your opinion on this topic."

Without these inputs, a rewrite will produce a different 
AI-generated draft — not a human one.

---

### Type B — Author's Raw Notes (Unpolished, Unstructured)

Identifying signals:
- Incomplete sentences or fragments
- Ideas in random order
- Specific details present but no narrative
- Strong voice but no shape

Default mode: **Mode 1 Diagnostic → Mode 4 Full Rewrite**

Preserve: Every specific detail, number, name, and direct quote.
These are gold. Build the structure around them, not the other 
way around.

---

### Type C — Over-Polished Corporate Draft

Identifying signals:
- Formally structured with proper transitions
- No first-person voice or personal stakes
- Language optimized for inoffensiveness
- Could have come from a PR team or brand guideline
- Technically correct, emotionally inert

Default mode: **Mode 1 Diagnostic → Mode 3 AI-Proof Pass**

The structure is often salvageable. The voice needs a full 
replacement. Apply voice archetype aggressively — the draft 
needs to sound like the author speaking at their most direct, 
not the brand speaking at its most careful.

---

### Type D — Underperforming Previous Post (Recycled Idea)

Identifying signals:
- Author reports low engagement on previous version
- The idea is solid but something didn't land
- Often: concept is strong, hook is weak

Default mode: **Mode 1 Diagnostic → Mode 2 Hook Repair**

Start with the hook. 80% of LinkedIn underperformance 
is a hook problem. Only escalate to Mode 4 if the diagnostic 
reveals structure or voice failure as the primary cause.

---

### Type E — Near-Ready Draft (Author's Own Writing)

Identifying signals:
- Strong voice present
- Specific details exist
- Minor AI tells remain from an edit or polish pass
- Hook or ending is the only weak point

Default mode: **Mode 1 Diagnostic → Mode 5 Final Polish**

Minimum intervention. Preserve everything that works. 
The risk here is over-editing — removing the rough edges 
that make it human in the name of making it "better."

---

## Part 8 — Editing Red Lines (Universal, All Modes)

These rules apply in every mode, every draft, every time.

1. **Never make the opinion softer.** If the author said something 
   direct and you sand it down for palatability, you've failed as 
   an editor. Bolder opinions get more engagement and build more 
   trust — not less.

2. **Never invent specifics.** If a specific detail is needed 
   and not available — ask. Do not generate a plausible number, 
   a convincing anecdote, or a realistic-sounding example. 
   Invented specifics are a form of dishonesty and destroy 
   trust when readers recognize them.

3. **Never edit toward perfection.** The goal is human, not flawless. 
   A slightly imperfect sentence that sounds like how a real person 
   talks is more valuable than a technically perfect sentence that 
   sounds like a press release.

4. **Never change the author's voice archetype.** If a Practitioner 
   writes with sparse, factual sentences — do not inject warmth. 
   If a Builder/Sharer writes conversationally — do not formalize. 
   Voice is not a style preference. It is an identity signal.

5. **Never remove specificity to improve flow.** If a specific 
   detail makes a sentence grammatically awkward, fix the grammar 
   around the detail — not the detail around the grammar. 
   Specificity > polish, always.

6. **Never add a CTA that the author wouldn't naturally say.** 
   If the author's voice is direct and they wouldn't say 
   "Drop a comment below" — don't add it. The ending must be 
   consistent with the voice that carries the rest of the post.

---

## Part 9 — Editor Agent Instructions

When operating as part of the LinkedIn generation agent, 
the editor runs as the final step of every post generation workflow.

AGENT_EDITOR_SEQUENCE = {
"step_1": "Receive completed draft from post generation pipeline",
"step_2": "Run full diagnostic (Part 1). Output DIAGNOSTIC_RESULT.",
"step_3": "Identify primary failure layer",
"step_4": "Execute minimum necessary mode",
"step_5": "Run AI-Proof Pass (Mode 3) regardless of primary mode —
always the final operation before scoring",
"step_6": "Generate Edit Scorecard (Part 6)",
"step_7": "If overall_score >= 7.5 AND hook_strength >= 7 →
return final post",
"step_8": "If score < 7.5 → identify lowest dimension,
run targeted repair, re-score",
"step_9": "Maximum 2 repair iterations before escalating
to author for additional input"
}

The editor never delivers a post with a hook_strength below 7.
The editor never delivers a post with a known AI tell still present.
The editor never delivers a post with an [ABSTRACT] or 
[NEEDS DETAIL] tag unresolved.

---

## Part 10 — Integration with Full Agent Stack

The linkedin-editor skill is the quality gate of the entire 
LinkedIn generation system. It does not generate — it refines.

Skill execution order for any LinkedIn post task:

FULL_AGENT_PIPELINE = {
"step_1": "linkedin-content-strategy → What to write, for whom, why now",
"step_2": "linkedin-voice → Who is writing it, how they sound",
"step_3": "linkedin-post-structure → How to build the hook, body, ending",
"step_4": "linkedin-editor → Quality gate: diagnose, repair, score"
}

No post exits the pipeline without passing through linkedin-editor.
No post is returned to the user without a hook_strength >= 7 
and overall_score >= 7.5.

This is the standard. Every time.