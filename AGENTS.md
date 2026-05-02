# AGENTS.md

## 1. Project Overview

### What this project does
- This repository contains a production static personal portfolio site for `ismailcelik-tr.github.io`.
- It is a single-page frontend served as static files and deployed to GitHub Pages.
- It presents portfolio content, certifications, recent updates, skills, and contact information in a responsive, multilingual UI.

### Core features
- Responsive single-page portfolio experience.
- Client-side language switching for `en`, `tr`, and `fr`.
- Theme switching with system-preference support.
- Modal-driven UI for certifications and updates.
- Static content rendering from `posts.json`.
- Lightweight interactive behavior implemented in plain JavaScript.

### Target users
- Recruiters and hiring managers.
- Technical collaborators and potential clients.
- Visitors reviewing portfolio work, certifications, and technical profile.

## 2. Tech Stack

### Frontend
- HTML5: page structure and semantic markup.
- CSS3: custom design system, layout, animation, and responsive rules.
- Vanilla JavaScript (ES6+): client-side interactivity, i18n, theme state, modal behavior, and content rendering.

### Backend
- None. This project has no application server.

### Database
- None. Data is file-based.
- `posts.json` acts as a static content source for updates.

### Infrastructure
- GitHub Pages for production hosting.
- Static asset delivery through the browser.
- Third-party frontend assets loaded from CDN:
  - Lucide icons via `unpkg`.
  - Google Fonts.

### Versions
- No explicit package-managed runtime is pinned in-repo.
- Assume modern evergreen browsers as the execution target.
- Local development commonly uses Python 3 `http.server` or equivalent static hosting.

## 3. Architecture

### High-level system design
- The site is a static SPA-style document with all sections in `index.html`.
- Styling is centralized in `style.css`.
- Behavior is centralized in `script.js`.
- Content is a mix of inline markup and static JSON loaded at runtime.

### How services communicate
- There are no internal services.
- Browser-side JavaScript fetches `posts.json`.
- External communication is limited to static asset/CDN requests and outbound links.

### Folder structure
- `index.html`: main document structure, section markup, modal markup, and CDN includes.
- `style.css`: global styles, layout, components, themes, animations, and responsive rules.
- `script.js`: translation dictionaries, DOM wiring, rendering logic, state handling, and modal/theme behavior.
- `posts.json`: structured update/feed content consumed by the frontend.
- `assets/`: local images and badge/logo assets.

## 4. Development Guidelines

### Coding standards
- Preserve the current stack: plain HTML, plain CSS, plain JS.
- Prefer small, explicit DOM code over abstraction-heavy rewrites.
- Keep behavior deterministic and compatible with static hosting.
- Favor readability over cleverness.
- Minimize global side effects outside the existing `DOMContentLoaded` bootstrapping pattern.

### Naming conventions
- Use kebab-case for CSS classes and HTML ids unless matching an existing pattern.
- Use camelCase for JavaScript variables and functions.
- Use descriptive IDs for data objects, especially content entries and certifications.
- Keep translation keys stable and grouped by feature.

### File organization rules
- Do not introduce frameworks or bundlers for small changes.
- Keep markup changes in `index.html`, styles in `style.css`, and behavior in `script.js`.
- Add new static data to `posts.json` only when the content is truly data-driven.
- Reuse existing component/class patterns before creating new ones.

## 5. Commands

### Run locally
- Open directly:
```bash
index.html
```
- Preferred local static server:
```bash
python -m http.server 8000 --bind 127.0.0.1
```

### Build
- No build step exists.

### Test
- No automated test suite exists today.
- Manual verification is required in browser after UI changes.

### Lint / format
- No lint or formatter is configured in-repo.
- Keep formatting consistent with surrounding code.
- If adding tooling, keep it minimal and justify the change.

## 6. API & Data Rules

### API design conventions
- There is no backend API.
- Treat `posts.json` as the primary structured data interface.
- New data structures must be additive and backward-compatible with existing rendering logic.

### Error handling format
- Fail soft in the UI.
- If `posts.json` fails to load, show a user-safe fallback message instead of throwing uncaught errors.
- Log debugging details to the console only when useful for development.

### Validation rules
- Assume JSON content is trusted only after shape checks in rendering code.
- Validate existence of required fields before rendering dynamic content.
- Preserve multilingual content completeness where a feature is localized.

## 7. Testing Strategy

### Current expectations
- Manual regression testing is mandatory for:
  - navigation
  - theme switching
  - language switching
  - certifications modal
  - updates modal and pagination/load-more behavior
  - responsive layout at mobile and desktop widths

### If tests are added
- Unit tests: utility functions and pure transformation logic only.
- Integration tests: DOM rendering and modal/theme/i18n flows.
- E2E tests: critical user journeys on the deployed static site or local static server.

### Coverage expectations
- No enforced numeric threshold exists.
- If a non-trivial logic branch is introduced, add tests or document why manual coverage is sufficient.

## 8. Deployment & Environments

### Environments
- `dev`: local static serving.
- `production`: GitHub Pages from the repository branch used for deployment.
- `staging`: not formally defined; if needed, use a branch-based preview approach.

### Environment variable usage
- None currently.
- Do not introduce environment-variable dependence unless there is a clear deployment need.
- Any future environment-specific behavior must degrade safely when variables are absent.

## 9. AI Agent Instructions

### How the agent should modify code
- Read the existing HTML/CSS/JS before editing.
- Make the smallest viable change that matches current patterns.
- Preserve static-hosting compatibility.
- Keep accessibility intact when editing interactive elements.
- Update translations in all supported languages when adding user-facing text.
- When changing data-driven UI, update both content and rendering assumptions together.

### What the agent must NEVER do
- Do not add a framework, bundler, or backend without explicit user approval.
- Do not rewrite large sections of the site for stylistic reasons alone.
- Do not remove existing translations, accessibility attributes, or responsive behavior.
- Do not hardcode environment-specific absolute URLs when relative paths are sufficient.
- Do not introduce secrets, tokens, analytics trackers, or third-party scripts without approval.

### How to safely refactor
- Keep HTML structure stable unless the UI problem requires structural change.
- Refactor one concern at a time: markup, styles, behavior, or data.
- Preserve existing CSS class semantics where possible.
- Re-test all affected interactive flows after any refactor.
- Prefer additive changes over broad rewrites.

### Rules for adding dependencies
- Default rule: do not add dependencies.
- If a dependency is unavoidable, it must:
  - work with static hosting
  - have a narrow scope
  - replace meaningful custom complexity
  - be approved by the user
- CDN additions should be minimized and justified by clear UI or maintenance value.

## 10. Performance & Security Considerations

### Performance
- Keep the site fast on first load.
- Avoid large libraries for small UI behavior.
- Optimize images and prefer local assets for stable content.
- Do not add blocking scripts unless necessary.
- Preserve responsive performance on mid-range mobile devices.

### Security
- Treat all dynamic rendering paths carefully, especially content loaded from `posts.json`.
- Avoid unsafe HTML injection unless the source is tightly controlled and sanitized.
- Keep external links using `target="_blank"` paired with `rel="noopener noreferrer"`.
- Do not add client-side storage for sensitive data.

## 11. Deeper Docs

- [README.md](./README.md): project summary and local run basics.
- [LICENSE](./LICENSE): repository license terms.

