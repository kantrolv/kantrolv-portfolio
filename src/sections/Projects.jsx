import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoLines, splitIntoWords, riseFrom, prepareStrokeDraw, countUp } from '../lib/stage'
import MarginNote from '../components/MarginNote'
import Magnetic from '../components/Magnetic'
import Watermark from '../components/Watermark'
import { projects } from '../data/projects'

/**
 * The Catalogue — the centrepiece, staged as an exhibition. Each project is
 * a physical plate: a distinct sheet that is laid onto the paper as it
 * approaches (drifting up, its shadow settling), holds pinned while the
 * entry sets itself — numeral inked, metric counting, description rising —
 * then lifts away at the tail like a page being turned as the next plate
 * arrives. Everything renders from src/data/projects.js; № 04, 05… just work.
 */
export default function Projects({ ready, reduced, width }) {
  const years = projects.map((p) => p.year)
  const range =
    Math.min(...years) === Math.max(...years)
      ? `${years[0]}`
      : `${Math.min(...years)} — ${Math.max(...years)}`

  return (
    <div id="catalogue">
      <CatalogueHead ready={ready} reduced={reduced} width={width} count={projects.length} range={range} />
      {projects.map((project) => (
        <Entry
          key={project.number}
          project={project}
          total={projects.length}
          ready={ready}
          reduced={reduced}
          width={width}
        />
      ))}
    </div>
  )
}

function CatalogueHead({ ready, reduced, width, count, range }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const titleEl = q('.catalogue-head__title')[0]
      const title = splitIntoWords(titleEl)
      splits.push(title)

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.6,
          },
        })
        .from(q('.section-head .label'), { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.08 }, 0)
        .from(q('.section-head .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 0.05)
        .from(...riseFrom(title.words, { duration: 0.9, stagger: 0.07, blur: true }), 0.15)
        .fromTo(
          titleEl,
          { fontVariationSettings: '"wght" 420' },
          { fontVariationSettings: '"wght" 500', duration: 0.9, ease: 'silk' },
          0.15
        )
        .from(q('.catalogue-head__meta .rule'), { scaleX: 0, duration: 0.6, ease: 'silk', stagger: 0.08 }, 0.5)
        .from(q('.catalogue-head__meta .label'), { autoAlpha: 0, y: 8, duration: 0.5 }, 0.6)
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width])

  return (
    <section className="scene catalogue-head" ref={root} aria-label="Selected works">
      <Watermark value="IV" style={{ right: '4vw', top: '-4%' }} ready={ready} reduced={reduced} />
      <MarginNote top="30%" left="1.4rem" vertical speed={0.5} ready={ready} reduced={reduced}>
        IV / V — <span className="gold">The Catalogue</span>
      </MarginNote>
      <MarginNote top="42%" right="1.4rem" vertical speed={-0.5} ready={ready} reduced={reduced}>
        Bound by hand — Pune · India
      </MarginNote>
      <div className="scene__inner scene__inner--short">
        <div className="section-head">
          <span className="label label--gold">№ IV</span>
          <span className="label">The Catalogue</span>
          <hr className="rule" />
        </div>
        <h2 className="display catalogue-head__title">A Catalogue of Selected Works</h2>
        <div className="catalogue-head__meta">
          <span className="rule" aria-hidden="true" />
          <span className="label">
            {String(count).padStart(2, '0')} entries · {range}
          </span>
          <span className="rule" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

function Entry({ project, total, ready, reduced, width }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const titleEl = q('.entry__title')[0]
      const title = splitIntoWords(titleEl)
      const desc = splitIntoLines(q('.entry__desc')[0])
      splits.push(title, desc)

      const numeralStrokes = prepareStrokeDraw(q('.entry__numeral')[0])
      gsap.set(q('.numeral-fill'), { opacity: 0 })

      const yearEl = q('.entry__year .yr')[0]
      const figureEl = q('.entry__metric .figure')[0]
      const { value, prefix = '', suffix = '' } = project.metric

      // Approach — the plate is laid onto the table: it drifts up with a
      // hair of rotation while its shadow settles, the frame draws round,
      // and the numeral inks itself. No scroll increment arrives empty.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 92%',
            end: 'top top',
            scrub: true,
          },
        })
        .from(q('.plate'), { y: '7vh', rotate: 0.4, duration: 1.3, ease: 'none' }, 0)
        .from(q('.plate__shadow'), { opacity: 0, duration: 1.1, ease: 'none' }, 0.1)
        .fromTo(
          q('.plate__frame'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'silk' },
          0.2
        )
        .to(numeralStrokes, { strokeDashoffset: 0, duration: 1.3, ease: 'none' }, 0)
        .from(q('.entry__no'), { autoAlpha: 0, y: 8, duration: 0.45 }, 0.1)
        .from(q('.plate__index'), { autoAlpha: 0, duration: 0.4 }, 0.55)
        .from(q('.entry__year .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 0.5)
        .from(yearEl, { autoAlpha: 0, duration: 0.15 }, 0.55)
        .add(countUp(yearEl, project.year, { start: project.year - 14, duration: 0.7 }), 0.55)

      // The pinned setting of the entry, closing with the page-turn lift.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
        },
        defaults: { ease: 'regal' },
      })

      tl.to(q('.numeral-fill'), { opacity: 0.13, duration: 0.8, ease: 'none' }, 0.02)
        .from(...riseFrom(title.words, { duration: 0.8, stagger: 0.07, blur: true }), 0.05)
        .fromTo(
          titleEl,
          { fontVariationSettings: '"wght" 420' },
          { fontVariationSettings: '"wght" 500', duration: 0.8, ease: 'silk' },
          0.05
        )
      const subtitle = q('.entry__subtitle')
      if (subtitle.length) tl.from(subtitle, { autoAlpha: 0, y: 12, duration: 0.5 }, 0.3)
      tl.from(q('.entry__rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'silk' }, 0.4)
        .from(...riseFrom(desc.lines, { duration: 0.65, stagger: 0.05 }), 0.55)
        .from(figureEl, { autoAlpha: 0, duration: 0.15 }, 1.0)
        .add(countUp(figureEl, value, { prefix, suffix, duration: 0.8 }), 1.0)
        .from(q('.entry__metric .what, .entry__metric .basis'), { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.06 }, 1.12)
        .from(q('.entry__tags li'), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.05 }, 1.3)
        .from(q('.entry__links .wipe-link'), { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08 }, 1.5)
        .to({}, { duration: 0.35 })
        // the page turn — the sheet lifts and its shadow deepens under it
        .to(q('.plate'), { scale: 0.985, y: -22, duration: 0.55, ease: 'silk' }, 2.05)
        .to(q('.plate__shadow'), { opacity: 0.5, duration: 0.55, ease: 'none' }, 2.05)
        .to(q('.entry__numeral-wrap'), { y: -52, ease: 'none', duration: 2.6 }, 0)
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width, project])

  const ext = (href) =>
    href && href !== '#' ? { target: '_blank', rel: 'noreferrer' } : undefined

  return (
    <article
      className="scene entry"
      ref={root}
      aria-label={`Project ${project.number} — ${project.title}`}
    >
      <MarginNote top="26%" left="1.4rem" vertical speed={0.55} ready={ready} reduced={reduced}>
        Plate {project.number} / {String(total).padStart(2, '0')}
      </MarginNote>
      <MarginNote top="60%" right="1.4rem" vertical speed={-0.5} ready={ready} reduced={reduced}>
        Filed under — <span className="gold">{project.filedUnder}</span>
      </MarginNote>

      <div className="plate">
        <span className="plate__shadow" aria-hidden="true" />
        <span className="plate__frame" aria-hidden="true" />
        <span className="plate__index label" aria-hidden="true">
          Plate {project.number} · {String(total).padStart(2, '0')}
        </span>

        <div className="scene__inner">
          <div className="entry__numeral-wrap">
            <span className="label label--gold entry__no">Nº {project.number}</span>
            <svg className="entry__numeral" viewBox="0 0 400 330" aria-hidden="true">
              <text className="numeral-fill" x="200" y="280" textAnchor="middle">
                {project.number}
              </text>
              <text data-draw data-draw-len="1500" x="200" y="280" textAnchor="middle">
                {project.number}
              </text>
            </svg>
          </div>

          <div className="entry__body">
            <p className="entry__year">
              <span className="rule" aria-hidden="true" />
              <span className="label yr">{project.year}</span>
            </p>
            <h3 className="display entry__title">{project.title}</h3>
            {project.subtitle ? <p className="entry__subtitle">{project.subtitle}</p> : null}
            <hr className="rule entry__rule" />
            <p className="entry__desc">{project.description}</p>

            <p className="entry__metric">
              <span className="figure">
                {(project.metric.prefix || '') + project.metric.value + (project.metric.suffix || '')}
              </span>
              <span className="entry__metric-copy">
                <span className="what label">{project.metric.label}</span>
                {project.metric.basis ? <span className="basis">{project.metric.basis}</span> : null}
              </span>
            </p>

            <ul className="entry__tags" aria-label="Technologies">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className="entry__links">
              <Magnetic strength={0.25}>
                <a className="wipe-link" href={project.github} {...ext(project.github)}>
                  GitHub <span className="arrow">↗</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a className="wipe-link" href={project.demo} {...ext(project.demo)}>
                  Live Demo <span className="arrow">↗</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
