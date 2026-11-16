# GroklikeFeel

A Hermes plugin that gives agents a Grok-like conversational feel.

- **Voice.** Injects a concise conversational voice on every `pre_llm_call`: answer first, short lines, acknowledgment only for longer jobs, no unsolicited summaries or closers, no em dashes.
- **Flow (desktop).** Tucks detailed Thought panels away behind a clean-chat toggle, and adds a gerund status chip ("thinking", "writing", "running a command") in the status bar while a turn is in flight. Both are gated to the `grokfeel-test` profile.

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
