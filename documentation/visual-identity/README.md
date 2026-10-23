# Alexis — visual identity reference

Built from the current landing page, sign-in screen and platform. This is a handoff reference, not a redesign. **Implemented** values come from the project. **Suggested brand rules** formalise the existing direction where the product has no official specification yet.

## 1. Identity and personality

**Design interpretation:** a calm, thoughtful study companion. Minimal editorial layouts, familiar workspace elements and a small amount of warmth and personality. Premium but approachable; expressive without looking juvenile.

Core characteristics: clear, spacious, quietly confident, tactile, alive. The personality comes from tilted cards, layered depth, soft materials and gentle companions—not from filling every surface with colour.

Existing copy: “A space for your notes, conversations, and everything you’re learning along the way.” Supporting line: “A little less scattered. A little more understood.” These are current product copy, not a separately approved slogan system.

## 2. Typography

**Implemented family:** Geist Sans, loaded globally through `geist/font/sans`. The product is not using a separate display or serif family. Arial and generic sans-serif are fallbacks. Geist Mono is not an established brand typeface in the current interface.

| Weight | Use |
|---|---|
| 400 Regular | Body copy, muted supporting lines, quieter display text |
| 500 Medium | Landing headlines, cards, CTAs and labels |
| 600 Semibold | Platform headings and emphasis |

### Current representative scale

These are representative component values, not one globally enforced size scale.

| Role | Size | Weight / leading / tracking |
|---|---|---|
| Landing hero, desktop | 34–51 px, responsive | 500 emphasis; 1.3 leading; −1.9 px tracking |
| Landing hero, mobile | 26–32 px | 1.45 leading; −1 px tracking |
| Closing CTA heading | 36–54 px desktop; 35 px mobile | 500; 1.12 leading; −1.8 px tracking |
| Pricing heading | 31–43 px | 500; 1.2 leading; −1.5 px tracking |
| Platform welcome heading | 30–42 px | 600; 1.18 leading; −1.5 px tracking |
| Feature card heading | 20–21 px | 500; 1.25 leading; about −0.65 px tracking |
| Sign-in illustration tagline | 21–23 px | 400; 1.35 leading; −0.65 px tracking; muted ink |
| Main UI body | 14 px | 400; 1.5 leading |
| Marketing supporting text | 12–15 px | Usually 1.6–1.7 leading |
| Buttons / navigation | 11–14 px, component dependent | Usually 500 |
| Eyebrows / small labels | 9–10 px | 500; about +0.05 to +0.08 em tracking |

**Suggested brand rules:** use Geist everywhere in new identity work. Pair dark words with muted words in larger headlines. Use sentence case and short lines. Save uppercase for short category labels. For standalone marketing documents, start body copy at 16 px or an equivalent comfortable print size; the tiny labels in product miniatures are not a model for readable marketing body text.

Install `fonts/Geist-Variable.ttf` in your design tool. Use `fonts/Geist-Variable.woff2` on the web. The bundled font licence is SIL OFL 1.1; keep `fonts/LICENSE.TXT` with redistributed font files.

## 3. Core neutral colours

The default theme is called **Sage**, but its main action colour is a deep forest green. Pale Sage is the supporting tint. White and neutral surfaces do most of the visual work.

| Role | Light / Sage | Dark / Sage |
|---|---|---|
| Main text | #202322 | #e8ece9 |
| Body text | #414642 | #cbd3cd |
| Muted text | #6c726e | #97a29b |
| Canvas | #ffffff | #141917 |
| Card surface | #ffffff | #1a201c |
| Soft surface | #fcfcfa | #151b18 |
| Muted surface | #f6f7f5 | #1e2521 |
| Border | #e7e9e6 | #2b342e |
| Hover border | #cdd2cd | #3d4841 |
| Hover fill | #eeefec | #262f29 |

The platform’s underlying page background is #FAFAF8 in light Sage and #0F1311 in dark Sage, with a very faint radial wash. Landing surfaces are generally white; these background colours are not interchangeable with every card surface.

## 4. Accent palettes — exact implemented values

### Light mode

| Palette | Primary / actions | Hover | Soft fill | Secondary accent text | Accent border |
|---|---|---|---|---|---|
| Sage | #123c2b | #1e503a | #edf3ee | #4b6843 | #d6e1d7 |
| Iris | #6946a3 | #7953b5 | #f1ecf6 | #6b5583 | #ddd3e8 |
| Chrome | #2c3237 | #3a4249 | #eef0f2 | #525b63 | #d8dbde |
| Amber | #956326 | #a57230 | #f7f0e4 | #7d6139 | #e6d9c3 |

### Dark mode

| Palette | Primary / actions | Hover | Soft fill | Secondary accent text | Accent border |
|---|---|---|---|---|---|
| Sage | #2f6a4d | #397d5b | #1b2c23 | #9ac7aa | #3d5f4c |
| Iris | #8257ae | #9064bd | #241d2e | #c3b0d8 | #4a3a5c |
| Chrome | #48535b | #56636c | #1d2327 | #b6c1c8 | #3a444b |
| Amber | #986b30 | #a57538 | #2a2318 | #d9bc8b | #55452c |

Button foregrounds, light/dark respectively: Sage #F4F7EF / #EEF4EF; Iris #F7F3FB / #F3EDF8; Chrome #F4F6F7 / #F2F5F6; Amber #FBF7EF / #FBF4E8.

**Important implementation distinction:** palette-picker swatches are #1F5A3E, #6B4F8F, #59636B and #8A6A3F. Those are the small selection dots, not the primary action colours. In source CSS, `--green` means the selected primary accent even when the selected palette is Iris, Chrome or Amber.

Iris, Chrome and Amber also tint light-mode surfaces and borders. All exact theme tokens, gradients and surface variations are in `alexis-tokens.json`.

**Suggested brand rule:** use Sage for the main Alexis identity and one accent palette per composition. Keep Iris, Chrome and Amber as deliberate alternatives rather than making all four compete on one page. A useful starting composition is roughly 85% neutral surfaces, 10% ink and 5% accent; this is a suggested balance, not a measured product ratio.

### Supporting semantic colours

| Role | Light | Dark |
|---|---|---|
| Error | #9a4c36 | #de9a87 |
| Error fill | #fdecea | #2d1d19 |
| Warning | #96622a | #d5aa72 |
| Warning fill | #fdf6f1 | #2b2419 |
| Information | #3f6b7d | #8bbecd |
| Information fill | #eef5f7 | #17262b |

Use semantic colours for states, not as extra brand palettes.

### Contrast handoff

Calculated from the exact primary button background and button foreground tokens above. These are colour-pair checks, not a full accessibility audit.

| Palette | Light button contrast | Dark button contrast |
|---|---|---|
| Sage | 11.36:1 | 5.72:1 |
| Iris | 6.38:1 | 4.66:1 |
| Chrome | 11.97:1 | 7.20:1 |
| Amber | 4.80:1 | 4.29:1 |

Use 4.5:1 as the minimum for ordinary small text; 3:1 applies to sufficiently large text. Any pair below the relevant threshold needs adjustment before reuse. Soft fills and muted accent text should not automatically be used as button background/foreground pairs.

The current dark Amber button pair measures 4.29:1, so it needs more contrast for ordinary small text in future brand applications. The product colours have not been changed as part of this reference. Threshold source: [W3C, Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## 5. Logo and brand assets

| Asset in this kit | Role |
|---|---|
| assets/logo.svg | Primary supplied Alexis emblem: charcoal folded-document tile with ivory abstract mark |
| assets/logo-bot.svg | Isolated mark for assistant and voice contexts |
| assets/favicon.svg | Current favicon asset |
| assets/mushroom.svg | Static vector export of the original mushroom companion |
| assets/cat.svg | Static vector export of the original resting ivory cat |
| assets/spirit.svg | Static vector export of the original pearl spirit |

The emblem artwork uses near-black #131414 / #101010 / #121212, ivory #F8F6F3 and a folded-corner gradient from #292A2A to #65746D. Do not recolour the supplied emblem to match every palette. The web implementation adapts it to dark mode with grayscale and inversion. For external brand materials, prepare and check a dedicated light-on-dark export rather than assuming CSS will travel with the SVG.

The word “Alexis” is currently live Geist text beside the emblem in some contexts; there is no separate outlined wordmark master in this kit. The platform sidebar uses the emblem by itself.

**Suggested brand rules, not previously formalised:** preserve the SVG aspect ratio and its artwork; allow at least one quarter of the emblem width as clear space; use a 24 px or larger emblem for new standalone identity applications; do not stretch, add heavy outlines, or place it on busy imagery. Tiny product preview uses already exist below that size.

The original app source is `public/brand/logo.svg`; `public/brand/logo bot.svg` is the assistant mark. The default profile photo is a UI placeholder, not a brand asset, and is intentionally excluded.

## 6. Shapes, layout and depth

**Implemented:** a 12 px foundation radius; 12–18 px product cards; 15 px sign-in cards; 18 px feature cards; 24 px sign-in container; 26–36 px pricing groups; full-pill CTA buttons and floating navigation dock. Borders are usually 1 px and low contrast.

Landing sections currently use 96 px vertical padding on desktop, 78 px on intermediate layouts and 60 px on mobile. Card gaps commonly use 12–20 px. The product has component-specific spacing, not a perfectly enforced 4 px grid.

**Suggested reusable spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64 and 96 px. Retain generous margins and a clear reading order. Keep important actions obvious and avoid nesting a card inside every card.

Depth comes from white/soft surfaces, thin borders and diffuse shadows. An existing card shadow is `0 14px 28px -18px #19291E35`. Floating icon tiles use small shadows and slight rotation. Use a raised primary pill and a plain login link with a hover underline.

The sign-in composition is deliberately a little irregular: chat about −2°, flashcard +3°, focus card −3° and planner +1.5°, with staggered offsets and independent depth. Preserve that controlled messiness in illustrations; keep forms and reading content straight.

## 7. Icons, imagery and companions

**Implemented icon family:** Lucide React, generally 1.7 px strokes, with some navigation at 1.6 px. Typical UI icons are 14–20 px; decorative icon tiles are around 26–43 px containers. Use one consistent stroke family rather than mixing solid clip-art and outline icons.

Companions are original SVG artwork in `components/workspace/familiar-art.tsx`: a bronze mushroom, a resting ivory cat and a pearl/mineral spirit. They have natural shading, restrained expressions and slow individual movement. The exported SVGs here are static; product animation remains in the source CSS. Avoid emoji substitutes, exaggerated bouncing, hearts, oversized eyes or childlike facial features.

The main visual motifs are papers, notes, course excerpts, compact chat panels, planner rows, floating speech bubbles, tilted icon tiles and a macOS-style product preview. Product UI is the primary marketing imagery. No photography style has been formally established.

## 8. Motion and gradients

| Behaviour | Current reference |
|---|---|
| Standard easing | cubic-bezier(0.2, 0.7, 0.2, 1) |
| Small UI transitions | About 160–250 ms |
| Flashcard flip | About 520 ms |
| Scroll reveal | 750 ms; small upward entrance; staggered |
| Floating sign-in cards | Independent 10–13 s loops, slight tilt and pointer parallax |
| Companion speech bubble | Gentle 5 s drift, about 3 px |
| Focus background | 14 s opacity breath; 80vw diameter, bottom −40vw; half the circle below the screen |

The latest Focus glow mixes the primary accent at up to 12% alpha, then animates the overall element at 0.22–0.34 opacity: a maximum contribution of roughly 2.6–4.1% at its centre before other compositing. It is meant to be almost imperceptible, not a bright halo. Reduced-motion preferences disable movement.

Voice uses a soft blended field, not a hard glass orb or a heavy enclosing halo. Existing cool/warm pairs: Sage #9BBBF3 / #8EE6E8; Iris #B8A4EE / #B4D9F4; Chrome #AFBFD5 / #C1D9DC; Amber #E5C2A1 / #F2DAAB. These are atmospheric supporting colours, not replacement primary brand colours.

## 9. Writing and composition

**Design interpretation / suggested editorial rules:** write like a calm study partner. Short, useful sentences; sentence case; concrete actions. Let the product examples do some of the explaining. Keep the encouraging voice without exaggerated promises or productivity pressure.

Examples already used: “What are we learning today?”, “One thing at a time.” and “A little room to focus.” The supporting “A little less scattered…” line should stay secondary in scale and contrast.

Use the complete “notes, conversations…” line as a brand description when there is room. For a poster or social asset, choose one thought, one visual motif and one clear action.

## 10. Handoff contents and next brand decisions

- `brand-board.html`: visual reference, with light/dark theme switching; open locally in a browser.
- `alexis-tokens.json`: exact current theme tokens and motion references; a plain JSON handoff, not a claimed Figma-plugin-specific import format.
- `palette-reference.csv`: all extracted colour values as hex and RGB, including alpha where present.
- `assets/`: supplied logo/bot/favicon and original static companion SVGs.
- `fonts/`: variable Geist TTF, WOFF2 and its licence.

Still to formalise if you build a full brand book: an outlined wordmark master, approved monochrome and reversed logo exports, social/slide/email templates, print proofing and colour profiles, photography direction, and any Arabic or other script typography. Do not treat automatic RGB-to-CMYK conversions as approved print colours. None of those missing standards has been invented as existing Alexis policy here.

Source of truth: the project files listed in `alexis-tokens.json`. This kit is a snapshot and should be regenerated after design-token changes.
