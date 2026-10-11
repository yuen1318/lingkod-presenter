# Lingkod Presenter

Single-page lyric presenter (`index.html`, `sw.js`, `songs.js`). See `README.md` for behavior.

## Rules

- Never edit `songs.js` unless explicitly asked.
- Never commit; the owner reviews and commits manually.
- Bump `VERSION` in `sw.js` when shipped files change, so installed devices update.
- Stay on goal: this is a lyric presenter. Legibility on a projector beats decoration.

## Skills — use on every task in this repo

- **caveman** — terse replies, every session.
- **ponytail** (plugin) — smallest complete change; no extra features or abstractions.
- **impeccable** (plugin) — any UI work: run its context step, follow `polish`/`craft-floor`, run its detector after UI edits.
- **ui-ux-pro-max** (global, `~/.claude/skills/`) — UX, accessibility, responsive and typography checks on UI changes.
- **design-taste-frontend** (global, `~/.claude/skills/`, from tasteskill.dev) — visual taste pass on UI changes.

When skills conflict: the user's request first, then ponytail on scope, then impeccable on visual quality.
