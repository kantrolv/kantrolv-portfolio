# Kantrol Vamshi Krishna — Portfolio MMXXVI

A scroll-staged portfolio set like a private members' club programme:
cream paper, ink serif, forest green, and one restrained gold.
React + Vite, GSAP ScrollTrigger, Lenis. No 3D, no trackers, fonts
self-hosted.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Paste your real links

Everything personal lives in **`src/data/site.js`**:

- `socials` — replace the `'#'` placeholders (GitHub, LinkedIn,
  Codeforces, CodeChef) with real URLs, and the `value` fields with the
  handles you want displayed (e.g. `github.com/yourname`).
- Email is already set from the resume.

Project links live in **`src/data/projects.js`** — swap each entry's
`github: '#'` and `demo: '#'`. Links that are still `'#'` stay on-page;
real URLs automatically open in a new tab.

## Add a project (№ 04, 05, …)

Append an object to the array in `src/data/projects.js`:

```js
{
  number: '04',                    // sets the giant drawn numeral
  title: 'The Next Thing',
  subtitle: 'Optional second line',// omit if not needed
  year: 2026,                      // counts up on reveal
  filedUnder: 'Intelligent Systems',
  description: 'One confident editorial paragraph…',
  metric: { value: 40, suffix: '%', label: 'faster than before' },
  tags: ['React', 'LangGraph'],
  github: '#',
  demo: '#',
}
```

That's it — the catalogue entry, its pinned reveal, the numeral draw,
the entry count in the header, and the marginalia all generate
themselves.

Skills are edited the same way (`skillClusters` in `src/data/site.js`) —
add a row to a cluster and it appears on the honours board, ruled and
ticked. The epigraphs between sections are in `epigraphs` in the same
file.

## Notes

- **Reduced motion**: with `prefers-reduced-motion`, the site renders as
  a fully readable "printed edition" — no pins, no smooth-scroll, all
  content visible.
- **Fonts**: Playfair Display + Inter, bundled via Fontsource (no
  external requests).
- See `DESIGN.md` for the concept, motion grammar, and the decisions
  behind them.
