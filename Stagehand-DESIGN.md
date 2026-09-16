---
version: alpha
name: Stagehand
description: |
  Stagehand's design system embodies a minimalist, developer-first aesthetic
  with sharp geometric edges and a monochromatic primary palette punctuated by
  strategic accent colors. The visual language prioritizes clarity and speed,
  with emphasis on typography and whitespace over decorative effects. The brand
  uses near-black (#17171C) as the dominant UI color alongside a clean white
  canvas, creating high contrast for readability. Accent colors—particularly the
  vibrant green (#00C851) used in data visualizations and interactive
  states—provide visual feedback and guide user attention through key
  interactions. The overall mood is professional, direct, and optimized for
  technical audiences who value efficiency and precision.
source:
  url: "https://www.stagehand.dev"
  pagesAnalyzed: 1
  extractedAt: 2026-09-10
  tokensMeasured: true
colors:
  primary: "#17171C"
  accent: "#FF5F57"
  link: "#506B9C"
  canvas: "#D4D4D4"
  on-primary: "#FFFFFF"
  ink: "#000000"
  hairline: "#E4E9F2"
  accent-1: "#007D33"
  accent-2: "#00C851"
  accent-3: "#9BAFD3"
  accent-4: "#2A2A33"
  accent-5: "#FEBC2E"
  neutral-1: "#444746"
  neutral-2: "#7F7F8D"
typography:
  display-lg:
    fontFamily: planar
    fontSize: 58px
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: -1.74px
  display-md:
    fontFamily: planar
    fontSize: 42px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.84px
  heading-lg:
    fontFamily: planar
    fontSize: 38px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.76px
  heading-md:
    fontFamily: planar
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.56px
  heading-sm:
    fontFamily: planar
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.17px
  heading-xs:
    fontFamily: planar
    fontSize: 16.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-xl:
    fontFamily: plain
    fontSize: 16.5px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-lg:
    fontFamily: plain
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0px
  body-md:
    fontFamily: plain
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-sm:
    fontFamily: plain
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-xs:
    fontFamily: plain
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-xs-2:
    fontFamily: plain
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0px
  code-xl:
    fontFamily: standardMono
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  code-lg:
    fontFamily: standardMono
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  code-md:
    fontFamily: standardMono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  code-md-lowercase:
    fontFamily: standardMono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
    textTransform: lowercase
  code-sm:
    fontFamily: standardMono
    fontSize: 10.5px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0px
  code-xs:
    fontFamily: standardMono
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
rounded:
  none: 0px
  xs: 6px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 28px
  xxxl: 32px
  section: 40px
  band: 48px
borderWidths:
  thin: 1px
elevationStrategy: color-blocking
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#D4D4D4"
    surface: "#CECECE"
    surfaceRaised: "#C6C6C6"
    text: "#000000"
    textMuted: "#4A4A4A"
    border: "#E4E9F2"
    accent: "#17171C"
    accentFg: "#FFFFFF"
    focusRing: "#17171C"
    elevation: shadow
  dark:
    bg: "#0F0F10"
    surface: "#1D1D1E"
    surfaceRaised: "#29292A"
    text: "#F6F6F6"
    textMuted: "#9E9E9F"
    border: "#353536"
    accent: "#7E7E95"
    accentFg: "#0B0B0C"
    focusRing: "#616176"
    elevation: "border+surface"
gradients:
  - context: hero
    kind: linear
    value: "linear-gradient(to right, rgba(90, 120, 175, 0.06) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(rgba(90, 120, 175, 0.06) 1px, rgba(0, 0, 0, 0) 1px)"
components:
  button-primary:
    textColor: "{colors.ink}"
    border: "1px solid {colors.accent-4}"
    height: 54.25px
    padding: "16px 20px 16px 20px"
    fontSize: 16px
    fontFamily: plain
    fontWeight: 400
    lineHeight: 1.5
    backgroundColor: "{colors.primary}"
  button-filled:
    typography: "{typography.code-lg}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.accent-3}"
    height: 40px
    padding: "0px 20px 0px 20px"
    backgroundColor: "{colors.on-primary}"
  button-filled-2:
    typography: "{typography.code-lg}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    height: 40px
    padding: "0px 20px 0px 20px"
    backgroundColor: "{colors.on-primary}"
  button-secondary:
    typography: "{typography.code-lg}"
    textColor: "{colors.on-primary}"
    height: 40px
    padding: "0px 20px 0px 20px"
    backgroundColor: "{colors.ink}"
  navigation:
    textColor: "{colors.ink}"
    padding: "16px 49.95px 16px 49.95px"
    fontSize: 16px
    fontFamily: plain
    fontWeight: 400
    lineHeight: 1.5
    backgroundColor: "{colors.on-primary}"
  footer:
    typography: "{typography.code-xs}"
    textColor: "{colors.ink}"
    border: "1px solid rgba(0, 200, 81, 0.5)"
    padding: "16px 40px 16px 40px"
  link:
    typography: "{typography.body-xs-2}"
    textColor: "{colors.ink}"
    padding: "0px 6px 0px 10px"
    rounded: "10px 10px 0px 0px"
  link-sm:
    textColor: "{colors.ink}"
    fontSize: 16px
    fontFamily: plain
    fontWeight: 400
    lineHeight: 1.5
states:
  other-hover:
    target: other
    state: hover
    opacity: 1
  other-disabled:
    target: other
    state: disabled
    opacity: 0.35
  other-focus:
    target: other
    state: focus
    opacity: 1
breakpoints:
  - width: 375
    containerWidth: 351
    gridColumns: 2
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 36
    bodyPx: 16
    sectionPaddingX: 24
  - width: 768
    containerWidth: 720
    gridColumns: 3
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 50
    bodyPx: 16
    sectionPaddingX: 50
  - width: 1024
    containerWidth: 944
    gridColumns: 3
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 50
    bodyPx: 16
    sectionPaddingX: 50
  - width: 1280
    containerWidth: 1200
    gridColumns: 3
    navLinksVisible: 7
    menuToggleVisible: true
    headingPx: 50
    bodyPx: 16
    sectionPaddingX: 50
  - width: 1440
    containerWidth: 1360
    gridColumns: 3
    navLinksVisible: 7
    menuToggleVisible: true
    headingPx: 58
    bodyPx: 16
    sectionPaddingX: 50
coverage:
  statesFound: 32
  gradientsFound: 1
  rolesUnassigned: 7
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: false
  semanticRampDeclared: false
---

# Design System Inspired by Stagehand

## 1. Visual Theme & Atmosphere

Stagehand's design system embodies a minimalist, developer-first aesthetic with sharp geometric edges and a monochromatic primary palette punctuated by strategic accent colors. The visual language prioritizes clarity and speed, with emphasis on typography and whitespace over decorative effects. The brand uses near-black (`{colors.primary}` — `#17171C`) as the dominant UI color alongside a clean white canvas, creating high contrast for readability. Accent colors—particularly the vibrant green (`{colors.accent-2}` — `#00C851`) used in data visualizations and interactive states—provide visual feedback and guide user attention through key interactions. The overall mood is professional, direct, and optimized for technical audiences who value efficiency and precision.

**Key Characteristics**

- Sharp, unrounded corners (0px radius on primary interactive elements)
- High-contrast monochromatic foundation with calculated accent pops
- Negative letter-spacing on display sizes for compact, modern typography
- Minimal use of shadows; depth created through color blocking and borders
- Typography-led hierarchy with no decorative graphics on hero sections
- Responsive grid that maintains consistency across all breakpoints
- Interaction feedback via opacity, color shifts, and subtle border changes

## 2. Color Palette & Roles

### Primary
- **Primary / Brand** (`{colors.primary}` — `#17171C`): Primary CTA fills, brand accent in logo, active and hover states on key interactive elements. Used as the primary button background and heading colour.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): Label and text colour on primary brand surfaces, ensuring contrast against dark backgrounds.

### Accent Colors
- **Accent / Hero Band** (`{colors.accent}` — `#FF5F57`): Secondary accent for highlighted sections and brand accents, used sparingly for emphasis.
- **Decorative Accent — Green** (`{colors.accent-2}` — `#00C851`): Performance visualization bars, success indicators in charts, and interactive state highlights. No formal semantic role; used for visual distinction in data-driven components.
- **Decorative Accent — Purple** (`{colors.accent-3}` — `#9BAFD3`): Comparative visualization bars and secondary chart elements. Paired with green for performance comparisons.
- **Decorative Accent — Dark** (`{colors.accent-4}` — `#2A2A33`): Background texture and subtle depth elements.
- **Decorative Accent — Gold** (`{colors.accent-5}` — `#FEBC2E`): Highlighted or featured UI moments, non-semantic use.
- **Decorative Accent — Teal** (`{colors.accent-1}` — `#007D33`): Optional accent for specific design moments, no declared role.

### Interactive
- **Link** (`{colors.link}` — `#506B9C`): Inline hyperlink text colour, providing distinct visual cue for navigable elements.

### Neutral Scale
- **Canvas** (`{colors.canvas}` — `#D4D4D4`): Default page background, neutral light surface.
- **Ink** (`{colors.ink}` — `#000000`): Primary text colour for headings and body copy, maximum contrast layer.
- **Neutral Medium** (`{colors.neutral-1}` — `#444746`): Secondary text, dimmed labels, and supporting copy.
- **Neutral Muted** (`{colors.neutral-2}` — `#7F7F8D`): Tertiary text, disabled states, and very low-emphasis copy.

### Surface & Borders
- **Hairline** (`{colors.hairline}` — `#E4E9F2`): 1px borders, dividers, and subtle frame lines throughout the interface.

## 3. Typography Rules

### Font Family
- **Primary**: Planar (display and heading sizes)
- **Body & UI**: Plain (standard text, body copy, links)
- **Monospace**: StandardMono, GeistMono (code blocks, technical labels, inline code)
- **Fallback Stack**: Planar → system-ui; Plain → -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; StandardMono → "Courier New", monospace

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display Large | Planar | 58px | 400 | 1.06 | -1.74px | Hero headline, maximum emphasis |
| Display Medium | Planar | 42px | 400 | 1.1 | -0.84px | Section headlines, strong visual hierarchy |
| Heading Large | Planar | 38px | 400 | 1 | -0.76px | Major section titles |
| Heading Medium | Planar | 28px | 400 | 1.5 | -0.56px | Secondary section headings |
| Heading Small | Planar | 17px | 400 | 1.5 | -0.17px | Tertiary headings, subsections |
| Heading XS | Planar | 16.5px | 400 | 1.5 | 0px | Small headings, labels |
| Body Large | Plain | 16px | 400 | 1.65 | 0px | Primary body text, longer-form content |
| Body XL | Plain | 16.5px | 400 | 1.6 | 0px | Enhanced body copy, prominent passages |
| Body Medium | Plain | 15px | 400 | 1.6 | 0px | Standard body copy |
| Body Small | Plain | 14px | 400 | 1.5 | 0px | Secondary body text, captions |
| Body XS | Plain | 13.5px | 400 | 1.6 | 0px | Small labels, helper text |
| Body XS (2) | Plain | 12px | 400 | 1.33 | 0px | Inline labels, micro copy |

### Principles
- Negative letter-spacing (up to -1.74px) applied to all display and heading sizes; tightens headlines for a modern, compact feel.
- Body copy uses 0px letter-spacing for legibility.
- Line-height decreases from display to heading sizes (1.06 to 1), then increases again in body copy (1.33 to 1.65) for readability.
- Display and heading sizes use 400 weight exclusively; no bold variants observed.
- Planar dominates visual hierarchy; Plain provides neutral, readable body foundation; monospace reserved for technical content only.

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background**: `{colors.primary}` (`#17171C`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Font**: Plain, 16px, weight 400, line-height 24px
- **Padding**: `{spacing.md}` `{spacing.lg}` (`16px 20px`)
- **Height**: 54.25px
- **Border**: `{colors.accent-4}` (`#2A2A33`), `1px` solid
- **Border Radius**: `{rounded.none}` (0px)
- **Box Shadow**: None
- **Width**: Full-width responsive (464px observed at 1440px)
- **Hover State**: Background opacity increases to 0.85–0.9; border may shift to `{colors.link}` (`#506B9C`)
- **Focus State**: Outline `2px solid {colors.accent-2}` (`#00C851`)
- **Disabled State**: Opacity `0.35`

#### Secondary Button (Filled Dark)
- **Background**: `{colors.ink}` (`#000000`)
- **Text Color**: `{colors.on-primary}` (`#FFFFFF`)
- **Font**: StandardMono, 12.5px, weight 400, line-height 18.75px
- **Padding**: 0px `{spacing.lg}` (0px 20px)
- **Height**: 40px
- **Border**: None (0px)
- **Border Radius**: `{rounded.none}` (0px)
- **Box Shadow**: None
- **Hover State**: Opacity to 0.7; background may shift to `{colors.accent-4}` (`#2A2A33`)
- **Disabled State**: Opacity `0.35` or `0.4`

#### Filled Button (Light Variant)
- **Background**: `{colors.on-primary}` (`#FFFFFF`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Font**: StandardMono, 12.5px, weight 400, line-height 18.75px
- **Padding**: 0px `{spacing.lg}` (0px 20px)
- **Height**: 40px
- **Border**: `{colors.hairline}` (`#E4E9F2`), `1px` solid (or `{colors.accent-3}` — `#9BAFD3` on some variants)
- **Border Radius**: `{rounded.none}` (0px)
- **Box Shadow**: None
- **Hover State**: Background opacity `0.05–0.1`; border may become `{colors.accent-2}` (`#00C851`) with 0.4 opacity or 6% opacity
- **Disabled State**: Opacity `0.4`

### Cards & Containers

#### Card / Content Frame
- **Background**: `{colors.on-primary}` (`#FFFFFF`)
- **Border**: `{colors.hairline}` (`#E4E9F2`), `1px` solid
- **Border Radius**: `{rounded.none}` (0px)
- **Padding**: `{spacing.lg}` to `{spacing.section}` (`20px` to `40px`), context-dependent
- **Box Shadow**: None; depth via color blocking only
- **Hover State**: Background may shift to `rgba(0, 0, 0, 0.05)` or `{colors.accent-4}` (`#2A2A33`) on interactive cards

#### Hero Section
- **Background**: Linear gradient pattern: `linear-gradient(to right, rgba(90, 120, 175, 0.06) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(rgba(90, 120, 175, 0.06) 1px, rgba(0, 0, 0, 0) 1px)`
- **Base Color**: `{colors.on-primary}` (`#FFFFFF`)
- **Padding**: `{spacing.band}` vertical (`48px`); `{spacing.xxxl}` or `{spacing.section}` horizontal (`32px` or `40px`)
- **Typography**: Display sizes use `{colors.ink}` (`#000000`) for contrast

### Inputs & Forms

#### Text Input
- **Background**: `{colors.on-primary}` (`#FFFFFF`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Border**: `{colors.hairline}` (`#E4E9F2`), `1px` solid
- **Border Radius**: `{rounded.none}` (0px)
- **Padding**: `{spacing.md}` (`16px`)
- **Font**: Plain, 14–16px, weight 400
- **Hover State**: Border becomes `{colors.link}` (`#506B9C`) or opacity shifts; background may lighten to `rgba(0, 0, 0, 0.05)`
- **Focus State**: Border becomes `{colors.accent-2}` (`#00C851`); outline `2px solid {colors.accent-2}`
- **Disabled State**: Opacity `0.35`; background `rgba(0, 0, 0, 0.05)`

### Navigation

#### Header Navigation
- **Background**: `{colors.on-primary}` (`#FFFFFF`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Font**: Plain, 16px, weight 400, line-height 24px
- **Height**: 103px
- **Padding**: `{spacing.md}` vertical, `{spacing.section}` horizontal (`16px 40px`)
- **Border**: None (0px)
- **Border Radius**: `{rounded.none}` (0px)
- **Box Shadow**: None
- **Active Link State**: Text color remains `{colors.ink}`; underline appears in `{colors.primary}` (`#17171C`)
- **Hover State**: Text color shifts to `{colors.link}` (`#506B9C`); background may become `rgba(0, 0, 0, 0.05)`

#### Navigation Link (Small)
- **Background**: Transparent (`rgba(0, 0, 0, 0)`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Font**: Plain, 16px, weight 400, line-height 24px
- **Padding**: 0px `{spacing.sm}` (0px 6px)
- **Height**: 27–34px, context-dependent
- **Border**: None (0px)
- **Border Radius**: `{rounded.xs}` (6px, partial—10px 10px 0px 0px on default variant)
- **Hover State**: Background `rgba(0, 0, 0, 0.05)` to `0.1`; text color may shift to `{colors.link}`
- **Focus State**: Background `rgba(255, 255, 255, 0.05)` or `{colors.accent-4}` (`#2A2A33`)
- **Active State**: Underline in `{colors.primary}` or text bold

### Footer

#### Footer Container
- **Background**: Transparent (`rgba(0, 0, 0, 0)`)
- **Text Color**: `{colors.ink}` (`#000000`)
- **Font**: StandardMono, 10px, weight 400, line-height 15px
- **Height**: 48px
- **Padding**: `{spacing.md}` `{spacing.section}` (`16px 40px`)
- **Border**: Top `{colors.accent-2}` (`#00C851`) with 0.5 opacity, `1px` solid
- **Border Radius**: `{rounded.none}` (0px)
- **Box Shadow**: None

### Links

#### Inline Link
- **Background**: Transparent
- **Text Color**: `{colors.link}` (`#506B9C`)
- **Font**: Plain, 12–16px, weight 400
- **Padding**: 0px
- **Border**: None (0px)
- **Border Radius**: `{rounded.none}` (0px)
- **Hover State**: Text color shifts to `{colors.accent}` (`#FF5F57`) or `{colors.accent-2}` (`#00C851`); opacity to 0.85–0.9
- **Focus State**: Outline `2px solid {colors.accent-2}` (`#00C851`)
- **Underline**: Applied on hover

## 5. Layout Principles

### Spacing System

Base unit: `{spacing.xs}` = 8px. All spacing derives from this modular scale:

- **`{spacing.xxs}`** = 4px — Micro spacing between icon and text, internal padding on small buttons
- **`{spacing.xs}`** = 8px — Tight padding, small component gaps
- **`{spacing.sm}`** = 12px — Button and input internal padding
- **`{spacing.md}`** = 16px — Standard internal padding, component spacing, header height
- **`{spacing.lg}`** = 20px — Increased internal padding on larger buttons, section dividers
- **`{spacing.xl}`** = 24px — Card padding, medium spacing between sections
- **`{spacing.xxl}`** = 28px — Large section spacing
- **`{spacing.xxxl}`** = 32px — Extra-large gaps, hero horizontal padding
- **`{spacing.section}`** = 40px — Standard horizontal padding on full-width containers
- **`{spacing.band}`** = 48px — Hero section vertical padding, major visual breaks

### Grid & Container

- **Max Content Width**: 1360px (at 1440px viewport); 1200px (at 1280px); 944px (at 1024px)
- **Column Strategy**: 3-column grid observed at tablet and above; responsive to viewport
- **Horizontal Padding**: `{spacing.section}` (40px) maintained on desktop; reduces to `{spacing.xxxl}` (32px) on tablet; `{spacing.xl}` (24px) on mobile
- **Section Pattern**: Full-width bands with internal max-width container; padding applied to outer band, content centered within

### Whitespace Philosophy

Generous whitespace surrounds hero sections and key content blocks, creating visual breathing room. Padding increases with viewport size to maintain proportion and readability. Interactive elements are never crowded; minimum spacing of `{spacing.md}` (16px) between interactive targets. Vertical rhythm maintained through consistent section gaps (`{spacing.band}` — 48px).

### Border Radius Scale

- **`{rounded.none}`** = 0px — Buttons, cards, inputs, navigation; sharp geometric aesthetic across primary interactive elements
- **`{rounded.xs}`** = 6px — Partial rounding on some navigation tabs (e.g., 10px 10px 0px 0px observed)
- **`{rounded.full}`** = 9999px — Pills and circular elements (not commonly observed on primary components)

### Border Widths

- **Thin** = `1px` — Standard borders on buttons, cards, inputs, and dividers; used for `{colors.hairline}` and decorative frames

## 6. Depth & Elevation

The Stagehand system uses **color blocking** as its primary depth mechanism. No multi-layered box-shadow values are employed. Depth is conveyed through:

- **Surface color shifts**: White (`{colors.on-primary}`) for elevated surfaces; canvas backgrounds for recessed areas; `{colors.accent-4}` (`#2A2A33`) for subtle depth
- **Border treatment**: Hairline borders (`{colors.hairline}` — `#E4E9F2`, 1px) define edges and separate layers
- **Opacity changes**: Hover states reduce opacity or shift background to create perceived lift

No traditional elevation table applies; the system is intentionally flat with strategic color-based contrast.

### Opacity Levels

- **90% (0.90)** — Subtle dimming on hover; near-full visibility
- **85% (0.85)** — Light hover feedback on dark elements
- **35% (0.35)** — Disabled state, indicating unavailability
- **6% (0.06)** — Micro-opacity hover, barely perceptible background shift (`rgba(0, 0, 0, 0.06)` or `rgba(0, 200, 81, 0.06)`)
- **5% (0.05)** — Minimal hover background shift on light surfaces
- **0% (0)** — Full transparency for overlay or ghost states

### Z-index / Layering

- **Base** = 0 — Standard document flow
- **Dropdown / Overlay Tier 1** = 10 — Dropdowns, tooltips
- **Dropdown / Overlay Tier 2** = 20 — Elevated dropdowns, popovers
- **Dropdown / Overlay Tier 3** = 30 — Modal backdrops, high-priority overlays
- **Dropdown / Overlay Tier 4** = 40 — Topmost modal dialogs, notifications

## 7. Do's and Don'ts

### Do

- Use `{colors.primary}` (`#17171C`) for primary CTAs and key brand moments; it commands attention and drives user action.
- Apply negative letter-spacing on all display and heading sizes to maintain the brand's modern, compact aesthetic.
- Maintain 0px border radius on buttons, cards, and inputs; sharp corners are a defining trait.
- Use the monospace fonts (StandardMono, GeistMono) exclusively for code, technical labels, and inline syntax.
- Pair `{colors.accent-2}` (`#00C851`) with `{colors.accent-3}` (`#9BAFD3`) in data visualizations for clear, accessible comparisons.
- Use `{colors.hairline}` (`#E4E9F2`) for all 1px borders; maintain visual consistency.
- Organize content into `{spacing.band}` (48px) vertical sections with generous horizontal padding.
- Apply hover states by adjusting opacity, border color, or background color; never add shadows.
- Reserve `{colors.link}` (`#506B9C`) for inline hyperlinks; maintain distinct visual cue for navigable text.

### Don't

- Do not use rounded corners (`{rounded.xs}` or beyond) on primary buttons or input fields; the system is sharp by design.
- Do not invent new colors outside the defined palette; stick to the 14 measured values.
- Do not apply box-shadows or drop-shadow effects; the system uses color blocking and opacity only.
- Do not use the secondary fonts (Plain, monospace) for headings; reserve Planar for display and heading hierarchy.
- Do not apply letter-spacing to body copy; 0px letter-spacing maintains readability and is intentional.
- Do not exceed `{spacing.band}` (48px) as standard vertical section padding without justification.
- Do not mix `{colors.primary}` with light surfaces without sufficient contrast; test WCAG AA compliance on every combination.
- Do not use decorative accent colors (`{colors.accent-1}`, `-4`, `-5`) as primary interactive states; reserve them for secondary visual interest only.
- Do not create custom interaction states (e.g., active, focus, disabled) without extracting them from the site's CSS; invent no states.

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Viewport Width | Max Content Width | Typography Scale | Padding X | Notable Changes |
|---|---|---|---|---|---|
| Mobile | 375px | 351px | Display 36px, Body 16px | 24px | 2-column grid; nav toggle visible; compact horizontal spacing |
| Tablet | 768px | 720px | Display 50px, Body 16px | 50px | 3-column grid; full nav links visible; increased horizontal breathing room |
| Laptop | 1024px | 944px | Display 50px, Body 16px | 50px | 3-column grid maintained; standard nav spacing |
| Desktop | 1280px | 1200px | Display 50px, Body 16px | 50px | 7 nav links visible; full header height |
| Large Desktop | 1440px | 1360px | Display 58px, Body 16px | 50px | Display typography scales to 58px; maximum content width |

### Touch Targets

- **Minimum height**: 40px for buttons, inputs, and navigation links
- **Minimum width**: 40px for icon buttons (not explicitly measured; use 40px as safe minimum)
- **Padding around interactive elements**: `{spacing.sm}` to `{spacing.md}` (12px–16px) minimum to prevent accidental activation
- **Tap area expansion**: Hover states should not reduce clickable area; maintain full button dimensions

### Collapsing Strategy

- **Mobile (375px)**: Hero display text shrinks to 36px; horizontal padding reduces to `{spacing.xl}` (24px); 2-column grid; navigation links collapse into toggle menu
- **Tablet (768px) and above**: Display text increases to 50px; horizontal padding expands to `{spacing.section}` (40px); 3-column grid introduced; full navigation visible
- **Large Desktop (1440px)**: Display text scales to full 58px; content max-width reaches 1360px; 7 navigation links visible; final scale tier

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Primary (`{colors.primary}` — `#17171C`)
- **Page Background**: Canvas (`{colors.canvas}` — `#D4D4D4`)
- **Heading Text**: Ink (`{colors.ink}` — `#000000`)
- **Body Text**: Ink (`{colors.ink}` — `#000000`) or Neutral Medium (`{colors.neutral-1}` — `#444746`)
- **Link Text**: Link (`{colors.link}` — `#506B9C`)
- **Card / Container Background**: On Primary (`{colors.on-primary}` — `#FFFFFF`)
- **Borders & Dividers**: Hairline (`{colors.hairline}` — `#E4E9F2`)
- **Accent / Visual Pop**: Accent (`{colors.accent}` — `#FF5F57`) or Decorative Green (`{colors.accent-2}` — `#00C851`)
- **Secondary Button**: Ink on Primary (`#000000` text on `#17171C` background)
- **Disabled State Opacity**: `0.35` to `0.4`
- **Hover Opacity**: `0.05` to `0.1` for light backgrounds; `0.7` to `0.9` for dark

### Iteration Guide

1. **All borders are 1px solid `{colors.hairline}` (`#E4E9F2`) unless specified otherwise** (e.g., footer border is `{colors.accent-2}` with 0.5 opacity).
2. **All interactive elements (buttons, inputs, cards) use 0px border-radius** (`{rounded.none}`); no rounded corners on primary UI.
3. **Display and heading text uses Planar font with negative letter-spacing** (up to -1.74px on display large); body uses Plain with 0px letter-spacing.
4. **Spacing is always a multiple of 4px** (base 8px scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48px).
5. **Hover states shift background opacity by 5–10% or change text/border color; never add shadows or blur effects.**
6. **Focus states apply a 2px solid outline in `{colors.accent-2}` (`#00C851`)** on keyboard navigation.
7. **Disabled elements reduce opacity to 0.35–0.4** and are non-interactive.
8. **Maximum content width is 1360px at 1440px viewport; padding is `{spacing.section}` (40px) on either side.**
9. **Hero sections and major visual breaks use `{spacing.band}` (48px) vertical padding** with full-width backgrounds.
10. **Data visualizations use `{colors.accent-2}` (green) and `{colors.accent-3}` (purple) for contrast; never invent new chart colors.**

## 10. Known Gaps

- **Semantic Status Colors**: The site does not expose error, success, warning, or info states in its CSS. No semantic colour ramp was measured; do not invent one.
- **7 Decorative Accent Colors**: `{colors.accent-1}` (`#007D33`), `{colors.accent-4}` (`#2A2A33`), and `{colors.accent-5}` (`#FEBC2E`) have no measured semantic role. They appear in charts and visual accents only; their exact functional contexts were not fully extracted.
- **Interaction States on Mobile**: Hover states are well-defined on desktop; touch interactions (active, long-press) on mobile devices were not explicitly captured and may differ.
- **Dark Mode**: The extraction measured one theme (light background). No dark mode variant was detected or measured; if a dark theme exists, it was not analysed.
- **Animation & Transition Timing**: No keyframe animations, transition durations, or easing functions were extracted from the CSS. All timing details are absent.
- **Filter / Backdrop Effects**: Some hover states reference a generic `filter` variable that was not fully resolved (e.g., `var(--tw-blur,)`); exact blur, brightness, or contrast values are unknown.
- **Accessibility States (aria-disabled, aria-expanded)**: Only visual CSS states were captured; ARIA-driven interactions and their styling were not measured.
- **Authenticated / Gated Content**: Only the public home page was analysed. Surfaces behind authentication, account pages, or dashboards were not visited.
- **Print Styles**: No print-specific CSS rules were extracted.
- **Custom Shadow Definitions**: The extraction found `boxShadow: "none"` on all measured components; if subtle shadows exist on unmeasured elements (e.g., modals, tooltips), they were not captured.
- **Breakpoint Behavior Below 375px**: Responsive behaviour on devices narrower than 375px was not measured.