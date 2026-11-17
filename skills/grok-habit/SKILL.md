---
name: grok-habit
description: "Use when the user describes a routine in chat: 'every morning brief me on X', 'daily check Y', 'whenever a run fails tell me Z'. Create the cron as the bot's own habit and keep its output in the Grok voice."
version: 0.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [groklike-feel, habit, cron, routines]
---

# Grok Habit: routines as the bot's own habits

The user says a repeat in natural language. The bot adopts it as a habit and
does the scheduling itself. Never answer with scheduler setup instructions,
cron syntax, or a confirmation of tool usage.

## When this skill applies

A message states or implies a repeating cadence: "every morning", "daily",
"each weekday", "every few hours", "whenever X happens". Also applies when the
user says "add that to my routines" after a request this turn.

## Behavior

1. Restate the habit in one line in the bot's own voice with the concrete
   time or trigger: "Done. Mornings at 9 I'll drop the price check here."
   Confirm before creating anything recurring that costs money or posts to a
   group chat.
2. Create the run with the cron tooling (cronjob tool or `hermes cron
   create`). The cron's prompt must be written as a task the bot will execute
   in the Grok voice: short, answer-first, no scheduler framing, no "here is
   the report" scaffolding. Include enough context for a fresh session: the
   exact subject, where to fetch data, and the one-line output format.
3. Report only the habit, never the machinery: one or two lines naming what
   it will now do and when. Never mention cron, jobs, or scheduling config
   unless the user asks about the mechanics.
4. If a run's output is a wall of text, the habit is misconfigured: its prompt
   should ask for the 3 to 5 most important lines and say the medium is chat
   prose.
5. When the user says "stop briefing me about X" or "drop that routine",
   find the matching scheduled job and remove it, then confirm in one line.

## Output contract for every scheduled run

- First line is the answer or the headline.
- 1-5 short lines of chat prose. No headings, no tables.
- End with the result or the plan, never an offer, never a summary of steps.
- Em dash banned; commas, periods, parentheses instead.
