import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoLines, riseFrom } from '../lib/stage'

/**
 * A centred motto set between movements — thin gold rules part, a diamond
 * turns in, and the line rises as the reader arrives. Scrubbed, so the
 * reveal belongs to the scroll itself.
 */
export default function Epigraph({ text, ready, reduced, width }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context((self) => {
      const q = gsap.utils.selector(root)
      const split = splitIntoLines(q('.epigraph__text')[0])
      splits.push(split)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 82%',
          end: 'top 38%',
          scrub: 0.6,
        },
      })
      tl.from(q('.epigraph__rule'), { scaleX: 0, duration: 1, ease: 'silk', stagger: 0.1 }, 0)
        .from(...riseFrom(split.lines, { duration: 1.2 }), 0.2)
        .from(
          q('.epigraph__diamond'),
          { scale: 0, rotate: 225, duration: 0.9, ease: 'silk' },
          0.55
        )

      // Keeps the motto drifting gently for as long as it is on stage.
      gsap.fromTo(
        q('.epigraph__inner'),
        { y: 36 },
        {
          y: -36,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width, text])

  return (
    <aside className="epigraph" ref={root}>
      <div className="epigraph__inner">
        <span className="epigraph__rule" aria-hidden="true" />
        <p className="epigraph__text">“{text}”</p>
        <span className="epigraph__diamond" aria-hidden="true" />
        <span className="epigraph__rule" aria-hidden="true" />
      </div>
    </aside>
  )
}
