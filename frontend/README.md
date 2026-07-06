# Nestwell — PG/Hostel Management Admin Panel

A hostel/PG management admin dashboard built with **React (Vite)**, **React Router**,
**Tailwind CSS**, and **Framer Motion**, using the dark-navy / teal / off-white palette
supplied in the brief.

## Pages

- **Dashboard** — stat cards, an occupancy map (door-tag grid), recent complaints, recent payments
- **Rooms** — filterable grid of "door-plate" room cards (floor, status, beds, rent)
- **Tenants** — searchable tenant table with contact info and rent status
- **Rent** — collection summary + filterable payment table with per-row actions
- **Complaints** — status tabs with priority-coded complaint cards

## Palette

| Token       | Hex       | Used for                              |
|-------------|-----------|-----------------------------------------|
| `ink`       | `#222831` | Sidebar bg, primary text                |
| `ink-soft`  | `#393E46` | Secondary dark surfaces, occupied state |
| `teal`      | `#76ABAE` | Brand accent, vacant state              |
| `teal-deep` | `#5C8F92` | Hover states, paid/resolved state       |
| `teal-mist` | `#CFE3E4` | Chip backgrounds                        |
| `paper`     | `#EEEEEE` | Page canvas                             |
| `amber`     | `#C08A3E` | Due / maintenance / medium priority     |
| `rose`      | `#B5555A` | Overdue / open / high priority          |

The amber and rose tones are functional additions outside the brand palette, used only
for status semantics (rent due/overdue, complaint priority) — everything else in the
UI stays within navy/teal/off-white.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Project structure

```
pg-admin-panel/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx                  # React entry point + BrowserRouter
    ├── App.jsx                    # Route definitions
    ├── index.css                  # Tailwind directives + base styles
    ├── layouts/
    │   └── DashboardLayout.jsx     # Sidebar + topbar + animated route outlet
    ├── data/
    │   ├── rooms.js
    │   ├── tenants.js
    │   ├── rent.js
    │   └── complaints.js
    ├── hooks/
    │   └── useCountUp.js           # Scroll-triggered number count-up
    ├── lib/
    │   └── utils.js                 # formatCurrency, initials, avatarTint
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── Topbar.jsx
    │   ├── SearchInput.jsx
    │   ├── StatCard.jsx
    │   ├── StatusBadge.jsx
    │   └── RoomTag.jsx              # Signature "door plate" room card
    └── pages/
        ├── Dashboard.jsx
        ├── Rooms.jsx
        ├── Tenants.jsx
        ├── Rent.jsx
        └── Complaints.jsx
```

## Notes

- All data in `src/data/` is sample content — swap in API calls when you wire up a backend.
- The signature visual is `RoomTag`: a door-plate card with a status-colored top strip
  and mounting-screw dots, echoing a physical room plaque.
- Motion respects `prefers-reduced-motion`.
- The mobile sidebar is a slide-in drawer (hamburger menu in the topbar); it's always
  visible on large screens.
