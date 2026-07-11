import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import Monogram from './Monogram'

/**
 * Ghost letterhead watermark — an oversized serif numeral or the K·V
 * monogram at ~3–4% ink, drifting slower than the foreground. Sits at
 * z-index 0 beneath the section's inner content (z-index 1).
 */
export default function Watermark({ kind = 'text', value = '', style, ready, reduced }) {
  const el = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const section = el.current.closest('section') || el.current.parentElement
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { y: 80 },
        {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <div
      ref={el}
      className={`watermark ${kind === 'mono' ? 'watermark--mono' : 'watermark--text'}`}
      style={style}
      aria-hidden="true"
    >
      {kind === 'mono' ? <Monogram /> : value}
    </div>
  )
}
