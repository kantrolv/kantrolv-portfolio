import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * The layered backdrop — everything here lives *behind* the type
 * (negative z-index) and is tuned to read as fine stationery, never
 * wallpaper. Each layer respects prefers-reduced-motion.
 */

/* ————— section tint: the paper's temperature drifts by movement ————— */

const TINTS = [
  ['overture', '#f4efe6'], // warm ivory
  ['introduction', '#f3eee7'], // neutral
  ['honours', '#efefe5'], // faint green-grey
  ['catalogue', '#f5efe0'], // warmer sand
  ['correspondence', '#f4f1ea'], // soft ivory
]

export function SectionTint({ ready, reduced }) {
  const el = useRef(null)

  useEffect(() => {
    if (!ready || reduced) return
    // Contiguous bands — each section's temperature holds until the next
    // section arrives, so every scroll position (including jumps) resolves
    // to exactly one tint.
    const triggers = TINTS.map(([id, color], i) => {
      const section = document.getElementById(id)
      if (!section) return null
      const next = TINTS[i + 1] && document.getElementById(TINTS[i + 1][0])
      return ScrollTrigger.create({
        trigger: section,
        start: i === 0 ? 'top top' : 'top 55%',
        endTrigger: next || section,
        end: next ? 'top 55%' : 'bottom top',
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(el.current, {
              backgroundColor: color,
              duration: 1.8,
              ease: 'silk',
              overwrite: 'auto',
            })
          }
        },
      })
    }).filter(Boolean)
    return () => triggers.forEach((t) => t.kill())
  }, [ready, reduced])

  return <div className="bg-tint" ref={el} aria-hidden="true" />
}

/* ————— ambient cursor glow: lamplight on paper (desktop only) ————— */

const FINE = '(hover: hover) and (pointer: fine)'

export function AmbientGlow({ reduced }) {
  const el = useRef(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE).matches
  )

  useEffect(() => {
    if (!enabled || reduced) return
    const node = el.current
    gsap.set(node, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const x = gsap.quickTo(node, 'x', { duration: 1.2, ease: 'power3.out' })
    const y = gsap.quickTo(node, 'y', { duration: 1.2, ease: 'power3.out' })

    let shown = false
    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set(node, { x: e.clientX, y: e.clientY })
        gsap.to(node, { autoAlpha: 1, duration: 1.6, ease: 'none' })
      }
      x(e.clientX)
      y(e.clientY)
    }
    const leave = () => {
      shown = false
      gsap.to(node, { autoAlpha: 0, duration: 0.8, ease: 'none' })
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, reduced])

  if (!enabled || reduced) return null
  return <div className="bg-glow" ref={el} aria-hidden="true" />
}

/* ————— gold binding thread: the programme's stitching ————— */

const THREAD_SECTIONS = ['overture', 'introduction', 'honours', 'catalogue', 'correspondence']

export function BindingThread({ ready, reduced }) {
  const root = useRef(null)
  const fill = useRef(null)

  useEffect(() => {
    if (!ready) return
    const nodeEls = Array.from(root.current.querySelectorAll('.thread__node'))
    const fracs = []

    const measure = () => {
      const max = Math.max(1, ScrollTrigger.maxScroll(window))
      THREAD_SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el || !nodeEls[i]) return
        const top = el.getBoundingClientRect().top + window.scrollY
        fracs[i] = gsap.utils.clamp(0, 1, top / max)
        nodeEls[i].style.top = `${(fracs[i] * 100).toFixed(2)}%`
      })
    }
    measure()

    if (reduced) {
      // the printed edition ships fully stitched
      nodeEls.forEach((n) => n.classList.add('is-passed'))
      return
    }

    ScrollTrigger.addEventListener('refresh', measure)
    const tween = gsap.fromTo(
      fill.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.4,
          onUpdate: (self) => {
            nodeEls.forEach((n, i) =>
              n.classList.toggle('is-passed', self.progress >= (fracs[i] ?? 2) - 0.002)
            )
          },
        },
      }
    )
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [ready, reduced])

  return (
    <aside className="thread" ref={root} aria-hidden="true">
      <span className="thread__track" />
      <span className="thread__fill" ref={fill} />
      {THREAD_SECTIONS.map((id) => (
        <span className="thread__node" key={id} />
      ))}
    </aside>
  )
}
