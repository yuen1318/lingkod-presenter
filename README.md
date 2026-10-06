# Lingkod Presenter — App Behavior

A single-page lyric presentation app (`index.html`) designed for projecting song lyrics during live gatherings. It runs entirely in the browser and works offline via a service worker.

## Core Functionality

### Song Library & Search
- Songs load from `songs.js` (`rawSongs`) and are sorted alphabetically, case-insensitively.
- The top search bar filters songs by title as you type (100 ms debounce).
- The dropdown shows a result count, highlights the currently selected song, and scrolls it into view.
- If no songs load or nothing matches, a friendly empty message is shown instead.
- Clicking the search bar while a song is selected re-opens the search so you can switch songs; the current song keeps displaying until a new one is picked.
- The ✕ button clears the search text and refocuses the input.

### Presenting a Song
- Selecting a song starts at its first section, requests fullscreen, and attempts to lock the screen to landscape orientation.
- The top bar switches from search input to the selected song's title (pill width auto-fits the title text).
- A **section badge** (top-left) shows the current section name (e.g. VERSE, CHORUS, BRIDGE, REFRAIN).
- A **section counter** (top-right) shows progress as `current/total`.
- Lyrics render in the center panel, which gets a frosted-glass backdrop while a song is active.
- Past the last section, the display shows `♢ end of song ♢`; pressing next again triggers a brief pulse animation on the lyrics and counter instead of advancing.

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
| Swipe right / left (touch) | Previous / next section |
| `Alt`+`Shift`+`H` | Home view (clears song, shows welcome screen) |
| `Alt`+`Shift`+`F` | Open/focus song search |
| `↑` / `↓` (in search) | Move keyboard highlight through results |
| `Enter` (in search) | Select highlighted (or first) result |
| `Esc` | Close dropdown, blur search, or exit fullscreen |
| Double-click / double-tap | Toggle fullscreen (ignored inside the search area) |

- In fullscreen, the mouse cursor auto-hides after 1 second of inactivity and reappears on movement.
- Orientation unlocks when leaving fullscreen.

## Custom Background
- From the welcome screen you can upload a **PNG** background (validated by MIME type and PNG magic bytes).
- The image persists on the device in IndexedDB (`lyric-presenter` → `settings` store) and is restored on next launch.
- "Clear custom background" removes the saved image and restores the default `bg.webp`.

## Updates (PWA)
- The app registers `sw.js`; when the service worker reports `UPDATE_AVAILABLE`, a bottom banner appears — tapping it reloads to the new version.

## Responsive Behavior
- **Desktop**: three-column nav (badge / search / counter), large centered pill search.
- **Tablet portrait & phones**: badge and counter move to fixed bottom corners; search pill shrinks.
- **Tablet/short landscape**: compact nav with smaller pill, badge, and counter inline.
- Lyric panel padding, backdrop blur, and font caps adjust per breakpoint.
