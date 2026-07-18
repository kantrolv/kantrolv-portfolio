import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prepareStrokeDraw } from '../lib/stage'
import Monogram from '../components/Monogram'
import Watermark from '../components/Watermark'
import { site } from '../data/site'

const FINE = '(hover: hover) and (pointer: fine)'

// Kinetic type: letters within REACH of the pointer lift and their ink
// swells (variable wght). Weight rides a Houdini-registered custom property
// so gsap can tween it numerically; browsers without registerProperty
// simply get the lift.
const REACH = 150
let wghtRegistered = false
function registerWght() {
  if (wghtRegistered) return true
  if (typeof window.CSS?.registerProperty !== 'function') return false
  try {
    window.CSS.registerProperty({
      name: '--kv-wght',
      syntax: '<number>',
      inherits: false,
      initialValue: '500',
    })
  } catch (e) {
    // InvalidModificationError = already registered (hot reload) — fine.
    if (!(e instanceof DOMException && e.name === 'InvalidModificationError')) return false
  }
  wghtRegistered = true
  return true
}

/**
 * The Overture. A gold line draws across, the name sets line by line as if
 * printed, the monogram is inked stroke by stroke, and the guiding statement
 * settles beneath. On scroll, the whole plate drifts apart in gentle parallax.
 */
export default function Overture({ ready, started, reduced, width }) {
  const root = useRef(null)
  const played = useRef(false)

  // Impose hidden initial states as soon as fonts are ready (the preloader
  // still covers the stage), so the curtain opens onto a blank plate.
  useLayoutEffect(() => {
    if (!ready || reduced || played.current) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      prepareStrokeDraw(q('.overture__monogram')[0])
      gsap.set(q('.overture__name .line'), { yPercent: 115 })
      gsap.set(q('.overture__role .rule'), { scaleX: 0 })
      gsap.set(q('.overture__role .label'), { autoAlpha: 0, y: 10 })
      gsap.set(q('.overture__statement'), { autoAlpha: 0, y: 14 })
      gsap.set(q('.overture__baseline'), { scaleX: 0 })
      gsap.set(q('.overture__cue'), { autoAlpha: 0 })
    }, root)
    return () => {
      if (!played.current) ctx.revert()
    }
  }, [ready, reduced])

  // The printing of the plate — plays once, as the curtain lifts.
  useLayoutEffect(() => {
    if (!started || reduced || played.current) return
    played.current = true
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ defaults: { ease: 'regal' } })
    tl.to(q('.overture__name .line'), { yPercent: 0, duration: 1.3, stagger: 0.15 }, 0.3)
      .to(q('.overture__monogram [data-draw]'), { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: 'silk' }, 0.7)
      .to(q('.overture__role .rule'), { scaleX: 1, duration: 1, ease: 'silk' }, 1.05)
      .to(q('.overture__role .label'), { autoAlpha: 1, y: 0, duration: 0.9 }, 1.15)
      .to(q('.overture__statement'), { autoAlpha: 1, y: 0, duration: 1 }, 1.5)
      .to(q('.overture__baseline'), { scaleX: 1, duration: 1.3, ease: 'silk' }, 1.6)
      .to(q('.overture__cue'), { autoAlpha: 1, duration: 1.2 }, 2.2)
    return () => tl.kill()
  }, [started, reduced])

  // Kinetic name — desktop fine-pointer only, and only while the hero is
  // actually on stage. Pure transforms + a registered custom property.
  useEffect(() => {
    if (!started || reduced) return
    if (!window.matchMedia(FINE).matches) return
    const chars = Array.from(root.current.querySelectorAll('.overture__name .ch'))
    if (!chars.length) return
    const weighted = registerWght()

    const movers = chars.map((ch) => ({
      el: ch,
      y: gsap.quickTo(ch, 'y', { duration: 0.55, ease: 'power3.out' }),
      w: weighted ? gsap.quickTo(ch, '--kv-wght', { duration: 0.55, ease: 'power3.out' }) : null,
    }))

    let raf = 0
    let px = 0
    let py = 0
    const apply = () => {
      raf = 0
      for (const m of movers) {
        const r = m.el.getBoundingClientRect()
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
        const f = Math.max(0, 1 - d / REACH)
        m.y(-9 * Math.pow(f, 1.5))
        if (m.w) m.w(500 + 170 * f)
      }
    }
    const move = (e) => {
      if (window.scrollY > window.innerHeight) return // hero off stage
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const rest = () => {
      for (const m of movers) {
        m.y(0)
        if (m.w) m.w(500)
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', rest)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', rest)
    }
  }, [started, reduced])

  // Parallax exit — each layer leaves at its own pace.
  useLayoutEffect(() => {
    if (!ready || reduced) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        defaults: { ease: 'none' },
      })
      tl.to(q('.overture__monogram'), { y: -110, rotate: -5 }, 0)
        .to(q('.overture__role'), { y: -70 }, 0)
        .to(q('.overture__statement'), { y: -52, opacity: 0.35 }, 0)
        .to(q('.overture__name'), { y: -30, opacity: 0.25 }, 0)
        .to(q('.overture__baseline'), { opacity: 0 }, 0)
        .to(q('.overture__cue'), { autoAlpha: 0, duration: 0.25 }, 0)
    }, root)
    return () => ctx.revert()
  }, [ready, reduced, width])

  return (
    <section id="overture" className="scene overture" ref={root} aria-label="Overture">
      <Watermark kind="mono" style={{ right: '-9vw', top: '14%' }} ready={ready} reduced={reduced} />
      <div className="scene__inner">
        <Monogram className="overture__monogram" title="K V monogram" />
        <h1 className="overture__name" aria-label={site.name}>
          {site.nameLines.map((line) => (
            <span className="line-mask" key={line} aria-hidden="true">
              <span className="line">
                {[...line].map((ch, i) => (
                  <span className="ch" key={i}>
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="overture__role">
          <span className="rule" aria-hidden="true" />
          <span className="label label--forest">{site.role}</span>
          <span className="rule" aria-hidden="true" />
        </p>
        <p className="overture__statement">{site.pullQuote}</p>
        <hr className="rule overture__baseline" />
        <div className="overture__cue" aria-hidden="true">
          <span className="label">Scroll to begin</span>
          <span className="overture__cue-line" />
        </div>
      </div>
    </section>
  )
}
