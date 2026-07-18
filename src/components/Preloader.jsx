import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prepareStrokeDraw } from '../lib/stage'
import Monogram from './Monogram'
import { site } from '../data/site'

/**
 * The overture curtain. The K·V monogram inks itself stroke by stroke on
 * deep cream, then the paper parts along a drawn gold seam. `onOpen` fires
 * as the curtain begins to lift (so the overture can start beneath it);
 * `onGone` removes it from the tree.
 *
 * Runs once per session (App holds the flag) and any click or key
 * fast-forwards it — the hold is a dummy tween inside the timeline, so a
 * single timeScale compresses the wait and the parting alike.
 */
const MIN_DRAW_MS = 750 // one readable beat for the monogram

export default function Preloader({ ready, reduced, onOpen, onGone }) {
  const root = useRef(null)
  const mono = useRef(null)
  const mountedAt = useRef(performance.now())
  const drawTl = useRef(null)
  const openTl = useRef(null)
  const skipped = useRef(false)

  useEffect(() => {
    document.body.classList.add('is-loading')
    return () => document.body.classList.remove('is-loading')
  }, [])

  // Phase 1 — the monogram inks itself while fonts and modules settle.
  useLayoutEffect(() => {
    if (reduced) return
    const q = gsap.utils.selector(root)
    const shapes = prepareStrokeDraw(mono.current)
    gsap.set(q('.preloader__label'), { autoAlpha: 0, y: 8 })
    const tl = gsap.timeline()
    tl.to(shapes, { strokeDashoffset: 0, duration: 0.85, stagger: 0.04, ease: 'silk' }, 0)
      .to(q('.preloader__label'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'regal' }, 0.35)
    drawTl.current = tl
    return () => tl.kill()
  }, [reduced])

  // Phase 2 — once ready, hold until the monogram has had its beat, then part.
  useEffect(() => {
    if (!ready) return
    const q = gsap.utils.selector(root)

    if (reduced) {
      const tl = gsap.timeline({ onComplete: onGone })
      tl.call(onOpen)
      tl.to(root.current, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0.2)
      openTl.current = tl
      return () => tl.kill()
    }

    const elapsed = performance.now() - mountedAt.current
    const hold = Math.max(0, MIN_DRAW_MS - elapsed) / 1000

    const tl = gsap.timeline({ onComplete: onGone })
    tl.to({}, { duration: hold }) // skippable wait — timeScale compresses it
      .to(q('.preloader__content'), { autoAlpha: 0, y: -24, duration: 0.5, ease: 'silk' })
      .to(q('.preloader__seam'), { scaleX: 1, duration: 0.6, ease: 'silk' }, '<0.1')
      .call(onOpen)
      .to(q('.preloader__seam'), { autoAlpha: 0, duration: 0.25, ease: 'none' }, '+=0.04')
      .to(q('.preloader__panel--top'), { yPercent: -101, duration: 1.0, ease: 'regal' }, '<')
      .to(q('.preloader__panel--bottom'), { yPercent: 101, duration: 1.0, ease: 'regal' }, '<0.06')
    if (skipped.current) tl.timeScale(2.6)
    openTl.current = tl
    return () => tl.kill()
  }, [ready, reduced, onOpen, onGone])

  // Any interaction fast-forwards the curtain.
  useEffect(() => {
    if (reduced) return
    const skip = () => {
      if (skipped.current) return
      skipped.current = true
      drawTl.current?.timeScale(4)
      openTl.current?.timeScale(2.6)
    }
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [reduced])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__panel preloader__panel--top" />
      <div className="preloader__panel preloader__panel--bottom" />
      <span className="preloader__seam" />
      <div className="preloader__content">
        <Monogram className="preloader__monogram" ref={mono} />
        <p className="preloader__label label">
          {site.name} · Portfolio {site.year}
        </p>
      </div>
    </div>
  )
}
