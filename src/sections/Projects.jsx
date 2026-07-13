import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoLines, splitIntoWords, riseFrom, prepareStrokeDraw, countUp } from '../lib/stage'
import MarginNote from '../components/MarginNote'
import Magnetic from '../components/Magnetic'
import Watermark from '../components/Watermark'
import { projects } from '../data/projects'

/**
 * The Catalogue — the centrepiece. A header plate, then one pinned
 * catalogue entry per project: the numeral is inked stroke by stroke,
 * the rule extends, the entry sets itself as the reader scrubs through.
 * Everything renders from src/data/projects.js; № 04, 05… just work.
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
      const title = splitIntoWords(q('.catalogue-head__title')[0])
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
        .from(...riseFrom(title.words, { duration: 0.9, stagger: 0.07 }), 0.15)
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
        Nº 03 / V — <span className="gold">The Catalogue</span>
      </MarginNote>
      <MarginNote top="42%" right="1.4rem" vertical speed={-0.5} ready={ready} reduced={reduced}>
        Bound by hand — Pune · India
      </MarginNote>
      <div className="scene__inner scene__inner--short">
        <div className="section-head">
          <span className="label label--gold">Nº 03</span>
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
      const title = splitIntoWords(q('.entry__title')[0])
      const desc = splitIntoLines(q('.entry__desc')[0])
      splits.push(title, desc)

      const numeralStrokes = prepareStrokeDraw(q('.entry__numeral')[0])
      gsap.set(q('.numeral-fill'), { opacity: 0 })

      const yearEl = q('.entry__year .yr')[0]
      const figureEl = q('.entry__metric .figure')[0]
      const { value, prefix = '', suffix = '' } = project.metric

      // Approach — the numeral inks itself as the plate rises into view,
      // so not a single scroll increment arrives empty.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 92%',
            end: 'top top',
            scrub: true,
          },
        })
        .to(numeralStrokes, { strokeDashoffset: 0, duration: 1.3, ease: 'none' }, 0)
        .from(q('.entry__no'), { autoAlpha: 0, y: 8, duration: 0.45 }, 0.1)
        .from(q('.entry__year .rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'silk' }, 0.5)
        .from(yearEl, { autoAlpha: 0, duration: 0.15 }, 0.55)
        .add(countUp(yearEl, project.year, { start: project.year - 14, duration: 0.7 }), 0.55)

      // The pinned setting of the entry.
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
        .from(...riseFrom(title.words, { duration: 0.8, stagger: 0.07 }), 0.05)
      const subtitle = q('.entry__subtitle')
      if (subtitle.length) tl.from(subtitle, { autoAlpha: 0, y: 12, duration: 0.5 }, 0.3)
      tl.from(q('.entry__rule'), { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'silk' }, 0.4)
        .from(...riseFrom(desc.lines, { duration: 0.65, stagger: 0.05 }), 0.55)
        .from(figureEl, { autoAlpha: 0, duration: 0.15 }, 1.0)
        .add(countUp(figureEl, value, { prefix, suffix, duration: 0.8 }), 1.0)
        .from(q('.entry__metric .what'), { autoAlpha: 0, y: 8, duration: 0.5 }, 1.12)
        .from(q('.entry__tags li'), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.05 }, 1.3)
        .from(q('.entry__links .wipe-link'), { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08 }, 1.5)
        .to({}, { duration: 0.35 })
        .to(q('.entry__numeral-wrap'), { y: -46, ease: 'none', duration: 1.85 }, 0)
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
        Entry {project.number} / {String(total).padStart(2, '0')}
      </MarginNote>
      <MarginNote top="60%" right="1.4rem" vertical speed={-0.5} ready={ready} reduced={reduced}>
        Filed under — <span className="gold">{project.filedUnder}</span>
      </MarginNote>

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
            <span className="what label">{project.metric.label}</span>
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
    </article>
  )
}
