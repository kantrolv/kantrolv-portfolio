import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoLines, splitIntoWords, riseFrom } from '../lib/stage'
import MarginNote from '../components/MarginNote'
import Watermark from '../components/Watermark'
import { site } from '../data/site'

/**
 * The Introduction — a pinned editorial spread. The pull-quote sets word by
 * word, the initial settles into the margin, and the two ragged-right columns
 * rise line by line as the reader scrubs through.
 */
export default function Summary({ ready, reduced, width }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const quoteEl = q('.summary__quote')[0]
      const quote = splitIntoWords(quoteEl)
      const colA = splitIntoLines(q('.summary__col-text')[0])
      const colB = splitIntoLines(q('.summary__col--second')[0])
      splits.push(quote, colA, colB)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      })
      tl.from(q('.section-head .label'), { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.08 }, 0)
        .from(q('.section-head .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 0.05)
        .from(...riseFrom(quote.words, { duration: 0.9, stagger: 0.045, blur: true }), 0.18)
        .fromTo(
          quoteEl,
          { fontVariationSettings: '"wght" 420' },
          { fontVariationSettings: '"wght" 500', duration: 0.9, ease: 'silk' },
          0.18
        )
        .from(q('.summary__initial'), { autoAlpha: 0, scale: 1.9, y: 26, duration: 0.55, ease: 'silk' }, 0.62)
        .from(...riseFrom(colA.lines, { duration: 0.7, stagger: 0.055 }), 0.75)
        .from(...riseFrom(colB.lines, { duration: 0.7, stagger: 0.055 }), 1.0)
        .from(q('.summary__foot .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 1.35)
        .from(q('.summary__foot .label'), { autoAlpha: 0, y: 10, duration: 0.5 }, 1.42)
        .to({}, { duration: 0.3 })
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width])

  const [firstParagraph, secondParagraph] = site.summary
  const initial = firstParagraph.charAt(0)
  const firstRest = firstParagraph.slice(1)

  return (
    <section id="introduction" className="scene summary" ref={root} aria-label="Introduction">
      <Watermark value="II" style={{ right: '2vw', top: '6%' }} ready={ready} reduced={reduced} />
      <MarginNote top="24%" left="1.4rem" vertical speed={0.55} ready={ready} reduced={reduced}>
        II / V — <span className="gold">The Introduction</span>
      </MarginNote>
      <MarginNote top="30%" right="1.4rem" vertical speed={-0.4} ready={ready} reduced={reduced}>
        Pune · India
      </MarginNote>
      <MarginNote top="66%" right="1.4rem" vertical speed={0.7} ready={ready} reduced={reduced}>
        <span className="gold">{site.coordinates}</span>
      </MarginNote>

      <div className="scene__inner">
        <div className="section-head">
          <span className="label label--gold">№ II</span>
          <span className="label">The Introduction</span>
          <hr className="rule" />
        </div>

        <h2 className="summary__quote">
          “At the meeting point of <em>intelligence and craft.</em>”
        </h2>

        <div className="summary__columns">
          <div className="summary__col summary__first" role="text" aria-label={firstParagraph}>
            <span className="summary__initial" aria-hidden="true">
              {initial}
            </span>
            <p className="summary__col-text" aria-hidden="true">
              {firstRest}
            </p>
          </div>
          <p className="summary__col summary__col--second">{secondParagraph}</p>
        </div>

        <div className="summary__foot">
          <hr className="rule" />
          <span className="label">{site.education}</span>
        </div>
      </div>
    </section>
  )
}
