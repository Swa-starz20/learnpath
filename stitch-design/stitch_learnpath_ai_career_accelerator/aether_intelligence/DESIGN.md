---
name: Aether Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ddb7ff'
  on-tertiary: '#490080'
  tertiary-container: '#b76dff'
  on-tertiary-container: '#400071'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 38px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 32px
  unit-xl: 64px
---

## Brand & Style

The design system is anchored in a futuristic, high-fidelity aesthetic that merges the precision of developer-centric tools with the fluid, organic nature of artificial intelligence. It targets a sophisticated audience that values both data density and aesthetic inspiration.

The visual direction is a refined **Glassmorphism**, characterized by depth, translucency, and light-refraction. It avoids the clutter of traditional "glossy" designs by utilizing a minimalist layout structure—high whitespace, thin hairlines, and strategic "glow" states that indicate AI-driven activity. The interface should feel like a sentient workspace: responsive, illuminating, and quietly powerful.

## Colors

The palette is built on a deep, obsidian foundation to allow luminous AI accents to pop. The default mode is **Dark**, utilizing "Deep Slate" and "Midnight Black" gradients to create a sense of infinite depth.

*   **Primary (Indigo):** Used for main actions and branding elements.
*   **Secondary (Cyan):** Reserved for "Success" states, AI insights, and active data streams.
*   **Tertiary (Purple):** Used for premium features, milestones, and soft background "blobs."
*   **Surface Logic:** Surfaces are not solid; they are layered. Use `rgba(255, 255, 255, 0.03)` for glass panels with a `20px` backdrop blur. 
*   **Gradients:** Use linear gradients (45-degree angle) from Indigo to Purple for primary CTAs, and Cyan to Electric Blue for technical data visualizations.

## Typography

This design system utilizes a three-tier font hierarchy to balance editorial impact with technical utility.

*   **Hanken Grotesk** is the voice of the brand, used for large, high-impact headings and hero sections. It should be tracked tightly in larger sizes.
*   **Inter** provides maximum legibility for the core product experience, dashboard widgets, and long-form educational content.
*   **JetBrains Mono** is used sparingly for labels, metadata, and AI-generated code snippets to reinforce the "intelligent/technical" nature of the platform.

All typography should favor high contrast (White on Slate) for primary information, while secondary metadata should use a reduced opacity (60-70%) rather than a lighter grey color to maintain the glass effect.

## Layout & Spacing

The layout follows a **Sidebar-First Dashboard Architecture**. The sidebar is a fixed, semi-transparent element that acts as the primary anchor.

*   **The Grid:** Use a 12-column fluid grid for the main content area. Gaps should be generous (24px) to allow components room to "breathe" and prevent the glass effects from overlapping awkwardly.
*   **Rhythm:** A strict 8px base unit drives all spacing. Dashboard cards should use 32px padding (`unit-lg`) to maintain a premium feel.
*   **Responsive Behavior:** 
    *   **Desktop:** Sidebar expanded (280px), main content centered in a 1440px max-width container.
    *   **Tablet:** Sidebar collapses to an icon-only rail (80px).
    *   **Mobile:** Sidebar moves to a bottom navigation bar or a full-screen overlay; margins reduce to 16px.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Backdrop Blurs** rather than traditional heavy shadows.

1.  **Level 0 (Base):** Deep Slate (#0f172a) with a very subtle radial gradient of Purple in the corner.
2.  **Level 1 (Cards/Panels):** `rgba(255, 255, 255, 0.03)` fill with a 1px solid border at `rgba(255, 255, 255, 0.1)`. Apply `backdrop-filter: blur(20px)`.
3.  **Level 2 (Modals/Popovers):** `rgba(255, 255, 255, 0.08)` fill with a slightly thicker border. 
4.  **Shadows:** When necessary, use "Ambient Glows" instead of black shadows. For example, an active Indigo button should have a soft `0px 10px 30px rgba(99, 102, 241, 0.3)` outer glow.

## Shapes

The shape language is **Rounded (0.5rem base)**. This strike a balance between the rigid "pro" look of sharp corners and the overly playful look of pill shapes.

*   **Standard Components:** Buttons, Input fields, and small UI elements use `rounded-md` (0.5rem).
*   **Containers:** Dashboard cards and large panels use `rounded-lg` (1rem).
*   **Feature Elements:** Hero images or AI "orb" visuals may use `rounded-xl` (1.5rem) or full circles to create focal points.
*   **Borders:** Always use 1px widths for borders. Use a "gradient border" technique for primary cards where the top-left corner is more opaque than the bottom-right.

## Components

### Buttons
*   **Primary:** A subtle gradient from Indigo to Purple. On hover, the brightness increases, and a soft glow appears.
*   **Secondary:** Glass-style. Transparent background with a white 1px border at 20% opacity. Text is pure white.
*   **Ghost:** No border or background. Cyan text. Used for "Cancel" or low-priority actions.

### Input Fields
*   Dark backgrounds (`rgba(0,0,0,0.2)`) with 1px borders. 
*   **Focus State:** The border transitions to Cyan, and a very faint Cyan inner glow appears.

### Cards & Glass Panels
*   Every card must have a `backdrop-filter: blur(20px)`.
*   Include a "Gloss" highlight: a linear gradient at 135 degrees, from `rgba(255,255,255,0.1)` to `transparent`.

### Data Visualizations
*   **Radar Charts:** Use Cyan strokes with a 10% Cyan fill. Points should glow.
*   **Heatmaps:** Use a monochromatic scale of Indigo (dark) to Electric Blue (bright).
*   **Lines:** Use "Neon" properties—thin 2px lines with a drop-shadow of the same color to simulate a glowing wire.

### AI Feedback Indicators
*   Whenever the AI is "thinking," use a pulsing, multi-color gradient border (Indigo-Purple-Cyan) around the active container. 
*   Use a small "Sparkle" icon (label-font) next to AI-generated text.