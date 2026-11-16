# Grok Bot (v0.78.5) — extracted design tokens
# Source: /Applications/Grok Bot.app app.asar → dist/renderer/assets/index-CS11TaNu.css
# Extracted Nov 5 2026. "Grok Bot" = Cursor fork by SpaceXAI (package "sand", @anysphere/* deps).

## Palette (dark)
--cursor-chrome: #141414          (window chrome)
--cursor-pane: #181818            (editor/pane bg)
--cursor-sidebar: #181818
--cursor-bg-editor: #181818
--cursor-accent: #599ce7          (primary blue)
--cursor-base: #f0f0f0           (primary text)
--cursor-text-secondary: color-mix(base 74%, transparent)
--cursor-text-tertiary: color-mix(base 60%, transparent)
--cursor-text-quaternary: color-mix(base 36%, transparent)
--cursor-success/green: #3fa266
--cursor-danger: #e34671
--cursor-warn/yellow: #f1b467
--cursor-modified: #f1b467
--cursor-purple: #9386f2
--cursor-magenta: #b48ead
--cursor-cyan: #81a1c1
--speculars: #ffffff1f / #ffffff08 / #ffffff05 / #ffffff03 (subtle white overlays)
--cursor-shadow-primary: #0003

## Typography
--conversation-text-font-size: 14px
--cursor-font-size-base: 13px, lg: 14px, sm: 12px, xs: 11px
letter-spacing: base -.08px, lg -.15px, 3xl -.26px, 2xl -.46px  (tight, Apple-like)
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
font-smoothing: antialiased
weights: normal 400, medium 500, semibold 600, bold 700
rte-strong-font-weight: 500  (bold text is MEDIUM, not heavy — the "clean" look)
rte-h1: 1.75em, h2: 1.5em, h3: 1.25em  (flat heading scale)
rte-caption: 12px italic
rte-table-header: 12px / medium weight
markdown inline code radius: 0

## Radii
--conversation-surface-border-radius: 12px (radius-xl)
--sand-transcript-prose-bubble-radius: 18px
--prompt-input-border-radius: 20px
menu radius 12px, menu row 6px, new-chat menu 14px, row 8px
radius scale: 2/4/6/8/12/14/16/18px, full 9999px

## Motion system (JS token object "Sx")
cursorFadeDuration: 90ms
menuRiseDuration: 100ms
rowHoverRevealDuration: 100ms
hoverIntentDelay: 100ms
feedbackDuration: 120ms
quickFadeDuration: 120ms
cardToggleFadeDuration: 80ms / fadeIn 120ms
rowRevealDuration: 130ms
buttonHoverDuration: 140ms
hoverFadeDuration: 140ms
glyphSwapDuration: 200ms
enterDuration: 160ms
fadeDuration: 160ms
imageLoadFadeDuration: 180ms
trayEnterDuration: 180ms
noticeCollapseDuration: 200ms
revealDuration: 200ms
rowEnterDuration: 240ms
cardToggleDuration: 240ms
reactionBumpDuration: 240ms
cardCollapseDuration: 300ms
paneCrossfadeDuration: 260ms
sectionRevealDuration: 260ms
widgetEnterDuration: 320ms
cardStepEnterDelay: 380ms  (stagger!)
reactionPopDuration: 500ms
spinDuration: 700ms
glyphSpinDuration: 1000ms
sendProgressSweepDuration: 1000ms
runningSpinDuration: 1200ms
bounceDuration: 1400ms
shimmerDuration: 1400ms
sweepDuration: 2200ms
breatheDuration: 2400ms

## Easings (signature)
standard: cubic-bezier(0.2, 0, 0, 1)
glyph swap / row enter: cubic-bezier(0.22, 1, 0.36, 1)  (expo-out)
row enter alt: cubic-bezier(0.23, 1, 0.32, 1)
bouncy overshoot: cubic-bezier(0.25, 1.15, 0.4, 1)
exit: cubic-bezier(0.4, 0, 1, 1)
reaction pop: custom linear() curve peaking at 1.078 @ 37.5% (spring overshoot)

## Transcript row entrance (CSS)
.sand-transcript-row[data-enter=new] → animation-duration .32s, cubic-bezier(.22,1,.36,1), fill-mode backwards
.sand-transcript-row[data-enter=after-collapse] → .24s, animation-delay .38s
user rows: align-self flex-end, margin-inline-end 6px
shimmer text: base = color-mix(currentColor 60%, transparent), highlight = currentColor

## Composer
--prompt-input-container-bg: var(--cursor-bg-input-surface)
--prompt-input-container-border: stroke-tertiary, hover: stroke-secondary
--prompt-input-container-shadow: none
editor min-height 36px, max-height 200px
border-radius 20px
"dynamic island" pill variant: rest 8rem x 6px → active 14rem x full height, radius 3xl

## Misc feel details
scrollbar: 6px thin
"…ing…" gerund status strings everywhere: Creating… Generating… Checking… Listening… Stopping… Recovering… Publishing… (always gerund + ellipsis)
toast: 16 mentions
sound: 20 mentions
haptic patterns: pressSweep 1000ms
status chips (wx object): working / needsAttention / offline / error / info — distinct pulse animations per state
