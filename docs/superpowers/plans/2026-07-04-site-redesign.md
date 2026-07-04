# Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from the neon/glassmorphism design to a calm, Anthropic-inspired editorial design with aggressively simplified content, per the approved spec at `docs/superpowers/specs/2026-07-04-site-redesign-design.md`.

**Architecture:** Hybrid approach — `style.css` is rewritten from scratch task-by-task, `index.html` sections are restructured/removed, `script.js` behaviors (i18n, theme, command palette, modals, updates renderer, focus traps) are preserved with targeted edits (shader palette, removed-section references, new i18n keys). Work happens on a `redesign` branch; `main` (GitHub Pages) stays stable until final merge.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts (Inter + Source Serif 4), Lucide icons (CDN), flagcdn (kept for language selector). No build step. Manual browser testing only (no test framework exists — each task ends with `node --check` + concrete browser verification instead of automated tests).

## Global Constraints

- No frameworks, bundlers, backend, or new CDN hosts. Static-hosting compatible only.
- Light theme: bg `#faf9f5`, text `#191919`, secondary text `#555550`, accent `#d97757`, accent-text `#b0552f`, surface `#ffffff`, border `#e8e6dd`.
- Dark theme: bg `#1f1e1b`, text `#f0efe9`, secondary text `#b5b3a7`, accent `#d97757`, accent-text `#e08d6d`, surface `#262521`, border `#3a3833`.
- Border radius: 8px on buttons and cards (`--radius: 8px`). No pill shapes.
- Fonts: headings `Source Serif 4` via `--font-display` (swappable), body `Inter`. `Outfit` removed.
- Navbar logo text is exactly `İsmail ÇELİK`.
- Every new/changed UI string gets en + tr + fr entries in the `translations` object in `script.js`. Every removed UI element gets its keys deleted from all three dictionaries.
- All external links keep `target="_blank" rel="noopener noreferrer"`.
- CSS classes/ids kebab-case; JS camelCase.
- After each task: run `node --check script.js` (must pass) and load `http://127.0.0.1:8000` (serve with `python3 -m http.server 8000 --bind 127.0.0.1`) — zero console errors.
- Commit messages: imperative mood, short subject, no period, end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Create branch and strip removed sections

**Files:**
- Modify: `index.html` (delete sections), `script.js` (delete related JS + i18n keys)

**Interfaces:**
- Produces: an `index.html` containing only: navbar, `#hero`, `#updates`, `#projects` (with only the `.cv-projects` block inside), `#certifications`, `#tech` (emptied, kept as placeholder for Task 7), `#about`, `#contact` footer, the two modal overlays, command palette overlay.
- Later tasks rely on section ids `hero`, `updates`, `projects`, `certifications`, `tech`, `about`, `contact` existing.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign
```

- [ ] **Step 2: Delete removed sections from `index.html`**

Delete these blocks entirely:
- `<section id="huggingface" class="huggingface-focus">…</section>` (the whole HF block, index.html:166-236)
- Inside `<section id="projects">`: the `.work-feature` div, the `.work-grid` div (6 work cards), and the `.work-roadmap` div. Keep the `.section-header` and the entire `.cv-projects` block.
- `<section id="tech" class="tech-stack">…</section>` GIF grid contents: replace the whole section with this placeholder (restyled in Task 7):

```html
<!-- SKILLS -->
<section id="tech" class="skills">
  <div class="container">
    <div class="section-header">
      <h2 data-i18n="skills-title">Skills</h2>
    </div>
    <div class="skills-grid" id="skills-grid"></div>
  </div>
</section>
```

(The `skills-grid` div stays empty in HTML; Task 7 fills it with static markup — it is NOT JS-rendered.)
- `<section id="tech-expanding" class="tech-stack expanding">…</section>` — delete entirely.
- `<section id="perspective" class="perspective">…</section>` — delete entirely (terminal card included).
- In `#hero`: delete `<div class="hero-shader-vignette">`, the `.hero-cv-downloads` stays, delete the `.expertise-tags` div, delete the `.hero-scroll-indicator` anchor, and delete the `.lightning-strike` div (keep the profile img for now; Task 3 restructures hero fully).
- In the footer: delete the `<img … class="footer-badge">` badge and the `<p class="footer-motto" …>` paragraph.

- [ ] **Step 3: Delete related JS from `script.js`**

- In `getCommandItems` (script.js:1504): delete the `command-go-huggingface` item (line 1505) and the `command-go-strategy` item (line 1511).
- Delete these keys from **all three** dictionaries (`en`, `tr`, `fr`) in `translations`:
  `hf-title, hf-lead, hf-models-title, hf-spaces-title, hf-datasets-title, hf-model1-title, hf-model2-title, hf-model3-title, hf-space1-title, hf-space2-title, hf-space3-title, hf-data1-title, hf-data2-title, hf-data3-title, work-lead, work-eyebrow, work-feature-title, work-feature-p, work-signal1-title, work-signal1-p, work-signal2-title, work-signal2-p, work-signal3-title, work-signal3-p, work-card1-title, work-card1-p, work-card2-title, work-card2-p, work-card3-title, work-card3-p, work-card4-title, work-card4-p, work-card5-title, work-card5-p, work-card6-title, work-card6-p, work-roadmap-eyebrow, work-roadmap-title, work-roadmap-1, work-roadmap-2, work-roadmap-3, hero-exp1, hero-exp2, hero-exp3, hero-exp4, hero-exp5, tech-title, tech-expanding-title, perspective-title, perspective-p1, perspective-p2, footer-motto, command-go-huggingface, command-go-strategy, about-card1-title, about-card1-p, about-card2-title, about-card2-p, about-card3-title, about-card3-p`
- Add the new key `skills-title` to all three dictionaries: en `"Skills"`, tr `"Beceriler"`, fr `"Compétences"`.
- Keep `work-title` key but change its value (used by the `#projects` section header): en `"Selected Work"`, tr `"Seçili İşler"`, fr `"Travaux sélectionnés"`. In `index.html` the `#projects` `.section-header` h2 keeps `data-i18n="work-title"`; delete the `section-lead` paragraph (`work-lead`). Also delete the `.cv-projects-header` h3 (`cv-projects-title` key: delete from dictionaries too) — the section header is enough.
- Update `about-title` values (remove emoji): en `"About"`, tr `"Hakkımda"`, fr `"À propos"`. Add `about-p1`/`about-p2` (used in Task 7, added now to keep dictionary edits in one place):
  - en `about-p1`: `"I work across mobile, full-stack and AI systems, with a strong focus on architecture, backend engineering and high-performance solutions."`
  - en `about-p2`: `"I enjoy building things from scratch — network servers, parsers, CLI tools — and I care about the low-level details: memory management, concurrency, I/O protocols and performance tuning."`
  - tr `about-p1`: `"Mobil, full-stack ve AI sistemleri üzerinde çalışıyorum; mimariye, backend mühendisliğine ve yüksek performanslı çözümlere güçlü bir odağım var."`
  - tr `about-p2`: `"Bir şeyleri sıfırdan inşa etmeyi seviyorum — ağ sunucuları, ayrıştırıcılar, CLI araçları — ve alt seviye ayrıntıları önemsiyorum: bellek yönetimi, eşzamanlılık, G/Ç protokolleri ve performans optimizasyonu."`
  - fr `about-p1`: `"Je travaille sur des systèmes mobiles, full-stack et IA, avec un fort accent sur l'architecture, l'ingénierie backend et les solutions haute performance."`
  - fr `about-p2`: `"J'aime construire à partir de zéro — serveurs réseau, parseurs, outils CLI — et je soigne les détails bas niveau : gestion de la mémoire, concurrence, protocoles E/S et optimisation des performances."`
- Update `footer-title` values: en `"Let's work together"`, tr `"Birlikte çalışalım"`, fr `"Travaillons ensemble"` (remove 📫).
- Remove emoji from remaining values: none left after the above (verify with grep below).

- [ ] **Step 4: Verify**

```bash
node --check script.js
grep -n "huggingface\|perspective\|work-card\|work-roadmap\|hero-exp\|tech-expanding\|footer-motto" index.html script.js
```
Expected: `node --check` silent; grep returns **no matches**.
Serve and load the page: sections gone, command palette (Ctrl+K) no longer lists Hugging Face or Strategy, no console errors, language switch still works in all three languages.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js
git commit -m "Remove HF, work-cards, roadmap, tech grids, perspective sections"
```

---

### Task 2: New design system — tokens, base, typography, navbar

**Files:**
- Modify: `index.html` (head fonts, logo text, i18n-with-icon → plain), `script.js` (setTheme meta colors, remove syncBrandIcons), `style.css` (full rewrite of tokens/base/navbar; old component CSS temporarily deleted — sections look unstyled until their tasks)

**Interfaces:**
- Produces CSS custom properties consumed by all later tasks: `--bg, --text, --text-secondary, --accent, --accent-text, --surface, --border, --radius, --font-display, --font-body, --transition`.
- Produces utility classes: `.container`, `.btn`, `.btn-primary`, `.btn-outline`, `.section-header`, `.card`.

- [ ] **Step 1: Swap fonts in `index.html` head**

Replace the Google Fonts link (index.html:19-22) with:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap"
  rel="stylesheet"
/>
```

Set `<meta name="theme-color" content="#1f1e1b" />`. Change the navbar logo anchor to `<a class="logo" href="#hero" aria-label="Go to top">İsmail ÇELİK</a>`.

Convert all remaining `data-i18n-with-icon` attributes in `index.html` to plain `data-i18n` and remove their inner `<i data-lucide>` / `<img>` icons AND `data-icon` attributes. Affected elements: hero eyebrow, hero CTA anchors, hero CV links, updates h2, follow-linkedin anchor (remove the skillicons `<img>`, keep text), updates-load-more button, certifications h2, certifications-open-modal button. (The `data-i18n-with-icon` handler stays in script.js — harmless.)

- [ ] **Step 2: Update theme JS in `script.js`**

In `setTheme` (script.js:1485-1493): replace the meta colors line with

```javascript
themeColorMeta.setAttribute('content', theme === 'dark' ? '#1f1e1b' : '#faf9f5');
```

Delete the `syncBrandIcons` function (script.js:1476-1483) and its call inside `setTheme`. (Task 4 removes the `brand-icon` images from HTML.)

- [ ] **Step 3: Rewrite `style.css` — replace the ENTIRE file with the new foundation**

The new file starts with exactly this (later tasks append their section blocks):

```css
:root {
  --font-display: "Source Serif 4", Georgia, serif;
  --font-body: "Inter", -apple-system, sans-serif;
  --radius: 8px;
  --accent: #d97757;
  --transition: all 0.25s ease;
}

body.theme-dark {
  --bg: #1f1e1b;
  --text: #f0efe9;
  --text-secondary: #b5b3a7;
  --accent-text: #e08d6d;
  --surface: #262521;
  --border: #3a3833;
}

body.theme-light {
  --bg: #faf9f5;
  --text: #191919;
  --text-secondary: #555550;
  --accent-text: #b0552f;
  --surface: #ffffff;
  --border: #e8e6dd;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  font-size: 1rem;
  transition: background 0.4s ease, color 0.4s ease;
  overflow-x: hidden;
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 500; line-height: 1.2; }
h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); }
a { color: var(--accent-text); }

.container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }

section { padding: 4.5rem 0; border-bottom: 1px solid var(--border); }
.section-header { margin-bottom: 2rem; }

.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
}
.btn-primary { background: var(--accent); color: #16150f; }
.btn-primary:hover { filter: brightness(1.06); }
.btn-outline { border: 1px solid var(--border); color: var(--text); }
.btn-outline:hover { border-color: var(--accent-text); }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0; left: 0; width: 100%;
  z-index: 1000;
  padding: 0.85rem 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.navbar .container { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.logo {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.15rem;
  color: var(--text);
  text-decoration: none;
}
.nav-content { display: flex; align-items: center; gap: 2rem; min-width: 0; }
.nav-links { display: flex; align-items: center; gap: 1.5rem; }
.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
  transition: var(--transition);
}
.nav-links a:hover { color: var(--text); }
.nav-utils { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
```

Then append (still Task 2) the **navbar controls** styles — language selector, theme button, command palette trigger, mobile menu button and the mobile breakpoint:

```css
.lang-selector { position: relative; }
.lang-btn, .theme-btn, .command-palette-btn, .mobile-menu-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: none; border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.45rem 0.7rem;
  color: var(--text); font-family: var(--font-body); font-size: 0.85rem;
  cursor: pointer; transition: var(--transition);
}
.lang-btn:hover, .theme-btn:hover, .command-palette-btn:hover, .mobile-menu-btn:hover {
  border-color: var(--accent-text);
}
.lang-btn svg, .theme-btn svg, .command-palette-btn svg { width: 16px; height: 16px; }
.command-palette-btn kbd {
  font-family: var(--font-body); font-size: 0.7rem;
  border: 1px solid var(--border); border-radius: 4px; padding: 0.1rem 0.3rem;
  color: var(--text-secondary);
}
.lang-dropdown {
  display: none; position: absolute; right: 0; top: calc(100% + 6px);
  flex-direction: column; min-width: 140px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden; z-index: 1001;
}
.lang-dropdown button {
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; padding: 0.55rem 0.8rem;
  color: var(--text); font-family: var(--font-body); font-size: 0.85rem; cursor: pointer;
  text-align: left;
}
.lang-dropdown button:hover { background: var(--bg); }
body.theme-dark .light-icon { display: none; }
body.theme-light .dark-icon { display: none; }
.mobile-menu-btn { display: none; }
.mobile-menu-btn .close-icon { display: none; }
.mobile-menu-btn.active .menu-icon { display: none; }
.mobile-menu-btn.active .close-icon { display: inline; }

@media (max-width: 900px) {
  .nav-links {
    display: none; position: fixed; inset: 57px 0 auto 0;
    flex-direction: column; align-items: flex-start; gap: 0;
    background: var(--bg); border-bottom: 1px solid var(--border);
    padding: 0.5rem 1.5rem 1rem;
  }
  .nav-links.active { display: flex; }
  .nav-links a { padding: 0.7rem 0; width: 100%; font-size: 1rem; }
  .mobile-menu-btn { display: inline-flex; }
  .command-palette-btn span, .command-palette-btn kbd { display: none; }
}
```

Everything else from the old `style.css` is deleted. **Expected intermediate state:** hero/updates/projects/certs/about/footer render as unstyled-but-readable document flow until Tasks 3–8 add their blocks. This is acceptable on the `redesign` branch.

- [ ] **Step 4: Verify**

```bash
node --check script.js
grep -c "Outfit" index.html style.css
```
Expected: 0 matches for Outfit. In browser: navbar looks calm (cream/antracite per theme), logo reads "İsmail ÇELİK", theme toggle works and `meta[theme-color]` flips between `#faf9f5`/`#1f1e1b`, mobile menu opens/closes with scroll lock, language dropdown works. Body sections unstyled — expected.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js style.css
git commit -m "Rewrite design tokens, base styles and navbar for editorial redesign"
```

---

### Task 3: Hero — markup, styles, shader palette

**Files:**
- Modify: `index.html` (hero section), `script.js` (fragment shader + theme hook), `style.css` (append hero block)

**Interfaces:**
- Consumes: `.btn .btn-primary .btn-outline` from Task 2.
- Produces: `setShaderTheme(theme)` — a `let`-declared function variable in the DOMContentLoaded scope, assigned inside `initHeroShader`, called from `setTheme`.

- [ ] **Step 1: Replace the hero markup in `index.html`**

```html
<section id="hero" class="hero">
  <canvas id="hero-shader" class="hero-shader-canvas" aria-hidden="true"></canvas>
  <div class="container hero-content">
    <img src="assets/ismail-2.png" alt="İsmail Çelik" class="hero-photo" />
    <p class="hero-eyebrow" data-i18n="hero-eyebrow">Product-Minded Engineering</p>
    <h1 class="hero-title" data-i18n="hero-title">
      Full-stack, mobile and AI systems built with practical architecture.
    </h1>
    <p class="hero-bio" data-i18n="hero-bio">
      I build reliable web and mobile experiences, connect AI into real
      workflows, and care about the systems work that keeps products fast,
      maintainable, and useful.
    </p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary" data-i18n="hero-primary-action">View Projects</a>
      <a href="#contact" class="btn btn-outline" data-i18n="hero-secondary-action">Start a Conversation</a>
    </div>
    <p class="hero-cv">
      <span data-i18n="hero-cv-label">Download CV</span>
      <a href="generated-cv/001-ismailcelik-en.pdf" download data-i18n="hero-cv-en">English</a>
      <a href="generated-cv/001-ismailcelik-tr.pdf" download data-i18n="hero-cv-tr">Turkish</a>
    </p>
  </div>
</section>
```

- [ ] **Step 2: i18n keys in `script.js`**

Delete keys `hero-hi`, `hero-name`, `hero-subtitle` from all three dictionaries. Add `hero-title` with the old `hero-subtitle` values: en `"Full-stack, mobile and AI systems built with practical architecture."`, tr `"Pratik mimariyle geliştirilen full-stack, mobil ve AI sistemleri."`, fr `"Systèmes full-stack, mobiles et IA avec une architecture pratique."`. Keep `hero-eyebrow`, `hero-bio`, `hero-primary-action`, `hero-secondary-action`, `hero-cv-*` unchanged.

- [ ] **Step 3: Rework the fragment shader in `script.js`**

At the top of the DOMContentLoaded callback (after line 27) add:

```javascript
let setShaderTheme = () => {};
```

In `initHeroShader`, replace `fragmentSource` (script.js:76-142) with:

```javascript
const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform float dark;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898,78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = rnd(i);
  float b = rnd(i + vec2(1,0));
  float c = rnd(i + vec2(0,1));
  float d = rnd(i + 1.);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2. * m;
    a *= .5;
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - .5 * R) / MN;
  float n = fbm(uv * 1.6 + vec2(T * .02, -T * .012));
  float m = smoothstep(.35, 1.45, n);
  vec3 baseL = vec3(.980, .976, .961);
  vec3 tintL = vec3(.925, .910, .873);
  vec3 warmL = vec3(.851, .467, .341);
  vec3 baseD = vec3(.122, .118, .106);
  vec3 tintD = vec3(.173, .165, .149);
  vec3 warmD = vec3(.322, .208, .157);
  vec3 base = mix(baseL, baseD, dark);
  vec3 tint = mix(tintL, tintD, dark);
  vec3 warm = mix(warmL, warmD, dark);
  vec3 col = mix(base, tint, m);
  col = mix(col, warm, .05 * smoothstep(.75, 1.3, n));
  O = vec4(col, 1);
}`;
```

Still inside `initHeroShader`:
- Add near the top of the function: `let darkValue = document.body.classList.contains('theme-dark') ? 1 : 0;`
- In `drawFrame`, after the existing `time` uniform line, add:
  `gl.uniform1f(gl.getUniformLocation(program, 'dark'), darkValue);`
- Replace `gl.clearColor(0, 0, 0, 1);` with `gl.clearColor(0.98, 0.976, 0.961, 1);` (harmless: shader fills every pixel).
- Before `restart();` at the end of `initHeroShader`, add:

```javascript
setShaderTheme = (theme) => {
    darkValue = theme === 'dark' ? 1 : 0;
    if (!frameId) drawFrame();
};
```

- In `setTheme` (Task 2 version), add `setShaderTheme(theme);` as the last line.
- Delete the pointer-tracking code that is unused dead weight: `mapPointer`, `onPointerDown`, `onPointerMove`, `onPointerUp`, the `pointers` map, the pointer state variables, the `canvas.addEventListener('pointer…')`/`hero?.addEventListener` lines and the four `void …;` lines (script.js:63-67, 179-187, 233-271 in the original numbering).

**Ordering note:** `setTheme(getPreferredTheme())` runs before `initHeroShader()` (script.js:1665-1666) — that is fine because `setShaderTheme` is a no-op until the shader initializes, and `initHeroShader` reads the body class itself via `darkValue`.

- [ ] **Step 4: Append hero styles to `style.css`**

```css
/* Hero */
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: center;
  padding: 7rem 0 4rem;
}
.hero-shader-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  z-index: -1;
}
.hero-shader-canvas.hero-shader-unavailable { display: none; }
.hero-content { max-width: 760px; }
.hero-photo {
  width: 72px; height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
}
.hero-eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-bottom: 1rem;
}
.hero-title {
  font-size: clamp(2rem, 5.5vw, 3.4rem);
  font-weight: 500;
  margin-bottom: 1.25rem;
}
.hero-bio { color: var(--text-secondary); max-width: 560px; margin-bottom: 2rem; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.75rem; }
.hero-cv { font-size: 0.9rem; color: var(--text-secondary); }
.hero-cv a { margin-left: 0.75rem; }
```

- [ ] **Step 5: Verify**

```bash
node --check script.js
```
Browser: hero shows small round photo, serif headline, calm animated texture behind text in both themes (switch theme — texture shifts warm-light/warm-dark immediately). With DevTools "Emulate prefers-reduced-motion: reduce" the texture is a static frame. Console clean.

- [ ] **Step 6: Commit**

```bash
git add index.html script.js style.css
git commit -m "Restyle hero with editorial layout and palette-matched shader"
```

---

### Task 4: Updates section — timeline rendering and styles

**Files:**
- Modify: `index.html` (updates section wrapper), `script.js` (renderUpdates), `style.css` (append updates + modal styles)

**Interfaces:**
- Consumes: `.card` from Task 2.
- Produces: `renderUpdates(lang)` same signature, now rendering `<article class="update-entry card">` rows into `#updates-container`.

- [ ] **Step 1: Simplify updates markup in `index.html`**

Replace the `.updates-carousel-wrapper` block with:

```html
<div id="updates-container" class="updates-list">
  <div class="loading-spinner">Loading updates...</div>
</div>
```

Keep `.updates-actions` + load-more button and the `#update-modal-overlay` block as-is, but change `<div class="modal-content glass">` to `<div class="modal-content card">`. In the section header, the `follow-linkedin` anchor becomes a plain text link (no `<img>`): `<a href="https://www.linkedin.com/in/ismailcelik" target="_blank" rel="noopener noreferrer" class="text-link" data-i18n="follow-linkedin">Follow on LinkedIn</a>`.

- [ ] **Step 2: Update `renderUpdates` in `script.js`**

Inside the `.then(posts => { … })` block:
- Add a shape guard right after `updatesContainer.innerHTML = '';`:

```javascript
const validPosts = Array.isArray(posts)
    ? posts.filter((post) => post && post.date && post.content)
    : [];
```

Use `validPosts` everywhere `posts` was used below that line (`visiblePosts` slice and the load-more count checks).
- Add a date formatter above the forEach:

```javascript
const localeMap = { en: 'en-GB', tr: 'tr-TR', fr: 'fr-FR' };
const formatPostDate = (dateString) => new Intl.DateTimeFormat(
    localeMap[lang] || 'en-GB', { month: 'short', year: 'numeric' }
).format(new Date(dateString));
```

- Replace the card creation with:

```javascript
const card = document.createElement('article');
card.className = 'update-entry card';
card.innerHTML = `
    <time class="update-date" datetime="${post.date}">${formatPostDate(post.date)}</time>
    <div class="update-body">
        <div class="update-content">${post.content}</div>
        ${post.tags ? `
            <div class="update-tags">
                ${post.tags.map(tag => `<span class="update-tag">#${tag}</span>`).join('')}
            </div>
        ` : ''}
        ${post.linkPreview ? `
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="link-preview" onclick="event.stopPropagation()">
                <div class="preview-title">${post.linkPreview.title}</div>
                <div class="preview-desc">${post.linkPreview.description}</div>
            </a>
        ` : ''}
    </div>
`;
```

The click-to-open-modal listener and the modal body template stay unchanged (they already use `relativeTime`, tags and linkPreview).
- Remove `update-card--featured` logic (no featured card in a timeline) and the `.update-card-footer` block from the card template.

- [ ] **Step 3: Append updates styles to `style.css`**

```css
/* Updates */
.updates .section-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; }
.text-link { font-size: 0.9rem; }
.updates-list { display: flex; flex-direction: column; gap: 0.75rem; }
.update-entry {
  display: flex; gap: 1.25rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: var(--transition);
}
.update-entry:hover { border-color: var(--accent-text); }
.update-date { flex-shrink: 0; width: 72px; font-size: 0.82rem; color: var(--text-secondary); padding-top: 0.15rem; }
.update-body { min-width: 0; }
.update-content { font-size: 0.95rem; }
.update-tags { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
.update-tag { font-size: 0.78rem; color: var(--accent-text); }
.link-preview {
  display: block; margin-top: 0.75rem;
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.6rem 0.8rem; text-decoration: none;
}
.preview-title { font-size: 0.88rem; font-weight: 600; color: var(--text); }
.preview-desc { font-size: 0.82rem; color: var(--text-secondary); }
.updates-actions { margin-top: 1.25rem; }
.updates-load-more-btn {
  background: none; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.55rem 1.2rem; color: var(--text); font-family: var(--font-body);
  font-size: 0.9rem; cursor: pointer; transition: var(--transition);
}
.updates-load-more-btn:hover { border-color: var(--accent-text); }
.updates-load-error { color: var(--text-secondary); padding: 1rem 0; }
.loading-spinner { color: var(--text-secondary); }

/* Update modal + shared overlay */
.modal-overlay {
  display: none; position: fixed; inset: 0; z-index: 1100;
  background: rgba(20, 18, 14, 0.55);
  align-items: center; justify-content: center; padding: 1.5rem;
}
.modal-overlay.active { display: flex; }
.modal-content {
  position: relative; max-width: 640px; width: 100%;
  max-height: 80vh; overflow-y: auto; padding: 2rem;
}
.modal-close-btn {
  position: absolute; top: 0.75rem; right: 0.75rem;
  background: none; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.35rem; color: var(--text); cursor: pointer;
}
.modal-date { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
.modal-tags { margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
@media (max-width: 640px) {
  .update-entry { flex-direction: column; gap: 0.35rem; }
  .update-date { width: auto; }
}
```

- [ ] **Step 4: Verify**

```bash
node --check script.js
```
Browser: updates render as dated rows (date left, content right; stacked on mobile). Clicking a row opens the modal; Escape and overlay-click close it; body scroll locks while open. "Load more" reveals 2 more, hides at the end. Language switch re-renders dates in the right locale (`Haz 2026` vs `Jun 2026`). Stop the server and reload → friendly error message shows.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js style.css
git commit -m "Convert updates carousel to editorial timeline"
```

---

### Task 5: Selected Work — 5 featured cards + compact list

**Files:**
- Modify: `index.html` (cv-projects restructure), `script.js` (delete unused status/i18n keys if any orphaned), `style.css` (append work styles)

**Interfaces:**
- Consumes: `.card` from Task 2. i18n keys `cv-projectN-title`/`cv-projectN-note` (all 12 exist, unchanged) and `status-*` keys (unchanged).

- [ ] **Step 1: Restructure `.cv-projects` in `index.html`**

Featured cards keep projects 1–5 as `<article class="work-card card">` (rename from `cv-project-card glass`; delete the `cv-project-card--mobile` modifier). Template per card — example for project 1; repeat the same structure for projects 2–5 with their existing i18n keys, tags, statuses and links:

```html
<article class="work-card card">
  <div class="work-card-head">
    <h3 data-i18n="cv-project1-title">Gemini RAG Knowledge Assistant</h3>
    <span class="work-status work-status--progress" data-i18n="status-in-progress">In progress</span>
  </div>
  <p data-i18n="cv-project1-note">A production-oriented Retrieval-Augmented Generation assistant built with Gemini API, FastAPI, vector search, and Google Cloud-ready architecture.</p>
  <p class="work-tags">Gemini · RAG · Python · ChromaDB · Qdrant · LLM</p>
  <div class="work-links">
    <a href="https://github.com/ismailcelik-tr/gemini-rag-knowledge-assistant" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
  </div>
</article>
```

Status modifier mapping (one status per card — pick the first/most meaningful): project 1 `--progress`, project 2 `--progress`, project 3 `--live`, project 4 `--live`, project 5 `--progress`. Netelsan cards get two links: `<a href="…apple…">iOS ↗</a> <a href="…google…">Android ↗</a>` (keep existing URLs). Remove ALL `simpleicons`/`brand-icon` `<img>` tags and `<i data-lucide="play">` icons — links are text with `↗`.

Wrap the five cards in `<div class="work-grid">`. Below it add the compact list for projects 6–12:

```html
<ul class="work-list">
  <li><span data-i18n="cv-project6-title">Remote Alarm Monitoring Software</span><span class="work-list-tech">React · JavaScript · MongoDB</span></li>
  <li><span data-i18n="cv-project7-title">Automatic Versioning &amp; Distribution System</span><span class="work-list-tech">CI/CD · GitHub Actions</span></li>
  <li><span data-i18n="cv-project8-title">Vehicle Tracking Mobile &amp; Web Apps</span><span class="work-list-tech">Flutter · React · Spring</span></li>
  <li><span data-i18n="cv-project9-title">Log Management &amp; Monitoring Systems</span><span class="work-list-tech">Zabbix · Cacti · Linux</span></li>
  <li><span data-i18n="cv-project10-title">Cisco Network Configuration Tool</span><span class="work-list-tech">.NET · Network Automation</span></li>
  <li><span data-i18n="cv-project11-title">Pardus Migration &amp; Open Source Server Stack</span><span class="work-list-tech">Pardus · Zimbra · Linux</span></li>
  <li><span data-i18n="cv-project12-title">Terminal Server Web Control Application</span><span class="work-list-tech">MVC · .NET</span></li>
</ul>
```

The old `.cv-project-tags` span-lists, `.cv-project-statuses` multi-badge stacks and `.cv-project-actions` blocks are deleted (replaced by the structures above). Delete now-orphaned i18n keys `status-private-app`, `status-delivered`, `status-case-study`, `cv-projects-eyebrow` from all three dictionaries (only `status-live` and `status-in-progress` remain in use).

- [ ] **Step 2: Append work styles to `style.css`**

```css
/* Selected Work */
.work-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.work-card { padding: 1.4rem; display: flex; flex-direction: column; gap: 0.6rem; }
.work-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; }
.work-card-head h3 { font-size: 1.15rem; }
.work-card p { font-size: 0.92rem; color: var(--text-secondary); }
.work-status { font-size: 0.75rem; white-space: nowrap; }
.work-status::before { content: '● '; }
.work-status--live { color: #2e7d32; }
body.theme-dark .work-status--live { color: #81c784; }
.work-status--progress { color: var(--accent-text); }
.work-tags { font-size: 0.8rem !important; }
.work-links { display: flex; gap: 1rem; margin-top: auto; }
.work-links a { font-size: 0.88rem; }
.work-list { list-style: none; border-top: 1px solid var(--border); }
.work-list li {
  display: flex; justify-content: space-between; gap: 1rem;
  padding: 0.7rem 0; border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}
.work-list-tech { color: var(--text-secondary); font-size: 0.82rem; white-space: nowrap; }
@media (max-width: 760px) {
  .work-grid { grid-template-columns: 1fr; }
  .work-list li { flex-direction: column; gap: 0.15rem; }
}
```

- [ ] **Step 3: Verify**

```bash
node --check script.js
grep -n "simpleicons\|brand-icon\|cv-project-card\|project-status--case\|project-status--delivered" index.html
```
Expected: no matches. Browser: 5 featured cards in 2 columns (1 on mobile), 7 compact rows below, statuses show colored dots, all links open in new tabs, all three languages show translated titles/notes/statuses.

- [ ] **Step 4: Commit**

```bash
git add index.html script.js style.css
git commit -m "Restructure projects into featured cards and compact list"
```

---

### Task 6: Certifications — calm restyle

**Files:**
- Modify: `script.js` (renderer classes), `style.css` (append cert styles). `index.html` unchanged (section markup from Task 1 is already minimal).

**Interfaces:**
- Consumes: `.card` from Task 2. The renderer functions `renderCertificationCard`, `renderFeaturedCertifications`, `renderCertificationsModal` keep their signatures.

- [ ] **Step 1: Adjust renderer output in `script.js`**

In `renderCertificationCard` (script.js:1143): change the article class string from `cert-shell glass certification-card${isCompact}` to `cert-shell card certification-card${isCompact}`. No other JS changes — logos, badge images, credential ids, verify links all stay.

- [ ] **Step 2: Append certification styles to `style.css`**

```css
/* Certifications */
.certifications-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.cert-shell { padding: 1.25rem; }
.cert-row { display: flex; justify-content: space-between; gap: 1rem; }
.cert-main { display: flex; gap: 0.9rem; min-width: 0; }
.cert-logo { flex-shrink: 0; width: 44px; height: 44px; border-radius: var(--radius); overflow: hidden; display: flex; align-items: center; justify-content: center; background: var(--bg); border: 1px solid var(--border); }
.cert-logo img { width: 100%; height: 100%; object-fit: cover; }
.cert-logo-image--contain { object-fit: contain !important; padding: 4px; }
.cert-content h3 { font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; line-height: 1.35; }
.cert-org { font-size: 0.82rem; color: var(--text-secondary); }
.cert-issued { font-size: 0.8rem; color: var(--text-secondary); }
.cert-id { font-size: 0.75rem; color: var(--text-secondary); overflow: hidden; }
.cert-id-value { word-break: break-all; }
.cert-action { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; margin-top: 0.35rem; text-decoration: none; }
.cert-action svg { width: 14px; height: 14px; }
.cert-skill-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem; }
.cert-skill-row svg { width: 14px; height: 14px; flex-shrink: 0; }
.cert-badge-visual { flex-shrink: 0; width: 84px; height: 84px; border-radius: var(--radius); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.cert-badge-visual img { max-width: 100%; max-height: 100%; }
.certifications-footer { margin-top: 1.5rem; }
.certifications-open-btn {
  background: none; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.55rem 1.2rem; color: var(--text); font-family: var(--font-body);
  font-size: 0.9rem; cursor: pointer; transition: var(--transition);
}
.certifications-open-btn:hover { border-color: var(--accent-text); }

/* Certifications modal */
.certifications-modal-overlay {
  display: none; position: fixed; inset: 0; z-index: 1100;
  background: rgba(20, 18, 14, 0.55);
  align-items: center; justify-content: center; padding: 1.5rem;
}
.certifications-modal-overlay.active { display: flex; }
.certifications-modal {
  max-width: 720px; width: 100%; max-height: 82vh;
  display: flex; flex-direction: column; padding: 1.5rem;
}
.certifications-modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.certifications-modal-eyebrow { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-text); }
.certifications-modal-close {
  background: none; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 0.35rem; color: var(--text); cursor: pointer;
}
.certifications-modal-body { overflow-y: auto; }
.certifications-group-list { display: flex; flex-direction: column; gap: 0.75rem; }
@media (max-width: 760px) {
  .certifications-list { grid-template-columns: 1fr; }
  .cert-badge-visual { display: none; }
}
```

- [ ] **Step 3: Verify**

```bash
node --check script.js
grep -n "glass" script.js
```
Expected: the only remaining `glass` match is the `.glass, .section-header` selector inside `observeRevealElements` (Task 8 replaces it). Browser: featured certs in 2-column grid, modal opens with focus on close button, Tab cycles inside modal, Escape/overlay closes and returns focus.

- [ ] **Step 4: Commit**

```bash
git add script.js style.css
git commit -m "Restyle certifications cards and modal"
```

---

### Task 7: Skills, About, Footer

**Files:**
- Modify: `index.html` (fill skills grid, rewrite about + footer), `script.js` (skills group i18n keys), `style.css` (append blocks)

**Interfaces:**
- Consumes: section placeholder `#tech .skills-grid` from Task 1; `about-p1/about-p2/footer-title` keys added in Task 1.

- [ ] **Step 1: Fill the skills grid in `index.html`**

```html
<div class="skills-grid" id="skills-grid">
  <div class="skills-group">
    <h3 data-i18n="skills-group-mobile">Mobile</h3>
    <p>React Native · Flutter · iOS · Android</p>
  </div>
  <div class="skills-group">
    <h3 data-i18n="skills-group-backend">Backend</h3>
    <p>Node.js · Spring Boot · Express.js · FastAPI · REST · WebSocket</p>
  </div>
  <div class="skills-group">
    <h3 data-i18n="skills-group-ai">AI &amp; Data</h3>
    <p>Python · RAG · LLM · PyTorch · TensorFlow · ChromaDB · Qdrant</p>
  </div>
  <div class="skills-group">
    <h3 data-i18n="skills-group-cloud">Cloud &amp; DevOps</h3>
    <p>AWS · GCP · Docker · Kubernetes · CI/CD · Nginx · Linux</p>
  </div>
  <div class="skills-group">
    <h3 data-i18n="skills-group-data">Databases</h3>
    <p>PostgreSQL · MongoDB · MySQL · MSSQL · Redis</p>
  </div>
  <div class="skills-group">
    <h3 data-i18n="skills-group-lang">Languages &amp; Tools</h3>
    <p>TypeScript · JavaScript · Java · Dart · Go · Rust · Git</p>
  </div>
</div>
```

Add i18n keys to all three dictionaries: `skills-group-mobile` en `"Mobile"` tr `"Mobil"` fr `"Mobile"`; `skills-group-backend` `"Backend"` all three; `skills-group-ai` en `"AI & Data"` tr `"AI & Veri"` fr `"IA & Données"`; `skills-group-cloud` `"Cloud & DevOps"` all three; `skills-group-data` en `"Databases"` tr `"Veritabanları"` fr `"Bases de données"`; `skills-group-lang` en `"Languages & Tools"` tr `"Diller & Araçlar"` fr `"Langages & Outils"`.

- [ ] **Step 2: Rewrite About in `index.html`**

```html
<section id="about" class="about">
  <div class="container">
    <div class="section-header">
      <h2 data-i18n="about-title">About</h2>
    </div>
    <div class="about-prose">
      <p data-i18n="about-p1">I work across mobile, full-stack and AI systems, with a strong focus on architecture, backend engineering and high-performance solutions.</p>
      <p data-i18n="about-p2">I enjoy building things from scratch — network servers, parsers, CLI tools — and I care about the low-level details: memory management, concurrency, I/O protocols and performance tuning.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Rewrite the footer in `index.html`**

```html
<footer id="contact">
  <div class="container">
    <h2 data-i18n="footer-title">Let's work together</h2>
    <div class="social-links">
      <a href="https://linkedin.com/in/ismailcelik/" target="_blank" rel="noopener noreferrer" class="social-btn">
        <i data-lucide="linkedin"></i>
        <span data-i18n="footer-linkedin">LinkedIn</span>
      </a>
      <a href="https://github.com/ismailcelik-tr" target="_blank" rel="noopener noreferrer" class="social-btn">
        <i data-lucide="github"></i>
        <span data-i18n="footer-website">GitHub</span>
      </a>
      <a href="mailto:ismailceliktr00@gmail.com" class="social-btn">
        <i data-lucide="mail"></i>
        <span data-i18n="footer-email">Email</span>
      </a>
    </div>
    <p class="copyright">
      <span data-i18n="footer-copy">© <span id="current-year"></span> İsmail ÇELİK | Licensed under MIT</span>
    </p>
  </div>
</footer>
```

**Note:** `footer-copy` translation values contain the year as text (`© 2026 …`) and `updateLanguage` overwrites the span via `textContent`, which destroys the nested `#current-year` span — this already happens today and the dictionary value carries the year, so keep the existing behavior: the nested span is harmless; the dictionary text wins. Leave dictionaries as they are.

- [ ] **Step 4: Append styles to `style.css`**

```css
/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem 2.5rem; }
.skills-group h3 { font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-text); margin-bottom: 0.25rem; }
.skills-group p { font-size: 0.95rem; color: var(--text-secondary); }
@media (max-width: 640px) { .skills-grid { grid-template-columns: 1fr; } }

/* About */
.about-prose { max-width: 640px; display: flex; flex-direction: column; gap: 1rem; }
.about-prose p { color: var(--text-secondary); }

/* Footer */
footer { padding: 4.5rem 0 2.5rem; }
footer h2 { margin-bottom: 1.5rem; }
.social-links { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2.5rem; }
.social-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  color: var(--text); text-decoration: none; font-size: 0.95rem;
  transition: var(--transition);
}
.social-btn:hover { color: var(--accent-text); }
.social-btn svg { width: 18px; height: 18px; }
.copyright { font-size: 0.82rem; color: var(--text-secondary); }
```

- [ ] **Step 5: Verify**

```bash
node --check script.js
```
Browser: skills as 6 labeled text groups (2 columns desktop / 1 mobile), about as two prose paragraphs, footer with three icon+text links and copyright — all translated in en/tr/fr. No skillicons/GIF requests in the Network tab.

- [ ] **Step 6: Commit**

```bash
git add index.html script.js style.css
git commit -m "Add skills groups, prose about section and simplified footer"
```

---

### Task 8: Command palette, reveal animation, final polish

**Files:**
- Modify: `script.js` (observer selector + reduced-motion guard), `style.css` (append palette styles + fade-in), `index.html` (palette overlay `glass` → `card`)

**Interfaces:**
- Consumes: overlay markup ids from index.html (`command-palette-overlay`, etc.) — unchanged.

- [ ] **Step 1: Palette markup class in `index.html`**

In the command palette overlay: `<div class="command-palette glass" …>` → `<div class="command-palette card" …>`. Same for the certifications modal: `class="certifications-modal glass"` → `class="certifications-modal card"` (index.html:1037).

- [ ] **Step 2: Reveal animation in `script.js`**

Replace `observeRevealElements` (script.js:1652-1661) with:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const observeRevealElements = (root = document) => {
    if (prefersReducedMotion.matches) return;
    root.querySelectorAll('.card, .section-header').forEach(el => {
        if (el.dataset.revealBound === 'true') return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
        el.dataset.revealBound = 'true';
    });
};
```

- [ ] **Step 3: Append command palette styles to `style.css`**

```css
/* Command palette */
.command-palette-overlay {
  display: none; position: fixed; inset: 0; z-index: 1200;
  background: rgba(20, 18, 14, 0.55);
  align-items: flex-start; justify-content: center; padding: 15vh 1.5rem 1.5rem;
}
.command-palette-overlay.active { display: flex; }
.command-palette { width: 100%; max-width: 520px; overflow: hidden; }
.command-palette-header {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.85rem 1rem; border-bottom: 1px solid var(--border);
}
.command-palette-header svg { width: 16px; height: 16px; color: var(--text-secondary); flex-shrink: 0; }
.command-palette-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text); font-family: var(--font-body); font-size: 0.95rem;
}
.command-palette-close-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.2rem; }
.command-palette-body { padding: 0.6rem; }
.command-palette-label {
  font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-secondary); padding: 0.25rem 0.5rem 0.5rem;
}
.command-palette-results { display: flex; flex-direction: column; max-height: 40vh; overflow-y: auto; }
.command-item {
  background: none; border: none; border-radius: var(--radius);
  padding: 0.6rem 0.75rem; color: var(--text); font-family: var(--font-body);
  font-size: 0.9rem; text-align: left; cursor: pointer;
}
.command-item:hover, .command-item.active { background: var(--bg); color: var(--accent-text); }
.command-empty { padding: 0.75rem; color: var(--text-secondary); font-size: 0.9rem; }
```

- [ ] **Step 4: Verify — full manual regression (CLAUDE.md checklist)**

```bash
node --check script.js
grep -n "glass" index.html script.js style.css
```
Expected: zero `glass` matches anywhere. Then in browser at desktop and ~375px widths:
1. Theme dark ↔ light: whole page recolors, shader shifts palette, meta theme-color flips.
2. Language en → tr → fr: every visible string changes, no `undefined` text anywhere.
3. Hero animation runs; with reduced-motion emulation it is static; with WebGL blocked (`about:config` or DevTools) page still renders on flat `--bg`.
4. Ctrl/Cmd+K: opens, Arrow keys navigate, Enter executes, Escape closes, no HF/Strategy entries.
5. Certifications modal: open, Tab trap, Escape/overlay close, focus returns to the button.
6. Updates: timeline rows, load-more, detail modal.
7. Mobile menu: opens, locks scroll, closes on link tap.
8. Scroll-reveal: cards fade in once; with reduced-motion they are visible immediately.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js style.css
git commit -m "Restyle command palette and modals, guard reveal animation"
```

---

### Task 9: Documentation updates (user-requested)

**Files:**
- Modify: `AGENTS.md`, `CLAUDE.md`, `README.md`

- [ ] **Step 1: Update `AGENTS.md`**

- §1 Core features: replace "Animated hero section with canvas/WebGL visual treatment" description to mention the calm palette-matched texture; remove mentions of glassmorphism.
- §2 Infrastructure CDN list: remove "Skill and social icons via skillicons.dev"; keep Lucide, Google Fonts, flagcdn. Note fonts are Inter + Source Serif 4.
- §4 Coding standards: replace "gradients, glassmorphism surfaces" wording with "editorial design system (warm neutral palette, serif display type, flat surfaces)".
- §10 Performance: keep shader/blur caution but drop "blur-heavy" (no more backdrop blur).

- [ ] **Step 2: Update `CLAUDE.md`**

- Tech Stack bullet: `CDN assets only: Lucide Icons (unpkg), Google Fonts (Inter, Source Serif 4), flagcdn` (remove skillicons.dev).
- Repository structure comment for `style.css`: "editorial design system; theming via CSS custom properties".
- Testing checklist: remove nothing structurally, but ensure listed flows match: updates timeline (not carousel) — change "Updates modal: pagination / load-more" stays accurate; no other edits needed.

- [ ] **Step 3: Update `README.md`**

- Remove the two shields.io badges and the "From Neural Data to Pixel Perfection" line.
- Overview: "a calm, editorial single-page portfolio inspired by modern documentation-grade design; multilingual (en/tr/fr) with dark/light themes".
- Typography line: `Inter & Source Serif 4 (Google Fonts)`.
- Key Features: drop "pixel-perfect design" phrasing; keep theme switching, i18n, mobile-first, performance bullets.

- [ ] **Step 4: Verify and commit**

```bash
grep -n "Outfit\|skillicons\|glassmorphism\|Neural Data" AGENTS.md CLAUDE.md README.md
```
Expected: no matches.

```bash
git add AGENTS.md CLAUDE.md README.md
git commit -m "Update docs for editorial redesign"
```

---

### Task 10: Final review and merge decision

- [ ] **Step 1:** Run the complete manual regression from Task 8 Step 4 one more time on a fresh serve.
- [ ] **Step 2:** Show the user the result on `http://127.0.0.1:8000` and wait for their approval.
- [ ] **Step 3:** Use the superpowers:finishing-a-development-branch skill — offer merge of `redesign` into `main` (deploys to GitHub Pages), PR, or hold.
