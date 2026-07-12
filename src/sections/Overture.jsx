import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prepareStrokeDraw } from '../lib/stage'
import Monogram from '../components/Monogram'
import Watermark from '../components/Watermark'
import { site } from '../data/site'

/**
 * The Overture. A gold line draws across, the name sets line by line as if
 * printed, and the monogram is inked stroke by stroke. On scroll, the whole
 * plate drifts apart in gentle parallax.
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
    tl.to(q('.overture__baseline'), { scaleX: 1, duration: 1.4, ease: 'silk' }, 0.15)
      .to(q('.overture__name .line'), { yPercent: 0, duration: 1.3, stagger: 0.15 }, 0.45)
      .to(q('.overture__role .rule'), { scaleX: 1, duration: 1, ease: 'silk' }, 1.15)
      .to(q('.overture__role .label'), { autoAlpha: 1, y: 0, duration: 0.9 }, 1.25)
      .to(
        q('.overture__monogram [data-draw]'),
        { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: 'silk' },
        1.0
      )
      .to(q('.overture__cue'), { autoAlpha: 1, duration: 1.2 }, 2.3)
    return () => tl.kill()
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
        <p className="overture__role">
          <span className="rule" aria-hidden="true" />
          <span className="label label--forest">{site.role}</span>
          <span className="rule" aria-hidden="true" />
        </p>
        <h1 className="overture__name" aria-label={site.name}>
          {site.nameLines.map((line) => (
            <span className="line-mask" key={line} aria-hidden="true">
              <span className="line">{line}</span>
            </span>
          ))}
        </h1>
        <hr className="rule overture__baseline" />
        <div className="overture__cue" aria-hidden="true">
          <span className="label">Scroll to begin</span>
          <span className="overture__cue-line" />
        </div>
      </div>
    </section>
  )
}
