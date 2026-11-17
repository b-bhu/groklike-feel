# GroklikeFeel

A Hermes plugin that gives agents a Grok-like conversational feel.

- **Voice.** Injects a concise conversational voice on every `pre_llm_call`: answer first, short lines, acknowledgment only for longer jobs, no unsolicited summaries or closers, no em dashes.
- **Habit.** Ships the `grok-habit` skill (installed into the profile skills dir): say a repeat in chat ("every morning brief me on prices") and the bot adopts it as its own habit, schedules it, and reports in one line without scheduler framing.
- **Flow (desktop).** Adds a shimmering gerund status chip in the status bar and docks Stop / Continue pills under the composer (Stop is the app's own interrupt verb; Continue appears after a stop). Silent-running is left to the app's own visibility switches (`display.show_reasoning`, `display.tool_progress`), which the plugin does not touch. Everything desktop is gated to the `grokfeel-test` and `ui-ux` profiles.
- **Look (desktop).** Ships a `GroklikeFeel` theme built from the Grok app's extracted design tokens (graphite chrome, ink-on-dark, blue accent, tight tracking). Pick it in Settings > Appearance; assign it per profile to scope it (currently `grokfeel-test`, `ui-ux`).

## Layout

- `__init__.py` + `plugin.yaml`: the agent-side plugin (hooks).
- `desktop/plugin.js`: the desktop-side plugin (runtime JS bundle).

## Install

From a git host, once this repo is pushed:

```
hermes plugins install <owner>/groklike-feel
```

For local testing, copy the pieces into a profile's `plugins/groklike-feel/` (agent side) and `.hermes/desktop-plugins/groklike-feel/` (desktop side), then reload the app.

## Validate

```
hermes plugins validate .
```
