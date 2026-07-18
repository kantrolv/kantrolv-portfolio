import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoWords, riseFrom } from '../lib/stage'
import MarginNote from '../components/MarginNote'
import Watermark from '../components/Watermark'
import SkillMark from '../components/SkillMark'
import { site, skillClusters } from '../data/site'

/**
 * The Honours Board — ruled clusters, each row drawing in with a dotted
 * leader and a meaningful annotation: a gold catalogue citation where the
 * skill shipped, or an honest standing where it hasn't yet.
 */
export default function Skills({ ready, reduced, width }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)

      // header
      const titleEl = q('.skills__title')[0]
      const title = splitIntoWords(titleEl)
      splits.push(title)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: q('.section-head')[0],
            start: 'top 80%',
            end: 'top 45%',
            scrub: 0.6,
          },
        })
        .from(q('.section-head .label'), { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.08 }, 0)
        .from(q('.section-head .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 0.05)
        .from(...riseFrom(title.words, { duration: 0.8, stagger: 0.06, blur: true }), 0.15)
        .fromTo(
          titleEl,
          { fontVariationSettings: '"wght" 420' },
          { fontVariationSettings: '"wght" 500', duration: 0.8, ease: 'silk' },
          0.15
        )

      // each cluster is its own staged board
      q('.cluster').forEach((cluster) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cluster,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
          defaults: { ease: 'regal' },
        })
        tl.from(cluster.querySelector('.cluster__numeral'), { autoAlpha: 0, x: -12, duration: 0.6 }, 0)
          .from(cluster.querySelector('.cluster__title'), { autoAlpha: 0, y: 16, duration: 0.7 }, 0.06)
          .from(cluster.querySelector('.cluster__sub'), { autoAlpha: 0, duration: 0.6 }, 0.2)
          .from(
            cluster.querySelectorAll('.cluster__row .name, .cluster__row .skill-mark'),
            { autoAlpha: 0, y: 12, duration: 0.55, stagger: 0.07 },
            0.25
          )
          .fromTo(
            cluster.querySelectorAll('.cluster__row .leader'),
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.55, stagger: 0.07, ease: 'silk' },
            0.3
          )
          .fromTo(
            cluster.querySelectorAll('.cluster__row .row-rule'),
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.07, ease: 'silk' },
            0.32
          )
          .from(
            cluster.querySelectorAll('.cluster__row .note'),
            { autoAlpha: 0, x: 8, duration: 0.5, stagger: 0.07, ease: 'silk' },
            0.5
          )
      })

      // appendix — certifications
      gsap.from(q('.skills__certs > *'), {
        autoAlpha: 0,
        y: 10,
        duration: 0.7,
        stagger: 0.06,
        scrollTrigger: {
          trigger: q('.skills__certs')[0],
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width])

  return (
    <section id="honours" className="scene skills" ref={root} aria-label="Skills">
      <Watermark kind="mono" style={{ left: '-10vw', top: '32%' }} ready={ready} reduced={reduced} />
      <MarginNote top="18%" left="1.4rem" vertical speed={0.5} ready={ready} reduced={reduced}>
        III / V — <span className="gold">The Honours</span>
      </MarginNote>
      <MarginNote top="58%" right="1.4rem" vertical speed={-0.45} ready={ready} reduced={reduced}>
        {site.year} — Kept in good standing
      </MarginNote>

      <div className="scene__inner">
        <div className="section-head">
          <span className="label label--gold">№ III</span>
          <span className="label">The Honours</span>
          <hr className="rule" />
        </div>

        <h2 className="display skills__title">The Honours Board</h2>

        <div className="skills__grid">
          {skillClusters.map((cluster) => (
            <div className={`cluster${cluster.lead ? ' cluster--lead' : ''}`} key={cluster.title}>
              <div className="cluster__head">
                <span className="cluster__numeral" aria-hidden="true">
                  {cluster.numeral}.
                </span>
                <h3 className="cluster__title">{cluster.title}</h3>
                <span className="cluster__sub">{cluster.sub}</span>
              </div>
              <ul className="cluster__rows">
                {cluster.rows.map((row) => (
                  <li className={`cluster__row${row.lead ? ' cluster__row--lead' : ''}`} key={row.name}>
                    <SkillMark icon={row.icon} />
                    <span className="name">{row.name}</span>
                    <span className="leader" aria-hidden="true" />
                    <span className={`note${row.cite ? ' note--cite' : ''}`}>
                      {row.cite ? `Shipped · ${row.cite}` : row.standing}
                    </span>
                    <span className="row-rule" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="skills__certs">
          <span className="label label--gold">Appendix — Certifications</span>
          {site.certifications.map((cert) => (
            <Fragment key={cert}>
              <span className="diamond" aria-hidden="true" />
              <span className="cert">{cert}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
