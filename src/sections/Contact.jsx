import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { splitIntoLines, splitIntoWords, riseFrom, prepareStrokeDraw } from '../lib/stage'
import MarginNote from '../components/MarginNote'
import Watermark from '../components/Watermark'
import Monogram from '../components/Monogram'
import Magnetic from '../components/Magnetic'
import LocalTime from '../components/LocalTime'
import { site } from '../data/site'

/**
 * Correspondence — the closing card. A gold double border is drawn around
 * cream card stock, the monogram is inked, and the directory of addresses
 * sets itself row by row. A fine footer closes the programme.
 */
export default function Contact({ ready, reduced, width }) {
  const root = useRef(null)
  const card = useRef(null)
  const borderSvg = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const splits = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)

      // Size the border SVG to the card so the stroke draw is pixel-true.
      const w = card.current.offsetWidth
      const h = card.current.offsetHeight
      const svg = borderSvg.current
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      const outer = svg.querySelector('.outer')
      const inner = svg.querySelector('.inner')
      outer.setAttribute('x', 0.5)
      outer.setAttribute('y', 0.5)
      outer.setAttribute('width', w - 1)
      outer.setAttribute('height', h - 1)
      inner.setAttribute('x', 8)
      inner.setAttribute('y', 8)
      inner.setAttribute('width', w - 16)
      inner.setAttribute('height', h - 16)

      const borderShapes = prepareStrokeDraw(svg)
      const monogramShapes = prepareStrokeDraw(q('.contact__monogram')[0])
      const title = splitIntoWords(q('.contact__title')[0])
      const note = splitIntoLines(q('.contact__note')[0])
      splits.push(title, note)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card.current,
          start: 'top 78%',
          end: 'top 22%',
          scrub: 0.7,
        },
        defaults: { ease: 'regal' },
      })
      tl.to(borderShapes, { strokeDashoffset: 0, duration: 1.5, ease: 'silk', stagger: 0.15 }, 0)
        .to(monogramShapes, { strokeDashoffset: 0, duration: 1.1, stagger: 0.05, ease: 'silk' }, 0.25)
        .from(q('.contact__salut'), { autoAlpha: 0, y: 10, duration: 0.45 }, 0.45)
        .from(...riseFrom(title.words, { duration: 0.8, stagger: 0.08 }), 0.55)
        .from(...riseFrom(note.lines, { duration: 0.6, stagger: 0.06 }), 0.8)
        .from(q('.contact__list .label'), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.06 }, 1.0)
        .fromTo(
          q('.contact__list .leader'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.5, stagger: 0.06, ease: 'silk' },
          1.05
        )
        .from(q('.contact__list .wipe-link'), { autoAlpha: 0, y: 8, duration: 0.45, stagger: 0.06 }, 1.1)

      gsap
        .timeline({
          scrollTrigger: {
            trigger: q('.footer')[0],
            start: 'top 94%',
            toggleActions: 'play none none none',
          },
        })
        .from(q('.footer__rule'), { scaleX: 0, duration: 1.1, ease: 'silk' }, 0)
        .from(q('.footer__item'), { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.1 }, 0.25)
    }, root)
    return () => {
      splits.forEach((s) => s.revert())
      ctx.revert()
    }
  }, [ready, reduced, width])

  const ext = (href) =>
    href && href !== '#' && !href.startsWith('mailto:')
      ? { target: '_blank', rel: 'noreferrer' }
      : undefined

  return (
    <section id="correspondence" className="scene contact" ref={root} aria-label="Contact">
      <Watermark kind="mono" style={{ left: '-11vw', top: '42%' }} ready={ready} reduced={reduced} />
      <MarginNote top="22%" left="1.4rem" vertical speed={0.5} ready={ready} reduced={reduced}>
        Nº 04 / V — <span className="gold">Correspondence</span>
      </MarginNote>
      <MarginNote top="48%" right="1.4rem" vertical speed={-0.45} ready={ready} reduced={reduced}>
        Visitors received — by appointment
      </MarginNote>

      <div className="scene__inner">
        <div className="section-head">
          <span className="label label--gold">Nº 04</span>
          <span className="label">Correspondence</span>
          <hr className="rule" />
        </div>

        <div className="contact__card" ref={card}>
          <svg className="contact__border" ref={borderSvg} aria-hidden="true" preserveAspectRatio="none">
            <rect className="outer" data-draw />
            <rect className="inner" data-draw />
          </svg>
          <Monogram className="contact__monogram" />
          <p className="label label--gold contact__salut">Kindly addressed to</p>
          <h2 className="display contact__title">
            Let’s work <em>together.</em>
          </h2>
          <p className="contact__note">
            For collaborations, internships, commissions, or simply good conversation — the desk
            is always open, and correspondence is answered promptly.
          </p>
          <ul className="contact__list">
            {site.socials.map((social) => (
              <li key={social.label}>
                <span className="label">{social.label}</span>
                <span className="leader" aria-hidden="true" />
                <Magnetic strength={0.2}>
                  <a className="wipe-link" href={social.href} {...ext(social.href)}>
                    {social.value}
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <footer className="footer">
          <hr className="rule footer__rule" />
          <div className="footer__row">
            <span className="footer__item">
              <LocalTime />
            </span>
            <span className="footer__item">
              Portfolio {site.year} — set in Playfair Display &amp; Inter
            </span>
            <span className="footer__item">{site.coordinates}</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
