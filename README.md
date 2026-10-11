# Lingkod Presenter — App Behavior

A single-page lyric presentation app (`index.html`) designed for projecting song lyrics during live gatherings. It runs entirely in the browser and works offline via a service worker.

## Core Functionality

### Song Library & Search
- Songs load from `songs.js` (`rawSongs`) and are sorted alphabetically, case-insensitively.
- The top search bar filters songs by title as you type (100 ms debounce). Matching ignores accents and apostrophes (`senor` finds "Señor", `lords day` finds "Lord’s Day").
- The dropdown shows a result count, highlights the currently selected song, and scrolls it into view.
- If no songs load or nothing matches, a friendly empty message is shown instead.
- Clicking the search bar while a song is selected re-opens the search so you can switch songs; the current song keeps displaying until a new one is picked.
- The ✕ button clears the search text and refocuses the input.

### Presenting a Song
- Selecting a song starts at its first section, requests fullscreen, attempts to lock the screen to landscape orientation, and holds a screen wake lock so the display does not sleep (released on Home view).
- The top bar switches from search input to the selected song's title (pill width auto-fits the title text).
- A **section badge** (top-left) shows the current section name (e.g. VERSE, CHORUS, BRIDGE, REFRAIN).
- A **section counter** (top-right) shows progress as `current/total`.
- Lyrics render in the center panel, which gets a frosted-glass backdrop while a song is active.
- Past the last section, the display shows an "End of song" marker; pressing next again triggers a brief pulse animation on the lyrics and counter instead of advancing.

### Lyric Formatting Tags
Song data can include inline tags, rendered as styled spans:
- `[C1]…[/C1]` — gold highlight (`#FAD539`)
- `[F1]…[/F1]` — italic emphasis

### Auto Font Sizing
- Lyric font size is computed to fit both viewport width (longest line) and height (line count), capped per screen size.
- Letter spacing tightens automatically for long lines.
- Resizing recalculates on window resize, fullscreen changes, font load, and section changes (via `requestAnimationFrame`).

## Navigation & Controls

| Input | Action |
|---|---|
| `←` / `→` | Previous / next section (with slide transition animation) |
| `PageUp` / `PageDown`, `↑` / `↓`, `Space` | Previous / next section (presenter remotes) |
| `Home` / `End` | First / last section |
| Swipe right / left (touch) | Previous / next section |
| `Alt`+`Shift`+`H` | Home view (clears song, shows welcome screen) |
| `Alt`+`Shift`+`F` | Open/focus song search |
| `↑` / `↓` (in search) | Move keyboard highlight through results |
| `Enter` (in search) | Select highlighted (or first) result |
| `Esc` | Close dropdown, blur search, or exit fullscreen |
| Double-click / double-tap | Toggle fullscreen (ignored inside the search area) |

- In fullscreen, the mouse cursor auto-hides after 1 second of inactivity and reappears on movement.
- Orientation unlocks when leaving fullscreen.

## Checks
- `node check-search.mjs` asserts the search folding and highlight mapping in `index.html`.

## Song Requests
- The welcome screen links to a Google Form (opens in a new tab) for requesting a new song or a correction.

## Custom Background
- From the welcome screen you can upload a **PNG** background (validated by MIME type and PNG magic bytes).
- The image persists on the device in IndexedDB (`lyric-presenter` → `settings` store) and is restored on next launch.
- "Reset to default" removes the saved image and restores the default `bg.webp`.
- A `localStorage` flag (`lingkod-custom-bg`) marks that a custom image exists, so on launch the screen stays black until it loads instead of flashing `bg.webp`.

## Updates (PWA)
- The app registers `sw.js`; when the service worker reports `UPDATE_AVAILABLE` (not on first install), a floating pill appears at the bottom — tapping it reloads to the new version. The pill only shows while no song is on screen, so it never appears on the projector mid-song.
- `manifest.webmanifest` (with `icon.png`) makes the app installable; it launches fullscreen in landscape.

## Responsive Behavior
- **Desktop**: three-column nav (badge / search / counter), large centered pill search.
- **Tablet portrait & phones**: badge and counter move to fixed bottom corners; search pill shrinks.
- **Tablet/short landscape**: compact nav with smaller pill, badge, and counter inline.
- Lyric panel padding, backdrop blur, and font caps adjust per breakpoint.
