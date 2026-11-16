# GroklikeFeel — plan

Hermes plugin for the Nous hackathon (ends Nov 11, 2026).
One job: make Hermes feel like Grok Bot — an assistant you talk to, not a chat app.

**Scope rule:** Hermes has the mechanism → we build on it. Hermes doesn't → out of scope, say so.

---

## VOICE — how it speaks
Hermes has skills (SKILL.md) → **in scope**.

Improve:
- First line is the answer. No restating the task, no "Great question".
- 1–5 lines by default. Expand only when asked.
- No unsolicited tables/lists/headers.
- Never summarize what was just done. Never end with "Want me to…?".
- Memory-aware phrasing ("your Polymarket lane"), not generic.
- Wit yes, fluff no.

Deliverable: `grok-voice` SKILL.md shipped inside the plugin.

## FLOW — how it responds
Hermes has streaming + mid-turn steering → **in scope**.

Improve:
- Instant ack ("On it —") before tools run, short result after.
- User keeps typing while it works — steering already exists; short replies make it feel usable.
- Status in gerunds on a plugin status-bar chip: Working… Generating… Stopping…
- Compaction: "summarizing" reads as stuck (user complaint, Nov 5). Compaction is Hermes core — can't remove it, but short replies = it almost never fires. If it does, the chip says so instead of a wall of text.

Deliverable: status-bar chip + voice rules that keep first token fast.

## HABIT — how it repeats itself
Hermes has cron/scheduled jobs → **in scope**.

Improve:
- Natural-language routines: user says "every morning brief me on X" in chat → the bot creates the cron itself (hermes cron create), framed as its own habit, not scheduler config.
- Routine output in Grok voice: short, direct.

Deliverable: routine skill + cron templates.

## PERSISTENCE — the in-scope slice of Grok's "computer"
Grok's cloud computer + any-device access (X, web, mobile) → **OUT OF SCOPE**. Hermes is local-first, no cloud.

In scope: a bot session saves what matters into the profile (files, skills, memory) so the next session picks it up. This PLAN.md is the pattern: durable file, not chat scrollback.

---

## Stretch (user: "not much weight")
- Theme: palette/typography/motion tokens from Grok Bot (see grok-bot-design-tokens.md). Do only if time remains after Voice/Flow/Habit.

## Research notes
- Grok Bot app = Cursor fork (bundle com.anysphere.sand, package "sand", v0.78.5). The liked feel is Cursor's agent-chat engineering + Grok personality.
