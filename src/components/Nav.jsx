import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { scrollToEl } from '../lib/scroll'

const ITEMS = [
  { id: 'overture', numeral: 'I', label: 'Overture' },
  { id: 'introduction', numeral: 'II', label: 'Introduction' },
  { id: 'honours', numeral: 'III', label: 'Honours' },
  { id: 'catalogue', numeral: 'IV', label: 'Catalogue' },
  { id: 'correspondence', numeral: 'V', label: 'Correspondence' },
]

/** Small-caps programme navigation; the active movement carries a gold rule. */
export default function Nav({ ready }) {
  const [active, setActive] = useState('overture')
  const triggers = useRef([])

  useEffect(() => {
    if (!ready) return
    triggers.current = ITEMS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActive(id),
      })
    }).filter(Boolean)
    return () => triggers.current.forEach((t) => t.kill())
  }, [ready])

  const go = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) scrollToEl(el)
  }

  return (
    <header className="nav">
      <a href="#overture" className="nav__mark" onClick={(e) => go(e, 'overture')} aria-label="Back to top">
        K<span className="amp">·</span>V
      </a>
      <nav aria-label="Sections">
        <ul className="nav__list">
          {ITEMS.map(({ id, numeral, label }) => (
            <li key={id}>
              <a
                className={`nav__link${active === id ? ' is-active' : ''}`}
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                aria-current={active === id ? 'true' : undefined}
              >
                <span className="n">{numeral}.</span>
                <span className="txt">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
