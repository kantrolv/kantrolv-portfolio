# DESIGN — Portfolio MMXXVI

**Concept: a private members' club programme.**
The site reads as a finely printed programme from an old club — cream paper,
ink serif, forest green, one restrained gold. The scroll is the page-turn:
every section is a staged reveal (à la SBS *The Boat*), and the space
*between* sections is treated as carefully as the sections themselves.

## Art direction

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F4EFE6` | ground; a deeper cream `#EDE5D5` for card stock |
| Ink | `#1A1A18` | display type, body headings |
| Forest | `#1E3A2F` | italic emphasis, the "V" of the monogram, epigraphs |
| Gold | `#B08D57` | rules, numerals, ticks, metrics — never large fills |

- **Type**: Playfair Display (variable, self-hosted) for display + italics;
  Inter (variable) for body and small-caps labels. Small caps are synthesized
  the classic way: uppercase Inter at ~0.3em tracking, 10–11px.
- **Texture**: an SVG `feTurbulence` grain tile stepped through
  `background-position` (8 steps — living paper without a giant GPU
  layer), plus a slowly breathing radial vignette.

## The backdrop (five layers, all behind the type)

Stacking, bottom → top, every layer `pointer-events: none` and behind
content via negative z-index; type sits above at `z-index: 1`:

1. **Section tint** (`z -4`) — the paper's temperature drifts by movement:
   warm ivory (Overture) → neutral (Introduction) → faint green-grey
   (Honours) → warmer sand (Catalogue) → soft ivory (Correspondence).
   Contiguous ScrollTrigger bands (each runs until the *next* section's
   start, so jumps and deep links always resolve to exactly one tint),
   crossfaded over 1.8s. Shifts are 1–6 RGB units — felt, not seen.
2. **Ambient cursor glow** (`z -3`) — a 52vmax radial of pale gold at
   3–7% alpha, multiply-blended, trailing the pointer on a slow `quickTo`
   like lamplight on paper. Fine-pointer devices only; off under reduced
   motion.
3. **Living grain + vignette** (`z -2`) — multiply-blended fiber noise at
   ~4% effective opacity, stepped every ~1.1s; breathing vignette above it.
4. **Ghost watermarks** (`z 0`, inside each section) — alternating
   oversized serif numerals (II, IV at ~2.8% ink) and the stroke-only K·V
   monogram (~3.6% ink), drifting ±80px slower than the foreground:
   luxury letterhead, not decoration.
5. **Gold binding thread** (left margin, ≥1100px) — a 1px stitch that
   draws with overall scroll progress; five diamond nodes mark where
   movements begin (positions re-measured on every ScrollTrigger refresh)
   and turn solid gold as the reader passes them. Fades in with the
   curtain alongside the nav.

Tuning rule applied throughout: if a layer is *noticed*, it is too loud —
watermark and glow opacities were dialed down once already after the
critique pass. Idle frame rate measured at ~120fps with all layers on.

## Fountain-pen cursor

A `<canvas>` cursor (no WebGL) built to match the site's *correspondence*
vocabulary — a nib laying a calligraphic ink stroke on paper. A crisp nib
dot is locked to the pointer for pixel precision; behind it a 16-point
chain trails with lerp easing (high damping, low stiffness). Rather than
discrete blots, the chain is rendered as one **continuous tapering
ribbon** — per-frame normals offset the centreline, full width at the nib
down to a hairline tail — so it reads as a single wet line. Two fills (a
faint wide halo + the body) fake ink bleed without a blur filter. The
stroke is **velocity-aware**: it thins as the pointer accelerates (the pen
lifting) and pools back to the nib at rest. Over links (`a, button,
[data-cursor]`) an eased `swell` warms ink → muted gold, grows the stroke
~1.4×, and slows the chain (magnetic pull). Allocation-free loop (typed
arrays, no per-frame objects); measured ~120fps under continuous motion.
Desktop + fine pointer only — disabled on touch and reduced motion, where
the native cursor returns.

## Engraved skill marks

Each Honours-Board row carries a monochrome mark to the left of the name.
Glyphs come from **simple-icons** (named imports → tree-shaken to the ~19
used, not the full set), but only their `.path` is used — never the brand
`.hex` — so every mark is rendered in `currentColor`/fill at ink 66%,
warming to gold on row hover. Skills with no clean logo (RAG, FAISS,
agentic systems, NLP, OpenAI/Groq, AWS, SQL) get a quiet gold diamond in
the same 17px box, keeping the ruled column aligned and the palette
strictly cream/ink/gold. Tone is carried by `fill` (not element opacity),
leaving `opacity` free for the row's staggered reveal. Data-driven via
`{ name, icon }` rows in `src/data/site.js`.
- **Ornament**: a stroke-only K·V monogram, plate-frame corner marks fixed at
  the viewport corners, thin gold rules everywhere, dotted leaders, diamonds.

## The scroll experience

1. **Overture** — preloader counts in gold serif, the paper parts along a
   drawn gold seam; the baseline rule draws across, the name sets line by
   line from masks, the monogram inks itself stroke by stroke. Parallax
   drift on exit.
2. **The Introduction** — pinned spread (`+=150%`, scrub): pull-quote sets
   word by word, the initial settles into the margin, two justified columns
   rise line by line, education footer draws last.
3. **The Honours Board** — four ruled clusters (Intelligence / Front of
   House / Back of House / The Workshop). Rows reveal with clip-wiped
   leaders and hand-drawn gold ticks; certifications set as an appendix.
4. **The Catalogue** — the centrepiece. Each entry: the giant serif numeral
   is stroke-drawn *during the approach* (so no scroll increment arrives
   empty), then the entry pins (`+=170%`, scrub) and sets itself — title
   words, extending rule, description lines, kinetic gold metric, tags,
   underline-wipe links.
5. **Correspondence** — a cream card whose double gold border is literally
   drawn (measured SVG rects), a directory of addresses with dotted leaders,
   and a fine footer with the live Pune clock.

**Between every movement**: an original epigraph (centred serif italic,
rules parting, a diamond turning in) that also drifts on parallax; vertical
small-caps marginalia (entry index, coordinates, "filed under") parallax in
the margins throughout.

## Motion grammar

- Two custom eases only: `regal` (≈ `cubic-bezier(.16,1,.3,1)`) for rises,
  `silk` (≈ `cubic-bezier(.65,0,.15,1)`) for draws. Consistency is what
  makes it feel expensive.
- GSAP ScrollTrigger + Lenis (`duration 1.15`, exponential easing).
- Text reveals via SplitText line/word masks (free since GSAP 3.13);
  justified interior lines are re-justified with `text-align-last`.
- Stroke draws via `stroke-dashoffset`; `<text>` numerals use a
  `data-draw-len` override since text has no `getTotalLength`.
- Kinetic numbers: years and metrics count up inside scrubbed timelines,
  faded in at their cue so markup defaults never leak early.

## Engineering decisions

- **Markup holds the final state.** GSAP imposes hidden initial states at
  effect time — so `prefers-reduced-motion`, no-JS, and SEO all get the
  complete printed page (pins and Lenis are skipped entirely under reduced
  motion).
- **Ready-gating**: scenes build only after `document.fonts.ready` (behind
  the preloader), so line-splitting never measures fallback fonts; a
  `ScrollTrigger.refresh()` is choreographed after build and after the
  scroll-lock lifts.
- **Resize**: effects are keyed on a debounced *width* bucket (height
  changes from mobile URL bars are ignored) and fully rebuilt via
  `gsap.context` revert + SplitText revert.
- **Performance**: transforms/opacity only, `quickTo` for cursor and
  magnetic hovers (no per-frame allocations), no blanket `will-change`,
  grain animated by background-position rather than layer transforms.
- **Data-driven**: `src/data/projects.js` and `src/data/site.js` render
  everything; entry № 04+ inherits the full staging automatically.

## Self-critique log (3 passes)

1. *Functional*: preloader raced by on fast connections (min-hold added);
   nav appeared before the curtain (now fades with `is-live`); nav active
   state lost through the catalogue (wrapper id); duplicate filed-under
   label; GSAP warnings for absent subtitles; blank approach into entries
   (numeral now inks on approach).
2. *Craft*: dead cream between sections (epigraph padding trimmed + drift
   parallax added); grain layer was a GPU memory bomb on mobile
   (background-position stepping); blanket `will-change` removed; hero
   baseline strengthened to gold-70.
3. *Final juror*: mobile columns were stretch-justified (ragged-right under
   900px); pinned summary overflowed 812px (compressed type scale); section
   text collided with nav labels (stronger paper gradient); metrics leaked
   final values before their count-up cue (faded in at cue); overture
   monogram timing tightened.
