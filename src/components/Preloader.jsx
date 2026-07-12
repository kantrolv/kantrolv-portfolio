import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { site } from '../data/site'

/**
 * Gold percentage counter on deep cream, then the paper parts along a
 * drawn gold seam. `onOpen` fires as the curtain begins to lift (so the
 * overture can start beneath it); `onGone` removes it from the tree.
 */
const MIN_HOLD_MS = 2300 // the counter deserves to be read

export default function Preloader({ ready, reduced, onOpen, onGone }) {
  const root = useRef(null)
  const count = useRef(null)
  const state = useRef({ v: 0 })
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  useEffect(() => {
    document.body.classList.add('is-loading')
    return () => document.body.classList.remove('is-loading')
  }, [])

  // Phase 1 — count toward 96 while fonts and modules settle.
  useEffect(() => {
    if (reduced) return
    const tween = gsap.to(state.current, {
      v: 96,
      duration: 1.9,
      ease: 'silk',
      onUpdate: () => {
        if (count.current) count.current.textContent = Math.round(state.current.v)
      },
    })
    return () => tween.kill()
  }, [reduced])

  // Phase 2 — once ready (and the counter has been readable), land on 100
  // and part the paper.
  useEffect(() => {
    if (!ready) return

    const q = gsap.utils.selector(root)

    if (reduced) {
      if (count.current) count.current.textContent = 100
      const tl = gsap.timeline({ onComplete: onGone })
      tl.call(onOpen)
      tl.to(root.current, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 0.2)
      return () => tl.kill()
    }

    const elapsed = performance.now() - mountedAt.current
    const hold = Math.max(0, MIN_HOLD_MS - elapsed) / 1000

    const tl = gsap.timeline({ onComplete: onGone, delay: hold })
    tl.to(state.current, {
      v: 100,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        if (count.current) count.current.textContent = Math.round(state.current.v)
      },
    })
      .to(q('.preloader__content'), { autoAlpha: 0, y: -26, duration: 0.55, ease: 'silk' }, '+=0.15')
      .to(q('.preloader__seam'), { scaleX: 1, duration: 0.7, ease: 'silk' }, '<0.1')
      .call(onOpen)
      .to(q('.preloader__seam'), { autoAlpha: 0, duration: 0.3, ease: 'none' }, '+=0.05')
      .to(q('.preloader__panel--top'), { yPercent: -101, duration: 1.15, ease: 'regal' }, '<')
      .to(q('.preloader__panel--bottom'), { yPercent: 101, duration: 1.15, ease: 'regal' }, '<0.06')

    return () => tl.kill()
  }, [ready, reduced, onOpen, onGone])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__panel preloader__panel--top" />
      <div className="preloader__panel preloader__panel--bottom" />
      <span className="preloader__seam" />
      <div className="preloader__content">
        <div className="preloader__count">
          <span ref={count}>0</span>
        </div>
        <p className="preloader__label label">
          {site.name} · Portfolio {site.year}
        </p>
      </div>
    </div>
  )
}
