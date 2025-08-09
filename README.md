# Next.js Todo App (Dark Minimal UI)

A lightweight, modern, dark-themed Todo application built with **Next.js (App Router)** + **TypeScript**. Features inline editing, filtering, and a clean accessible interface.

## Core Features
- Add tasks
- Toggle complete / active
- Inline edit (double-click title or use ✏️ button)
- Delete tasks
- Filter: All / Active / Completed
- Clear all completed tasks
- Live counts for remaining active tasks
- Keyboard: Enter to add / save, Escape to cancel edit
- Accessible form & list semantics

## Tech Stack
- Next.js 14 (App Directory)
- TypeScript
- No external state libs (simple custom store)
- Pure CSS (no framework) with dark gradient UI

## Quick Start

```bash
# Install deps
npm install

# Run dev server
npm run dev

# Visit
http://localhost:3000
```

## Project Structure
```
app/
  layout.tsx        # Root layout
  page.tsx          # Main todo page
  globals.css       # Styles (dark UI)
  components.tsx    # UI components (client)
  store.ts          # Simple in-memory store
  types.ts          # Shared types
```

## Design Notes
- State persists in `localStorage` (gracefully ignores corruption / quota errors).
- Minimal re-renders: tiny custom subscription hook.
- No hydration mismatch risk: purely client UI inside app shell body.

## Possible Extensions
- LocalStorage persistence
- Drag to reorder
- Due dates & sorting
- Bulk select & actions
- Server Actions / DB (Postgres, SQLite)
- PWA installability

## License
MIT
