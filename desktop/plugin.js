import { createElement, useEffect, useState } from 'react'
import { atom, host, COMPOSER_AREAS, STATUSBAR_AREAS, THEMES_AREA, TITLEBAR_AREAS, useValue } from '@hermes/plugin-sdk'

/** Hide the transcript's internal reasoning presentation, not the model's work. */
const CLEAN_CHAT_KEY = 'local.cleanChat'
const GATED_PROFILES = ['grokfeel-test', 'ui-ux']
const profileState = host.state.focusedSessionProfile || host.state.profile
const busyState = host.state.busy
const isProfileOn = () => GATED_PROFILES.includes(profileState.get())

/**
 * GroklikeFeel theme: the Grok app look, rebuilt from the extracted tokens
 * (grok-bot-design-tokens.md). Chrome #141414, surfaces #181818, ink #f0f0f0,
 * interactive blue #599ce7, graphite bubbles. Contributes under THEMES_AREA;
 * it only applies when selected, and is assignable per profile in
 * Settings > Appearance, so the default profile keeps its own skin.
 */
const GROK_THEME = {
  name: 'GroklikeFeel',
  label: 'GroklikeFeel',
  description: 'Grok app look: graphite chrome, ink on dark, blue accent, tight tracking, graphite bubbles.',
  colors: {
    background: '#141414',
    foreground: '#f0f0f0',
    card: '#181818',
    cardForeground: '#f0f0f0',
    popover: '#1e1e1e',
    popoverForeground: '#f0f0f0',
    muted: '#232323',
    mutedForeground: '#b3b3b3',
    primary: '#599ce7',
    primaryForeground: '#0f1a2b',
    secondary: '#232323',
    secondaryForeground: '#f0f0f0',
    accent: '#232323',
    accentForeground: '#f0f0f0',
    border: '#262626',
    input: '#232323',
    ring: '#599ce7',
    midground: '#599ce7',
    destructive: '#e34671',
    destructiveForeground: '#ffffff',
    sidebarBackground: '#181818',
    sidebarBorder: '#262626',
    userBubble: '#2b2b2b',
    userBubbleBorder: '#343434',
  },
  darkColors: {
    background: '#141414',
    foreground: '#f0f0f0',
    card: '#181818',
    cardForeground: '#f0f0f0',
    popover: '#1e1e1e',
    popoverForeground: '#f0f0f0',
    muted: '#232323',
    mutedForeground: '#b3b3b3',
    primary: '#599ce7',
    primaryForeground: '#0f1a2b',
    secondary: '#232323',
    secondaryForeground: '#f0f0f0',
    accent: '#232323',
    accentForeground: '#f0f0f0',
    border: '#262626',
    input: '#232323',
    ring: '#599ce7',
    midground: '#599ce7',
    destructive: '#e34671',
    destructiveForeground: '#ffffff',
    sidebarBackground: '#181818',
    sidebarBorder: '#262626',
    userBubble: '#2b2b2b',
    userBubbleBorder: '#343434',
  },
  typography: {
    fontSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    baseSize: '13px',
    lineHeight: '1.55',
    letterSpacing: '-0.08px',
  },
  customCSS: `
    strong, b { font-weight: 500; }
    :not(pre) > code { border-radius: 0; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.14); border-radius: 999px; }
    ::-webkit-scrollbar-track { background: transparent; }
  `,
}

/** Tool name to gerund; unknown tools fall back to a plain reading of the name. */
const TOOL_GERUNDS = {
  browser_exec: 'driving the browser',
  clarify: 'asking you',
  delegate_task: 'delegating work',
  execute_code: 'running code',
  message_agent: 'messaging an agent',
  patch: 'editing',
  read_file: 'reading',
  search_files: 'searching files',
  skill_manage: 'updating skills',
  skill_view: 'loading a skill',
  terminal: 'running a command',
  text_to_speech: 'generating speech',
  todo_list: 'planning steps',
  vision_analyze: 'looking at an image',
  web_extract: 'reading a page',
  web_search: 'searching the web',
  write_file: 'writing',
}

function toolLabel(name, args) {
  const clean = String(name ?? '').replace(/connectors__/, '').replace(/__/g, ' ').replace(/_/g, ' ')
  const base = TOOL_GERUNDS[name] ?? (clean ? `working on ${clean}` : 'working')
  let object = ''
  if (args && typeof args === 'object') {
    const path = typeof args.path === 'string' ? args.path.split('/').pop() : ''
    if (path) object = path
    else if (typeof args.pattern === 'string') object = args.pattern
    else if (typeof args.query === 'string') object = args.query
    else if (typeof args.url === 'string') object = args.url.split('/').pop()
  }
  const label = object ? `${base} ${object}` : base
  return label.length > 48 ? `${label.slice(0, 47)}…` : label
}

function FlowChip({ label }) {
  const text = useValue(label)
  const tone = useValue(chipTone)
  const busy = useValue(busyState)
  const profile = useValue(profileState)
  if (!GATED_PROFILES.includes(profile) || !busy || !text) return null
  return createElement(
    'span',
    {
      className: 'groklike-feel-chip',
      'data-tone': tone,
      role: 'status',
      'aria-live': 'polite',
    },
    createElement('span', { className: 'groklike-feel-chip-text' }, text),
  )
}

/**
 * Composer underside pills: Stop while the focused chat works, Continue after
 * an interrupt. Stop is the same verb the app's own Stop button sends
 * (session.interrupt over host.request, fail closed); Continue resubmits
 * "continue" through the app's composer submit bus. Both are profile-gated.
 */
function FlowPill({ paused, onInterrupt, onContinue }) {
  const busy = useValue(busyState)
  const profile = useValue(profileState)
  const pausedOn = useValue(paused)

  if (!GATED_PROFILES.includes(profile)) return null

  if (busy) {
    return createElement(
      'button',
      { type: 'button', className: 'groklike-feel-pill', onClick: onInterrupt },
      'Stop',
    )
  }

  if (pausedOn) {
    return createElement(
      'button',
      { type: 'button', className: 'groklike-feel-pill groklike-feel-pill-continue', onClick: onContinue },
      'Continue',
    )
  }

  return null
}

function CleanChatControl({ hidden, onToggle }) {
  const profile = useValue(profileState)
  const [clean, setClean] = useState(hidden.get())
  useEffect(() => hidden.subscribe(setClean), [hidden])
  if (!GATED_PROFILES.includes(profile)) return null
  return createElement(
    'button',
    {
      type: 'button',
      className: 'groklike-feel-control',
      title: clean ? 'Show detailed reasoning in chats' : 'Hide detailed reasoning in chats',
      'aria-label': clean ? 'Show thoughts' : 'Clean chat',
      'aria-pressed': clean,
      onClick: onToggle,
    },
    clean ? 'Show thoughts' : 'Clean chat',
  )
}

export default {
  id: 'groklike-feel',
  name: 'GroklikeFeel',
  description: 'A calm transcript: keep answers and status visible, with detailed thoughts tucked away. Ships the GroklikeFeel theme (Grok app look) in Settings > Appearance.',
  defaultEnabled: true,

  register(ctx) {
    const hidden = atom(ctx.storage.get(CLEAN_CHAT_KEY, true) !== false)
    const flowLabel = atom(null)
    const chipTone = atom('working')
    const paused = atom(false)

    const style = document.createElement('style')
    style.textContent = `
      html.groklike-feel-clean [data-slot="aui_thinking-disclosure"],
      html.groklike-feel-clean [data-slot="message-reasoning"],
      html.groklike-feel-clean [data-slot="message-reasoning-streaming"] {
        display: none;
      }
      .groklike-feel-control {
        appearance: none;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--muted-foreground);
        cursor: pointer;
        font: inherit;
        font-size: 11px;
        line-height: 24px;
        padding: 0 8px;
        -webkit-app-region: no-drag;
      }
      .groklike-feel-control:hover {
        color: var(--foreground);
        background: color-mix(in srgb, var(--foreground) 8%, transparent);
      }
      .groklike-feel-control:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .groklike-feel-chip {
        align-items: center;
        color: var(--muted-foreground);
        display: inline-flex;
        font-size: 11px;
        gap: 6px;
        line-height: 24px;
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .groklike-feel-chip::before {
        animation: groklike-feel-pulse 1.2s ease-in-out infinite;
        background: var(--accent);
        border-radius: 999px;
        content: '';
        flex: none;
        height: 6px;
        width: 6px;
      }
      .groklike-feel-chip[data-tone='error']::before {
        background: #e34671;
      }
      .groklike-feel-chip-text {
        animation: groklike-feel-shimmer 1.4s linear infinite;
        background: linear-gradient(
          90deg,
          rgba(240, 240, 240, 0.55) 0%,
          #f0f0f0 50%,
          rgba(240, 240, 240, 0.55) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .groklike-feel-chip[data-tone='error'] .groklike-feel-chip-text {
        animation-duration: 2.2s;
        background: linear-gradient(
          90deg,
          rgba(227, 70, 113, 0.55) 0%,
          #e34671 50%,
          rgba(227, 70, 113, 0.55) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
      }
      @keyframes groklike-feel-shimmer {
        from { background-position: 200% 0; }
        to { background-position: -200% 0; }
      }
      .groklike-feel-pill {
        -webkit-app-region: no-drag;
        appearance: none;
        background: color-mix(in srgb, var(--foreground) 7%, transparent);
        border: 0;
        border-radius: 999px;
        color: var(--foreground);
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        font-weight: 500;
        padding: 4px 14px;
        transition: background 140ms ease, color 140ms ease, transform 100ms ease;
      }
      .groklike-feel-pill:hover {
        background: color-mix(in srgb, var(--foreground) 14%, transparent);
      }
      .groklike-feel-pill:active {
        transform: scale(0.97);
      }
      .groklike-feel-pill:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .groklike-feel-pill-continue {
        background: var(--accent);
        color: var(--primary-foreground);
      }
      .groklike-feel-pill-continue:hover {
        background: color-mix(in srgb, var(--accent) 86%, var(--foreground));
      }
      @keyframes groklike-feel-pulse {
        50% { opacity: 0.35; transform: scale(0.8); }
      }
    `
    document.head.append(style)

    function apply() {
      const active = GATED_PROFILES.includes(profileState.get()) && hidden.get()
      document.documentElement.classList.toggle('groklike-feel-clean', active)
    }

    apply()
    const unsubscribeHidden = hidden.subscribe(apply)
    const unsubscribeProfile = profileState.subscribe(apply)

    ctx.register({
      id: 'clean-chat',
      area: TITLEBAR_AREAS.left,
      order: 50,
      render: () => createElement(CleanChatControl, {
        hidden,
        onToggle: () => {
          const next = !hidden.get()
          hidden.set(next)
          ctx.storage.set(CLEAN_CHAT_KEY, next)
        },
      }),
    })

    /** Theme contribution: official THEMES_AREA family B data, picker-gated. */
    ctx.register({
      id: 'groklike-feel-theme',
      area: THEMES_AREA,
      data: GROK_THEME,
    })

    ctx.register({
      id: 'flow-chip',
      area: STATUSBAR_AREAS.right,
      order: 45,
      render: () => createElement(FlowChip, { label: flowLabel }),
    })

    /** Composer underside: Stop while busy, Continue after an interrupt. */
    ctx.register({
      id: 'flow-pill',
      area: COMPOSER_AREAS.underside,
      order: 20,
      render: () =>
        createElement(FlowPill, {
          paused,
          onInterrupt: () => {
            paused.set(true)
            host
              .request('session.interrupt', { session_id: host.state.activeSessionId.get() })
              .catch(() => {})
          },
          onContinue: () => {
            if (host.composer.submit(null, 'continue')) {
              paused.set(false)
            }
          },
        }),
    })

    const setFlow = text => flowLabel.set(text)
    const onEvent = ctx.onEvent.bind(ctx)
    const subscriptions = [
      onEvent('message.start', () => {
        setFlow('thinking')
        chipTone.set('working')
        paused.set(false)
      }),
      onEvent('reasoning.delta', () => setFlow('thinking')),
      onEvent('thinking.delta', () => setFlow('thinking')),
      onEvent('tool.start', event => {
        const payload = event.payload || {}
        setFlow(toolLabel(payload.name, payload.args))
      }),
      onEvent('tool.complete', () => setFlow('thinking')),
      onEvent('message.delta', () => setFlow('writing')),
      onEvent('status.update', event => {
        const payload = event.payload || {}
        if (payload.kind === 'compacting') setFlow('condensing the thread')
      }),
      onEvent('message.complete', () => setFlow(null)),
      onEvent('error', () => {
        setFlow(null)
        chipTone.set('error')
        paused.set(true)
      }),
      onEvent('session.reclaimed', () => {
        setFlow(null)
        paused.set(false)
      }),
    ]

    ctx.onDispose(() => {
      for (const unsubscribe of subscriptions) unsubscribe()
      unsubscribeHidden()
      unsubscribeProfile()
      style.remove()
      document.documentElement.classList.remove('groklike-feel-clean')
    })
  },
}
