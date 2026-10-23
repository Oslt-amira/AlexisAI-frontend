const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const out = __dirname;
const css = fs.readFileSync(path.join(root, 'components/workspace/design-system.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
function tokens(selector) {
  const block = blocks.find(match => match[1].trim() === selector);
  if (!block) throw new Error('Missing source selector: ' + selector);
  return Object.fromEntries([...block[2].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
}
const base = tokens('.alexis-app');
const dark = tokens(':root[data-theme="dark"] .alexis-app');
const accents = ['green', 'purple', 'chrome', 'amber'];
const names = ['Sage', 'Iris', 'Chrome', 'Amber'];
const themes = {};
accents.forEach((accent, index) => {
  const lightAccent = accent === 'green' ? {} : tokens(`:root[data-accent="${accent}"] .alexis-app`);
  const lightSurface = accent === 'green' ? {} : tokens(`:root:not([data-theme="dark"])[data-accent="${accent}"] .alexis-app`);
  const darkAccent = accent === 'green' ? {} : tokens(`:root[data-theme="dark"][data-accent="${accent}"] .alexis-app`);
  themes[names[index]] = { light: { ...base, ...lightAccent, ...lightSurface }, dark: { ...base, ...dark, ...darkAccent } };
});
const kit = {
  description: 'Alexis identity reference, extracted from the current product. Color values retain their source CSS token names. Spacing recommendations are documented separately.',
  typeface: { family: 'Geist Sans', fallback: 'Arial, sans-serif', source: 'geist/font/sans', packageVersion: JSON.parse(fs.readFileSync(path.join(root, 'node_modules/geist/package.json'), 'utf8')).version, weights: { regular: 400, medium: 500, semibold: 600 }, license: 'SIL Open Font License 1.1' },
  themes,
  motion: { easing: base.ease, uiTransitionMs: 160, cardFloatSeconds: [9, 10, 11, 12, 13], revealMs: 750, focusBreathingSeconds: 14, focusGlowWidth: '80vw', focusGlowHeight: '80vw', focusGlowBottom: '-40vw', focusGlowOpacity: [0.22, 0.34], focusGlowPrimaryAlpha: 0.12 },
  sourceFiles: ['app/layout.tsx', 'components/workspace/design-system.css', 'components/landing/landing-polish.css', 'components/landing/landing-refinement.css', 'app/signIn/sign-in.css', 'components/workspace/focus-attachments.css', 'components/workspace/voice-inspiration.css'],
};
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const [source, target] of [['logo.svg', 'logo.svg'], ['logo bot.svg', 'logo-bot.svg'], ['favicon.svg', 'favicon.svg']]) {
  fs.copyFileSync(path.join(root, 'public/brand', source), path.join(out, 'assets', target));
}
for (const name of ['Geist-Variable.ttf', 'Geist-Variable.woff2']) {
  fs.copyFileSync(path.join(root, 'node_modules/geist/dist/fonts/geist-sans', name), path.join(out, 'fonts', name));
}
fs.copyFileSync(path.join(root, 'node_modules/geist/LICENSE.TXT'), path.join(out, 'fonts/LICENSE.TXT'));
const compiled = ts.transpileModule(fs.readFileSync(path.join(root, 'components/workspace/familiar-art.tsx'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject, require });
for (const kind of ['mushroom', 'cat', 'alien']) {
  const html = renderToStaticMarkup(React.createElement(exportsObject.default, { kind }));
  const svg = html.match(/<svg[\s\S]*<\/svg>/)[0].replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" ');
  fs.writeFileSync(path.join(out, 'assets', `${kind === 'alien' ? 'spirit' : kind}.svg`), svg);
}
fs.writeFileSync(path.join(out, 'alexis-tokens.json'), JSON.stringify(kit, null, 2) + '\n');
const colorRows = ['Palette,Mode,Token,Hex,R,G,B,Alpha'];
for (const [palette, modes] of Object.entries(themes)) for (const [mode, values] of Object.entries(modes)) {
  for (const [token, hex] of Object.entries(values)) if (/^#[\da-f]{6}([\da-f]{2})?$/i.test(hex)) {
    const channels = hex.slice(1, 7).match(/../g).map(value => parseInt(value, 16));
    const alpha = hex.length === 9 ? Number((parseInt(hex.slice(7), 16) / 255).toFixed(4)) : 1;
    colorRows.push([palette, mode, token, hex, ...channels, alpha].join(','));
  }
}
fs.writeFileSync(path.join(out, 'palette-reference.csv'), colorRows.join('\n') + '\n');

function row(colors) { return Object.entries(colors).map(([name, key]) => `| ${name} | ${themes.Sage.light[key]} | ${themes.Sage.dark[key]} |`).join('\n'); }
function contrast(a, b) {
  const luminance = hex => {
    const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((values[0] + .05) / (values[1] + .05)).toFixed(2);
}
const accentRows = Object.entries(themes).map(([name, theme]) => `| ${name} | ${theme.light.green} | ${theme.light['green-hover']} | ${theme.light['green-soft']} | ${theme.light['green-ink']} | ${theme.light['green-border']} |`).join('\n');
const darkRows = Object.entries(themes).map(([name, theme]) => `| ${name} | ${theme.dark.green} | ${theme.dark['green-hover']} | ${theme.dark['green-soft']} | ${theme.dark['green-ink']} | ${theme.dark['green-border']} |`).join('\n');
const contrastRows = Object.entries(themes).map(([name, theme]) => `| ${name} | ${contrast(theme.light.green, theme.light['brand-on'])}:1 | ${contrast(theme.dark.green, theme.dark['brand-on'])}:1 |`).join('\n');
fs.writeFileSync(path.join(out, 'README.md'), `# Alexis — visual identity reference

Built from the current landing page, sign-in screen and platform. This is a handoff reference, not a redesign. **Implemented** values come from the project. **Suggested brand rules** formalise the existing direction where the product has no official specification yet.

## 1. Identity and personality

**Design interpretation:** a calm, thoughtful study companion. Minimal editorial layouts, familiar workspace elements and a small amount of warmth and personality. Premium but approachable; expressive without looking juvenile.

Core characteristics: clear, spacious, quietly confident, tactile, alive. The personality comes from tilted cards, layered depth, soft materials and gentle companions—not from filling every surface with colour.

Existing copy: “A space for your notes, conversations, and everything you’re learning along the way.” Supporting line: “A little less scattered. A little more understood.” These are current product copy, not a separately approved slogan system.

## 2. Typography

**Implemented family:** Geist Sans, loaded globally through \`geist/font/sans\`. The product is not using a separate display or serif family. Arial and generic sans-serif are fallbacks. Geist Mono is not an established brand typeface in the current interface.

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

Install \`fonts/Geist-Variable.ttf\` in your design tool. Use \`fonts/Geist-Variable.woff2\` on the web. The bundled font licence is SIL OFL 1.1; keep \`fonts/LICENSE.TXT\` with redistributed font files.

## 3. Core neutral colours

The default theme is called **Sage**, but its main action colour is a deep forest green. Pale Sage is the supporting tint. White and neutral surfaces do most of the visual work.

| Role | Light / Sage | Dark / Sage |
|---|---|---|
${row({ 'Main text': 'ink', 'Body text': 'body-ink', 'Muted text': 'muted-ink', 'Canvas': 'canvas', 'Card surface': 'surface', 'Soft surface': 'surface-soft', 'Muted surface': 'surface-muted', 'Border': 'line', 'Hover border': 'line-hover', 'Hover fill': 'hover' })}

The platform’s underlying page background is #FAFAF8 in light Sage and #0F1311 in dark Sage, with a very faint radial wash. Landing surfaces are generally white; these background colours are not interchangeable with every card surface.

## 4. Accent palettes — exact implemented values

### Light mode

| Palette | Primary / actions | Hover | Soft fill | Secondary accent text | Accent border |
|---|---|---|---|---|---|
${accentRows}

### Dark mode

| Palette | Primary / actions | Hover | Soft fill | Secondary accent text | Accent border |
|---|---|---|---|---|---|
${darkRows}

Button foregrounds, light/dark respectively: Sage #F4F7EF / #EEF4EF; Iris #F7F3FB / #F3EDF8; Chrome #F4F6F7 / #F2F5F6; Amber #FBF7EF / #FBF4E8.

**Important implementation distinction:** palette-picker swatches are #1F5A3E, #6B4F8F, #59636B and #8A6A3F. Those are the small selection dots, not the primary action colours. In source CSS, \`--green\` means the selected primary accent even when the selected palette is Iris, Chrome or Amber.

Iris, Chrome and Amber also tint light-mode surfaces and borders. All exact theme tokens, gradients and surface variations are in \`alexis-tokens.json\`.

**Suggested brand rule:** use Sage for the main Alexis identity and one accent palette per composition. Keep Iris, Chrome and Amber as deliberate alternatives rather than making all four compete on one page. A useful starting composition is roughly 85% neutral surfaces, 10% ink and 5% accent; this is a suggested balance, not a measured product ratio.

### Supporting semantic colours

| Role | Light | Dark |
|---|---|---|
${row({ 'Error': 'danger', 'Error fill': 'danger-soft', 'Warning': 'warning', 'Warning fill': 'warning-soft', 'Information': 'info', 'Information fill': 'info-soft' })}

Use semantic colours for states, not as extra brand palettes.

### Contrast handoff

Calculated from the exact primary button background and button foreground tokens above. These are colour-pair checks, not a full accessibility audit.

| Palette | Light button contrast | Dark button contrast |
|---|---|---|
${contrastRows}

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

The original app source is \`public/brand/logo.svg\`; \`public/brand/logo bot.svg\` is the assistant mark. The default profile photo is a UI placeholder, not a brand asset, and is intentionally excluded.

## 6. Shapes, layout and depth

**Implemented:** a 12 px foundation radius; 12–18 px product cards; 15 px sign-in cards; 18 px feature cards; 24 px sign-in container; 26–36 px pricing groups; full-pill CTA buttons and floating navigation dock. Borders are usually 1 px and low contrast.

Landing sections currently use 96 px vertical padding on desktop, 78 px on intermediate layouts and 60 px on mobile. Card gaps commonly use 12–20 px. The product has component-specific spacing, not a perfectly enforced 4 px grid.

**Suggested reusable spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64 and 96 px. Retain generous margins and a clear reading order. Keep important actions obvious and avoid nesting a card inside every card.

Depth comes from white/soft surfaces, thin borders and diffuse shadows. An existing card shadow is \`0 14px 28px -18px #19291E35\`. Floating icon tiles use small shadows and slight rotation. Use a raised primary pill and a plain login link with a hover underline.

The sign-in composition is deliberately a little irregular: chat about −2°, flashcard +3°, focus card −3° and planner +1.5°, with staggered offsets and independent depth. Preserve that controlled messiness in illustrations; keep forms and reading content straight.

## 7. Icons, imagery and companions

**Implemented icon family:** Lucide React, generally 1.7 px strokes, with some navigation at 1.6 px. Typical UI icons are 14–20 px; decorative icon tiles are around 26–43 px containers. Use one consistent stroke family rather than mixing solid clip-art and outline icons.

Companions are original SVG artwork in \`components/workspace/familiar-art.tsx\`: a bronze mushroom, a resting ivory cat and a pearl/mineral spirit. They have natural shading, restrained expressions and slow individual movement. The exported SVGs here are static; product animation remains in the source CSS. Avoid emoji substitutes, exaggerated bouncing, hearts, oversized eyes or childlike facial features.

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

- \`brand-board.html\`: visual reference, with light/dark theme switching; open locally in a browser.
- \`alexis-tokens.json\`: exact current theme tokens and motion references; a plain JSON handoff, not a claimed Figma-plugin-specific import format.
- \`palette-reference.csv\`: all extracted colour values as hex and RGB, including alpha where present.
- \`assets/\`: supplied logo/bot/favicon and original static companion SVGs.
- \`fonts/\`: variable Geist TTF, WOFF2 and its licence.

Still to formalise if you build a full brand book: an outlined wordmark master, approved monochrome and reversed logo exports, social/slide/email templates, print proofing and colour profiles, photography direction, and any Arabic or other script typography. Do not treat automatic RGB-to-CMYK conversions as approved print colours. None of those missing standards has been invented as existing Alexis policy here.

Source of truth: the project files listed in \`alexis-tokens.json\`. This kit is a snapshot and should be regenerated after design-token changes.
`.replaceAll('\`', '`'));

const paletteCards = Object.entries(themes).map(([name, modes]) => `<article class="palette" data-name="${name}"><div class="swatches"><span style="background:${modes.light.green}"></span><span style="background:${modes.light['green-soft']}"></span><span style="background:${modes.light['green-ink']}"></span></div><h3>${name}</h3><code>${modes.light.green}</code><p>${name === 'Sage' ? 'Calm & grounded' : name === 'Iris' ? 'Focused & creative' : name === 'Chrome' ? 'Clean & quiet' : 'Warm & papery'}</p></article>`).join('');
const board = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alexis — visual identity</title><style>
@font-face{font-family:Geist;src:url(fonts/Geist-Variable.woff2) format('woff2');font-weight:100 900;font-display:swap}*{box-sizing:border-box}body{margin:0;background:#fafaf8;color:#202322;font:14px/1.6 Geist,Arial,sans-serif}main{max-width:1120px;margin:auto;padding:48px 40px 70px}.top{display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:600;letter-spacing:-.9px}.brand img{width:45px;height:45px}.tag{font-size:10px;letter-spacing:.1em;color:#6c726e;text-transform:uppercase}.intro{margin:58px 0 38px}.intro h1{font-size:54px;line-height:1.12;letter-spacing:-2px;font-weight:500;margin:0 0 18px}.intro h1 span{color:#6c726e}.intro p{color:#6c726e;max-width:640px}.row{display:grid;grid-template-columns:1.15fr 1fr;gap:18px}.panel{border:1px solid #e7e9e6;border-radius:22px;padding:28px;background:#fff}.label{font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:#6c726e;margin:0 0 18px}h2{font-size:30px;line-height:1.25;letter-spacing:-1px;font-weight:500;margin:0 0 17px}.abc{font-size:58px;letter-spacing:-2px;line-height:1.15;margin:0 0 20px}.weights{display:flex;gap:22px;color:#414642}.weights span:nth-child(2){font-weight:500}.weights span:nth-child(3){font-weight:600}.sub{font-size:12px;color:#6c726e}.theme-demo{--primary:#123c2b;--soft:#edf3ee;--on:#f4f7ef;--bg:#fff;--ink:#202322;--muted:#6c726e;background:var(--bg);color:var(--ink);transition:background .3s,color .3s}.theme-demo .label,.theme-demo .sub{color:var(--muted)}.controls{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0 24px}button,select{font:inherit;border:1px solid #e7e9e6;border-radius:100px;padding:8px 13px;background:transparent;color:inherit;cursor:pointer}.pill{display:inline-flex;gap:20px;align-items:center;padding:11px 18px;background:var(--primary);color:var(--on);border-radius:100px;font-weight:500;font-size:12px;box-shadow:0 5px 15px #00000012}.soft{display:inline-block;margin-left:9px;background:var(--soft);color:var(--ink);padding:8px 12px;border-radius:9px;font-size:11px}.palettes{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:18px 0}.palette{border:1px solid #e7e9e6;border-radius:18px;overflow:hidden;background:#fff;padding-bottom:17px}.swatches{display:grid;grid-template-columns:2fr 1fr 1fr;height:70px}.palette h3{font-size:15px;font-weight:500;margin:15px 17px 2px}.palette code{font:11px Geist,Arial,sans-serif;color:#6c726e;margin:0 17px}.palette p{font-size:11px;margin:6px 17px 0;color:#6c726e}.bottom{display:grid;grid-template-columns:1fr 1fr;gap:18px}.companions{display:flex;align-items:center;justify-content:space-around;padding:6px 0}.companions figure{margin:0;text-align:center}.companions img{height:95px;width:95px}.companions figcaption{font-size:11px;color:#6c726e}.mini-cards{display:flex;gap:15px;margin-top:26px}.mini{flex:1;border:1px solid #e7e9e6;border-radius:12px;padding:17px 13px;box-shadow:0 14px 28px -18px #19291e35;font-size:12px}.mini:first-child{transform:rotate(-3deg)}.mini:last-child{transform:rotate(3deg);margin-top:12px}.mini i{display:block;height:3px;background:#e7e9e6;border-radius:3px;margin-top:10px}.foot{color:#6c726e;font-size:11px;margin-top:30px}@media(max-width:700px){main{padding:28px 20px}.intro h1{font-size:38px}.row,.bottom{grid-template-columns:1fr}.palettes{grid-template-columns:repeat(2,1fr)}.abc{font-size:45px}}@media print{.controls{display:none}main{padding:0}.intro{margin-top:25px}.panel,.palette{break-inside:avoid}}
</style><main><header class="top"><div class="brand"><img src="assets/logo.svg" alt="Alexis emblem">Alexis</div><span class="tag">Visual identity reference</span></header><section class="intro"><h1>A little less scattered.<br><span>A little more understood.</span></h1><p>Clear typography. Quiet surfaces. One considered accent.<br>A study companion with room to breathe—and a little personality.</p></section><div class="row"><section class="panel"><p class="label">01 / Typography</p><h2>Geist Sans</h2><p class="abc">Aa Bb Cc 0123</p><div class="weights"><span>Regular 400</span><span>Medium 500</span><span>Semibold 600</span></div><p class="sub">Sentence case · tight display tracking · generous leading</p></section><section class="panel theme-demo" id="demo"><p class="label">02 / One workspace, your colours</p><h2>What are we<br>learning today?</h2><div class="controls"><select id="palette" aria-label="Accent palette">${names.map(name => `<option>${name}</option>`).join('')}</select><button id="mode" aria-pressed="false">Dark mode</button></div><span class="pill">Start learning <span>↗</span></span><span class="soft">One thing at a time.</span></section></div><section class="palettes">${paletteCards}</section><div class="bottom"><section class="panel"><p class="label">03 / Quiet company</p><div class="companions"><figure><img src="assets/mushroom.svg" alt="Mushroom companion"><figcaption>Mushroom</figcaption></figure><figure><img src="assets/cat.svg" alt="Ivory cat companion"><figcaption>Sleepy cat</figcaption></figure><figure><img src="assets/spirit.svg" alt="Pearl spirit companion"><figcaption>Glow spirit</figcaption></figure></div><p class="sub">Sculptural shading. Natural materials. Restrained expression.</p></section><section class="panel"><p class="label">04 / Controlled messiness</p><div class="mini-cards"><div class="mini">A thought, kept.<i></i><i style="width:70%"></i></div><div class="mini">Room to focus.<i></i><i style="width:60%"></i></div></div><p class="sub" style="margin-top:27px">Soft corners · thin borders · layered cards · gentle motion</p></section></div><p class="foot">Current product reference. Exact tokens, dark variants, spacing, motion, usage guidance and asset notes are in README.md and alexis-tokens.json.</p></main><script>const themes=${JSON.stringify(themes)};const demo=document.getElementById('demo'),palette=document.getElementById('palette'),mode=document.getElementById('mode');let dark=false;function update(){const t=themes[palette.value][dark?'dark':'light'];for(const [key,value] of Object.entries({primary:t.green,soft:t['green-soft'],on:t['brand-on'],bg:t.surface,ink:t.ink,muted:t['muted-ink']}))demo.style.setProperty('--'+key,value);mode.textContent=dark?'Light mode':'Dark mode';mode.setAttribute('aria-pressed',String(dark));}palette.onchange=update;mode.onclick=()=>{dark=!dark;update()};update();</script></html>`;
fs.writeFileSync(path.join(out, 'brand-board.html'), board);
console.log('Created identity guide, 8 theme token sets, visual board, 6 SVG assets and licensed Geist font files.');
