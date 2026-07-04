# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Claude-Specific Instructions

### Project Overview

Personal portfolio for İsmail Çelik (`ismailcelik-tr.github.io`). Static single-page site deployed to GitHub Pages with no build step, no framework, and no server.

### Tech Stack

- HTML5 / Vanilla CSS3 / Vanilla JavaScript (ES6+)
- CDN assets only: Lucide Icons (unpkg), Google Fonts (Inter, Source Serif 4), flagcdn
- Python 3 for CV generation (`scripts/generate_cv_pdfs.py`)

### Repository Structure

```
index.html         # All section and modal markup
style.css          # Editorial design system; theming via CSS custom properties
script.js          # i18n dicts (en/tr/fr), certifications dataset, all DOM logic
posts.json         # Updates feed — fetched at runtime, rendered reverse-chronological
assets/            # Images and badge/logo assets
scripts/           # generate_cv_pdfs.py
generated-cv/      # Output PDFs (English and Turkish)
AGENTS.md          # Detailed development guidelines (imported above)
```

### Build / Run / Test / Lint Commands

| Task | Command |
|------|---------|
| Run locally | `python -m http.server 8000 --bind 127.0.0.1` |
| Generate CV PDFs | `python scripts/generate_cv_pdfs.py` |
| Build | *(none — no build step)* |
| Tests | *(none — manual browser testing only)* |
| Lint / format | *(none configured — match surrounding style)* |

### Coding Conventions

- Markup changes go in `index.html`, styles in `style.css`, behavior in `script.js`. Never mix concerns.
- CSS classes and HTML ids: kebab-case. JS variables and functions: camelCase.
- i18n: mark UI text with `data-i18n="key"` (or `data-i18n-with-icon`). Add the key and **all three translations** (en/tr/fr) to the dictionaries in `script.js` before using it.
- Keep translation keys stable and grouped by feature.
- `posts.json` shape: `{ id, date, content, link, linkPreview, tags }` — additive and backward-compatible changes only.
- Certification entries are hardcoded in `script.js`; include localized `issued` and `skills` for en/tr/fr.

### Architecture Rules

- No frameworks, bundlers, or backend without explicit user approval.
- Static-hosting compatibility is non-negotiable — no server-side logic, no environment variables.
- Preserve keyboard navigation, focus traps in modals, ARIA labels, and scroll locking on overlays/mobile nav.
- WebGL2 hero has a CSS fallback; respect `prefers-reduced-motion` in all animations.
- External links must use `rel="noopener noreferrer"`.
- Avoid unsafe HTML injection for dynamically rendered content.

### Git Workflow

- Work on `main` directly for small changes; propose a branch for large refactors.
- Commit messages: imperative mood, short subject line, no period.
- Do not force-push `main` or amend published commits without explicit approval.
- Ask before any destructive git operation (reset --hard, branch -D, rebase that rewrites shared history).

### Testing Expectations

No automated suite exists. After any UI change, manually verify:
- Theme switching (dark ↔ light), language switching (en/tr/fr)
- Hero animation and reduced-motion fallback
- Command palette (Ctrl/Cmd+K): open, keyboard search, command execution
- Certifications modal: open, focus trap, overlay close
- Updates modal: pagination / load-more
- Mobile menu: open/close, scroll locking
- Responsive layout at mobile and desktop widths

### Documentation Update Rules

- Update `AGENTS.md` if development guidelines change.
- No `docs/OPEN_DECISIONS.md` or `docs/IMPLEMENTATION_STATE.md` exist yet — create them under `docs/` only if persistent architectural decisions or implementation state need tracking across sessions.
- Temporary in-session state and task notes belong in `SESSION_CONTEXT.md` (create at repo root if needed), not in `CLAUDE.md` or `AGENTS.md`.
- `PROJECT_CONTEXT.md` (create at repo root if needed) holds durable project-wide context that supplements `AGENTS.md`.

### Security Rules

- No secrets, tokens, or analytics trackers without user approval.
- No new third-party scripts without explicit justification and user approval.
- Sanitize or validate shape of all content loaded from `posts.json` before rendering.

### No-Overengineering Rules

- Make the smallest viable change that matches current patterns.
- Do not introduce abstractions for one-off needs.
- Do not add dependencies for behavior that can be done in a few lines of vanilla code.
- Refactor one concern at a time (markup, styles, behavior, or data) — not all at once.

### Ask Before Acting

Always ask before:
- Adding a framework, bundler, backend, or new CDN dependency.
- Removing or rewriting large sections of HTML, CSS, or JS.
- Deleting files or making destructive git operations.
- Introducing any form of client-side storage for user data beyond the existing `localStorage` pattern.
