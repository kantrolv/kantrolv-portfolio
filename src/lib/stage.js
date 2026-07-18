import { gsap, SplitText } from './gsap'

/**
 * Shared staging helpers. Markup always contains the final, visible state;
 * these helpers impose the hidden initial state at effect time, so with
 * JavaScript off or reduced motion on, everything simply reads as printed.
 */

/** Split an element into masked lines and return a tween-ready target array. */
export function splitIntoLines(el) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'st-line',
  })
}

/** Split an element into masked words. */
export function splitIntoWords(el) {
  return SplitText.create(el, {
    type: 'words',
    mask: 'words',
    wordsClass: 'st-word',
  })
}

/**
 * Standard rise-from-mask config for split lines/words.
 * `blur: true` adds an ink-dry settle (blurred → crisp) — display titles
 * only; the filter is too costly to hang on every body line.
 */
export function riseFrom(targets, overrides = {}) {
  const { fade, blur, ...rest } = overrides
  return [
    targets,
    {
      yPercent: 115,
      opacity: fade === false ? 1 : 0.001,
      ...(blur ? { filter: 'blur(7px)' } : {}),
      duration: 0.9,
      stagger: 0.08,
      ease: 'regal',
      ...rest,
    },
  ]
}

/** Prepare every path/line/circle/rect inside an SVG for a stroke draw. */
export function prepareStrokeDraw(svgEl) {
  const shapes = svgEl.matches('[data-draw]')
    ? [svgEl]
    : Array.from(svgEl.querySelectorAll('[data-draw]'))
  shapes.forEach((shape) => {
    // data-draw-len overrides measurement (needed for <text>, which has no
    // getTotalLength — the override must exceed the glyph outline length).
    const len = shape.dataset.drawLen
      ? parseFloat(shape.dataset.drawLen)
      : typeof shape.getTotalLength === 'function'
        ? shape.getTotalLength()
        : 300
    shape.style.strokeDasharray = `${len}`
    shape.style.strokeDashoffset = `${len}`
  })
  return shapes
}

/** Tween config that draws prepared shapes stroke-by-stroke. */
export function drawStroke(shapes, overrides = {}) {
  return [
    shapes,
    {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'silk',
      ...overrides,
    },
  ]
}

/** Kinetic numeral: counts el's text from `start` to `value` when the tween plays. */
export function countUp(el, value, { prefix = '', suffix = '', duration = 1.4, start = 0 } = {}) {
  const state = { v: start }
  return [
    state,
    {
      v: value,
      duration,
      ease: 'silk',
      onUpdate() {
        el.textContent = `${prefix}${Math.round(state.v)}${suffix}`
      },
    },
  ]
}

/** Format helper for the roman-numeral marginalia. */
export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
