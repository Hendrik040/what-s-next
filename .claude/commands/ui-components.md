---
description: Create or refactor a reusable React graph node component for our react-force-graph-2d setup.
arguments-hint:
  name | Component name
  type |Node type (person, event, custom)
  label | Show label (on/off)
  hover | Show hover effect (on/off)
  click | Show click effect (on/off)
  size | Node size (auto/number)
  highlight | Show highlight effect (on/off)
---


Create or refactor a reusable React graph node component for our react-force-graph-2d setup.


- [name]: Component name from $ARGUMENTS
- [type]: Node type (person, event, custom) from $ARGUMENTS
- [label]: Show label (on/off) from $ARGUMENTS
- [hover]: Show hover effect (on/off) from $ARGUMENTS
- [click]: Show click effect (on/off) from $ARGUMENTS
- [size]: Node size (auto/number) from $ARGUMENTS
- [highlight]: Show highlight effect (on/off) from $ARGUMENTS


Context:
- Frontend: client/ (React 19 + Vite)
- Graph: client/src/components/GraphView.jsx using nodeCanvasObject
- Colors: people #4CAF50, events #2196F3 (see CLAUDE.md)

Goals:
- Add a dedicated node renderer exporting draw and sizing helpers, with minimal GraphView.jsx changes.
- Preserve current visuals; make them configurable via options.

Deliverables:
1) New file client/src/components/GraphNodeRenderer.js
   - export function drawNode(ctx, node, scale, options)
   - export function nodeRelSize(node, options)
   - States: default, hover, highlighted
   - Options: type, label, size, highlight, colors
2) Update client/src/components/GraphView.jsx to import and use the helpers via nodeCanvasObject and optionally nodeRelSize.
3) Safe defaults and brief usage example comment in GraphNodeRenderer.js.

Implementation notes:
- Mirror existing label font/padding from GraphView.jsx when --label on.
- Default colors: person #4CAF50, event #2196F3; allow overrides via options.colors.
- Size: if auto, derive from node.degree or node.val with clamped min/max; else numeric.
- Hover/highlight: subtle stroke or glow with low perf overhead.

Integration snippet (for reference):
- import { drawNode, nodeRelSize } from './GraphNodeRenderer'
- nodeCanvasObject={(node, ctx, scale) => drawNode(ctx, node, scale, options)}
- nodeRelSize={(node) => nodeRelSize(node, options)} (only if dynamic sizing used)

Options shape:
{
  type: 'person' | 'event' | 'custom',
  label: boolean,
  hover: boolean,
  click: boolean,
  size: 'auto' | number,
  highlight: boolean,
  colors?: { person?: string, event?: string, custom?: string, stroke?: string, text?: string }
}

Command behavior:
- Parse $ARGUMENTS with defaults: ComponentName=GraphNodeRenderer, type=custom, label=on, hover=on, click=on, size=auto, highlight=on.
- Create the new renderer and minimally edit GraphView.jsx without altering link behavior.
- Add imports at the top; keep diffs focused; run formatter if available.

Examples:
> /ui-componnents GraphNodeRenderer --type person --size 6 --label on
> /ui-componnents NodeRenderer --type event --highlight off --hover on --label off

Acceptance criteria:
- Renderer file exists and exports the functions.
- No runtime errors; visuals match current defaults.
- People remain green, events blue (unless overridden).
- Labels/sizes respond to options; performance remains smooth.
asfd