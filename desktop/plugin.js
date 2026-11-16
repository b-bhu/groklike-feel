import { createElement, useEffect, useState } from 'react'
import { atom, host, STATUSBAR_AREAS, TITLEBAR_AREAS, useValue } from '@hermes/plugin-sdk'

/** Hide the transcript's internal reasoning presentation, not the model's work. */
const CLEAN_CHAT_KEY = 'local.cleanChat'
const TEST_PROFILE = 'grokfeel-test'
const profileState = host.state.focusedSessionProfile || host.state.profile
const busyState = host.state.busy

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
  const busy = useValue(busyState)
  const profile = useValue(profileState)
  if (profile !== TEST_PROFILE || !busy || !text) return null
  return createElement(
    'span',
    { className: 'groklike-feel-chip', role: 'status', 'aria-live': 'polite' },
    text,
  )
}

function CleanChatControl({ hidden, onToggle }) {
  const profile = useValue(profileState)
  const [clean, setClean] = useState(hidden.get())
  useEffect(() => hidden.subscribe(setClean), [hidden])
  if (profile !== TEST_PROFILE) return null
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
  description: 'A calm transcript: keep answers and status visible, with detailed thoughts tucked away.',
  defaultEnabled: true,

  register(ctx) {
    const hidden = atom(ctx.storage.get(CLEAN_CHAT_KEY, true) !== false)
    const flowLabel = atom(null)

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
      @keyframes groklike-feel-pulse {
        50% { opacity: 0.35; transform: scale(0.8); }
      }
    `
    document.head.append(style)

    function apply() {
      const active = profileState.get() === TEST_PROFILE && hidden.get()
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

    ctx.register({
      id: 'flow-chip',
      area: STATUSBAR_AREAS.right,
      order: 45,
      render: () => createElement(FlowChip, { label: flowLabel }),
    })

    const setFlow = text => flowLabel.set(text)
    const onEvent = ctx.onEvent.bind(ctx)
    const subscriptions = [
      onEvent('message.start', () => setFlow('thinking')),
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
      onEvent('error', () => setFlow(null)),
      onEvent('session.reclaimed', () => setFlow(null)),
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
