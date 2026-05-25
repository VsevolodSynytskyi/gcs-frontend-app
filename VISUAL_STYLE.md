# Visual Style Guide

A reference for the visual language used by this design system. Written so the
same look-and-feel can be reproduced in a brand-new project regardless of
domain.

The aesthetic is best summarized as: **dark-first, glass-morphic HUD over a
full-bleed content stage, with monospaced numeric data and spring-driven
motion.** Floating translucent cards sit on top of a live background; chrome
is minimal; type is small and quiet; numbers are loud and monospaced.

---

## 1. Foundations

### 1.1 Stack & Tooling

- **TailwindCSS v4** with no `tailwind.config.js` — design tokens live as CSS
  variables in a single global stylesheet and are mapped into Tailwind via
  `@theme inline { ... }`.
- **shadcn/ui** (new-york style) for base interactive primitives (Button,
  Toggle, Popover, Tooltip, Separator, Resizable, Input, …).
- **Radix UI primitives** under the hood for all overlays/interactive
  components.
- **`class-variance-authority`** (`cva`) for component variants.
- **`clsx` + `tailwind-merge`** wrapped as a `cn(...)` helper.
- **`motion`** (Motion One / React) for all animations — never CSS transitions
  or keyframes for UI motion. Raw CSS keyframes are acceptable only for
  performance-sensitive background effects that animate many DOM nodes.
- **`lucide-react`** for icons. Default stroke width, sized explicitly
  (`size={18}`, `size={16}`).

### 1.2 Theming model

Two themes exist (`.dark` and `.light`) but **dark is the canonical
experience.** Theme is selected at the `<html>` level by toggling a single
class. Light mode exists for surfaces that need legibility on top of bright
content (e.g., a light-background underlay); a few glass treatments
specifically opt into a less-shadowed variant via the `[.light_&]:` selector.

Theme switching is driven by app state, not by a static preference. The visual
language stays the same — only the underlying token values change.

### 1.3 Color system

All colors are defined as **OKLCH** CSS variables. The variables are *roles*,
not literal hues, and components reference roles only (`bg-card`,
`text-muted-foreground`, etc.).

| Role | Purpose |
|---|---|
| `background` / `foreground` | Page surface & default text |
| `card` / `card-foreground` | Card surface & text on it |
| `popover` / `popover-foreground` | Overlay surface & text on it |
| `primary` / `primary-foreground` | Primary action (used sparingly) |
| `secondary` / `secondary-foreground` | Secondary action |
| `muted` / `muted-foreground` | De-emphasized text / inactive backgrounds |
| `accent` / `accent-foreground` | Hover & toggle-on background |
| `destructive` | Errors, danger actions, failure state |
| `border` | Hairline borders |
| `input` | Form field background tint |
| `ring` | Focus ring color |
| `chart-1` … `chart-5` | Reserved palette for data viz |
| `sidebar-*` | Sidebar-scoped variants (same roles, dedicated tokens) |

**Reference token values (dark):**

```css
--background:            oklch(0.145 0 0);   /* near-black */
--foreground:            oklch(0.985 0 0);   /* near-white */
--card:                  oklch(0.205 0 0);
--card-foreground:       oklch(0.985 0 0);
--popover:               oklch(0.205 0 0);
--popover-foreground:    oklch(0.985 0 0);
--primary:               oklch(0.922 0 0);   /* light grey on dark */
--primary-foreground:    oklch(0.205 0 0);
--secondary:             oklch(0.269 0 0);
--secondary-foreground:  oklch(0.985 0 0);
--muted:                 oklch(0.269 0 0);
--muted-foreground:      oklch(0.708 0 0);
--accent:                oklch(0.269 0 0);
--accent-foreground:     oklch(0.985 0 0);
--destructive:           oklch(0.704 0.191 22.216);
--border:                oklch(1 0 0 / 10%); /* 10% white */
--input:                 oklch(1 0 0 / 15%);
--ring:                  oklch(0.556 0 0);
```

**Reference token values (light):**

```css
--background:            oklch(1 0 0);
--foreground:            oklch(0.145 0 0);
--card:                  oklch(1 0 0);
--card-foreground:       oklch(0.145 0 0);
--popover:               oklch(1 0 0);
--popover-foreground:    oklch(0.145 0 0);
--primary:               oklch(0.205 0 0);
--primary-foreground:    oklch(0.985 0 0);
--secondary:             oklch(0.97 0 0);
--secondary-foreground:  oklch(0.205 0 0);
--muted:                 oklch(0.97 0 0);
--muted-foreground:      oklch(0.556 0 0);
--accent:                oklch(0.97 0 0);
--accent-foreground:     oklch(0.205 0 0);
--destructive:           oklch(0.577 0.245 27.325);
--border:                oklch(0.922 0 0);
--input:                 oklch(0.922 0 0);
--ring:                  oklch(0.708 0 0);
```

Charts and sidebar tokens follow the same role pattern; if a token is not
listed for a theme, fall back to its shadcn `new-york` default.

**Status / semantic colors** are *not* role tokens — they are Tailwind's
literal `green-500`, `yellow-500`, `red-500`, `blue-400`. They appear in three
fixed tints (see [Badges](#34-badges-status-pills)):

- `bg-{color}/15` — fill at 15% opacity
- `border-{color}/25` — border at 25% opacity
- `text-{color}` — full saturation text/icon

Thresholded coloring (e.g., a percentage meter going from healthy → warning →
critical) uses the same trio of greens/yellows/reds (`>= 60` / `>= 30` /
else).

### 1.4 Radius scale

A single base radius drives a derived scale. Replicate by declaring:

```css
--radius: 0.625rem; /* 10px — the canonical card radius */

--radius-sm:  calc(var(--radius) - 4px);   /* 6px */
--radius-md:  calc(var(--radius) - 2px);   /* 8px */
--radius-lg:  var(--radius);               /* 10px */
--radius-xl:  calc(var(--radius) + 4px);   /* 14px */
--radius-2xl: calc(var(--radius) + 8px);   /* 18px */
--radius-3xl: calc(var(--radius) + 12px);  /* 22px */
--radius-4xl: calc(var(--radius) + 16px);  /* 26px */
```

**Typical usage:**

| Element | Radius |
|---|---|
| Buttons, inputs, toggles | `rounded-md` (8px) |
| Glass cards, popovers, toasts | `rounded-xl` (14px) |
| Outer page chrome / cropped media panels | `rounded-lg` (10px) |
| Badges, progress bars, status dots | `rounded-full` |
| Tiny pill chrome (e.g., grip handle) | `rounded-xs` |

---

## 2. Typography

There is **no custom typeface.** The voice comes from sizing, weight, casing,
and the strategic use of monospace.

### 2.1 Font stack

Inherit a generic system stack rather than shipping a webfont:

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* monospace stack — used for all numeric values */
font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
             'Liberation Mono', monospace;
```

The monospace stack is reached via Tailwind's `font-mono` utility.

### 2.2 Scale (Tailwind defaults)

| Token | Used for |
|---|---|
| `text-xs` (12px) | Labels, toast body, tooltip body, badge text, scale captions |
| `text-sm` (14px) | Buttons, body copy in popovers, toasts |
| `text-base` (16px) | Numeric / data values |
| `text-2xl` (24px) | Hero numbers (large readouts inside data widgets) |

### 2.3 Recurring type patterns

**Stat label (uppercase, tracked, muted):**

```tsx
<span className="text-muted-foreground text-xs tracking-wider uppercase">
  Throughput
</span>
```

**Stat value (monospace, foreground, base size):**

```tsx
<span className="text-foreground font-mono text-base">128.4</span>
```

This label/value pair is the single most-repeated typographic motif. Numbers
*always* render in `font-mono` so they don't shimmer between fixed-width
digits as values stream in.

**Empty state:** when a value is missing, render a muted `--`:

```tsx
<span className="text-muted-foreground">--</span>
```

### 2.4 Weights

Use sparingly:

- `font-medium` for button labels, badge labels, popover titles, caption
  text accompanying small visual indicators.
- `font-semibold` for tiny tracked glyph labels inside dense visualizations
  (e.g., axis tick letters in a circular gauge) — nowhere else.
- Body / labels stay at default weight.

---

## 3. Component patterns

### 3.1 The Glass Card

The signature surface. Every floating panel, every overlay button cluster,
every toast uses it.

```tsx
<div className="
  bg-background/40
  rounded-xl
  border border-white/20
  p-4
  shadow-sm
  backdrop-blur-sm
  [.light_&]:border-white/50
  [.light_&]:shadow-none
">
  …
</div>
```

Rules:

- Surface = **the background token at 40% opacity** (not `card`!) — the panel
  is meant to read as a frosted slice of the page, not as an opaque card.
- `backdrop-blur-sm` is mandatory; the glass effect collapses without it.
- Border is `white/20` in dark mode, `white/50` in light mode (the brighter
  border replaces the shadow that disappears on light backgrounds).
- Shadow is `shadow-sm` in dark mode, none in light mode.
- Padding defaults to `p-4`; override down to `p-1` when the card only wraps
  a button cluster or toggle group.
- Radius is always `rounded-xl` — never `rounded-lg` and never `rounded-2xl`.

Popovers share **exactly the same recipe** (same `bg-background/40`, same
`border-white/20`, same `rounded-xl`, same `p-4`). Treat the glass card and
the popover surface as one visual element.

### 3.2 Buttons

A single `Button` primitive with `variant` × `size` matrix via `cva`.

**Base class** (always applied):

```
inline-flex shrink-0 items-center justify-center gap-2
rounded-md text-sm font-medium whitespace-nowrap
cursor-pointer transition-all outline-none
focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
disabled:pointer-events-none disabled:opacity-50
aria-invalid:border-destructive aria-invalid:ring-destructive/20
[&_svg]:pointer-events-none [&_svg]:shrink-0
[&_svg:not([class*='size-'])]:size-4
```

**Variants:**

| Variant | Look |
|---|---|
| `default` | Bordered, `bg-background`, hover `bg-muted`. In dark mode swaps to `bg-input/30` → `bg-input/50` so it reads as a faintly translucent chip. `aria-expanded` toggles to the hover state. |
| `destructive` | Solid `bg-destructive` with white text; `/60` in dark mode. |
| `secondary` | `bg-secondary` with `secondary-foreground`; hover at `/80`. |
| `ghost` | Transparent until hover, then `bg-accent`. |
| `link` | Underlined `text-primary` only. |

**Sizes:**

| Size | Height | Padding | Notes |
|---|---|---|---|
| `default` | `h-9` | `px-4 py-2` (or `px-3` when icon-only via `has-[>svg]`) | |
| `xs` | `h-6` | `px-2 text-xs`, `gap-1`, svg `size-3` | Used for very dense chrome |
| `sm` | `h-8` | `px-3` (`px-2.5` w/ svg) | |
| `lg` | `h-10` | `px-6` (`px-4` w/ svg) | |
| `icon` | `size-9` | square | |
| `icon-xs` / `icon-sm` / `icon-lg` | `size-6` / `8` / `10` | square | |

The cursor is always `pointer` (set globally in the base recipe) — never rely
on the browser default; touch/desktop hybrid use is assumed.

### 3.3 Inputs & form fields

Text inputs match button sizing so they line up in toolbars and forms.

```tsx
<input
  className="
    flex h-9 w-full min-w-0 rounded-md
    border border-input bg-transparent
    px-3 py-1
    text-sm
    placeholder:text-muted-foreground
    selection:bg-primary selection:text-primary-foreground
    shadow-xs outline-none transition-[color,box-shadow]
    focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    disabled:cursor-not-allowed disabled:opacity-50
    dark:bg-input/30
    file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium
  "
/>
```

Notes:

- Height matches `Button` `default` (`h-9`); `sm` and `lg` siblings should
  mirror the button equivalents (`h-8`, `h-10`).
- Background is **`bg-transparent` in light mode** and **`bg-input/30`** in
  dark mode — same translucent-chip feel as the default button.
- Border is the `--input` token, not `--border`.
- The focus ring (`ring-[3px] ring-ring/50` plus a `border-ring` swap) is
  shared with buttons and toggles — *this is the system's single focus
  treatment.* Don't invent new focus styles.
- Placeholder color always uses `text-muted-foreground`.

### 3.4 Toggles & toggle groups

Toggles use the same base sizing as buttons but a different recipe:

- Default variant: transparent background, `data-[state=on]:bg-accent`.
- Outline variant: `border border-input`, `bg-transparent`, `shadow-xs`,
  hover lifts to `bg-muted`.
- Toggle groups can be `spacing={0}` (segmented, borders merge into a single
  rounded shell, first child gets `rounded-l-md`, last child `rounded-r-md`)
  or `spacing > 0` (free-standing pills with a gap).

### 3.5 Badges (status pills)

Small uppercase-friendly pills used for connection state, system state,
status readouts.

```
inline-flex w-fit shrink-0 items-center justify-center gap-1
overflow-hidden rounded-full border border-transparent
px-2 py-0.5 text-xs font-medium whitespace-nowrap
```

**Variants** — note the unusual semantic mapping: `default` is *green*, not
neutral. The variants are tuned around health/state, not generic UI
emphasis.

| Variant | Colors |
|---|---|
| `default` | `bg-green-500/15 text-green-500 border-green-500/25` — healthy / ready / active |
| `secondary` | `bg-yellow-500/15 text-yellow-500 border-yellow-500/25` — transitional / initializing |
| `destructive` | `bg-red-500/15 text-red-500 border-red-500/25` — disconnected / critical |
| `outline` | Neutral `border-border`, `text-foreground` |
| `ghost` / `link` | Hover-only states |

**Pulsing dot pattern** — when a status is transitional, prepend a small
animated dot whose color inherits `bg-current` (so it picks up the variant's
text color automatically):

```tsx
<motion.span
  className="mr-1 inline-block size-1.5 rounded-full bg-current"
  animate={{ opacity: [1, 0.3, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
/>
```

### 3.6 Tooltips

- Surface: solid `bg-popover` with `text-popover-foreground` (this is one of
  the few overlays that does **not** use the glass treatment — tooltips need
  to be reliably legible at small sizes).
- `border-border`, `rounded-md`, `px-3 py-1.5`, `text-xs`, `shadow-md`.
- Animated in/out with `animate-in fade-in-0 zoom-in-95` /
  `data-[state=closed]:animate-out fade-out-0 zoom-out-95`.
- `delayDuration={0}` and a default `sideOffset` of `8` — tooltips feel
  responsive and sit slightly away from their trigger.

### 3.7 Popovers

Use the **glass card recipe** (see [3.1](#31-the-glass-card)). Slide-in
animations come from Radix data attributes:

```
data-[side=bottom]:slide-in-from-top-2
data-[side=top]:slide-in-from-bottom-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[state=open]:animate-in   data-[state=open]:fade-in-0   data-[state=open]:zoom-in-95
data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
```

`sideOffset={4}`, `w-72` default width, `origin-(--radix-popover-content-transform-origin)`
so the zoom-in originates from the trigger.

### 3.8 Toasts

Bottom-right stack, glass surface, monospace body (toasts often report
machine-readable status strings).

- Container: `fixed right-4 bottom-4 z-[2000] w-96 flex flex-col gap-2`.
- Each toast: same glass recipe (`bg-background/40 border-white/20
  backdrop-blur-sm rounded-xl shadow-sm`), plus `px-4 py-3 font-mono text-sm`.
- Variant colors apply to the *text only*, not the background:
  - `info`: `text-blue-400` + Info icon
  - `warning`: `text-yellow-400` + TriangleAlert icon
  - `error`: `text-red-400` + CircleAlert icon
  - `default`: `text-foreground/80`, no icon
- Auto-dismiss after 4000ms.
- Enter/exit: `initial={{ opacity: 0, y: 20, scale: 0.95 }}` →
  `animate={{ opacity: 1, y: 0, scale: 1 }}` → exit drifts up
  (`y: -10, scale: 0.95`). Duration 0.2s.

### 3.9 Separators

Hairlines only — `bg-border`, 1px (`h-px`/`w-px`). Used inside cards to split
logical groups (e.g., status row | action buttons) with `my-3` vertical
breathing room.

### 3.10 Resizable panes

Two-pane layouts use a 1px `bg-border` separator with a small centered grip.

```tsx
<ResizablePanelGroup className="size-full gap-1">
  <ResizablePanel defaultSize={50} minSize={20}>
    <div className="size-full overflow-hidden rounded-lg">{leftContent}</div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50} minSize={20}>
    <div className="size-full overflow-hidden rounded-lg">{rightContent}</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

The handle:

```tsx
<div className="
  bg-border relative flex w-px items-center justify-center
  after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2
  focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1
">
  <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
    <GripVerticalIcon className="size-2.5" />
  </div>
</div>
```

The visible separator is 1px; an invisible 4px hit-area (`::after`) makes it
draggable. Panels themselves clip with `rounded-lg overflow-hidden` so the
content stage corners stay soft.

### 3.11 Progress bars

A two-layer pattern — a faint full-width track plus a fill bar:

```tsx
<div className="bg-foreground/10 h-2.5 w-full overflow-hidden rounded-full">
  <motion.div
    className="h-full rounded-full bg-green-500"
    animate={{ width: `${percentage}%` }}
    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
  />
</div>
```

Track is always `bg-foreground/10` (so it adapts to dark/light), height
`h-2.5`, fill color is semantic (green/yellow/red by threshold).

### 3.12 Stat item (label-over-value)

The repeating data-readout primitive:

```tsx
<div className="flex flex-col gap-1">
  <span className="text-muted-foreground text-xs tracking-wider uppercase">
    Throughput
  </span>
  <span className="text-foreground font-mono text-base">128.4</span>
</div>
```

Two stats per row inside a card → `grid grid-cols-2 gap-4`.

### 3.13 Scrollbars

The project intentionally **does not customize scrollbars** — they inherit
the platform default. Rationale: dark-glass surfaces over an active
background read cleanly with system scrollbars (especially on macOS, where
they're already overlay-style), and custom thumbs tend to clash with the
hairline-border aesthetic. If you must introduce a custom scrollbar, keep it
1–2px thick, color it `border` at default and `muted-foreground` on hover,
and never give it a visible track.

---

## 4. Layout & spacing

### 4.1 Page chrome

- The root takes the full viewport (`h-screen w-screen`) with **`p-1`** of
  outer padding. This 4px gutter — never larger — is what gives the app its
  edge-to-edge HUD feeling while still hinting at a windowed frame.
- The main content area sits inside a `rounded-lg` clip so the live stage
  has soft corners.
- Floating overlays use absolute positioning relative to the root, with
  **z-index in deliberate tiers**:
  - `z-1000` — floating UI on top of the content stage (panels, controls,
    overlays).
  - `z-2000` (or `z-[2000]`) — toasts, the topmost layer.

Don't introduce intermediate z-index values for ordinary UI. Reserve very
small (`z-1`–`z-9`) values for compositing layers *inside* a single visual
component if they're truly local to it.

### 4.2 Spacing scale

Tailwind's default 4px spacing scale is used as-is. The recurring choices:

| Context | Spacing |
|---|---|
| Stacked card group (vertical) | `gap-1` (4px) |
| Inside a card (column) | `gap-2` to `gap-4` |
| Grid of stats inside a card | `gap-4` |
| Padding inside a glass card | `p-4` (default), `p-1` (icon clusters) |
| Floating overlay inset from edge | `top-4 left-4`, `bottom-3 left-3`, `right-3` |
| Toast container inset | `right-4 bottom-4` |
| Tooltip offset | `sideOffset={8}` |
| Popover offset | `sideOffset={4}` |

When a panel needs a centered vertical anchor it pins to `top-1/2` then
applies `-translate-y-1/2` rather than using flex centering on a full-height
parent — this keeps the panel's height intrinsic to its content.

### 4.3 Card stacking

When several glass cards stack into a single "panel" (e.g., a side rail of
data widgets), they sit with `gap-1` between them — *not* merged into a
larger card. Each remains an independent glass slab so the user reads them
as discrete instrument modules.

---

## 5. Motion

**All motion goes through the `motion` library.** Never CSS transitions or
keyframes for UI motion.

### 5.1 The signature spring

Anything that rotates, fills, or settles into a position uses a consistent
spring:

```ts
{ type: 'spring', stiffness: 80,  damping: 20 }  // default
{                stiffness: 80,  damping: 18 }  // perspective tilt
{ type: 'spring', stiffness: 100, damping: 20 }  // progress fills
```

These are tuned to feel weighty but not floaty — pick the same numbers if you
want the same character.

### 5.2 Fade-and-rise pattern

Items entering a stack fade in with a staggered delay:

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.05 * index }}
/>
```

Stacked widgets stagger at 0 / 0.05 / 0.1 / 0.15s.

### 5.3 Status crossfade

When a discrete state changes (e.g., a status badge swaps label), crossfade
with `AnimatePresence mode="wait"`, `duration: 0.15`, opacity-only.

### 5.4 Panel slide-in

Side panels enter from off-screen using percentage translates:

```tsx
initial={{ x: '-110%' }}
animate={{ x: 0 }}
exit={{ x: '-110%' }}
```

The `-110%` (vs `-100%`) keeps the shadow from peeking during the exit.

### 5.5 Perspective / 3D tilt

A subtle (max 10°) `rotateX` / `rotateY` parallax driven by mouse position
applies to "hero" floating panels (stacks the user is meant to focus on).
Implemented by:

```ts
perspective: '800px'
maxTilt:    10           // degrees
spring:     stiffness 80, damping 18
```

The wrapper applies `perspective` on an outer `<div>`, with the inner
`<motion.div>` receiving `rotateX`/`rotateY` spring values driven by
`(mouseY - centerY) / halfHeight * maxTilt`. Tilt eases back to zero on
mouse-leave.

### 5.6 Pulsing dot (waiting / transitional state)

```tsx
animate={{ opacity: [1, 0.3, 1] }}
transition={{ repeat: Infinity, duration: 1.5 }}
```

1.5s period, three-stop fade. Use it for any "in-progress" affordance.

### 5.7 Loading & empty states

The system favors the **muted `--` placeholder** over skeleton shimmers.
Reasons:

- The data layout doesn't shift between loading and loaded — the
  `<StatItem>` reserves its slot, the label is already rendered, only the
  value is missing.
- Animated skeletons compete visually with the live background and the
  pulsing-dot pattern.

Rules:

- Numeric / value slots → muted `--` until data arrives.
- Discrete status (badge, indicator) → render a hidden placeholder of the
  same shape (e.g., `<Badge className="invisible">Loading</Badge>`) so
  layout doesn't jump, then reveal with a 0.15s opacity crossfade.
- Whole-card loading is *not* a supported state in this system. If a card
  has no data yet, it stays mounted with empty slots; if it shouldn't exist
  at all, don't render it.

> One-off page-level transitions (intro reveals, splash sequences) are
> app-specific and not part of the shared visual language. Build them on the
> spring principles above, but don't try to make them universal.

---

## 6. Iconography

- **Library:** `lucide-react`, exclusively.
- **Default size:** `18` for buttons/controls, `16` for inline status icons
  in toasts, `24` for SVG markers placed on a canvas/map layer.
- **Stroke width:** library default (`2`).
- **Color:** always inherits via `currentColor` — never set with an explicit
  hex.
- Inside buttons, SVG icons auto-size to `size-4` via the button base recipe;
  override with explicit `size={N}` props when needed.

---

## 7. House rules (cheat sheet)

Treat these as the project's "house rules" — if you stray from them you'll
break the visual identity:

1. **No opaque cards on the main stage.** Anything floating uses the glass
   recipe. Reserve solid surfaces for tooltips only.
2. **The content stage is the canvas.** Chrome is minimal, edge-padded by
   4px, and always sits on top of a live background.
3. **Numbers are monospaced.** Always. Even short ones. This prevents
   jitter under streaming updates.
4. **Labels are uppercase, tracked, muted, 12px.** This pairing is the
   project's strongest typographic motif.
5. **Status color is encoded three ways:** 15% bg + 25% border + 100% text.
   Never invent new tints — reuse green/yellow/red/blue at those opacities.
6. **`default` badge variant is green.** State-first semantics, not
   emphasis-first. Plan badge variants around traffic-light meanings.
7. **Motion is springy, not timed.** Default to a spring (stiffness 80,
   damping 18–20). Reach for tweened easings only for one-shot transitions
   (page reveals, micro-fades).
8. **Hover states are subtle.** Buttons shift one tier on the muted/input
   scale; they don't grow, glow, or change radius.
9. **Borders are `white/20` (dark) and `white/50` (light).** Not the
   `border` token. The semi-transparent white is what makes glass read as
   glass.
10. **z-index is tiered, not free-form.** `z-1000` for floating UI, `z-2000`
    for toasts. Don't fill in the gaps.
11. **Padding stays small.** `p-1` for control clusters, `p-4` for content
    cards. There is no `p-6` / `p-8` in the main UI.
12. **Empty / unknown values render as a muted `--`.** Never `0`, never an
    empty string, never `N/A`. No skeleton shimmers.
13. **One focus treatment.** `ring-[3px] ring-ring/50` plus a `border-ring`
    swap. Used by buttons, inputs, toggles, popovers — everywhere.
14. **Cursor is always pointer on interactive surfaces.** Explicitly set in
    the base button recipe.
15. **Two themes, one identity.** Light mode swaps tokens and a couple of
    glass parameters (border weight, shadow off) but uses the same
    components, the same radii, and the same motion.
